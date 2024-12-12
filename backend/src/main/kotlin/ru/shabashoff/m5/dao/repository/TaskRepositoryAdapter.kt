package ru.shabashoff.m5.dao.repository

import org.springframework.cache.annotation.Cacheable
import org.springframework.data.repository.CrudRepository
import org.springframework.stereotype.Component
import ru.shabashoff.m5.dao.entity.TaskEntity
import kotlin.jvm.optionals.getOrNull

@Component
class TaskRepositoryAdapter(
    private val taskRepository: TaskRepository
) {

    @Cacheable(value = ["TaskRepositoryAdapter.findById"], key = "#id")
    fun findById(id: Long): TaskEntity? = taskRepository.findById(id).getOrNull()

    @Cacheable(value = ["TaskRepositoryAdapter.findAll"])
    fun findAll(): List<TaskEntity> = taskRepository.findAllByOrderByPriorityDesc()
}

interface TaskRepository : CrudRepository<TaskEntity, Long> {
    fun findAllByOrderByPriorityDesc(): List<TaskEntity>
}
