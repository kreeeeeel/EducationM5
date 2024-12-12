package ru.shabashoff.m5.exception.impl

import ru.shabashoff.m5.exception.BusinessException

private const val CODE = 404
private const val TEXT = "User is not found!"

class UserNotFoundException: BusinessException(CODE, TEXT)