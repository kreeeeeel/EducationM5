package ru.shabashoff.m5.service.ton.impl

import org.springframework.stereotype.Service
import org.ton.java.tonconnect.Domain
import org.ton.java.tonconnect.TonConnect
import org.ton.java.tonconnect.TonProof
import org.ton.java.tonconnect.WalletAccount
import ru.shabashoff.m5.dao.entity.TaskEntity.Details.WalletTransactionDetail
import ru.shabashoff.m5.dao.entity.TaskEntity.TaskType
import ru.shabashoff.m5.dao.entity.user.UserTaskEntity
import ru.shabashoff.m5.dao.repository.TaskRepositoryAdapter
import ru.shabashoff.m5.dao.repository.user.UserRepository
import ru.shabashoff.m5.dto.request.ton.TonTransactionValidationRequest
import ru.shabashoff.m5.dto.request.ton.TonWalletValidationRequest
import ru.shabashoff.m5.dto.response.ExpResponse
import ru.shabashoff.m5.dto.response.TonWalletValidationResponse
import ru.shabashoff.m5.dto.type.ExperienceEvent
import ru.shabashoff.m5.service.exp.ExpService
import ru.shabashoff.m5.service.getUserIdFromContext
import ru.shabashoff.m5.service.ton.TonTransactionValidationService
import ru.shabashoff.m5.service.ton.TonValidationService
import java.security.SecureRandom
import java.util.*
import kotlin.jvm.optionals.getOrNull


@Service
class TonValidationServiceImpl(
    private val userRepository: UserRepository,
    private val taskRepositoryAdapter: TaskRepositoryAdapter,
    private val expService: ExpService,
    private val tonTransactionValidationService: TonTransactionValidationService,
) : TonValidationService {

    private val random = SecureRandom()
    private val base64 = Base64.getEncoder()
    override fun validateWallet(request: TonWalletValidationRequest): TonWalletValidationResponse {
        val addressStr = request.account.address

        val tonProof = TonProof.builder()
            .timestamp(request.proof.timestamp)
            .signature(request.proof.signature)
            .domain(
                Domain.builder()
                    .value("shabashoff.ru")
                    .lengthBytes(13)
                    .build()
            )
            .payload(request.proof.payload)
            .build()

        val walletAccount = WalletAccount.builder()
            .chain(-239)
            .address(addressStr)
            .publicKey(request.account.publicKey)
            .build()

        val checkProof = TonConnect.checkProof(tonProof, walletAccount)
        var expResponse: ExpResponse? = null
        var reward: Long = 0

        if (checkProof) {
            val userId = getUserIdFromContext()
            val task = taskRepositoryAdapter.findAll().find { it.type == TaskType.CONNECT_WALLET }
            userRepository.findById(userId).getOrNull()?.let { user ->
                task?.let { task ->
                    if (!user.tasks.any { it.task.id == task.id }) {
                        user.walletAddress = addressStr
                        user.tasks.add(
                            UserTaskEntity(
                                task = task,
                                status = UserTaskEntity.UserTaskStatus.Success,
                                user = user,
                            )
                        )
                        user.fuel += task.reward
                        reward = task.reward

                        expResponse = expService.addingExperienceToTheUser(user, ExperienceEvent.COMPLETING_MISSIONS)

                        userRepository.save(user)
                    }
                }
            }
        }

        return TonWalletValidationResponse(
            reward = reward,
            success = checkProof,
            exp = expResponse
        )
    }

    override fun generatePayload(): String {
        val randomBytes = ByteArray(32)
        random.nextBytes(randomBytes)
        return base64.encodeToString(randomBytes)
    }

    override fun validateTransaction(request: TonTransactionValidationRequest): TonWalletValidationResponse? {
        val userId = getUserIdFromContext()
        val user = userRepository.findById(userId).getOrNull() ?: return null
        if (user.tasks.any { it.task.id == request.taskId }) {
            return null
        }

        return taskRepositoryAdapter.findAll().find { it.id == request.taskId }?.let { task ->
            if (task.details == null || task.details !is WalletTransactionDetail) {
                return null
            }
            val details = task.details as WalletTransactionDetail
            val isValid = tonTransactionValidationService.isValid(
                boc = request.boc,
                expectedRecipientAddress = details.address,
                expectedAmount = details.amount.toLong()
            )

            if (isValid) {
                user.tasks.add(
                    UserTaskEntity(
                        task = task,
                        status = UserTaskEntity.UserTaskStatus.Success,
                        user = user,
                    )
                )
                user.fuel += task.reward

                val expResponse = expService.addingExperienceToTheUser(user, ExperienceEvent.COMPLETING_MISSIONS)

                userRepository.save(user)

                TonWalletValidationResponse(
                    success = true,
                    reward = task.reward,
                    exp = expResponse
                )
            } else null
        }
    }
}