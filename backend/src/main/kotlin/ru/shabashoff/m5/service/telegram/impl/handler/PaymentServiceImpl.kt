package ru.shabashoff.m5.service.telegram.impl.handler

import com.pengrad.telegrambot.TelegramBot
import com.pengrad.telegrambot.model.PreCheckoutQuery
import com.pengrad.telegrambot.model.Update
import com.pengrad.telegrambot.request.AnswerPreCheckoutQuery
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service
import ru.shabashoff.m5.dao.entity.TradeStarsEntity
import ru.shabashoff.m5.dao.repository.TradeStarsRepositoryAdapter
import ru.shabashoff.m5.dao.repository.user.UserRepository
import ru.shabashoff.m5.exception.impl.ItemNotFoundException
import ru.shabashoff.m5.service.telegram.TelegramHandler
import kotlin.jvm.optionals.getOrNull

@Service
class PaymentServiceImpl(
    private val tradeStarsRepositoryAdapter: TradeStarsRepositoryAdapter,
    private val userRepository: UserRepository,
    private val telegramBot: TelegramBot
) : TelegramHandler {

    private val logger: Logger = LoggerFactory.getLogger(this::class.java)

    override fun handler(update: Update) {
        if (update.preCheckoutQuery() != null) {
            handlePreCheckoutUpdate(update)
        }
    }

    private fun handlePreCheckoutUpdate(update: Update) {
        val preCheckout = update.preCheckoutQuery()!!
        val token = preCheckout.invoicePayload()

        val itemEntity = getTradeEntity(token)
        val userId = preCheckout.from().id()

        completePreCheckout(preCheckout)
        updateUserEntity(itemEntity, userId)

        logger.info("User ID: $userId purchased TOKEN: $token for ${preCheckout.totalAmount()} Telegram Stars")
    }

    private fun getTradeEntity(payload: String): TradeStarsEntity {
        val id = payload.toLong()
        return tradeStarsRepositoryAdapter.findById(id) ?: throw ItemNotFoundException()
    }

    private fun completePreCheckout(preCheckout: PreCheckoutQuery) {
        val checkoutQuery = AnswerPreCheckoutQuery(preCheckout.id())
        telegramBot.execute(checkoutQuery)
    }

    private fun updateUserEntity(tradeStarsEntity: TradeStarsEntity, userId: Long) {
        val userEntity = userRepository.findById(userId).getOrNull()!!.also {//TODO: fixit
            //it.userDetails.purchasedWithStarsCount++
            it.fuel += tradeStarsEntity.exchange
        }
        userRepository.save(userEntity)
    }
}
