package ru.shabashoff.m5.dto.response

import ru.shabashoff.m5.dao.entity.TaskEntity
import ru.shabashoff.m5.dao.entity.TaskEntity.TaskType
import ru.shabashoff.m5.dao.entity.user.UserTaskEntity.UserTaskStatus

data class TaskResponse(
    val id: Long,
    val title: String,
    val reward: Long,
    val description: String,
    val status: UserTaskStatus,
    var type: TaskType,
    var needCount: Long?,
    var priority: Int,
    var url: String?,
    var details: TaskEntity.Details?
) {
    companion object {
        fun mapper(taskEntity: TaskEntity, taskStatus: UserTaskStatus) = TaskResponse(
            id = taskEntity.id,
            title = taskEntity.title,
            reward = taskEntity.reward,
            priority = taskEntity.priority,
            description = taskEntity.description,
            status = taskStatus,
            type = taskEntity.type,
            needCount = taskEntity.needCount,
            details = taskEntity.details,
            url = taskEntity.url,
        )
    }
}
