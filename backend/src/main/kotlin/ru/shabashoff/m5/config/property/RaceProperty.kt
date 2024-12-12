package ru.shabashoff.m5.config.property

import org.springframework.boot.context.properties.ConfigurationProperties
import kotlin.properties.Delegates

@ConfigurationProperties(prefix = "race")
class RaceProperty {
    var cost by Delegates.notNull<Long>()
    var factor by Delegates.notNull<Long>()
    var carServiceMinute by Delegates.notNull<Long>()
    var topUsersCount by Delegates.notNull<Int>()
}