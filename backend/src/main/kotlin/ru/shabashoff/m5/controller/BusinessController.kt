package ru.shabashoff.m5.controller

import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import ru.shabashoff.m5.service.business.BusinessService

@RestController
@RequestMapping("/api/v0.1/business")
class BusinessController(
    private val businessService: BusinessService
) {
    @GetMapping
    fun getAllBusiness() = businessService.getAllBusiness()

    @PostMapping("/upgrade/{businessId}")
    fun upgradeBusiness(@PathVariable businessId: Long) = businessService.upgradeBusiness(businessId)
}
