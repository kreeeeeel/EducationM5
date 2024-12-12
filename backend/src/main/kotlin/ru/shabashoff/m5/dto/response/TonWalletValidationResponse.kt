package ru.shabashoff.m5.dto.response

data class TonWalletValidationResponse(
    val success: Boolean,
    val reward: Long?,
    val exp: ExpResponse?
)