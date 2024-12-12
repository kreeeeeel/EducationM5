package ru.shabashoff.m5.dto.response

import ru.shabashoff.m5.dao.entity.user.UserEntity
import java.time.OffsetDateTime

data class UserInfoResponse(
    val name: String,
    val photo: String,
    val level: Long,
    val exp: Long,
    val needExpToUp: Long,
    val ratingRacing: Long,
    val fuel: Long,
    var passiveIncome: Long,

    var lastVisitedAt: Long,
    var nextClaimAt: Long,
    var createdAt: Long,
    var nextDay: Long,
    var now: Long,

    //val details: Details,
    val dailyReward: List<RewardResponse>
) {
    companion object {
        fun mapper(
            defaultPassiveIncome: Long,
            userEntity: UserEntity,
            url: String,
            now: OffsetDateTime,
            needExpToUp: Long,
            nextDay: Long,
            dailyReward: List<RewardResponse>,
        ): UserInfoResponse =
            UserInfoResponse(
                name = userEntity.name,
                photo = userEntity.photo,
                level = userEntity.level,
                exp = userEntity.exp,
                needExpToUp = needExpToUp,
                fuel = userEntity.fuel,
                ratingRacing = userEntity.rating?.rating ?: 0,
                passiveIncome = userEntity.businesses.sumOf { it.passiveIncome } + defaultPassiveIncome,
                lastVisitedAt = userEntity.lastVisitedAt.toInstant().epochSecond,
                createdAt = userEntity.createdAt.toInstant().epochSecond,
                nextClaimAt = userEntity.nextClaimAt.toInstant().epochSecond,
                now = now.toInstant().epochSecond,
                //details = Details.mapper(userEntity.userDetails, adsCount),
                nextDay = nextDay,
                dailyReward = dailyReward
            )
    }
}

//data class Details(
//    val claimCount: Long,
//    val referralsCount: Long,
//    val completedMissionsCount: Long,
//    val viewedAdsCount: Long,
//    val purchasedWithStarsCount: Long,
//    val upgradeCarCount: Long,
//    val upgradeBusinessCount: Long,
//    val racingCount: Long,
//    val racingWinCount: Long,
//    val walletAddress: String?,
//    val dailyEntry: Long,
//    val adsEntry: Long,
//) {
//    companion object {
//        fun mapper(userDetails: UserEntity.UserDetails, adsCount: Long) = Details(
//            claimCount = userDetails.claimCount,
//            referralsCount = userDetails.referralsCount,
//            viewedAdsCount = userDetails.viewedAdsCount,
//            completedMissionsCount = userDetails.completedMissionsCount,
//            purchasedWithStarsCount = userDetails.purchasedWithStarsCount,
//            upgradeCarCount = userDetails.upgradeCarCount,
//            upgradeBusinessCount = userDetails.upgradeBusinessCount,
//            racingCount = userDetails.racingCount,
//            racingWinCount = userDetails.racingWinCount,
//            walletAddress = userDetails.wallet?.address,
//            dailyEntry = userDetails.dailyEntry,
//            adsEntry = max(0, adsCount - userDetails.adsEntry)
//        )
//    }
//}
