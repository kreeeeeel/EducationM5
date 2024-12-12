package ru.shabashoff.m5.config.security

import jakarta.servlet.FilterChain
import jakarta.servlet.ServletException
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.apache.commons.lang3.StringUtils
import org.springframework.security.core.context.SecurityContext
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.stereotype.Component
import org.springframework.web.filter.OncePerRequestFilter
import ru.shabashoff.m5.service.token.TokenService
import java.io.IOException


@Component
class JwtAuthenticationFilter(
    private val tokenService: TokenService
) : OncePerRequestFilter() {

    @Throws(ServletException::class, IOException::class)
    override fun doFilterInternal(
        request: HttpServletRequest,
        response: HttpServletResponse,
        filterChain: FilterChain
    ) {
        val jwt : String? = request.getHeader(HEADER_NAME)
        if (jwt.isNullOrBlank() || StringUtils.startsWith(jwt, BEARER_PREFIX)) {
            filterChain.doFilter(request, response)
            return
        }

        if (SecurityContextHolder.getContext().authentication == null) {
            val userId = tokenService.parseToken(jwt)
            if (userId != null){
                val context: SecurityContext = SecurityContextHolder.createEmptyContext()
                context.authentication = CustomAuthenticationToken(userId)
                SecurityContextHolder.setContext(context)
            }

        }

        filterChain.doFilter(request, response)
    }

    companion object {
        const val BEARER_PREFIX = "Bearer "
        const val HEADER_NAME = "Authorization"
    }
}