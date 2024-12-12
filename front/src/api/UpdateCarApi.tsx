import {Car} from "../types/Car.ts";
import {config} from "../Constants.tsx";

export const fetchUpdateCar = async (carId: number, upgradeType: 'POWER_UPGRADE' | 'HANDLING_UPGRADE' | 'BRAKING_UPGRADE' | 'REPUTATION_UPGRADE'): Promise<Car | null> => {
    try {
        const token = localStorage.getItem('jwt');
        if (!token) return null;

        const response = await fetch(`${config.url}/api/v0.1/car/upgrade?carId=${carId}&upgrade=${upgradeType}`, {
            method: 'PUT',
            headers: {
                'Authorization': `${token}`
            },
        });

        if (!response.ok) return null;
        return await response.json() as Car;
    } catch (error) {
        return null;
    }
};