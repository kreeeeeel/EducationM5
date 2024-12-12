package ru.shabashoff.m5.service.business.impl.handler

import org.springframework.stereotype.Component
import ru.shabashoff.m5.config.property.BusinessProperty
import ru.shabashoff.m5.dao.entity.BusinessEntity.BusinessType
import ru.shabashoff.m5.dao.entity.user.UserBusinessEntity
import ru.shabashoff.m5.service.business.BusinessStatisticHandler
import java.time.OffsetDateTime

@Component
class RacingTimeHandler(
    private val businessProperty: BusinessProperty
) : BusinessStatisticHandler<OffsetDateTime, OffsetDateTime> {
    override val type: BusinessType = BusinessType.RACING_TIME

    override fun handle(business: UserBusinessEntity, value: OffsetDateTime?): OffsetDateTime {
        return value?.minusMinutes(businessProperty.racingMinusMinute * business.level) ?: throw NullPointerException()
    }
}
