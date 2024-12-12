package ru.shabashoff.m5.dto.response

import ru.shabashoff.m5.dao.entity.user.UserEntity

data class ReferralResponse(
    val url: String,
    val bonus: Long,
    val numberOfInvitees: Int,
    val users: List<UserReferralResponse>
) {
    companion object {
        fun mapper(userEntity: UserEntity, url: String) = ReferralResponse(
            url = url,
            bonus = userEntity.referrals.sumOf { it.bonus },
            numberOfInvitees = userEntity.referrals.size,
            users = userEntity.referrals.map {
                UserReferralResponse(it.referredUser!!.name, it.referredUser!!.name, it.bonus)
            }
        )
    }
}

data class UserReferralResponse(
    val name: String,
    val photo: String,
    val bonus: Long
)
