package ru.shabashoff.m5.service.race

import ru.shabashoff.m5.dto.response.RaceResultResponse
import ru.shabashoff.m5.dto.response.UserRatingResponse

interface RaceService {
    fun startRace(carId: Long): RaceResultResponse
    fun topUsersByRating(): List<UserRatingResponse>
}