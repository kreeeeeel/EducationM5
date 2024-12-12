import {config} from "../Constants.tsx";
import {UserInfo} from "../types/UserInfo.ts";

export const fetchUserInfo = async (): Promise<UserInfo | null> => {
    try {
        const token = localStorage.getItem('jwt');
        if (!token) return null;

        const response = await fetch(`${config.url}/api/v0.1/user`, {
            headers: {
                'Authorization': `${token}`,
            },
        });

        if (!response.ok) return null;
        return await response.json() as UserInfo;
    } catch (error) {
        return null;
    }
};