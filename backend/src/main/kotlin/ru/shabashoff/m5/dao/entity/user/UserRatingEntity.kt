package ru.shabashoff.m5.dao.entity.user

import com.fasterxml.jackson.annotation.JsonIgnore
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.FetchType
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.JoinColumn
import jakarta.persistence.OneToOne
import jakarta.persistence.Table
import java.time.OffsetDateTime

@Entity
@Table(name = "user_rating")
data class UserRatingEntity(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,

    @JsonIgnore
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    val user: UserEntity?,

    @Column(nullable = false)
    var rating: Long = 0,

    var winCount: Long = 0,
    var racingCount: Long = 0,

    @Column(name = "last_updated", nullable = false)
    var lastUpdated: OffsetDateTime = OffsetDateTime.now()
)
