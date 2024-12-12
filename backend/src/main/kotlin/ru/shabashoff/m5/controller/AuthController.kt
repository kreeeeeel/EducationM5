package ru.shabashoff.m5.controller

import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import ru.shabashoff.m5.service.auth.AuthService

@RestController
@RequestMapping("/api/v0.1/auth")
class AuthController(
    private val authService: AuthService
) {

    @PostMapping("/login")
    fun validate(
        @RequestParam params: Map<String, String>
    ): ResponseEntity<Any> = authService.auth(params)?.let {
        ResponseEntity.ofNullable(it)
    } ?: ResponseEntity.status(403).build()
}
