package ru.shabashoff.m5.config.property

import org.springframework.boot.context.properties.ConfigurationProperties
import kotlin.properties.Delegates

@ConfigurationProperties("reward")
class RewardProperty {
    var claimGetFromHour by Delegates.notNull<Long>()
    var maxDays by Delegates.notNull<Long>()
    var claimDay by Delegates.notNull<Long>()
    var adsCountDay by Delegates.notNull<Long>()
    var ads: Map<String, RewardEnum> = emptyMap()
}

enum class RewardEnum {
    CLEAR_CLAIM_TIME_ADS
}