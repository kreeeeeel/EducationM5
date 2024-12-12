package ru.shabashoff.m5.dao.entity.user

import jakarta.persistence.CascadeType
import jakarta.persistence.Entity
import jakarta.persistence.FetchType
import jakarta.persistence.Id
import jakarta.persistence.JoinColumn
import jakarta.persistence.ManyToOne
import jakarta.persistence.OneToMany
import jakarta.persistence.OneToOne
import jakarta.persistence.Table
import org.hibernate.annotations.DynamicUpdate
import ru.shabashoff.m5.service.auth.impl.UserData
import java.time.LocalDate
import java.time.OffsetDateTime

@Entity
@DynamicUpdate
@Table(name = "user")
data class UserEntity(
    @Id
    val id: Long, // Telegram ID пользователя

    var name: String,
    var photo: String,
    var walletAddress: String? = null,

    var level: Long = 1,
    var exp: Long = 0,
    var fuel: Long = 0,

    var lastVisitedAt: OffsetDateTime,
    var createdAt: OffsetDateTime,
    var nextClaimAt: OffsetDateTime,
    var referralBonus: Long = 0,

    var dailyLastClaim: LocalDate? = null,
    var dailyEntry: Long = 0,

    @ManyToOne(fetch = FetchType.LAZY, cascade = [CascadeType.ALL])
    @JoinColumn(name = "inviter_id")
    var inviter: UserEntity? = null,

    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY, cascade = [CascadeType.ALL])
    var cars: MutableList<UserCarEntity> = mutableListOf(),

    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY, cascade = [CascadeType.ALL])
    var tasks: MutableList<UserTaskEntity> = mutableListOf(),

    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY, cascade = [CascadeType.ALL])
    var businesses: MutableList<UserBusinessEntity> = mutableListOf(), // Бизнесы пользователя

    @OneToMany(mappedBy = "referrer", fetch = FetchType.LAZY, cascade = [CascadeType.ALL])
    var referrals: MutableList<UserReferralEntity> = mutableListOf(), // Рефералы

    @OneToOne(mappedBy = "user", fetch = FetchType.LAZY, cascade = [CascadeType.ALL])
    var rating: UserRatingEntity? = null,
) {

    companion object {
        fun createUser(
            userData: UserData,
            currentOffsetDateNow: OffsetDateTime,
            claimOffsetDate: OffsetDateTime,
            photo: String,
            fuel: Long,
        ) = UserEntity(
            id = userData.id,
            name = userData.name,
            fuel = fuel,
            photo = photo,
            lastVisitedAt = currentOffsetDateNow,
            createdAt = currentOffsetDateNow,
            nextClaimAt = claimOffsetDate,
        )
    }
}
