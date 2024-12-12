package ru.shabashoff.m5.config.property

import org.springframework.boot.context.properties.ConfigurationProperties
import org.springframework.context.annotation.Configuration

@ConfigurationProperties(prefix = "datasource")
class DatabaseProperty {
    lateinit var host: String
    lateinit var username: String
    lateinit var password: String
    lateinit var database: String
    lateinit var schema: String
}