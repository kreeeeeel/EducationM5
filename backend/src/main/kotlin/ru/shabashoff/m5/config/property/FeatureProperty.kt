package ru.shabashoff.m5.config.property

import org.springframework.boot.context.properties.ConfigurationProperties

@ConfigurationProperties("feature-flag")
class FeatureProperty {
    var loginCheckEnabled: Boolean = true
}