import {RaceResponse} from "./response/RaceResponse.tsx";
import {config} from "../Constants.tsx";

export const fetchStartRace = async (carId: number): Promise<RaceResponse | null> => {
    try {
        const token = localStorage.getItem('jwt');
        if (!token) {
            return null;
        }

        const response = await fetch(`${config.url}/api/v0.1/race?carId=${carId}`, {
            method: 'POST',
            headers: {
                'Authorization': `${token}`,
            },
        });

        if (!response.ok) return null;
        return await response.json() as RaceResponse;
    } catch (error) {
        return null;
    }
};