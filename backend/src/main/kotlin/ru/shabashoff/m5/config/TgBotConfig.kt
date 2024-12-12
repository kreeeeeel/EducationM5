package ru.shabashoff.m5.config

import com.pengrad.telegrambot.TelegramBot
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import ru.shabashoff.m5.config.property.TgBotProperty

@Configuration
class TgBotConfig(
    private val botProperty: TgBotProperty
) {

    @Bean
    fun getBot() = TelegramBot(botProperty.token)

}
