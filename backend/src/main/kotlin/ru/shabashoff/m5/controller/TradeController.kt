package ru.shabashoff.m5.controller

import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import ru.shabashoff.m5.service.trade.TradeService

@RestController
@RequestMapping("/api/v0.1/trade")
class TradeController(
    private val tradeService: TradeService
) {

    @GetMapping
    fun getTrades() = tradeService.getTrades()
}