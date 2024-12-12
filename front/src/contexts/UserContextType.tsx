import React from "react";
import {Business} from "../types/Business.ts";
import {Car} from "../types/Car.ts";
import {Task} from "../types/Task.ts";
import {TopRaceResponse} from "../api/response/TopRaceResponse.tsx";
import {RaceResponse} from "../api/response/RaceResponse.tsx";
import {Trade} from "../types/Trade.ts";
import {UserInfo} from "../types/UserInfo.ts";
import {ErrorType} from "../types/ErrorType.ts";

export interface UserContextType {
    userInfo: UserInfo | null;
    setUserInfo: React.Dispatch<React.SetStateAction<UserInfo | null>>;
    businesses: Business[] | null;
    setBusinesses: React.Dispatch<React.SetStateAction<Business[] | null>>;
    allCars: Car[] | null;
    setAllCars: React.Dispatch<React.SetStateAction<Car[] | null>>;
    currentCarIdx: number;
    setCurrentCarIdx: React.Dispatch<React.SetStateAction<number>>;
    tasks: Task[] | null;
    setTasks: React.Dispatch<React.SetStateAction<Task[] | null>>;
    topRacers: TopRaceResponse[] | null;
    loading: boolean;
    error: ErrorType | null;
    setError: (type: ErrorType | null) => void;
    trades: Trade[] | null;
    setTrades: React.Dispatch<React.SetStateAction<Trade[] | null>>;
    lastRaceResult: RaceResponse | null;
    setLastRaceResult: React.Dispatch<React.SetStateAction<RaceResponse | null>>;
}