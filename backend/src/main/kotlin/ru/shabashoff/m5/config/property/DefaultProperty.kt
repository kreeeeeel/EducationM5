package ru.shabashoff.m5.config.property

import org.springframework.boot.context.properties.ConfigurationProperties
import kotlin.properties.Delegates

@ConfigurationProperties(prefix = "default")
class DefaultProperty {
    var fuel by Delegates.notNull<Long>()
    var referralBonus by Delegates.notNull<Long>()
    var passiveIncome by Delegates.notNull<Long>()
    var photo by Delegates.notNull<List<String>>()
}