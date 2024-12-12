package ru.shabashoff.m5.service.car

import ru.shabashoff.m5.dao.entity.CarEntity.CarUpgradeType
import ru.shabashoff.m5.dao.entity.user.UserEntity
import ru.shabashoff.m5.dto.response.CarResponse

interface CarService {
    fun assignDefaultCarToUser(userEntity: UserEntity)
    fun getAllCars(): List<CarResponse>
    fun buyCar(carId: Long): CarResponse
    fun upgradeCar(carId: Long, type: CarUpgradeType): CarResponse
}