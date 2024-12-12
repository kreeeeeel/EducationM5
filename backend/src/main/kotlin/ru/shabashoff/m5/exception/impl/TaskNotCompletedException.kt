package ru.shabashoff.m5.exception.impl

import ru.shabashoff.m5.exception.BusinessException

private const val CODE = 400
private const val TEXT = "Task not completed, left: "

class TaskNotCompletedException(count: Long): BusinessException(CODE, "$TEXT$count")
