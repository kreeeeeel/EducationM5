package ru.shabashoff.m5

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration
import org.springframework.boot.autoconfigure.security.servlet.UserDetailsServiceAutoConfiguration
import org.springframework.boot.context.properties.ConfigurationPropertiesScan
import org.springframework.boot.runApplication
import org.springframework.data.jpa.repository.config.EnableJpaRepositories

@EnableJpaRepositories
@ConfigurationPropertiesScan
@SpringBootApplication(
    exclude = [SecurityAutoConfiguration::class, UserDetailsServiceAutoConfiguration::class]
)
class M5Application

fun main(args: Array<String>) {
    runApplication<M5Application>(*args)
}
