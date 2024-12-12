package ru.shabashoff.m5.service.telegram.impl

import com.pengrad.telegrambot.TelegramBot
import com.pengrad.telegrambot.model.ChatMember
import com.pengrad.telegrambot.request.GetChatMember
import jakarta.annotation.PostConstruct
import org.springframework.stereotype.Service
import ru.shabashoff.m5.service.telegram.TelegramHandler
import ru.shabashoff.m5.service.telegram.TelegramService

private const val URL = "https://t.me/"

@Service
class TelegramServiceImpl(
    private val telegramBot: TelegramBot,
    private val telegramHandlers: List<TelegramHandler>,
): TelegramService {

    @PostConstruct
    fun initCallback() {
        //telegramBot.setUpdatesListener { updates ->
        //    runBlocking {
        //        updates.forEach { update ->
        //            telegramHandlers.forEach { it.handler(update) }
        //        }
        //    }
        //    UpdatesListener.CONFIRMED_UPDATES_ALL
        //}
    }

    override fun isSubscribedChannel(channelId: String, userId: Long): Boolean {
        val channel = channelId.replace(URL, "@")
        val getChatMember = GetChatMember(channel, userId)
        val execute = telegramBot.execute(getChatMember) ?: return false
        val chatMember = execute.chatMember() ?: return false

        return ChatMember.Status.member == chatMember.status()
                || ChatMember.Status.administrator == chatMember.status()
                || ChatMember.Status.creator == chatMember.status()
    }
}
