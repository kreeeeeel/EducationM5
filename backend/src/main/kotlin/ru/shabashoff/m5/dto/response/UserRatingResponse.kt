package ru.shabashoff.m5.dto.response

import ru.shabashoff.m5.dao.entity.CarEntity

data class UserRatingResponse(
    val id: Long,
    val name: String,
    val image: String,
    val rating: Long,
    val car: CarUserRatingResponse
)

data class CarUserRatingResponse(
    val id: Long,
    val name: String,
    val image: String
) {
    companion object {
        fun mapper(carEntity: CarEntity) = CarUserRatingResponse(
            id = carEntity.id,
            name = carEntity.name,
            image = carEntity.image
        )
    }
}