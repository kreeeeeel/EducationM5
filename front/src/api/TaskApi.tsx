import {Task} from "../types/Task.ts";
import {config} from "../Constants.tsx";

export const fetchTasks = async (): Promise<Task[] | null> => {
    try {
        const token = localStorage.getItem('jwt');
        if (!token) return null;

        const response = await fetch(`${config.url}/api/v0.1/task`, {
            method: 'GET',
            headers: {
                'Authorization': `${token}`
            },
        });

        if (!response.ok) return null;
        return await response.json() as Task[];
    } catch (error) {
        return null;
    }
};