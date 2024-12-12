package ru.shabashoff.m5.dto.response

import com.fasterxml.jackson.annotation.JsonInclude
import ru.shabashoff.m5.dao.entity.CarEntity
import ru.shabashoff.m5.dao.entity.CarEntity.CarUpgradeType
import ru.shabashoff.m5.dao.entity.user.UserCarEntity
import ru.shabashoff.m5.service.calculateUpgradeCarCost
import java.time.OffsetDateTime

@JsonInclude(JsonInclude.Include.NON_NULL)
data class CarResponse(
    val id: Long,
    val isOwned: Boolean,
    val name: String,
    val image: String,
    val cost: Long,
    val requiredWins: Long,
    val power: CarIndicatorResponse,
    val handling: CarIndicatorResponse,
    val braking: CarIndicatorResponse,
    val reputation: CarIndicatorResponse,
    val nextRacingAt: Long?,
    val serverTime: Long,
    val exp: ExpResponse? = null
) {
    companion object {

        fun mapper(
            carEntity: CarEntity,
            userCarEntity: UserCarEntity?,
            exp: ExpResponse? = null,
            serverTime: OffsetDateTime
        ) = CarResponse(
            id = carEntity.id,
            isOwned = userCarEntity != null,
            name = carEntity.name,
            image = carEntity.image,
            cost = carEntity.cost,
            requiredWins = carEntity.requiredWins,
            power = carIndicator(carEntity, userCarEntity, CarUpgradeType.POWER),
            handling = carIndicator(carEntity, userCarEntity, CarUpgradeType.HANDLING),
            braking = carIndicator(carEntity, userCarEntity, CarUpgradeType.BRAKING),
            reputation = carIndicator(carEntity, userCarEntity, CarUpgradeType.REPUTATION),
            exp = exp,
            serverTime = serverTime.toInstant().epochSecond,
            nextRacingAt = userCarEntity?.nextRacingAt?.toInstant()?.epochSecond
        )

        private fun carIndicator(carEntity: CarEntity, userCarEntity: UserCarEntity?, type: CarUpgradeType) =
            CarIndicatorResponse(
                currentIndicator = userCarEntity?.getCarIndicator(type) ?: carEntity.carDetails.upgrades[type]!!.base,
                maximumIndicator = carEntity.carDetails.upgrades[type]!!.max,
                costUpgrade = calculateUpgradeCarCost(
                    carEntity.carDetails.upgrades[type]!!.cost,
                    carEntity.carDetails.upgrades[type]!!.base,
                    userCarEntity?.getCarIndicator(type)
                )
            )
    }
}

data class CarIndicatorResponse(
    val currentIndicator: Long,
    val maximumIndicator: Long,
    var costUpgrade: Long
)
