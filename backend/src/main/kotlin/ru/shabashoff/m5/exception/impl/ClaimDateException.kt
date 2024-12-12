package ru.shabashoff.m5.exception.impl

import ru.shabashoff.m5.exception.BusinessException

private const val CODE = 400
private const val TEXT = "The time has not come to receive your reward!"

class ClaimDateException: BusinessException(CODE, TEXT)
