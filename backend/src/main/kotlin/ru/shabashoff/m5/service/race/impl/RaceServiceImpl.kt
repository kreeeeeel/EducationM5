package ru.shabashoff.m5.service.race.impl

import org.springframework.beans.factory.annotation.Qualifier
import org.springframework.data.domain.Pageable
import org.springframework.stereotype.Service
import ru.shabashoff.m5.config.property.RaceProperty
import ru.shabashoff.m5.dao.entity.user.UserCarEntity
import ru.shabashoff.m5.dao.entity.user.UserEntity
import ru.shabashoff.m5.dao.repository.user.UserRepository
import ru.shabashoff.m5.dto.response.CarResponse
import ru.shabashoff.m5.dto.response.CarUserRatingResponse
import ru.shabashoff.m5.dto.response.ExpResponse
import ru.shabashoff.m5.dto.response.RaceResultResponse
import ru.shabashoff.m5.dto.response.UserRatingResponse
import ru.shabashoff.m5.dto.type.ExperienceEvent
import ru.shabashoff.m5.dto.type.RaceResult
import ru.shabashoff.m5.dto.type.RaceResultEnum
import ru.shabashoff.m5.exception.impl.NoMoneyException
import ru.shabashoff.m5.exception.impl.UserNotFoundException
import ru.shabashoff.m5.exception.impl.car.CarNotFoundException
import ru.shabashoff.m5.exception.impl.racing.CarBeingServicedException
import ru.shabashoff.m5.exception.impl.racing.OpponentIsNotFoundException
import ru.shabashoff.m5.service.DateTimeProvider
import ru.shabashoff.m5.service.business.BusinessStatisticHandler
import ru.shabashoff.m5.service.exp.ExpService
import ru.shabashoff.m5.service.getUserIdFromContext
import ru.shabashoff.m5.service.race.RaceService
import java.time.OffsetDateTime
import kotlin.jvm.optionals.getOrNull
import kotlin.math.pow
import kotlin.random.Random

