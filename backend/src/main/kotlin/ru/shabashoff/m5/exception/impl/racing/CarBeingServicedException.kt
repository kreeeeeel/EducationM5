package ru.shabashoff.m5.exception.impl.racing

import ru.shabashoff.m5.exception.BusinessException
import java.time.OffsetDateTime

private const val CODE = 400
private const val TEXT = "The car is currently being serviced and will be available in: "

class CarBeingServicedException(
    offsetDateTime: OffsetDateTime
) : BusinessException(CODE, "$TEXT${offsetDateTime.toInstant().epochSecond}")