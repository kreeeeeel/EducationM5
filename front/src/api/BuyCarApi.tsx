import {Car} from "../types/Car.ts";
import {config} from "../Constants.tsx";

export const fetchBuyCar = async (carId: number): Promise<Car | null> => {
    try {
        const token = localStorage.getItem('jwt');
        if (!token) return null;

        const response = await fetch(`${config.url}/api/v0.1/car/buy?carId=${carId}`, {
            method: 'POST',
            headers: {
                'Authorization': `${token}`,
            },
        });

        if (!response.ok) return null;
        return await response.json() as Car;
    } catch (error) {
        return null;
    }
};