package ru.shabashoff.m5.dto.response

import com.fasterxml.jackson.annotation.JsonInclude
import ru.shabashoff.m5.dto.type.RaceResultEnum

@JsonInclude(JsonInclude.Include.NON_NULL)
data class RaceResultResponse(
    val currentCar: CarResponse,
    val opponentName: String,
    val opponentImage: String,
    val opponentRating: Long,
    val opponentCar: CarResponse,
    val result: RaceResultEnum,
    val points: Long,
    val chanceWin: Double,
    val currentPoints: Long,
    val nextRacingAt: Long? = null,
    val serverTime: Long,
    val exp: ExpResponse
)
