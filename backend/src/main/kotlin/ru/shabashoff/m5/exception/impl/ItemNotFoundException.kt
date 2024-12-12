package ru.shabashoff.m5.exception.impl

import ru.shabashoff.m5.exception.BusinessException

private const val CODE = 404
private const val TEXT = "This item with this ID was not found!"

class ItemNotFoundException: BusinessException(CODE, TEXT)
