package ru.shabashoff.m5.exception.impl.racing

import ru.shabashoff.m5.exception.BusinessException

private const val CODE = 400
private const val TEXT = "Your opponent is not found!"

class OpponentIsNotFoundException: BusinessException(CODE, TEXT)
