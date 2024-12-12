package ru.shabashoff.m5.dao.repository

import org.springframework.cache.annotation.Cacheable
import org.springframework.data.repository.CrudRepository
import org.springframework.stereotype.Component
import ru.shabashoff.m5.dao.entity.CarEntity
import kotlin.jvm.optionals.getOrNull

@Component
class CarRepositoryAdapter(
    private val carRepository: CarRepository
) {

    @Cacheable(value = ["CarRepositoryAdapter.findById"], key = "#id")
    fun findById(id: Long): CarEntity? = carRepository.findById(id).getOrNull()

    @Cacheable(value = ["CarRepositoryAdapter.findFirst"])
    fun findFirst(): CarEntity? = carRepository.findFirstByOrderByIdAsc()

    @Cacheable(value = ["CarRepositoryAdapter.findAll"])
    fun findAll(): List<CarEntity> = carRepository.findAllByOrderByIdAsc()
}

interface CarRepository : CrudRepository<CarEntity, Long> {
    fun findFirstByOrderByIdAsc(): CarEntity?
    fun findAllByOrderByIdAsc(): List<CarEntity>
}