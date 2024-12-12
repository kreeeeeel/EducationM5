package ru.shabashoff.m5.service

import org.springframework.security.core.context.SecurityContextHolder

fun getUserIdFromContext() = SecurityContextHolder.getContext().authentication.principal.toString().toLong()

fun calculateUpgradeCarCost(cost: Long, baseCarIndicator: Long, userCarIndicator: Long?): Long {
    if (userCarIndicator == null) return cost

    val value = (userCarIndicator - baseCarIndicator) + 1
    return value * cost
}