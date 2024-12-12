package ru.shabashoff.m5.exception.impl.car

import ru.shabashoff.m5.exception.BusinessException

private const val CODE = 400
private const val TEXT = "This car already have max indicator!"

class CarAlreadyMaxIndicatorException: BusinessException(CODE, TEXT)
