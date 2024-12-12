package ru.shabashoff.m5.service.ton

import ru.shabashoff.m5.dto.request.ton.TonTransactionValidationRequest
import ru.shabashoff.m5.dto.request.ton.TonWalletValidationRequest
import ru.shabashoff.m5.dto.response.TonWalletValidationResponse

interface TonValidationService {
    fun validateWallet(request: TonWalletValidationRequest): TonWalletValidationResponse

    fun generatePayload(): String

    fun validateTransaction(request: TonTransactionValidationRequest): TonWalletValidationResponse?
}