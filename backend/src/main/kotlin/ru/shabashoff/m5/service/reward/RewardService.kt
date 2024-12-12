package ru.shabashoff.m5.service.reward

import ru.shabashoff.m5.dao.entity.user.UserEntity
import ru.shabashoff.m5.dto.response.ClaimResponse
import ru.shabashoff.m5.dto.response.RewardResponse

interface RewardService {
    fun takeRewardOfClaim(): ClaimResponse
    fun getDailyRewards(userEntity: UserEntity): List<RewardResponse>
    fun takeRewardDaily(day: Long): RewardResponse
    fun rewardAds(key: String, userId: Long)
}