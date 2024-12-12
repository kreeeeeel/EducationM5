package ru.shabashoff.m5.service.exp

import ru.shabashoff.m5.dao.entity.user.UserEntity
import ru.shabashoff.m5.dto.response.ExpResponse
import ru.shabashoff.m5.dto.type.ExperienceEvent

interface ExpService {
    fun addingExperienceToTheUser(userEntity: UserEntity, exp: ExperienceEvent): ExpResponse
    fun getExpForNextLevel(userEntity: UserEntity): Long
}