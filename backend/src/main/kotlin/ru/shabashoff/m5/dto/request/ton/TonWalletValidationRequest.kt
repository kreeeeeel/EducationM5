package ru.shabashoff.m5.dto.request.ton

import com.fasterxml.jackson.annotation.JsonIgnoreProperties


@JsonIgnoreProperties(ignoreUnknown = true)
data class TonWalletValidationRequest(
    val proof: TonProofV2,
    val account: TonAccount
)

@JsonIgnoreProperties(ignoreUnknown = true)
data class TonAccount (
    val address: String,
    val publicKey: String,
    val walletStateInit: String
)

@JsonIgnoreProperties(ignoreUnknown = true)
data class TonProofV2(
    val signature: String,
    val timestamp: Long,
    val payload: String
)