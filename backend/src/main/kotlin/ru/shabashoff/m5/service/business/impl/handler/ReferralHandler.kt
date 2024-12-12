package ru.shabashoff.m5.service.business.impl.handler

import org.springframework.stereotype.Component
import ru.shabashoff.m5.config.property.BusinessProperty
import ru.shabashoff.m5.dao.entity.BusinessEntity.BusinessType
import ru.shabashoff.m5.dao.entity.user.UserBusinessEntity
import ru.shabashoff.m5.service.business.BusinessStatisticHandler

@Component
class ReferralHandler(
    private val businessProperty: BusinessProperty
): BusinessStatisticHandler<Long, Any> {
    override val type: BusinessType = BusinessType.REFERRAL_BONUS

    override fun handle(business: UserBusinessEntity, value: Any?): Long {
        val level = business.level
        return if (level > 0) businessProperty.referralBonus else 0
    }
}
