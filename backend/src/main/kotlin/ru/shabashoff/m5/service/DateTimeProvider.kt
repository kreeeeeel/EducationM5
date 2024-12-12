package ru.shabashoff.m5.service

import org.springframework.stereotype.Component
import java.time.LocalDate
import java.time.OffsetDateTime
import java.time.ZoneOffset

@Component
class DateTimeProvider {
    fun zone(): ZoneOffset = ZoneOffset.UTC
    fun localDateNow(): LocalDate = LocalDate.now(zone())
    fun offsetDateNow(): OffsetDateTime = OffsetDateTime.now(zone())
}
