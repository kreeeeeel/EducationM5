import {ExpResponse} from "./response/ExpResponse.tsx";
import {config} from "../Constants.tsx";

export const fetchTaskCompletion = async (taskId: number): Promise<ExpResponse | null> => {
    try {
        const token = localStorage.getItem('jwt');
        if (!token) return null;

        const response = await fetch(`${config.url}/api/v0.1/task?taskId=${taskId}`, {
            method: 'POST',
            headers: {
                'Authorization': `${token}`
            },
        });

        if (!response.ok) return null;
        return await response.json() as ExpResponse;
    } catch (error) {
        return null;
    }
};