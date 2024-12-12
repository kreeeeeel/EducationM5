package ru.shabashoff.m5.service.telegram.impl.handler

import com.pengrad.telegrambot.TelegramBot
import com.pengrad.telegrambot.model.Message
import com.pengrad.telegrambot.model.Update
import com.pengrad.telegrambot.model.request.InlineKeyboardButton
import com.pengrad.telegrambot.model.request.InlineKeyboardMarkup
import com.pengrad.telegrambot.request.SendPhoto
import org.springframework.stereotype.Service
import ru.shabashoff.m5.config.property.TgBotProperty
import ru.shabashoff.m5.service.telegram.TelegramHandler

@Service
class StartHandlerImpl(
    private val telegramBot: TelegramBot,
    private val tgBotProperty: TgBotProperty
) : TelegramHandler {

    override fun handler(update: Update) {
        if (update.message() != null) {
            handleMessage(update.message())
        }
    }

    private fun handleMessage(message: Message) {
        if (message.text() == "/start") {
            val chatId = message.chat().id()
            val inlineKeyboard = InlineKeyboardMarkup()
                .addRow(InlineKeyboardButton().also {
                    it.text = "Начать игру"
                    it.url = tgBotProperty.miniApp
                })

            telegramBot.execute(
                SendPhoto(chatId, tgBotProperty.startPhoto)
                    .caption(tgBotProperty.startMessage)
                    .replyMarkup(inlineKeyboard)
            )
        }
    }
}