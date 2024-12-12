import {TopRaceResponse} from "./response/TopRaceResponse.tsx";
import {config} from "../Constants.tsx";

export const fetchTopRacers = async (): Promise<TopRaceResponse[] | null> => {
    try {
        const token = localStorage.getItem('jwt');
        if (!token) return null;

        const response = await fetch(`${config.url}/api/v0.1/race/top`, {
            method: 'GET',
            headers: {
                'Authorization': `${token}`,
            },
        });

        if (!response.ok) return null;
        return await response.json() as TopRaceResponse[];
    } catch (error) {
        return null
    }
};