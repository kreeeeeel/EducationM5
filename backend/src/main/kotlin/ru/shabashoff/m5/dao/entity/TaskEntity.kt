package ru.shabashoff.m5.dao.entity

import com.fasterxml.jackson.annotation.JsonTypeInfo
import com.fasterxml.jackson.annotation.JsonTypeName
import jakarta.persistence.Entity
import jakarta.persistence.EnumType
import jakarta.persistence.Enumerated
import jakarta.persistence.Id
import jakarta.persistence.Table
import org.hibernate.annotations.JdbcTypeCode
import org.hibernate.type.SqlTypes
import java.io.Serializable

@Entity
@Table(name = "task")
data class TaskEntity(
    @Id
    val id: Long,

    val title: String,
    val description: String,
    @Enumerated(EnumType.STRING)
    val type: TaskType,
    val needCount: Long? = null,
    val url: String? = null,
    val reward: Long,
    val priority: Int,

    @JdbcTypeCode(SqlTypes.JSON)
    val details: Details? = null
) : Serializable {

    @JsonTypeInfo(use = JsonTypeInfo.Id.NAME, property = "type")
    sealed class Details : Serializable  {
        @JsonTypeName("WalletTransactionDetail")
        data class WalletTransactionDetail(
            val token: String,
            val address: String,
            val amount: String
        ) : Details()
    }

    enum class TaskType {
        SUBSCRIBE_TG,
        NUMBER_OF_RACES,
        RACE_VICTORIES,
        RECEIVED_OF_CLAIMS,
        ADVERTISING_VIEWED,
        INVITE_FRIENDS,
        UPGRADE_CAR,
        UPGRADE_BUSINESS,
        CONNECT_WALLET,
        WALLET_TRANSACTION
    }
}