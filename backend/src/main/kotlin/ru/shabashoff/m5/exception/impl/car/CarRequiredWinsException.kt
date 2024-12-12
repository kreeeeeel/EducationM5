package ru.shabashoff.m5.exception.impl.car

import ru.shabashoff.m5.exception.BusinessException

private const val CODE = 400
private const val TEXT = "To buy a car, you need to win races:"

class CarRequiredWinsException(count: Long): BusinessException(CODE, "$TEXT $count")
