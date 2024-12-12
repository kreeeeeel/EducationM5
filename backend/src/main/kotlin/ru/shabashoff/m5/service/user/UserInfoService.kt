package ru.shabashoff.m5.service.user

import ru.shabashoff.m5.dto.response.UserInfoResponse

interface UserInfoService {
    fun get(): UserInfoResponse
}
