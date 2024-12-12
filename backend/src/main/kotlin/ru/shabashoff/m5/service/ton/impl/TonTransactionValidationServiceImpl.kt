package ru.shabashoff.m5.service.ton.impl

import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import com.fasterxml.jackson.annotation.JsonProperty
import com.fasterxml.jackson.databind.ObjectMapper
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service
import org.springframework.web.client.RestTemplate
import org.ton.block.MsgAddressInt
import org.ton.boc.BagOfCells
import ru.shabashoff.m5.service.DateTimeProvider
import ru.shabashoff.m5.service.ton.TonTransactionValidationService
import java.util.*

@Service
class TonTransactionValidationServiceImpl(
    private val dateTimeProvider: DateTimeProvider,
    private val objectMapper: ObjectMapper,
) : TonTransactionValidationService {

    private val restTemplate = RestTemplate()
    private val logger: Logger = LoggerFactory.getLogger(this::class.java)

    private val timeout = 40_000L
    private val delayMillis = 2_000L

    override fun isValid(
        boc: String,
        expectedRecipientAddress: String,
        expectedAmount: Long
    ): Boolean {
        try {
            val trHex = bocToTransactionHex(boc)
            logger.info("Transaction hex: $trHex")

            var trData: Transaction? = null
            val startTime = System.currentTimeMillis()

            while (System.currentTimeMillis() - startTime < timeout) {
                try {
                    trData = findTransaction(trHex)
                    if (trData != null) {
                        logger.info("Transaction data: $trData")
                        break
                    } else {
                        logger.info("Transaction not found, retrying in 2 seconds")
                        Thread.sleep(delayMillis)
                    }
                } catch (e: Exception) {
                    logger.error("Error while fetching transaction: ${e.message}")
                    Thread.sleep(delayMillis)
                }
            }

            if (trData == null) {
                logger.warn("Transaction data is null after retries")
                return false
            }

            val transactionHash = trData.hash ?: ""
            if (transactionHash.isEmpty()) {
                logger.warn("Invalid transaction, hash is empty")
                return false
            }//TODO: check another transactions

            val transactionTimestamp = trData.utime
            val currentTimestamp = dateTimeProvider.offsetDateNow().toEpochSecond()

            val timeDifference = currentTimestamp - transactionTimestamp
            if (timeDifference > 300) { // 300 секунд = 5 минут
                logger.warn("Invalid transaction, time difference more than 5 minutes: $timeDifference sec")
                return false
            }
            val expectedAddressHex = convertAddressToHex(expectedRecipientAddress).lowercase(Locale.getDefault())
            val outMsgs = trData.outMsgs ?: emptyList()
            val matchingMsg = outMsgs.find { msg ->
                msg.destination?.address == expectedAddressHex && (msg.value ?: 0L) >= expectedAmount
            }

            if (matchingMsg == null) {
                logger.warn("No outgoing message to expected recipient with expected amount")
                return false
            }

            logger.info("Transaction valid")
            return true
        } catch (e: Exception) {
            logger.error("Exception in isValid: ", e)
            return false
        }
    }

    private fun bocToTransactionHex(boc: String): String {
        val bocBytes = Base64.getDecoder().decode(boc)
        val bagOfCells = BagOfCells(bocBytes)
        val rootCell = bagOfCells.first()
        return rootCell.hash().toHex()
    }

    private fun findTransaction(hash: String): Transaction? {
        val apiUrl = "https://tonapi.io/v2/blockchain/transactions/$hash"

        try {
            val response = restTemplate.getForObject(apiUrl, String::class.java)
            return objectMapper.readValue(response, Transaction::class.java)
        } catch (e: Exception) {
            logger.error("Error fetching transaction from API: ${e.message}")
            return null
        }
    }

    // Модели данных
    @JsonIgnoreProperties(ignoreUnknown = true)
    data class Transaction(
        val hash: String?,
        val lt: Long,
        val account: Account?,
        val success: Boolean,
        val utime: Long,
        @JsonProperty("in_msg") val inMsg: Message?,
        @JsonProperty("out_msgs") val outMsgs: List<Message>?,
    )

    @JsonIgnoreProperties(ignoreUnknown = true)
    data class Account(
        val address: String?,
        @JsonProperty("is_scam") val isScam: Boolean?,
        @JsonProperty("is_wallet") val isWallet: Boolean?
    )

    @JsonIgnoreProperties(ignoreUnknown = true)
    data class Message(
        @JsonProperty("msg_type") val msgType: String?,
        @JsonProperty("created_lt") val createdLt: Long?,
        @JsonProperty("ihr_disabled") val ihrDisabled: Boolean?,
        val bounce: Boolean?,
        val bounced: Boolean?,
        val value: Long?,  // Сумма в нанотонах
        @JsonProperty("fwd_fee") val fwdFee: Long?,
        @JsonProperty("ihr_fee") val ihrFee: Long?,
        val destination: Account?,
        val source: Account?,
        @JsonProperty("import_fee") val importFee: Long?,
        @JsonProperty("created_at") val createdAt: Long?,
        val hash: String?,
    )

    private fun convertAddressToHex(address: String): String {
        return if (address.startsWith("UQ") || address.startsWith("EQ") || address.startsWith("kQ")) {
            val msgAddressInt = MsgAddressInt.parse(address)
            MsgAddressInt.toString(address = msgAddressInt, userFriendly = false)
        } else address
    }
}
