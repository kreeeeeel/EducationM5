package ru.shabashoff.m5.exception.impl.business

import ru.shabashoff.m5.exception.BusinessException

private const val CODE = 400
private const val TEXT = "Your business have maximum level!"

class MaxLevelBusinessException: BusinessException(CODE, TEXT)
