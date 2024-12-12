package ru.shabashoff.m5.controller

import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import ru.shabashoff.m5.dto.request.ton.TonTransactionValidationRequest
import ru.shabashoff.m5.dto.request.ton.TonWalletValidationRequest
import ru.shabashoff.m5.service.ton.TonValidationService

@RestController
@RequestMapping("/api/v0.1/ton")
class TonValidationController(
    private val tonValidationService: TonValidationService
) {
    @PostMapping("/validate-connect")
    fun completeTask(@RequestBody request: TonWalletValidationRequest) =
        tonValidationService.validateWallet(request)

    @GetMapping("/generate-payload")
    fun generatePayload() = tonValidationService.generatePayload()


    @PostMapping("/validate-transaction")
    fun validateTransaction(@RequestBody request: TonTransactionValidationRequest) =
        tonValidationService.validateTransaction(request)
}
