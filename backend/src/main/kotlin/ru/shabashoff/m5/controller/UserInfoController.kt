package ru.shabashoff.m5.controller

import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import ru.shabashoff.m5.service.user.UserInfoService

@RestController
@RequestMapping("/api/v0.1/user")
class UserInfoController(
    private val userInfoService: UserInfoService
) {

    @GetMapping
    fun get() = userInfoService.get()
}
