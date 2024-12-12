package ru.shabashoff.m5.controller

import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import ru.shabashoff.m5.service.task.TaskService

@RestController
@RequestMapping("/api/v0.1/task")
class TaskController(
    private val taskService: TaskService
) {
    @GetMapping
    fun getAllTasks() = taskService.getTask()

    @PostMapping
    fun completeTask(@RequestParam taskId: Long) = taskService.completeTask(taskId)
}
