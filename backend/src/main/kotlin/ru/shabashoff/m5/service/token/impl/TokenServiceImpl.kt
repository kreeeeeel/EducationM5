package ru.shabashoff.m5.service.token.impl

import org.springframework.security.oauth2.jwt.*
import org.springframework.stereotype.Service
import ru.shabashoff.m5.config.property.JwtProperty
import ru.shabashoff.m5.service.token.TokenService
import java.time.Instant
import java.time.temporal.ChronoUnit

@Service
class TokenServiceImpl(
    private val jwtProperty: JwtProperty,
    private val jwtDecoder: JwtDecoder,
    private val jwtEncoder: JwtEncoder,
): TokenService {

    override fun createToken(id: Long): String {
        val jwsHeader = JwsHeader.with { "HS256" }.build()
        val claims = JwtClaimsSet.builder()
            .issuedAt(Instant.now())
            .expiresAt(Instant.now().plus(jwtProperty.expire, ChronoUnit.MILLIS))
            .claim("userId", id)
            .build()
        return jwtEncoder.encode(JwtEncoderParameters.from(jwsHeader, claims)).tokenValue
    }

    override fun parseToken(token: String): Long? {
        return try {
            val jwt = jwtDecoder.decode(token)
            return jwt.claims["userId"] as Long
        } catch (e: Exception) {
            null
        }
    }

}
