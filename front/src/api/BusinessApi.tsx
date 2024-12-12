import {Business} from "../types/Business.ts";
import {config} from "../Constants.tsx";

export const fetchBusinesses = async (): Promise<Business[] | null> => {
    try {
        const token = localStorage.getItem('jwt');
        if (!token) return null;

        const response = await fetch(`${config.url}/api/v0.1/business`, {
            method: 'GET',
            headers: {
                'Authorization': `${token}`,
            },
        });

        if (!response.ok) return null;
        return await response.json() as Business[];
    } catch (error) {
        return null;
    }
};