@Service
class RaceServiceImpl(
    private val dateTimeProvider: DateTimeProvider,
    private val raceProperty: RaceProperty,
    private val userRepository: UserRepository,
    private val expService: ExpService,
    @Qualifier("racingTimeHandler")
    private val racingTimeHandler: BusinessStatisticHandler<OffsetDateTime, OffsetDateTime>,
) : RaceService {

    override fun startRace(carId: Long): RaceResultResponse {
        val userEntity = getUserWithCar()?.also {
            validateRaceAvailability(it, carId)
            validateUserFuel(it)
        } ?: throw UserNotFoundException()
        val userCar = getUserCar(userEntity, carId)
        val opponentEntity = userRepository.findOneUserInRatingRange(userEntity.id, userEntity.rating?.rating ?: 0) ?: throw OpponentIsNotFoundException()
        val opponentCar = opponentEntity.cars.maxBy { it.car.priority }
        val result = calculateResultRace(userCar, opponentCar)
        val exp = expService.addingExperienceToTheUser(userEntity, ExperienceEvent.PARTICIPATION_IN_RACE)
        val eloAdjustment = updateUserRating(userEntity, userCar, opponentEntity.rating?.rating ?: 0, result)

        return buildRaceResultResponse(userEntity, userCar, opponentEntity, opponentCar, result, eloAdjustment, exp)
    }

    override fun topUsersByRating(): List<UserRatingResponse> {
        val topRacers = userRepository.findTopRacers(Pageable.ofSize(raceProperty.topUsersCount))
        return topRacers.mapNotNull { mapToUserRatingResponse(it) }
    }

    private fun mapToUserRatingResponse(user: UserEntity): UserRatingResponse? {
        val carResponse = user.cars.map { it.car }.maxByOrNull { it.priority }
            ?.let { CarUserRatingResponse.mapper(it) }
            ?: return null

        return UserRatingResponse(
            id = user.id,
            name = user.name,
            image = user.photo,
            rating = user.rating?.rating ?: 0,
            car = carResponse
        )
    }

    private fun getUserWithCar(): UserEntity? {
        val userId = getUserIdFromContext()
        return userRepository.findById(userId).getOrNull()
    }

    private fun getUserCar(userEntity: UserEntity, carId: Long) = userEntity.cars.firstOrNull { it.car.id == carId } ?: throw CarNotFoundException()

    private fun validateUserFuel(userEntity: UserEntity) {
        if (userEntity.fuel < raceProperty.cost) throw NoMoneyException()
    }

    private fun validateRaceAvailability(userEntity: UserEntity, carId: Long) {
        userEntity.cars.firstOrNull { it.car.id == carId }?.let {
            it.nextRacingAt.let { nextRacingDate ->
                if (!nextRacingDate.isBefore(dateTimeProvider.offsetDateNow())) {
                    throw CarBeingServicedException(nextRacingDate)
                }
            }
        }
    }

    private fun updateUserRating(user: UserEntity, userCar: UserCarEntity, opponentRating: Long, result: RaceResult): Long {
        val userRating = user.rating!!
        val oldRating = userRating.rating
        val eloAdjustment = calculateEloAdjustment(userRating.rating, opponentRating, result.resultEnum)
        if (result.resultEnum == RaceResultEnum.WIN) {
            userRating.winCount++
        }
        user.fuel -= raceProperty.cost
        userRating.racingCount++
        userRating.rating = maxOf(0, userRating.rating + eloAdjustment)

        val nextRacingAt = dateTimeProvider.offsetDateNow().plusMinutes(raceProperty.carServiceMinute)
        val nextRacingAtFromBusiness = racingTimeHandler.handle(
            user.businesses.first(), //TODO: fix it
            nextRacingAt
        )

        userCar.nextRacingAt = nextRacingAtFromBusiness

        userRepository.save(user)
        return userRating.rating - oldRating
    }

    private fun buildRaceResultResponse(
        userEntity: UserEntity,
        userCar: UserCarEntity,
        opponentEntity: UserEntity,
        opponentCar: UserCarEntity,
        raceResult: RaceResult,
        eloAdjustment: Long,
        experienceResponse: ExpResponse
    ): RaceResultResponse {
        val currentDateTime = dateTimeProvider.offsetDateNow()

        return RaceResultResponse(
            currentCar = CarResponse.mapper(
                carEntity = userCar.car,
                userCarEntity = userCar,
                exp = experienceResponse,
                serverTime = currentDateTime
            ),
            opponentName = opponentEntity.name,
            opponentImage = opponentEntity.photo,
            opponentRating = opponentEntity.rating?.rating ?: 0,
            opponentCar = CarResponse.mapper(
                carEntity = opponentCar.car,
                userCarEntity = null,
                serverTime = currentDateTime
            ),
            result = raceResult.resultEnum,
            points = eloAdjustment,
            currentPoints = userEntity.rating!!.rating,
            exp = experienceResponse,
            nextRacingAt = userCar.nextRacingAt.toInstant().epochSecond,
            serverTime = dateTimeProvider.offsetDateNow().toInstant().epochSecond,
            chanceWin = raceResult.chance
        )
    }

    private fun calculateResultRace(userCar: UserCarEntity, opponentCarEntity: UserCarEntity): RaceResult {
        val userScore = calculateScore(userCar)
        val opponentScore = calculateScore(opponentCarEntity)
        val chance = (userScore / (userScore + opponentScore) * 100).coerceIn(0.0, 100.0)

        return RaceResult(
            chance = chance,
            resultEnum = if (userScore > opponentScore) RaceResultEnum.WIN else RaceResultEnum.LOSS
        )
    }

    private fun calculateEloAdjustment(playerRating: Long, opponentRating: Long, outcome: RaceResultEnum): Long {
        val kFactor = raceProperty.factor
        val expectedScore = 1.0 / (1.0 + 10.0.pow((opponentRating - playerRating) / 400.0))

        val actualScore = when (outcome) {
            RaceResultEnum.WIN -> 1.0
            RaceResultEnum.LOSS -> 0.0
        }

        return (kFactor * (actualScore - expectedScore)).toLong()
    }


    private fun calculateScore(car: UserCarEntity): Double {
        val baseScore = car.power * 0.4 + car.handling * 0.3 + car.braking * 0.2 + car.reputation * 0.1
        val randomFactor = baseScore * (Random.nextDouble(-0.05, 0.05))
        return baseScore + randomFactor
    }

}
