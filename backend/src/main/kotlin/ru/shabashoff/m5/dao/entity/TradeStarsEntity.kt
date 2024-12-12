package ru.shabashoff.m5.dao.entity

import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.Table
import java.io.Serializable


@Entity
@Table(name = "trade_stars")
data class TradeStarsEntity(
    @Id
    val id: Long,
    val price: Int,
    val exchange: Long
) : Serializable
