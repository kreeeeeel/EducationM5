package ru.shabashoff.m5.config

import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule
import com.fasterxml.jackson.module.kotlin.KotlinModule
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration


@Configuration
class JacksonConfig {
    @Bean
    fun objectMapper() = ObjectMapper().also {
        it.registerModule(JavaTimeModule())
        it.registerModule(KotlinModule.Builder().build())
    }
}