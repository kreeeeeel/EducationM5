package ru.shabashoff.m5.controller

import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import ru.shabashoff.m5.service.reward.RewardService

@RestController
@RequestMapping("/api/v0.1/reward")
class RewardController(
    private val rewardService: RewardService
) {

    @PostMapping("/claim")
    fun takeRewardOfClaim() = rewardService.takeRewardOfClaim()

    @PostMapping("/week")
    fun takeRewardOfWeek(@RequestParam day: Long) = rewardService.takeRewardDaily(day)

    @GetMapping("/adsgram")
    fun rewardAds(@RequestParam key: String, @RequestParam userId: Long) = rewardService.rewardAds(key, userId)
}
