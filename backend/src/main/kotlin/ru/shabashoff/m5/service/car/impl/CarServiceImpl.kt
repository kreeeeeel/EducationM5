package ru.shabashoff.m5.service.car.impl

import org.springframework.stereotype.Service
import ru.shabashoff.m5.dao.entity.CarEntity
import ru.shabashoff.m5.dao.entity.CarEntity.CarUpgradeType
import ru.shabashoff.m5.dao.entity.user.UserCarEntity
import ru.shabashoff.m5.dao.entity.user.UserEntity
import ru.shabashoff.m5.dao.repository.CarRepositoryAdapter
import ru.shabashoff.m5.dao.repository.user.UserRepository
import ru.shabashoff.m5.dto.response.CarResponse
import ru.shabashoff.m5.dto.type.ExperienceEvent
import ru.shabashoff.m5.exception.impl.BadRequestException
import ru.shabashoff.m5.exception.impl.UserNotFoundException
import ru.shabashoff.m5.exception.impl.car.CarAlreadyMaxIndicatorException
import ru.shabashoff.m5.exception.impl.car.CarIsAlreadyException
import ru.shabashoff.m5.exception.impl.car.CarNotFoundException
import ru.shabashoff.m5.service.DateTimeProvider
import ru.shabashoff.m5.service.calculateUpgradeCarCost
import ru.shabashoff.m5.service.car.CarService
import ru.shabashoff.m5.service.exp.ExpService
import ru.shabashoff.m5.service.getUserIdFromContext
import kotlin.jvm.optionals.getOrNull

@Service
class CarServiceImpl(
    private val dateTimeProvider: DateTimeProvider,
    private val carRepositoryAdapter: CarRepositoryAdapter,
    private val userRepository: UserRepository,
    private val expService: ExpService,
) : CarService {
    override fun assignDefaultCarToUser(userEntity: UserEntity) {
        val defaultCarEntity = carRepositoryAdapter.findFirst() ?: throw CarNotFoundException()

        userEntity.cars.add(
            UserCarEntity(
                car = defaultCarEntity,
                nextRacingAt = dateTimeProvider.offsetDateNow(),
                user = userEntity,
            )
        )
    }

    override fun getAllCars(): List<CarResponse> {
        val userEntity = getUserEntityFromContext()
        val userCars = userEntity.cars.associateBy { it.car.id }

        val currentOffsetDate = dateTimeProvider.offsetDateNow()

        return carRepositoryAdapter.findAll().map { car -> CarResponse.mapper(car, userCars[car.id], serverTime = currentOffsetDate) }
    }

    override fun buyCar(carId: Long): CarResponse {
        val userEntity = getUserEntityFromContext()
        val userCars = userEntity.cars.associateBy { it.car.id }

        if (userCars.containsKey(carId)) {
            throw CarIsAlreadyException()
        }

        val carEntity = carRepositoryAdapter.findById(carId) ?: throw CarNotFoundException()
        val userCarDetails = assignCarToTheUser(carEntity, userEntity)

        val experienceResponse = expService.addingExperienceToTheUser(userEntity, ExperienceEvent.INTERACTION_WITH_CAR)
        userRepository.save(userEntity)

        return CarResponse.mapper(
            carEntity = carEntity,
            userCarEntity = userCarDetails,
            exp = experienceResponse,
            serverTime = dateTimeProvider.offsetDateNow()
        )
    }

    override fun upgradeCar(carId: Long, type: CarUpgradeType): CarResponse {
        val user = getUserEntityFromContext()

        val userCarEntity = user.cars.firstOrNull { it.car.id == carId } ?: throw CarNotFoundException()
        val carEntity = carRepositoryAdapter.findById(carId) ?: throw CarNotFoundException()

        user.fuel -= calculateUpgradeCarCost(
            carEntity.carDetails.upgrades[type]!!.cost,
            carEntity.carDetails.upgrades[type]!!.base,
            userCarEntity.getCarIndicator(type)
        ).let {
            if (user.fuel < it) throw BadRequestException()
            it
        }
        applyUpgrade(type, userCarEntity, carEntity)
        val experienceResponse = expService.addingExperienceToTheUser(user, ExperienceEvent.INTERACTION_WITH_CAR)

        userRepository.save(user)
        return CarResponse.mapper(
            userCarEntity = userCarEntity,
            carEntity = carEntity,
            exp = experienceResponse,
            serverTime = dateTimeProvider.offsetDateNow()
        )
    }

    fun assignCarToTheUser(carEntity: CarEntity, userEntity: UserEntity): UserCarEntity {
        if (userEntity.fuel < carEntity.cost) throw BadRequestException()

        userEntity.fuel -= carEntity.cost
        val newUserCarEntity = UserCarEntity(
            car = carEntity,
            nextRacingAt = dateTimeProvider.offsetDateNow(),
            user = userEntity,
        )
        userEntity.cars.add(
            newUserCarEntity
        )

        return newUserCarEntity
    }

    private fun applyUpgrade(
        type: CarUpgradeType,
        userCarEntity: UserCarEntity,
        carEntity: CarEntity
    ) {
        val (currentLevel, maxLevel) = when (type) {
            CarUpgradeType.POWER -> userCarEntity::power to carEntity.carDetails.upgrades[type]!!.max
            CarUpgradeType.HANDLING -> userCarEntity::handling to carEntity.carDetails.upgrades[type]!!.max
            CarUpgradeType.BRAKING -> userCarEntity::braking to carEntity.carDetails.upgrades[type]!!.max
            CarUpgradeType.REPUTATION -> userCarEntity::reputation to carEntity.carDetails.upgrades[type]!!.max
        }

        currentLevel.set(currentLevel.get() + 1)
        if (currentLevel.get() > maxLevel) {
            throw CarAlreadyMaxIndicatorException()
        }
    }

    private fun getUserEntityFromContext(): UserEntity {
        val userId = getUserIdFromContext()
        return userRepository.findById(userId).getOrNull() ?: throw UserNotFoundException()
    }
}
