package ru.shabashoff.m5.service.business.impl.handler

import org.springframework.stereotype.Component
import ru.shabashoff.m5.config.property.BusinessProperty
import ru.shabashoff.m5.dao.entity.BusinessEntity.BusinessType
import ru.shabashoff.m5.dao.entity.user.UserBusinessEntity
import ru.shabashoff.m5.service.business.BusinessStatisticHandler
import java.time.OffsetDateTime

@Component
class ClaimTimeHandler(
    private val businessProperty: BusinessProperty,
) : BusinessStatisticHandler<OffsetDateTime, OffsetDateTime> {
    override val type: BusinessType = BusinessType.CLAIM_TIME

    override fun handle(business: UserBusinessEntity, value: OffsetDateTime?): OffsetDateTime {
        val minusMinute = businessProperty.claimMinusMinute * business.level
        return value?.let {
            if (minusMinute == 0L) {
                it
            } else it.minusMinutes(minusMinute)
        } ?: throw NullPointerException()
    }
}
