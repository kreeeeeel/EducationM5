import {config} from "../Constants.tsx";

export const fetchAuth = async (initDataRaw: string) => {
    try {
        const response = await fetch(`${config.url}/api/v0.1/auth/login?${initDataRaw}`, { method: 'POST' });
        if (!response.ok) return null;

        const data = await response.json();
        if (!data) return null;

        localStorage.setItem('jwt', data.token);
        return data.token;
    } catch (error) {
        return null;
    }
};