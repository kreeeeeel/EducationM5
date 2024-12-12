package ru.shabashoff.m5.dao.entity

import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.Table
import org.hibernate.annotations.JdbcTypeCode
import org.hibernate.type.SqlTypes
import java.io.Serializable

@Entity
@Table(name = "car")
data class CarEntity(
    @Id
    var id: Long,

    var name: String,
    var image: String,
    var requiredWins: Long,
    var cost: Long,

    var priority: Long,

    @JdbcTypeCode(SqlTypes.JSON)
    var carDetails: CarDetails = CarDetails()
) : Serializable {

    class CarDetails : Serializable {
        var upgrades: MutableMap<CarUpgradeType, CarIndicators> = mutableMapOf()
    }

    class CarIndicators : Serializable {
        var base: Long = 0
        var max: Long = 0
        var cost: Long = 0
    }

    enum class CarUpgradeType {
        POWER, HANDLING, BRAKING, REPUTATION
    }
}
