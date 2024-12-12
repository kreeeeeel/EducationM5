package ru.shabashoff.m5.exception.impl.business

import ru.shabashoff.m5.exception.BusinessException

private const val CODE = 400
private const val TEXT = "To purchase you need a level: "

class LevelException(level: Long): BusinessException(CODE, "$TEXT$level")
