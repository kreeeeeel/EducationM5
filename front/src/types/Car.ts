// src/types/Car.ts

import {ExpResponse} from "../api/response/ExpResponse.tsx";

export interface Indicator {
    currentIndicator: number;
    maximumIndicator: number;
    costUpgrade: number;
}

export interface Car {
    id: number;
    name: string;
    isOwned: boolean;
    image: string;
    cost: number;
    serverTime: number;
    nextRacingAt: number;
    power: Indicator;
    handling: Indicator;
    braking: Indicator;
    reputation: Indicator;
    exp: ExpResponse | null;
}
