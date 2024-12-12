import {ExpResponse} from "./response/ExpResponse.tsx";
import {config} from "../Constants.tsx";

export const fetchUpdateBusiness = async (businessId: number): Promise<{
    id: number;
    newLevel: number;
    newCost: number;
    businessPassiveIncome: number;
    newPassiveIncome: number;
    exp: ExpResponse;
} | null> => {
    try {
        const token = localStorage.getItem('jwt');
        if (!token) return null;

        const response = await fetch(`${config.url}/api/v0.1/business/upgrade/${businessId}`, {
            method: 'POST',
            headers: {
                'Authorization': `${token}`
            },
        });

        if (!response.ok) return null;
        return await response.json();
    } catch (e) {
        return null;
    }
};