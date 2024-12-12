import {ClaimRewardResponse} from "./response/ClaimRewardResponse.tsx";
import {config} from "../Constants.tsx";

export const fetchClaimReward = async (): Promise<ClaimRewardResponse | null> => {
    try {
        const token = localStorage.getItem('jwt');
        if (!token) return null;

        const response = await fetch(`${config.url}/api/v0.1/reward/claim`, {
            method: 'POST',
            headers: {
                'Authorization': `${token}`
            },
        });

        if (!response.ok) return null;
        return await response.json() as ClaimRewardResponse;
    } catch (error) {
        return null;
    }
};