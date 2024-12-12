import {initData, useSignal} from '@telegram-apps/sdk-react';
import React, {createContext, ReactNode, useEffect, useState} from 'react';

import {fetchAuth} from '../api/AuthApi.tsx'
import {fetchUserInfo} from '../api/UserInfoApi.tsx'
import {fetchBusinesses} from '../api/BusinessApi.tsx'
import {fetchTasks} from '../api/TaskApi.tsx'
import {fetchAllCars} from '../api/GetCarsApi.tsx'
import {fetchTopRacers} from '../api/TopRacersApi.tsx'
import {fetchTrades} from '../api/TradesApi.tsx'

import {RaceResponse} from '../api/response/RaceResponse.tsx'
import {TopRaceResponse} from '../api/response/TopRaceResponse.tsx'

import {Business} from '../types/Business';
import {Car} from '../types/Car';
import {Task} from '../types/Task';
import usePreloadImages from "../hooks/usePreloadImages.ts";
import {UserContextType} from "./UserContextType.tsx";
import {UserInfo} from "../types/UserInfo.ts";
import {Trade} from "../types/Trade.ts";
import {ErrorType} from "../types/ErrorType.ts";

export const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
    children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
    const initDataRaw = useSignal(initData.raw);

    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
    const [businesses, setBusinesses] = useState<Business[] | null>(null);
    const [tasks, setTasks] = useState<Task[] | null>(null);
    const [allCars, setAllCars] = useState<Car[] | null>(null);
    const [currentCarIdx, setCurrentCarIdx] = useState<number>(0);
    const [topRacers, setTopRacers] = useState<TopRaceResponse[] | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<ErrorType | null>(null);
    const [trades, setTrades] = useState<Trade[] | null>(null);
    const [lastRaceResult, setLastRaceResult] = useState<RaceResponse | null>(null);

    useEffect(() => {
        const authenticateAndFetchData = async () => {
            try {
                const token = await fetchAuth(initDataRaw as string);
                if (token) {
                    setUserInfo(await fetchUserInfo());
                    setBusinesses(await fetchBusinesses());
                    setTasks(await fetchTasks());
                    setTopRacers(await fetchTopRacers());
                    setTrades(await fetchTrades())

                    const allCars = await fetchAllCars();
                    setAllCars(allCars);
                    setCurrentCarIdx(allCars!.findIndex(car => car.isOwned) || 0);
                } else setError(ErrorType.SERVER_NOT_RESPONDING);
            } catch (err) {
                setError(ErrorType.SERVER_NOT_RESPONDING);
            } finally {
                setLoading(false);
            }
        };

        !initDataRaw ? setLoading(false) : authenticateAndFetchData().catch(err =>
                console.error('Unexpected error during data fetching:', err)
        )
    }, [initDataRaw]);

    const carImages = allCars ? allCars.map(car => car.image) : [];
    const businessImages = businesses ? businesses.map(business => business.image) : [];
    const userImage = userInfo?.photo ? [userInfo.photo] : [];

    const allImages = [...carImages, ...businessImages, ...userImage];
    usePreloadImages(allImages);

    return (
        <UserContext.Provider
            value={{
                userInfo, setUserInfo,
                businesses, setBusinesses,
                allCars, setAllCars,
                currentCarIdx, setCurrentCarIdx,
                tasks, setTasks,
                topRacers,
                loading,
                error, setError,
                trades, setTrades,
                lastRaceResult, setLastRaceResult
            }}
        >
            {children}
        </UserContext.Provider>
    );
};
