package ru.shabashoff.m5.service.ton

interface TonTransactionValidationService {
    fun isValid(
        boc: String,
        expectedRecipientAddress: String,
        expectedAmount: Long
    ): Boolean
}