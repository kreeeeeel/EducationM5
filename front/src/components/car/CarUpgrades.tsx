import React, {useContext} from 'react';
import {FaGasPump} from 'react-icons/fa';
import ValueFormatter from '../ValueFormatter.tsx';
import {fetchUpdateCar} from "../../api/UpdateCarApi.tsx";
import {UserContext} from "../../contexts/UserContext.tsx";
import {ErrorType} from "../../types/ErrorType.ts";

interface CarUpgradeProps {
    type: 'POWER_UPGRADE' | 'HANDLING_UPGRADE' | 'BRAKING_UPGRADE' | 'REPUTATION_UPGRADE';
    icon: React.ReactElement;
    currentLevel: number;
    maxLevel: number;
    cost: number;
    color: string;
    carIndex: number;
    onShowBuyFuel: () => void;
}

const colorClassesMap: { [key: string]: { icon: string; cost: string; button: string } } = {
    yellow: {
        icon: 'text-yellow-400',
        cost: 'text-yellow-400',
        button: 'from-yellow-400 to-yellow-500',
    },
    blue: {
        icon: 'text-blue-400',
        cost: 'text-blue-400',
        button: 'from-blue-400 to-blue-500',
    },
    green: {
        icon: 'text-green-400',
        cost: 'text-green-400',
        button: 'from-green-400 to-green-500',
    },
    red: {
        icon: 'text-red-400',
        cost: 'text-red-400',
        button: 'from-red-400 to-red-500',
    },
    default: {
        icon: 'text-white',
        cost: 'text-white',
        button: 'from-gray-400 to-gray-500',
    },
};

const CarUpgrades: React.FC<CarUpgradeProps> = ({
    type,
    icon,
    currentLevel,
    maxLevel,
    cost,
    color,
    carIndex,
    onShowBuyFuel
}) => {

    const userContext = useContext(UserContext);
    if (userContext == null || cost == null) {
        throw new Error("User context not found");
    }

    const { userInfo, setUserInfo, allCars, setAllCars, setError } = userContext
    if (userInfo == null || setUserInfo == null || allCars == null || setAllCars == null) {
        throw new Error("User elements not found");
    }

    const colorClasses = colorClassesMap[color] || colorClassesMap['default'];
    const isMaxLevel = currentLevel != null && maxLevel != null ? currentLevel >= maxLevel : false;
    const hasNullParams = currentLevel == null || maxLevel == null;

    const upgradeCar = async () => {
        if (cost > userInfo.fuel) {
            onShowBuyFuel();
            return;
        }

        try {
            const data = await fetchUpdateCar(carIndex, type);
            if (!data) {
                setError?.(ErrorType.ERROR_CAR_UPDATE);
                return;
            }

            const updatedCars = allCars?.map(car => {
                if (car.id === carIndex) return data
                return car;
            }) || [];

            setAllCars(updatedCars);

            userInfo.fuel -= cost;
            setUserInfo(userInfo);

            if (navigator.vibrate) {
                navigator.vibrate(100);
            }
        } catch (error) {
            setError?.(ErrorType.ERROR_CAR_UPDATE);
        }
    };

    return (
        <div className="w-24 flex flex-col items-center justify-center">
            <div className="flex items-center flex-1 mb-2">
                <div className="flex-1">
                    <p className={`text-xs text-gray-300`}>
                        Ур. {currentLevel != null ? currentLevel : '--'}
                    </p>
                </div>
            </div>
            {icon}

            <button
                className={`mt-2 w-20 flex justify-center items-center bg-gradient-to-r ${colorClasses.button} text-black font-bold px-4 rounded-xl transition duration-300 whitespace-nowrap ${
                    isMaxLevel || hasNullParams && 'opacity-70 cursor-not-allowed'
                } ${cost > userInfo.fuel && 'opacity-65 cursor-not-allowed'}`}
                onClick={() => !isMaxLevel && !hasNullParams && upgradeCar()}
                disabled={isMaxLevel || hasNullParams}
                aria-disabled={isMaxLevel || hasNullParams}
            >
                {isMaxLevel ? (
                    <span className="font-bold">MAX</span>
                ) : (
                    <>
                        <ValueFormatter value={cost}/>
                        <FaGasPump className={`ml-1 w-4 h-4`}/>
                    </>
                )}
            </button>
        </div>
    );
};

export default CarUpgrades;