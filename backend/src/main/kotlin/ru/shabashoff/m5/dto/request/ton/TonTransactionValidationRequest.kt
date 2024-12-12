package ru.shabashoff.m5.dto.request.ton

import com.fasterxml.jackson.annotation.JsonIgnoreProperties


@JsonIgnoreProperties(ignoreUnknown = true)
data class TonTransactionValidationRequest(
    val boc: String,
    val taskId: Long
)
