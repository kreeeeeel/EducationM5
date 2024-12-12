package ru.shabashoff.m5.service.task.impl

import org.springframework.stereotype.Service
import ru.shabashoff.m5.dao.entity.TaskEntity
import ru.shabashoff.m5.dao.entity.TaskEntity.TaskType
import ru.shabashoff.m5.dao.entity.user.UserEntity
import ru.shabashoff.m5.dao.entity.user.UserTaskEntity
import ru.shabashoff.m5.dao.entity.user.UserTaskEntity.UserTaskStatus.NotStarted
import ru.shabashoff.m5.dao.entity.user.UserTaskEntity.UserTaskStatus.Success
import ru.shabashoff.m5.dao.repository.TaskRepositoryAdapter
import ru.shabashoff.m5.dao.repository.user.UserRepository
import ru.shabashoff.m5.dao.repository.user.UserTaskAdapter
import ru.shabashoff.m5.dto.response.ExpResponse
import ru.shabashoff.m5.dto.response.TaskResponse
import ru.shabashoff.m5.dto.type.ExperienceEvent
import ru.shabashoff.m5.exception.impl.BadRequestException
import ru.shabashoff.m5.exception.impl.SubscribeChannelException
import ru.shabashoff.m5.exception.impl.TaskNotCompletedException
import ru.shabashoff.m5.exception.impl.TaskNotFoundException
import ru.shabashoff.m5.exception.impl.UserNotFoundException
import ru.shabashoff.m5.service.exp.ExpService
import ru.shabashoff.m5.service.getUserIdFromContext
import ru.shabashoff.m5.service.task.TaskService
import ru.shabashoff.m5.service.telegram.TelegramService
import kotlin.jvm.optionals.getOrNull

@Service
class TaskServiceImpl(
    private val telegramService: TelegramService,
    private val expService: ExpService,
    private val userRepository: UserRepository,
    private val userTaskAdapter: UserTaskAdapter,
    private val taskRepositoryAdapter: TaskRepositoryAdapter
) : TaskService {
    override fun getTask(): List<TaskResponse> {
        val userId = getUserIdFromContext()
        val userTasks = userTaskAdapter.findUserTasks(userId).associateBy { it.task.id }

        return taskRepositoryAdapter.findAll().map {
            TaskResponse.mapper(it, userTasks[it.id]?.status ?: NotStarted)
        }
    }

    override fun completeTask(id: Long): ExpResponse {
        val userId = getUserIdFromContext()
        val userEntity = userRepository.findById(userId).getOrNull() ?: throw UserNotFoundException()

        if (userEntity.tasks.any { it.task.id == id }) {
            throw BadRequestException()
        }

        val task = taskRepositoryAdapter.findById(id) ?: throw TaskNotFoundException()
        validateMission(userEntity, task)

        userEntity.tasks.add(
            UserTaskEntity(
                task = task,
                status = Success,
                user = userEntity,
            )
        )
        userEntity.fuel += task.reward

        val response = expService.addingExperienceToTheUser(userEntity, ExperienceEvent.COMPLETING_MISSIONS)
        userRepository.save(userEntity)

        return response
    }

    private fun validateMission(user: UserEntity, mission: TaskEntity) {
        when (mission.type) {
            //TaskType.SUBSCRIBE_TG -> validateTelegramSubscription(user.id, mission.url)
            //TaskType.NUMBER_OF_RACES -> validateCount(user.userDetails.racingCount, mission.needCount)
            //TaskType.RACE_VICTORIES -> validateCount(user.userDetails.racingWinCount, mission.needCount)
            //TaskType.RECEIVED_OF_CLAIMS -> validateCount(user.userDetails.claimCount, mission.needCount)
            //TaskType.ADVERTISING_VIEWED -> validateCount(user.userDetails.viewedAdsCount, mission.needCount)
            //TaskType.INVITE_FRIENDS -> validateCount(user.userDetails.referralsCount, mission.needCount)
            //TaskType.UPGRADE_CAR -> validateCount(user.userDetails.upgradeCarCount, mission.needCount)
            //TaskType.UPGRADE_BUSINESS -> validateCount(user.userDetails.upgradeBusinessCount, mission.needCount)
            TaskType.CONNECT_WALLET -> TODO()
            TaskType.WALLET_TRANSACTION -> TODO()
            else -> TODO()
        }
    }

    private fun validateTelegramSubscription(id: Long, channelId: String?) {
        channelId?.let {
            if (!telegramService.isSubscribedChannel(channelId, id)) {
                throw SubscribeChannelException(channelId)
            }
        } ?: throw BadRequestException()
    }

    private fun validateCount(actual: Long, required: Long?) {
        required?.let {
            if (actual < required) {
                throw TaskNotCompletedException(required - actual)
            }
        } ?: throw BadRequestException()
    }
}