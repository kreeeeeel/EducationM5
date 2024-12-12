package ru.shabashoff.m5.dto.response

data class RewardResponse(
    val day: Long,
    val isCompleted: Boolean,
    val isCanTake: Boolean,
    val isCanTakeInFuture: Boolean,
    val reward: Long,
)
