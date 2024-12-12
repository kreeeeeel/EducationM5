package ru.shabashoff.m5.dto.response

import ru.shabashoff.m5.dao.entity.user.UserEntity

data class ClaimResponse(
    val currentFuel: Long,
    val dateNextClaim: Long,
    val exp: ExpResponse,
) {
    companion object {
        fun mapper(userEntity: UserEntity, exp: ExpResponse) = ClaimResponse(
            currentFuel = userEntity.fuel,
            dateNextClaim = userEntity.nextClaimAt.toInstant().epochSecond,
            exp = exp,
        )
    }
}
