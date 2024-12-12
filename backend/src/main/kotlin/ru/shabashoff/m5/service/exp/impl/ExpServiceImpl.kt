package ru.shabashoff.m5.service.exp.impl

import org.springframework.stereotype.Service
import ru.shabashoff.m5.config.property.ExpProperty
import ru.shabashoff.m5.dao.entity.user.UserEntity
import ru.shabashoff.m5.dto.response.ExpResponse
import ru.shabashoff.m5.dto.type.ExperienceEvent
import ru.shabashoff.m5.service.exp.ExpService

@Service
class ExpServiceImpl(
    private val expProperty: ExpProperty
): ExpService {
    override fun addingExperienceToTheUser(userEntity: UserEntity, exp: ExperienceEvent): ExpResponse {
        userEntity.exp += getCountExp(exp)
        val requiredExp = userEntity.level * expProperty.maximumQuantityForUpdate
        return if (userEntity.exp >= requiredExp) {
            levelUpUser(userEntity, requiredExp)
        } else {
            ExpResponse(newExp = userEntity.exp, expToNewLevel = requiredExp - userEntity.exp)
        }
    }

    override fun getExpForNextLevel(userEntity: UserEntity) =
        userEntity.level * expProperty.maximumQuantityForUpdate

    private fun levelUpUser(userEntity: UserEntity, requiredExp: Long): ExpResponse {
        userEntity.level++
        userEntity.exp -= requiredExp
        userEntity.fuel += expProperty.bonusForUpdateFuel*userEntity.level

        return ExpResponse(
            newLevel = userEntity.level,
            newExp = userEntity.exp,
            bonus = expProperty.bonusForUpdateFuel,
            expToNewLevel = getExpForNextLevel(userEntity)
        )
    }

    private fun getCountExp(exp: ExperienceEvent) = when(exp) {
        ExperienceEvent.RECEIVING_AWARDS -> expProperty.receivingAwards
        ExperienceEvent.USER_INVITATION -> expProperty.userInvitation
        ExperienceEvent.INTERACTION_WITH_BUSINESS -> expProperty.interactionWithBusiness
        ExperienceEvent.INTERACTION_WITH_CAR -> expProperty.interactionWithCar
        ExperienceEvent.PARTICIPATION_IN_RACE -> expProperty.participationTheRace
        ExperienceEvent.COMPLETING_MISSIONS -> expProperty.completingMissions
    }
}
