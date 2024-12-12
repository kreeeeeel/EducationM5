package ru.shabashoff.m5.dao.repository.user

import jakarta.persistence.LockModeType
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.EntityGraph
import org.springframework.data.jpa.repository.Lock
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.CrudRepository
import org.springframework.data.repository.query.Param
import ru.shabashoff.m5.dao.entity.user.UserEntity
import java.util.*

interface UserRepository : CrudRepository<UserEntity, Long> {

    @EntityGraph(attributePaths = ["rating", "businesses"])
    override fun findById(id: Long): Optional<UserEntity>

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT u FROM UserEntity u WHERE u.id = :userId")
    fun findByIdForUpdate(@Param("userId") userId: Long): UserEntity?

    @Query(
        """
        SELECT u 
        FROM UserEntity u 
        JOIN u.rating r 
        where u.id != :userId
        order by abs(r.rating - :rating) ASC, random()
        limit 1
    """
    )
    fun findOneUserInRatingRange(
        userId: Long,
        rating: Long,
    ): UserEntity

    @Query(
        """
        SELECT u 
        FROM UserEntity u 
        JOIN u.rating r 
        ORDER BY r.rating DESC
    """
    )
    fun findTopRacers(pageable: Pageable): List<UserEntity>
}

