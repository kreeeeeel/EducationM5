package ru.shabashoff.m5.config.redis

import com.fasterxml.jackson.databind.ObjectMapper
import org.springframework.cache.annotation.EnableCaching
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.data.redis.cache.RedisCacheConfiguration
import org.springframework.data.redis.cache.RedisCacheManager
import org.springframework.data.redis.connection.RedisConnectionFactory
import org.springframework.data.redis.serializer.Jackson2JsonRedisSerializer
import org.springframework.data.redis.serializer.RedisSerializationContext
import org.springframework.data.redis.serializer.StringRedisSerializer
import java.time.Duration


@Configuration
@EnableCaching
internal class RedisConfiguration(
    private val objectMapper: ObjectMapper
) {

    @Bean
    fun cacheManager(connectionFactory: RedisConnectionFactory, redisSerializationContext: RedisSerializationContext<String, Any>): RedisCacheManager {
        val cacheConfig: RedisCacheConfiguration = RedisCacheConfiguration.defaultCacheConfig()
            .entryTtl(Duration.ofMinutes(5))
            .disableCachingNullValues() // Optional: disable caching of null values

        return RedisCacheManager.builder(connectionFactory)
            .cacheDefaults(cacheConfig)
            .build()
    }

    @Bean
    fun redisSerializationContext(jackson2JsonRedisSerializer: Jackson2JsonRedisSerializer<Any>): RedisSerializationContext<String, Any> {
        val keySerializer = StringRedisSerializer()
        val valueSerializer = jackson2JsonRedisSerializer

        return RedisSerializationContext.newSerializationContext<String, Any>(keySerializer)
            .value(valueSerializer)
            .hashKey(keySerializer)
            .hashValue(valueSerializer)
            .build()
    }

    @Bean
    fun jackson2JsonRedisSerializer(): Jackson2JsonRedisSerializer<Any> {
        val serializer = Jackson2JsonRedisSerializer(Any::class.java)
        serializer.setObjectMapper(objectMapper)
        return serializer
    }
}