package ru.shabashoff.m5.service.business

import ru.shabashoff.m5.dto.response.BusinessResponse
import ru.shabashoff.m5.dto.response.UpgradeBusinessResponse

interface BusinessService {
    fun getAllBusiness(): List<BusinessResponse>?
    fun upgradeBusiness(businessId: Long): UpgradeBusinessResponse
}