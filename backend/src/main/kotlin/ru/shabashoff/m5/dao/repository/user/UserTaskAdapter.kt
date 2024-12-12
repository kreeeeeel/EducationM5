package ru.shabashoff.m5.dao.repository.user

import org.springframework.data.repository.CrudRepository
import org.springframework.stereotype.Component
import ru.shabashoff.m5.dao.entity.user.UserTaskEntity

@Component
class UserTaskAdapter(
    private val userTaskRepository: UserTaskRepository
) {
    fun findUserTasks(userId: Long) = userTaskRepository.findAllByUserId(userId)
}

interface UserTaskRepository : CrudRepository<UserTaskEntity, Long> {

    fun findAllByUserId(userId: Long): List<UserTaskEntity>
}

