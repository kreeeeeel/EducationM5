package ru.shabashoff.m5.service.auth.impl

import com.fasterxml.jackson.databind.ObjectMapper
import org.springframework.stereotype.Service
import ru.shabashoff.m5.config.property.DefaultProperty
import ru.shabashoff.m5.config.property.FeatureProperty
import ru.shabashoff.m5.config.property.TgBotProperty
import ru.shabashoff.m5.dao.entity.user.UserEntity
import ru.shabashoff.m5.dao.entity.user.UserRatingEntity
import ru.shabashoff.m5.dao.entity.user.UserReferralEntity
import ru.shabashoff.m5.dao.repository.user.UserRepository
import ru.shabashoff.m5.dto.response.AuthResponse
import ru.shabashoff.m5.dto.type.ExperienceEvent
import ru.shabashoff.m5.service.DateTimeProvider
import ru.shabashoff.m5.service.auth.AuthService
import ru.shabashoff.m5.service.car.CarService
import ru.shabashoff.m5.service.exp.ExpService
import ru.shabashoff.m5.service.token.TokenService
import java.net.URLDecoder
import java.time.OffsetDateTime
import javax.crypto.Mac
import javax.crypto.spec.SecretKeySpec
import kotlin.experimental.and
import kotlin.jvm.optionals.getOrNull
import kotlin.random.Random

@Service
class AuthServiceImpl(
    private val userRepository: UserRepository,
    private val dateTimeProvider: DateTimeProvider,
    private val objectMapper: ObjectMapper,
    private val tokenService: TokenService,
    private val expService: ExpService,
    private val carService: CarService,
    private val featureProperty: FeatureProperty,
    private val defaultProperty: DefaultProperty,
    private val tgBotProperty: TgBotProperty,
) : AuthService {

    override fun auth(map: Map<String, String>): AuthResponse? {
        if (!isValidRequest(map)) return null

        val userData = parseUserData(map["user"]) ?: return null
        val currentDateTime = dateTimeProvider.offsetDateNow()

        val user = findOrCreateUser(userData, currentDateTime, map["start_param"])
        updateUserName(user, userData.name)

        return AuthResponse(tokenService.createToken(user.id))
    }

    private fun findOrCreateUser(
        userData: UserData,
        currentDateTime: OffsetDateTime,
        referrerId: String?
    ): UserEntity {
        return userRepository.findById(userData.id).getOrNull() ?: createUser(userData, currentDateTime, referrerId)
    }

    private fun createUser(
        userData: UserData,
        currentDateTime: OffsetDateTime,
        referrerId: String?
    ): UserEntity {
        return UserEntity.createUser(
            userData = userData,
            currentOffsetDateNow = currentDateTime,
            claimOffsetDate = currentDateTime,
            photo = defaultProperty.photo[Random.nextInt(0, defaultProperty.photo.size)],
            fuel = defaultProperty.fuel,
        ).also { newUser ->
            newUser.rating = UserRatingEntity(user = newUser)
            assignReferralUser(referrerId, newUser)
            carService.assignDefaultCarToUser(newUser)
        }.let { userRepository.save(it) }
    }

    private fun isValidRequest(map: Map<String, String>): Boolean {
        val params = map.filter { it.key != "hash" }.map {
            URLDecoder.decode("${it.key}=${it.value}", "UTF-8")
        }.sorted().joinToString("\n")

        val secretKey = hmacSha256("WebAppData".toByteArray(), tgBotProperty.token)
        return !(featureProperty.loginCheckEnabled && hex(hmacSha256(secretKey, params)) != map["hash"])
    }

    private fun parseUserData(userJson: String?): UserData? {
        return try {
            val parseUser = objectMapper.readTree(userJson)
            UserData(
                id = parseUser["id"].asLong(),
                name = parseUser["first_name"].asText(),
            )
        } catch (ex: Exception) {
            null
        }
    }

    private fun assignReferralUser(referral: String?, currentUser: UserEntity) {
        val referrerId = referral?.toLongOrNull() ?: return
        if (referrerId == currentUser.id) return

        val referrerUser = userRepository.findById(referrerId).getOrNull() ?: return

        currentUser.inviter = referrerUser
        currentUser.fuel += defaultProperty.referralBonus
        referrerUser.referrals.add(
            UserReferralEntity(
                referrer = referrerUser,
                referredUser = currentUser,
                bonus = defaultProperty.referralBonus
            )
        )
        expService.addingExperienceToTheUser(referrerUser, ExperienceEvent.USER_INVITATION)
        userRepository.save(referrerUser)
    }


    private fun updateUserName(userEntity: UserEntity, newName: String) {
        if (userEntity.name != newName) {
            userEntity.name = newName
            userRepository.save(userEntity)
        }
    }

    private fun hmacSha256(key: ByteArray, data: String): ByteArray {
        val mac = Mac.getInstance("HmacSHA256")
        val secretKey = SecretKeySpec(key, "HmacSHA256")
        mac.init(secretKey)
        return mac.doFinal(data.toByteArray())
    }

    private fun hex(bytes: ByteArray): String {
        return bytes.joinToString("") { "%02x".format(it and 0xff.toByte()) }
    }
}

data class UserData(val id: Long, val name: String)