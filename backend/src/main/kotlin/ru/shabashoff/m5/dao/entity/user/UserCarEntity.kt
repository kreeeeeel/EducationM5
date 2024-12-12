package ru.shabashoff.m5.dao.entity.user

import com.fasterxml.jackson.annotation.JsonIgnore
import jakarta.persistence.Entity
import jakarta.persistence.FetchType
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.ManyToOne
import jakarta.persistence.Table
import ru.shabashoff.m5.dao.entity.CarEntity
import ru.shabashoff.m5.dao.entity.CarEntity.CarUpgradeType
import java.time.OffsetDateTime

@Entity
@Table(name = "user_car")
data class UserCarEntity(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    val user: UserEntity?,

    @ManyToOne(fetch = FetchType.LAZY)
    val car: CarEntity,

    var power: Long = 0,
    var handling: Long = 0,
    var braking: Long = 0,
    var reputation: Long = 0,

    var nextRacingAt: OffsetDateTime,
) {

    fun getCarIndicator(carUpgradeType: CarUpgradeType): Long = when (carUpgradeType) {
        CarUpgradeType.POWER -> power
        CarUpgradeType.HANDLING -> handling
        CarUpgradeType.BRAKING -> braking
        CarUpgradeType.REPUTATION -> reputation
    }
}