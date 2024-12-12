import {Car} from "../../types/Car.ts";
import {ExpResponse} from "./ExpResponse.tsx";

export interface RaceResponse {
    currentCar: Car;
    opponentName: string;
    opponentCar: Car;
    opponentImage: string;
    opponentRating: number;
    chanceWin: number;
    result: "WIN" | "LOSS";
    points: number;
    currentPoints: number;
    nextRacingAt: number;
    exp: ExpResponse;
}