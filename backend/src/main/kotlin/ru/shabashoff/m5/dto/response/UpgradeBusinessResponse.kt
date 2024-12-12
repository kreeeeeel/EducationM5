package ru.shabashoff.m5.dto.response

data class UpgradeBusinessResponse(
    val id: Long,
    val newLevel: Long,
    val newCost: Long,
    val businessPassiveIncome: Long,
    val exp: ExpResponse
)