import {config} from "../Constants.tsx";
import {DailyReward} from "../types/DailyReward.ts";

export const fetchRewardOfDay = async (day: number): Promise<DailyReward | null> => {
    try {
        const token = localStorage.getItem('jwt');
        if (!token) return null;

        const response = await fetch(`${config.url}/api/v0.1/reward/week?day=${day}`, {
            method: 'POST',
            headers: {
                'Authorization': `${token}`
            },
        });

        if (!response.ok) return null;
        return await response.json() as DailyReward;
    } catch (error) {
        return null;
    }
};