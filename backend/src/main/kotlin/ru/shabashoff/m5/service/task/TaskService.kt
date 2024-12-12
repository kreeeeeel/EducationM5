package ru.shabashoff.m5.service.task

import ru.shabashoff.m5.dto.response.ExpResponse
import ru.shabashoff.m5.dto.response.TaskResponse

interface TaskService {
    fun getTask(): List<TaskResponse>
    fun completeTask(id: Long): ExpResponse
}
