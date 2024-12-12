package ru.shabashoff.m5.service.trade

import ru.shabashoff.m5.dto.response.TradeResponse

interface TradeService {
    fun getTrades(): List<TradeResponse>
}