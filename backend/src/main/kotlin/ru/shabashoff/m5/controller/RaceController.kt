package ru.shabashoff.m5.controller

import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import ru.shabashoff.m5.service.race.RaceService

@RestController
@RequestMapping("/api/v0.1/race")
class RaceController(
    private val raceService: RaceService
) {
    @PostMapping
    fun startRace(@RequestParam carId: Long) = raceService.startRace(carId)

    @GetMapping("/top")
    fun topUsersByRating() = raceService.topUsersByRating()
}
