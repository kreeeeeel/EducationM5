import {config} from "../Constants.tsx";

export const fetchTonPayload = async(): Promise<string | null> => {
    try {
        const token = localStorage.getItem('jwt');
        if (!token) return null;

        const response = await fetch(`${config.url}/api/v0.1/ton/generate-payload`, {
            method: 'GET',
            headers: {
                'Authorization': `${token}`
            },
        });

        if (!response.ok) return null;
        return await response.text();
    } catch (error) {
        return null;
    }
};