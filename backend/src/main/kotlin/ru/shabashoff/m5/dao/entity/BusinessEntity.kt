package ru.shabashoff.m5.dao.entity

import jakarta.persistence.Entity
import jakarta.persistence.EnumType
import jakarta.persistence.Enumerated
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.Table
import java.io.Serializable

@Entity
@Table(name = "business")
data class BusinessEntity(

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long,

    val name: String,
    val image: String,
    val description: String,
    val requiredLevel: Long,
    val maxLevel: Long,

    val passiveIncome: Long,
    val upgradeCost: Long,

    @Enumerated(EnumType.STRING)
    val type: BusinessType
) : Serializable {
    enum class BusinessType {
        CLAIM_TIME, REFERRAL_BONUS, RACING_TIME
    }
}

