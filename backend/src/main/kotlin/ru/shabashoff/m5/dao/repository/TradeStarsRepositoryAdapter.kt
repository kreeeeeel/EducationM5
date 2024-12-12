package ru.shabashoff.m5.dao.repository

import org.springframework.cache.annotation.Cacheable
import org.springframework.data.repository.CrudRepository
import org.springframework.stereotype.Component
import ru.shabashoff.m5.dao.entity.TradeStarsEntity
import kotlin.jvm.optionals.getOrNull

@Component
class TradeStarsRepositoryAdapter(
    private val tradeStarsRepository: TradeStarsRepository
) {

    @Cacheable(value = ["TradeStarsRepositoryAdapter.findById"], key = "#id")
    fun findById(id: Long): TradeStarsEntity? = tradeStarsRepository.findById(id).getOrNull()

    @Cacheable(value = ["TradeStarsRepositoryAdapter.findAll"])
    fun findAll(): List<TradeStarsEntity> = tradeStarsRepository.findAll().toList()
}

interface TradeStarsRepository : CrudRepository<TradeStarsEntity, Long>
