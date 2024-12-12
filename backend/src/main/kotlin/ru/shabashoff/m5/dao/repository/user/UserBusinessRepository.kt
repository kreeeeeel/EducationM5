package ru.shabashoff.m5.dao.repository.user

import org.springframework.data.repository.CrudRepository
import ru.shabashoff.m5.dao.entity.user.UserBusinessEntity

interface UserBusinessRepository : CrudRepository<UserBusinessEntity, Long> {
    fun findAllByUserId(userId: Long): List<UserBusinessEntity>

    fun findByUserIdAndBusinessId(userId: Long, businessId: Long): UserBusinessEntity?
}
