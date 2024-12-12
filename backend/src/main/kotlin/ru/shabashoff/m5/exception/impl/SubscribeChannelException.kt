package ru.shabashoff.m5.exception.impl

import ru.shabashoff.m5.exception.BusinessException

private const val CODE = 400
private const val TEXT = "You are not subscribed to the channel: "

class SubscribeChannelException(url: String): BusinessException(CODE, "$TEXT$url")
