import {UserDetails} from "./UserDetails.ts";
import {RefInfo} from "./RefInfo.ts";
import {DailyReward} from "./DailyReward.ts";

export interface UserInfo {
    name: string;
    fuel: number;
    ratingRacing: number;
    exp: number;
    level: number;
    photo: string;
    referral: RefInfo;
    purchasedWithStars: number;
    passiveIncome: number;
    lastVisitedAt: string;
    nextClaimAt: number;
    nextDay: number;
    details: UserDetails;
    createdAt: string;
    dailyReward: DailyReward[]
}