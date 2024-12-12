package ru.shabashoff.m5.config.property

import org.springframework.boot.context.properties.ConfigurationProperties
import kotlin.properties.Delegates

@ConfigurationProperties(prefix = "business")
class BusinessProperty {
    var claimMinusMinute by Delegates.notNull<Long>()
    var discount by Delegates.notNull<Double>()
    var referralBonus by Delegates.notNull<Long>()
    var racingMinusMinute by Delegates.notNull<Long>()
}