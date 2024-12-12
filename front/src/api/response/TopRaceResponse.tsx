import {TopCar} from "./TopCarResponse.tsx";

export interface TopRaceResponse {
    id: number;
    image: string;
    name: string;
    rating: number;
    car: TopCar;
}