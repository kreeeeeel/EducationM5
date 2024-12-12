package ru.shabashoff.m5.dao.repository

import org.springframework.cache.annotation.Cacheable
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.CrudRepository
import org.springframework.stereotype.Component
import ru.shabashoff.m5.dao.entity.BusinessEntity
import ru.shabashoff.m5.dao.entity.BusinessEntity.BusinessType
import kotlin.jvm.optionals.getOrNull

@Component
class BusinessRepositoryAdapter(
    private val businessRepository: BusinessRepository
) {
    @Cacheable(value = ["BusinessRepositoryAdapter.findById"], key = "#id")
    fun findById(id: Long): BusinessEntity? = businessRepository.findById(id).getOrNull()

    @Cacheable(value = ["BusinessRepositoryAdapter.findBusinessIdsByType"], key = "#type")
    fun findBusinessIdsByType(type: BusinessType): Set<Long> = businessRepository.findIdByType(type)

    @Cacheable(value = ["BusinessRepositoryAdapter.findAll"])
    fun findAll(): List<BusinessEntity> = businessRepository.findAllByOrderByIdAsc()
}

interface BusinessRepository : CrudRepository<BusinessEntity, Long> {
    fun findAllByOrderByIdAsc(): List<BusinessEntity>

    @Query(
        """
        select be.id
        from BusinessEntity be
        where be.type = :type
    """
    )
    fun findIdByType(type: BusinessType): Set<Long>

}
