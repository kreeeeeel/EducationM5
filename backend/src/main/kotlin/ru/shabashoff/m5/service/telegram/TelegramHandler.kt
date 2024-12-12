package ru.shabashoff.m5.service.telegram

import com.pengrad.telegrambot.model.Update

interface TelegramHandler {
    fun handler(update: Update)
}