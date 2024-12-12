package ru.shabashoff.m5.config.property

import org.springframework.boot.context.properties.ConfigurationProperties

@ConfigurationProperties(prefix = "bot")
class TgBotProperty {
    lateinit var token: String
    lateinit var username: String
    lateinit var startMessage: String
    lateinit var miniApp: String
    lateinit var startPhoto: String
}