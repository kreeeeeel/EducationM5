package ru.shabashoff.m5.service.auth

import ru.shabashoff.m5.dto.response.AuthResponse

interface AuthService {
    fun auth(map: Map<String, String>): AuthResponse?
}
