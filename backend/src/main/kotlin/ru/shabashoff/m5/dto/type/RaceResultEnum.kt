package ru.shabashoff.m5.dto.type

data class RaceResult(
    val chance: Double,
    val resultEnum: RaceResultEnum
)
enum class RaceResultEnum {
    WIN, LOSS
}