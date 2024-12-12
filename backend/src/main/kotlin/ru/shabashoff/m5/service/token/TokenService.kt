package ru.shabashoff.m5.service.token

interface TokenService {
    fun createToken(id: Long): String
    fun parseToken(token: String): Long?
}