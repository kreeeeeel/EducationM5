package ru.shabashoff.m5.config.security

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.config.http.SessionCreationPolicy
import org.springframework.security.web.SecurityFilterChain
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter
import org.springframework.web.cors.CorsConfiguration
import org.springframework.web.cors.CorsConfigurationSource
import org.springframework.web.cors.UrlBasedCorsConfigurationSource

@Configuration
@EnableWebSecurity
class SecurityConfig(
    private val jwtAuthenticationFilter: JwtAuthenticationFilter

) {
    @Bean
    fun securityFilterChain(http: HttpSecurity): SecurityFilterChain {
        http
            .cors().and()
            .csrf().disable()
            .authorizeRequests { auth ->
                auth.requestMatchers(
                        "/api/v0.1/auth/login",
                        "/api/v0.1/reward/adsgram",
                        "/api/v0.1/ton/generate-payload",
                        "/v3/api-docs/**",
                        "/swagger-ui.html",
                        "/webjars/swagger-ui/**"
                    ).permitAll()
                    .anyRequest().authenticated()
            }
            .sessionManagement { session ->
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            }
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter::class.java)


        return http.build()
    }

    @Bean
    fun corsConfigurationSource(): CorsConfigurationSource {
        val configuration = CorsConfiguration().apply {
            applyPermitDefaultValues()
            allowedMethods = listOf("GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD")
            // Дополнительные настройки, если необходимо
            // allowedOrigins = listOf("https://example.com")
            // allowedHeaders = listOf("Authorization", "Cache-Control", "Content-Type")
        }
        val source = UrlBasedCorsConfigurationSource()
        source.registerCorsConfiguration("/**", configuration)
        return source
    }

}
