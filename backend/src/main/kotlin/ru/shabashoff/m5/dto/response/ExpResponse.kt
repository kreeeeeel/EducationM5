package ru.shabashoff.m5.dto.response

import com.fasterxml.jackson.annotation.JsonInclude

@JsonInclude(JsonInclude.Include.NON_NULL)
data class ExpResponse(
    val newLevel: Long? = null,
    val newExp: Long,
    val expToNewLevel: Long,
    val bonus: Long? = null
)
