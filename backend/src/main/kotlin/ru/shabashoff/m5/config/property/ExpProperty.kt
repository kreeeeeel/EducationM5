package ru.shabashoff.m5.config.property

import org.springframework.boot.context.properties.ConfigurationProperties
import kotlin.properties.Delegates

@ConfigurationProperties(prefix = "exp")
class ExpProperty {
    var bonusForUpdateFuel by Delegates.notNull<Long>()
    var maximumQuantityForUpdate by Delegates.notNull<Long>()
    var receivingAwards by Delegates.notNull<Long>()
    var userInvitation by Delegates.notNull<Long>()
    var interactionWithBusiness by Delegates.notNull<Long>()
    var interactionWithCar by Delegates.notNull<Long>()
    var participationTheRace by Delegates.notNull<Long>()
    var completingMissions by Delegates.notNull<Long>()
}