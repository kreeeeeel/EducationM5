package ru.shabashoff.m5.service.trade.impl

import com.pengrad.telegrambot.TelegramBot
import com.pengrad.telegrambot.model.request.LabeledPrice
import com.pengrad.telegrambot.request.CreateInvoiceLink
import org.springframework.stereotype.Service
import ru.shabashoff.m5.dao.entity.TradeStarsEntity
import ru.shabashoff.m5.dao.repository.TradeStarsRepositoryAdapter
import ru.shabashoff.m5.dto.response.TradeResponse
import ru.shabashoff.m5.exception.impl.ItemNotFoundException
import ru.shabashoff.m5.service.trade.TradeService

private const val NAME = "Покупка топлива"
private const val DESCRIPTION = "Приобритение топлива за звёзды"
private const val CURRENCY = "XTR"
private const val LABEL = "buy"

@Service
class TradeServiceImpl(
    private val tradeStarsRepositoryAdapter: TradeStarsRepositoryAdapter,
    private val telegramBot: TelegramBot
): TradeService {

    val map: MutableMap<Long, String> = HashMap()

    override fun getTrades(): List<TradeResponse> {
        return tradeStarsRepositoryAdapter.findAll().map {
            val link = map[it.id] ?: generateLink(it).also { link ->
                map[it.id] = link
            }
            TradeResponse(it.price, it.exchange, link)
        }
    }

    private fun generateLink(tradeStarsEntity: TradeStarsEntity): String {
        val createdInvoice =
            CreateInvoiceLink(NAME, DESCRIPTION, tradeStarsEntity.id.toString(), CURRENCY, LabeledPrice(LABEL, tradeStarsEntity.price))

        return telegramBot.execute(createdInvoice).let { tg ->
            if (!tg.isOk) throw ItemNotFoundException()
            tg.result()
        }
    }
}