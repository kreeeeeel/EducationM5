package ru.shabashoff.m5.service.business.impl

import jakarta.transaction.Transactional
import org.springframework.beans.factory.annotation.Qualifier
import org.springframework.stereotype.Service
import ru.shabashoff.m5.config.property.DefaultProperty
import ru.shabashoff.m5.dao.entity.BusinessEntity
import ru.shabashoff.m5.dao.entity.BusinessEntity.BusinessType
import ru.shabashoff.m5.dao.entity.user.UserBusinessEntity
import ru.shabashoff.m5.dao.entity.user.UserEntity
import ru.shabashoff.m5.dao.repository.BusinessRepositoryAdapter
import ru.shabashoff.m5.dao.repository.user.UserBusinessRepository
import ru.shabashoff.m5.dao.repository.user.UserRepository
import ru.shabashoff.m5.dto.response.BusinessResponse
import ru.shabashoff.m5.dto.response.UpgradeBusinessResponse
import ru.shabashoff.m5.dto.type.ExperienceEvent
import ru.shabashoff.m5.exception.impl.BadRequestException
import ru.shabashoff.m5.exception.impl.NoMoneyException
import ru.shabashoff.m5.exception.impl.business.LevelException
import ru.shabashoff.m5.exception.impl.business.MaxLevelBusinessException
import ru.shabashoff.m5.service.business.BusinessService
import ru.shabashoff.m5.service.business.BusinessStatisticHandler
import ru.shabashoff.m5.service.exp.ExpService
import ru.shabashoff.m5.service.getUserIdFromContext

@Service
class BusinessServiceImpl(
    @Qualifier("referralHandler")
    private val referralHandler: BusinessStatisticHandler<Long, Any>,
    private val businessRepositoryAdapter: BusinessRepositoryAdapter,
    private val userBusinessRepository: UserBusinessRepository,
    private val userRepository: UserRepository,
    private val defaultProperty: DefaultProperty,
    private val expService: ExpService
) : BusinessService {

    override fun getAllBusiness(): List<BusinessResponse>? {
        val userId = getUserIdFromContext()

        val userBusiness = userBusinessRepository.findAllByUserId(userId).associateBy { it.businessId }
        val businesses = businessRepositoryAdapter.findAll()

        return businesses.map { business ->
            BusinessResponse.mapper(business).also {
                it.level = userBusiness[business.id]?.level ?: 0
                if (userBusiness[business.id] != null) {
                    it.isOwned = true
                    it.upgradeCost *= (it.level+1)
                    it.passiveIncome *= (it.level+1)
                }
            }
        }
    }

    @Transactional
    override fun upgradeBusiness(businessId: Long): UpgradeBusinessResponse {
        val userId = getUserIdFromContext()
        val userEntity = userRepository.findByIdForUpdate(userId) ?: throw BadRequestException()
        val businessEntity = businessRepositoryAdapter.findById(businessId)?.also {
            if (userEntity.level < it.requiredLevel) throw LevelException(it.requiredLevel)
        } ?: throw BadRequestException()
        val userBusiness = getOrCreateUserBusiness(userEntity, businessEntity)
        val calculateCost = validateAndCalculatePrice(userBusiness, businessEntity).also {
            if (userEntity.fuel < it) throw NoMoneyException()
        }
        applyUpgrade(userEntity, userBusiness, businessEntity, calculateCost)
        if (businessEntity.type == BusinessType.REFERRAL_BONUS) {
            userEntity.referralBonus += referralHandler.handle(userBusiness)
        }
        val exp = expService.addingExperienceToTheUser(userEntity, ExperienceEvent.INTERACTION_WITH_BUSINESS)

        userRepository.save(userEntity)
        userBusinessRepository.save(userBusiness)

        return UpgradeBusinessResponse(
            id = businessId,
            newLevel = userBusiness.level,
            newCost = validateAndCalculatePrice(userBusiness, businessEntity),
            businessPassiveIncome = businessEntity.passiveIncome,
            exp = exp
        )
    }

    private fun validateAndCalculatePrice(
        userBusinessEntity: UserBusinessEntity,
        businessEntity: BusinessEntity
    ): Long {
        return userBusinessEntity.let { businessEntity.upgradeCost * (it.level + 1) }
    }

    private fun getOrCreateUserBusiness(userEntity: UserEntity, businessEntity: BusinessEntity): UserBusinessEntity {
        val alreadyExistBusiness = userBusinessRepository.findByUserIdAndBusinessId(userEntity.id, businessEntity.id)
        if (alreadyExistBusiness != null) return alreadyExistBusiness

        return UserBusinessEntity(
            user = userEntity,
            businessId = businessEntity.id,
            level = 0,
            passiveIncome = 0,
        )
    }

    private fun applyUpgrade(userEntity: UserEntity, userBusinessEntity: UserBusinessEntity, businessEntity: BusinessEntity, upgradeCost: Long) {
        if (userBusinessEntity.level >= businessEntity.maxLevel) throw MaxLevelBusinessException()

        userBusinessEntity.level++
        userBusinessEntity.passiveIncome += businessEntity.passiveIncome * userBusinessEntity.level

        userEntity.fuel -= upgradeCost
    }
}
