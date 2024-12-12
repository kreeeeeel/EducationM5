package ru.shabashoff.m5.exception.impl

import ru.shabashoff.m5.exception.BusinessException

private const val CODE = 404
private const val TEXT = "Task is not found!"

class TaskNotFoundException: BusinessException(CODE, TEXT)
