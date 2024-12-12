package ru.shabashoff.m5.exception.impl

import ru.shabashoff.m5.exception.BusinessException

private const val CODE = 400
private const val TEXT = "There are not enough funds to write off!"

class NoMoneyException: BusinessException(CODE, TEXT)
