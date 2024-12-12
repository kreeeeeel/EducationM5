package ru.shabashoff.m5.service.telegram

interface TelegramService {
    fun isSubscribedChannel(channelId: String, userId: Long): Boolean
}