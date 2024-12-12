package ru.shabashoff.m5.controller

import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import ru.shabashoff.m5.dao.entity.CarEntity.CarUpgradeType
import ru.shabashoff.m5.dto.response.CarResponse
import ru.shabashoff.m5.service.car.CarService

@RestController
@RequestMapping("/api/v0.1/car")
class CarController(
    private val carService: CarService,
) {
    @GetMapping
    fun getAllCars(): List<CarResponse> = carService.getAllCars()

    @PostMapping("/buy")
    fun buyCar(@RequestParam carId: Long): CarResponse = carService.buyCar(carId)

    @PutMapping("/upgrade")
    fun upgradeCar(@RequestParam carId: Long, @RequestParam upgrade: CarUpgradeType): CarResponse = carService.upgradeCar(carId, upgrade)
}
