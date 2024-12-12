package ru.shabashoff.m5.dao.entity.user

import com.fasterxml.jackson.annotation.JsonIgnore
import com.fasterxml.jackson.annotation.JsonTypeInfo
import com.fasterxml.jackson.annotation.JsonTypeName
import jakarta.persistence.Entity
import jakarta.persistence.EnumType
import jakarta.persistence.Enumerated
import jakarta.persistence.FetchType
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.ManyToOne
import jakarta.persistence.Table
import org.hibernate.annotations.JdbcTypeCode
import org.hibernate.type.SqlTypes
import ru.shabashoff.m5.dao.entity.TaskEntity

@Entity
@Table(name = "user_task")
class UserTaskEntity(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    val user: UserEntity?,

    @ManyToOne(fetch = FetchType.LAZY)
    val task: TaskEntity,

    @Enumerated(EnumType.STRING)
    val status: UserTaskStatus,

    @JdbcTypeCode(SqlTypes.JSON)
    var details: Details? = null,
) {

    @JsonTypeInfo(use = JsonTypeInfo.Id.NAME, property = "type")
    sealed class Details {

        @JsonTypeName("TransactionDetails")
        class TransactionDetails(
            val bom: String,
            val attempts: Int
        )
    }

    enum class UserTaskStatus {
        NotStarted, Failed, Success, CheckInProgress
    }
}
