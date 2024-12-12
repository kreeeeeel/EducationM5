package ru.shabashoff.m5.exception.impl

import ru.shabashoff.m5.exception.BusinessException

private const val CODE = 400
private const val TEXT = "Invalid parameters specified!"

class BadRequestException: BusinessException(CODE, TEXT)
