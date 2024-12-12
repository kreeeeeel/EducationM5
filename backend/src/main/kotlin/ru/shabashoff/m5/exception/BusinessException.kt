package ru.shabashoff.m5.exception

open class BusinessException(
    val code: Int,
    val text: String
) : RuntimeException()