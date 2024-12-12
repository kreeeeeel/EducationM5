package ru.shabashoff.m5.service.user.impl

import org.springframework.stereotype.Service
import ru.shabashoff.m5.config.property.DefaultProperty
import ru.shabashoff.m5.config.property.TgBotProperty
import ru.shabashoff.m5.dao.repository.user.UserRepository
import ru.shabashoff.m5.dto.response.UserInfoResponse
import ru.shabashoff.m5.exception.impl.BadRequestException
import ru.shabashoff.m5.service.DateTimeProvider
import ru.shabashoff.m5.service.exp.ExpService
import ru.shabashoff.m5.service.getUserIdFromContext
import ru.shabashoff.m5.service.reward.RewardService
import ru.shabashoff.m5.service.user.UserInfoService
import kotlin.jvm.optionals.getOrNull

@Service
class UserInfoServiceImpl(
    private val expService: ExpService,
    private val rewardService: RewardService,
    private val defaultProperty: DefaultProperty,
    private val tgBotProperty: TgBotProperty,
    private val userRepository: UserRepository,
    private val dateTimeProvider: DateTimeProvider
) : UserInfoService {

    override fun get(): UserInfoResponse {
        val userId = getUserIdFromContext()
        val user = userRepository.findById(userId).getOrNull() ?: throw BadRequestException()

        val currentOffset = dateTimeProvider.offsetDateNow()
        val currentDate = dateTimeProvider.localDateNow()
        val nextOffset = currentDate.atStartOfDay().plusDays(1).toInstant(dateTimeProvider.zone()).epochSecond

        return UserInfoResponse.mapper(
            defaultPassiveIncome = defaultProperty.passiveIncome,
            userEntity = user,
            url = "${tgBotProperty.miniApp}/start?startapp=${user.id}",
            now = currentOffset,
            needExpToUp = expService.getExpForNextLevel(user),
            nextDay = nextOffset,
            dailyReward = rewardService.getDailyRewards(user),
        )
    }
}
