import React, {useState, useContext, useEffect} from 'react';
import {motion, AnimatePresence} from 'framer-motion';
import {
    FaTachometerAlt,
    FaLock,
    FaChevronRight,
    FaChevronLeft,
    FaGasPump,
    FaFlag,
    FaSearch, FaTrophy
} from 'react-icons/fa';
import {GiCarWheel, GiMechanicGarage} from "react-icons/gi";
import {FaCar} from "react-icons/fa6";
import {TbSteeringWheel} from "react-icons/tb";
import {UserContext} from '../../contexts/UserContext';
import {fetchBuyCar} from '../../api/BuyCarApi.tsx';
import {fetchStartRace} from "../../api/RaceApi.tsx";
import {Car} from '../../types/Car';
import CarUpgrades from "./CarUpgrades.tsx";
import ValueFormatter from "../ValueFormatter.tsx";
import {ErrorType} from "../../types/ErrorType.ts";

interface CarInfoSectionProps {
    onShowBuyFuel: () => void;
    onShowBuyCar: () => void;
    onStartRace: () => void;
}

const CarInfoSection: React.FC<CarInfoSectionProps> = ({onShowBuyFuel, onShowBuyCar, onStartRace}) => {
    const userContext = useContext(UserContext);
    const [preloadedImages, setPreloadedImages] = useState(false);

    const {
        allCars, setAllCars,
        userInfo, setUserInfo,
        currentCarIdx, setCurrentCarIdx,
        setLastRaceResult, setError
    } = userContext ?? {}

    const [currentCarShowed, setCurrentCarShowed] = useState<Car | null>(null);
    const [timeLeft, setTimeLeft] = useState<number>(0);
    const [isSearchEnemy, setSearchEnemy] = useState<boolean>(false);

    useEffect(() => {
        if (allCars == null) {
            return
        }

        const displayedCar = allCars[currentCarIdx ?? 0];
        if (displayedCar) {
            setCurrentCarShowed(displayedCar);
        }

        if (allCars) {
            let loadedImages = 0;
            allCars.forEach((car) => {
                const img = new Image();
                img.src = car.image;
                img.onload = () => {
                    loadedImages += 1;
                    if (loadedImages === allCars.length) {
                        setPreloadedImages(true);
                    }
                };
            });
        }

        if (!displayedCar?.nextRacingAt) {
            setTimeLeft(0);
            return;
        }

        const nextRacingTime = displayedCar.nextRacingAt * 1000;
        const updateTimeLeft = () => {
            const now = new Date().getTime();
            const difference = nextRacingTime - now;
            if (difference <= 0) {
                setTimeLeft(0);
            } else {
                setTimeLeft(difference);
            }
        };
        const timerId = setInterval(updateTimeLeft, 1000);
        updateTimeLeft();

        return () => clearInterval(timerId);
    }, [allCars, currentCarIdx]);

    if (!userContext || !preloadedImages || allCars == null || currentCarIdx == null) {
        return <div className="text-center text-white">Загрузка...111</div>;
    }

    const nextCar = () => {
        if (allCars != null) {
            setCurrentCarIdx?.((prevIndex) => (prevIndex + 1) % allCars.length);
        }
    };

    const prevCar = () => {
        if (allCars != null) {
            setCurrentCarIdx?.((prevIndex) => (prevIndex - 1 + allCars.length) % allCars.length);
        }
    };

    const handleBuyCar = async () => {
        if (allCars == null || userInfo == null || setAllCars == null || setUserInfo == null || currentCarShowed == null) {
            return;
        }

        if (currentCarShowed.cost > userInfo.fuel) {
            onShowBuyFuel();
            return;
        }

        try {
            const newCar = await fetchBuyCar(currentCarShowed.id);
            if (!newCar) {
                setError?.(ErrorType.ERROR_CAR_BUY)
                return;
            }

            setAllCars(prev =>
                prev ? prev.map((car) => car.id === newCar.id ? newCar : car) : prev
            );
            setUserInfo(prev => prev ? {
                ...prev,
                fuel: userInfo.fuel - currentCarShowed.cost
            } : prev);

            onShowBuyCar();
        } catch (err) {
            setError?.(ErrorType.ERROR_CAR_BUY);
        }
    };

    const startCarRace = async () => {
        setSearchEnemy(true);
        try {
            const raceResponse = await fetchStartRace(currentCarIdx + 1);
            if (raceResponse == null) {
                setError?.(ErrorType.ERROR_RACE);
                setSearchEnemy(false);
                return;
            }

            setLastRaceResult?.(raceResponse);
            onStartRace()
        } catch (err) {
            setError?.(ErrorType.ERROR_RACE);
        }
        setSearchEnemy(false);
    }

    if (currentCarShowed == null) {
        return;
    }

    const isLocked = !currentCarShowed.isOwned;

    const formatTime = (milliseconds: number): string => {
        const totalSeconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    return (
        <div className="flex flex-col relative w-full">
            <div className="mt-14 bg-gradient-to-r from-[#0B1428] to-[#1C1C36] flex items-center justify-center shadow-black shadow-2xl">
                <div className="p-4 flex flex-col justify-center items-center">
                    <span className="text-sm text-gray-400">Победы</span>
                    <span className="text-3xl text-white">
                            <ValueFormatter value={userInfo?.details.racingWinCount}/>
                        </span>
                </div>
                <div className="p-4 flex flex-col justify-center items-center">
                    <span className="text-sm text-gray-400">Гонок</span>
                    <span className="text-3xl text-white">
                            <ValueFormatter value={userInfo?.details.racingCount}/>
                        </span>
                </div>
                <div className="p-4 flex flex-col justify-center items-center">
                    <span className="text-sm text-gray-400">Винстрик</span>
                    <span className="text-3xl text-white">-</span>
                </div>
                <div className="p-4 flex flex-col justify-center items-center">
                    <span className="text-sm text-gray-400">Винрейнт</span>
                    <span className="text-3xl text-white">
                            {Math.round(((userInfo?.details.racingWinCount ?? 0) / (userInfo?.details.racingCount ?? 1)) * 100)}%
                        </span>
                </div>
            </div>

            <div className="mr-2 bg-transparent flex-1 p-4">
                <div className="flex flex-col justify-center items-center">
                    <div className="flex justify-center items-center">
                        <FaTrophy className="text-xl mr-2 text-orange-400"/>
                        <span className="text-xl text-white">
                            <ValueFormatter value={userInfo?.ratingRacing}/>
                        </span>
                    </div>
                    <span className="text-3xl text-white">{currentCarShowed.name}</span>
                </div>
                <div className="flex justify-center relative items-center">
                    <button
                        onClick={prevCar}
                        disabled={isSearchEnemy}
                        className="absolute left-[-18px] md:left-[-40px] top-1/2 transform -translate-y-1/2 p-3 rounded-full text-white transition z-10 shadow-md flex items-center justify-center"
                    ><FaChevronLeft size={24}/></button>

                    <AnimatePresence mode="wait">
                        {currentCarShowed && (
                            <motion.div
                                key={currentCarShowed.id}
                                initial={{opacity: 0, scale: 0.9}}
                                animate={{opacity: 1, scale: 1}}
                                exit={{opacity: 0, scale: 0.9}}
                                transition={{duration: 0.4}}
                                className="relative"
                            >
                                <div className="relative">
                                    <img
                                        src={currentCarShowed.image}
                                        alt={currentCarShowed.name}
                                        className={`w-50 h-auto ${isLocked ? 'filter blur-sm' : ''}`}
                                    />
                                    {isLocked && (
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <FaLock className="text-white text-3xl"/>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <button
                        onClick={nextCar}
                        disabled={isSearchEnemy}
                        className="absolute right-[-28px] md:right-[-40px] top-1/2 transform -translate-y-1/2 p-3 rounded-full text-white transition z-10 shadow-md flex items-center justify-center"
                    ><FaChevronRight size={24}/></button>
                </div>

                {!isLocked && (
                    <div className="flex justify-center relative items-center space-x-2">
                        <CarUpgrades
                            type={'POWER_UPGRADE'}
                            icon={<FaTachometerAlt className="text-5xl text-red-400"/>}
                            currentLevel={currentCarShowed.power.currentIndicator}
                            maxLevel={currentCarShowed.power.maximumIndicator}
                            cost={currentCarShowed.power.costUpgrade}
                            color="red"
                            carIndex={currentCarIdx + 1}
                            onShowBuyFuel={onShowBuyFuel}
                        />

                        <CarUpgrades
                            type="HANDLING_UPGRADE"
                            icon={<TbSteeringWheel className="text-5xl text-green-400"/>}
                            currentLevel={currentCarShowed.handling.currentIndicator}
                            maxLevel={currentCarShowed.handling.maximumIndicator}
                            cost={currentCarShowed.handling.costUpgrade}
                            color="green"
                            carIndex={currentCarIdx + 1}
                            onShowBuyFuel={onShowBuyFuel}
                        />

                        <CarUpgrades
                            type="BRAKING_UPGRADE"
                            icon={<GiCarWheel className="text-5xl text-blue-400"/>}
                            currentLevel={currentCarShowed.braking.currentIndicator}
                            maxLevel={currentCarShowed.braking.maximumIndicator}
                            cost={currentCarShowed.braking.costUpgrade}
                            color="blue"
                            carIndex={currentCarIdx + 1}
                            onShowBuyFuel={onShowBuyFuel}
                        />

                        <CarUpgrades
                            type="REPUTATION_UPGRADE"
                            icon={<FaCar className="text-5xl text-yellow-400"/>}
                            currentLevel={currentCarShowed.reputation.currentIndicator}
                            maxLevel={currentCarShowed.reputation.maximumIndicator}
                            cost={currentCarShowed.reputation.costUpgrade}
                            color="yellow"
                            carIndex={currentCarIdx + 1}
                            onShowBuyFuel={onShowBuyFuel}
                        />
                    </div>
                )}

                {isLocked && (
                    <button
                        onClick={handleBuyCar}
                        className="mt-11 ml-1 w-full bg-green-800 text-white font-bold p-3 rounded-3xl transition duration-300 shadow-md flex items-center justify-center"
                    >
                        <span className="mr-2 text-2xl font-bold">
                            Купить за&nbsp; <ValueFormatter value={currentCarShowed.cost}/>
                        </span>
                        <FaGasPump className="text-2xl mt-1"/>
                    </button>
                )}
            </div>

            {!isLocked && (
                <button
                    disabled={timeLeft > 0 || isSearchEnemy}
                    onClick={startCarRace}
                    className={`fixed bottom-16 flex ml-3 mb-4 justify-center items-center bg-blue-500 rounded-3xl py-3 text-white text-2xl w-[calc(100%-24px)] ${(timeLeft > 0 || isLocked || isSearchEnemy) && 'opacity-75'}`}>
                {isSearchEnemy ? (
                        <>
                            <FaSearch className="mt-1 mr-2 text-white text-2xl"/>
                            Поиск соперника
                        </>
                    ) : isLocked ? (
                        <>
                            <FaLock className="mt-1 mr-2 text-white text-2xl"/>
                            Заблокировано
                        </>
                    ) : (
                        <>
                            {timeLeft > 0 ? <GiMechanicGarage className="mt-1 mr-2 text-white text-2xl"/> :
                                <FaFlag className="mt-1 mr-2 text-white text-2xl"/>}
                            {timeLeft > 0 ? formatTime(timeLeft) : "Начать заезд"}
                        </>
                    )}
                </button>
            )}
        </div>
    );
};

export default CarInfoSection;