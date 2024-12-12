package ru.shabashoff.m5.dto.response

import com.fasterxml.jackson.annotation.JsonInclude
import ru.shabashoff.m5.dao.entity.BusinessEntity

@JsonInclude(JsonInclude.Include.NON_NULL)
data class BusinessResponse(
    val id: Long,
    val name: String,
    val image: String,
    val type: BusinessEntity.BusinessType,
    val description: String,
    var isOwned: Boolean = false,
    var level: Long = 0L,
    val requiredLevel: Long,
    val maxLevel: Long,
    var passiveIncome: Long = 0L,
    var upgradeCost: Long = 0L,
) {
    companion object {

        fun mapper(businessEntity: BusinessEntity) = BusinessResponse(
            id = businessEntity.id,
            name = businessEntity.name,
            type = businessEntity.type,
            passiveIncome = businessEntity.passiveIncome,
            upgradeCost = businessEntity.upgradeCost,
            requiredLevel = businessEntity.requiredLevel,
            maxLevel = businessEntity.maxLevel,
            image = businessEntity.image,
            description = businessEntity.description,
        )
    }
}
