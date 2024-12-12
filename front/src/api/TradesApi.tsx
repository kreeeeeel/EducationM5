import {config} from "../Constants.tsx";
import {Trade} from "../types/Trade.ts";

export const fetchTrades = async (): Promise<Trade[] | null> => {
    try {
        const token = localStorage.getItem('jwt');
        if (!token) return null;

        const response = await fetch(`${config.url}/api/v0.1/trade`, {
            method: 'GET',
            headers: {
                'Authorization': `${token}`
            },
        });

        if (!response.ok) return null;
        return await response.json() as Trade[];
    } catch (error) {
        return null;
    }
};