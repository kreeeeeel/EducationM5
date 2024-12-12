package ru.shabashoff.m5.service.business

import ru.shabashoff.m5.dao.entity.BusinessEntity.BusinessType
import ru.shabashoff.m5.dao.entity.user.UserBusinessEntity

interface BusinessStatisticHandler<T, Q> {
    val type: BusinessType
    fun handle(business: UserBusinessEntity, value: Q? = null): T
}
