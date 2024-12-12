package ru.shabashoff.m5.config.property

import org.springframework.boot.context.properties.ConfigurationProperties
import org.springframework.context.annotation.Configuration
import kotlin.properties.Delegates

@ConfigurationProperties(prefix = "jwt")
class JwtProperty {
    lateinit var key: String
    var expire by Delegates.notNull<Long>()
}