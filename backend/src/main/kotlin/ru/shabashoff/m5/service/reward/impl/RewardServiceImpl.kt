package ru.shabashoff.m5.service.reward.impl

import org.springframework.beans.factory.annotation.Qualifier
import org.springframework.stereotype.Service
import ru.shabashoff.m5.config.property.DefaultProperty
import ru.shabashoff.m5.config.property.RewardEnum
import ru.shabashoff.m5.config.property.RewardEnum.CLEAR_CLAIM_TIME_ADS
import ru.shabashoff.m5.config.property.RewardProperty
import ru.shabashoff.m5.dao.entity.BusinessEntity.BusinessType.CLAIM_TIME
import ru.shabashoff.m5.dao.entity.user.UserEntity
import ru.shabashoff.m5.dao.repository.BusinessRepositoryAdapter
import ru.shabashoff.m5.dao.repository.user.UserRepository
import ru.shabashoff.m5.dto.response.ClaimResponse
import ru.shabashoff.m5.dto.response.RewardResponse
import ru.shabashoff.m5.dto.type.ExperienceEvent
import ru.shabashoff.m5.exception.impl.BadRequestException
import ru.shabashoff.m5.exception.impl.ClaimDateException
import ru.shabashoff.m5.exception.impl.UserNotFoundException
import ru.shabashoff.m5.service.DateTimeProvider
import ru.shabashoff.m5.service.business.BusinessStatisticHandler
import ru.shabashoff.m5.service.exp.ExpService
import ru.shabashoff.m5.service.getUserIdFromContext
import ru.shabashoff.m5.service.reward.RewardService
import java.time.OffsetDateTime
import kotlin.jvm.optionals.getOrNull

@Service
class RewardServiceImpl(
    private val expService: ExpService,
    private val defaultProperty: DefaultProperty,
    private val rewardProperty: RewardProperty,
    private val userRepository: UserRepository,
    private val dateTimeProvider: DateTimeProvider,
    private val businessRepositoryAdapter: BusinessRepositoryAdapter,
    @Qualifier("claimTimeHandler")
    private val claimTimeHandler: BusinessStatisticHandler<OffsetDateTime, OffsetDateTime>,
) : RewardService {

    override fun takeRewardOfClaim(): ClaimResponse {
        val userId = getUserIdFromContext()
        val user = userRepository.findById(userId).getOrNull() ?: throw UserNotFoundException()
        val currentOffsetDate = dateTimeProvider.offsetDateNow()
        if (!user.nextClaimAt.isBefore(currentOffsetDate)) {
            throw ClaimDateException()
        }

        user.fuel += user.businesses.sumOf { it.passiveIncome } + defaultProperty.passiveIncome
        user.lastVisitedAt = currentOffsetDate

        val claimTimeBusiness = user.businesses.firstOrNull { businessRepositoryAdapter.findBusinessIdsByType(CLAIM_TIME).contains(it.businessId) }
        user.nextClaimAt =claimTimeBusiness?.let {
            claimTimeHandler.handle(it, currentOffsetDate.plusHours(rewardProperty.claimGetFromHour))
        } ?: currentOffsetDate.plusHours(rewardProperty.claimGetFromHour)

        val exp = expService.addingExperienceToTheUser(user, ExperienceEvent.RECEIVING_AWARDS)
        return ClaimResponse.mapper(userRepository.save(user), exp)
    }

    override fun getDailyRewards(userEntity: UserEntity): List<RewardResponse> {
        val currentDate = dateTimeProvider.localDateNow()
        userEntity.dailyLastClaim?.let {
            if (it.plusDays(1) == currentDate) {
                userEntity.dailyEntry++
            } else userEntity.dailyEntry = 0
        }

        if (userEntity.dailyEntry >= rewardProperty.maxDays) {
            userEntity.dailyEntry = 0
        }

        return (0..rewardProperty.maxDays).mapIndexed { _, day ->
            val completed = userEntity.dailyEntry >= rewardProperty.maxDays
            RewardResponse(
                day = day,
                isCompleted = completed,
                isCanTake = !completed,
                isCanTakeInFuture = !completed,
                reward = (day + 1) * rewardProperty.claimDay
            )
        }

    }

    override fun takeRewardDaily(day: Long): RewardResponse {
        if (day < 0 || day > rewardProperty.maxDays) {
            throw BadRequestException()
        }

        val currentDate = dateTimeProvider.localDateNow()
        val userId = getUserIdFromContext()
        val userEntity = userRepository.findById(userId).getOrNull() ?: throw UserNotFoundException()

        userEntity.dailyLastClaim?.let {
            if (it.plusDays(1) != currentDate) {
                userEntity.dailyEntry = 0
            } else userEntity.dailyEntry++
        }

        if (userEntity.dailyEntry >= rewardProperty.maxDays) {
            userEntity.dailyEntry = 0
        }

        if (userEntity.dailyEntry != day) {
            throw BadRequestException()
        }

        userEntity.dailyLastClaim = currentDate
        userEntity.fuel += (day + 1) * rewardProperty.claimDay
        userRepository.save(userEntity)

        return RewardResponse(
            day = day,
            isCompleted = true,
            isCanTakeInFuture = false,
            isCanTake = false,
            reward = (day + 1) * rewardProperty.claimDay
        )
    }

    override fun rewardAds(key: String, userId: Long) {
        userRepository.findById(userId).getOrNull()?.let { user ->
            rewardProperty.ads[key]?.let { reward ->
                reward.processReward(user)
                userRepository.save(user)
            }
        }
    }

    private fun RewardEnum.processReward(user: UserEntity) {
        when (this) {
            CLEAR_CLAIM_TIME_ADS -> user.nextClaimAt = dateTimeProvider.offsetDateNow()
        }
    }
}
