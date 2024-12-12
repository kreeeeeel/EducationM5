package ru.shabashoff.m5.config.security

import org.springframework.http.HttpHeaders
import org.springframework.security.core.Authentication
import org.springframework.security.web.server.authentication.ServerAuthenticationConverter
import org.springframework.stereotype.Component
import org.springframework.web.server.ServerWebExchange
import reactor.core.publisher.Mono
import ru.shabashoff.m5.service.token.TokenService


@Component
class JwtServerAuthenticationConverter(
    private val tokenService: TokenService
) : ServerAuthenticationConverter {

    override fun convert(exchange: ServerWebExchange): Mono<Authentication> {
        return exchange.request.headers.getFirst(HttpHeaders.AUTHORIZATION)
            ?.let { tokenService.parseToken(it) }
            ?.let { id -> Mono.just(CustomAuthenticationToken(id)) }
            ?: Mono.empty()
    }
    
}
