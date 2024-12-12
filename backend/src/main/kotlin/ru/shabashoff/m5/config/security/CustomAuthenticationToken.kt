package ru.shabashoff.m5.config.security

import org.springframework.security.authentication.AbstractAuthenticationToken

data class CustomAuthenticationToken(
    private val id: Long
) : AbstractAuthenticationToken(emptyList()) {

    init {
        isAuthenticated = true
    }
    override fun getCredentials(): Any = id
    override fun getPrincipal(): Any = id
}