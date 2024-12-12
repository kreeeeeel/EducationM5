import React, {useContext} from 'react';
import {UserContext} from "../../contexts/UserContext.tsx";
import {FaTimesCircle, FaTrophy} from "react-icons/fa";
import {AnimatePresence, motion} from "framer-motion";
import ValueFormatter from "../ValueFormatter.tsx";

interface ResultRaceProps {
    onClose: () => void;
}

const ResultRace: React.FC<ResultRaceProps> = ({onClose}) => {
    const userContext = useContext(UserContext);
    const {setAllCars, currentCarIdx, lastRaceResult, setUserInfo} = userContext ?? {};

    const closeResultRace = () => {
        setUserInfo?.((prev) => {
            if (!prev) return prev;
            const updatedDetails = {
                ...prev.details,
                racingCount: (prev.details?.racingCount ?? 0) + 1,
                racingWinCount:
                    (prev.details?.racingWinCount ?? 0) +
                    (lastRaceResult?.result === 'WIN' ? 1 : 0),
            };

            return {
                ...prev,
                fuel: prev.fuel + (lastRaceResult?.exp.bonus ?? 0),
                exp: lastRaceResult?.exp.newExp ?? prev.exp,
                ratingRacing: lastRaceResult?.currentPoints ?? prev.ratingRacing,
                level: lastRaceResult?.exp.newLevel ?? prev.level,
                details: updatedDetails,
            };
        });

        setAllCars?.(prev => {
            if (prev !== null) {
                prev[currentCarIdx ?? 0].nextRacingAt = (lastRaceResult?.nextRacingAt ?? 0) + 5;
            }
            return prev;
        });

        onClose();
    }

    document.body.style.overflowY = 'auto';
    return (
        <div className="pb-[calc(100%-224px)] flex flex-col min-h-screen bg-gradient-to-b from-[#071333] to-[#0B1428] text-white">
            <div className="mt-2 ml-4 flex items-center py-2">
                <img
                    src={lastRaceResult?.opponentImage}
                    alt={lastRaceResult?.opponentName}
                    className="w-10 h-10 rounded-full object-cover mr-4"
                />
                <div className="flex-1">
                    <div className="text-lg font-medium text-white">
                        {lastRaceResult?.opponentName}
                    </div>
                    <div className="text-sm text-gray-400">
                        Ваш соперник
                    </div>
                </div>
            </div>

            <div className="flex justify-center items-center">
                <div className="mt-4 text-5xl flex items-center space-x-2">
                    <div>
                        {lastRaceResult?.result === 'WIN' ? (
                            <FaTrophy className="mt-1 text-yellow-500"/>
                        ) : (
                            <FaTimesCircle className="mt-1 text-red-500"/>
                        )}
                    </div>
                    <div>
                        {lastRaceResult?.result === 'WIN' ? 'Победа!' : 'Поражение'}
                    </div>
                </div>
            </div>
            <span className="flex justify-center items-center text-gray-300 text-2xl">
                {lastRaceResult?.result === 'WIN' ? 'Поздравляем! Так держать' : 'В следующий раз повезет'}
            </span>
            <div className="flex items-center justify-center rounded-3xl">
                <div className="p-4 flex flex-col justify-center items-center">
                    <span className="text-lg text-gray-400">Очки</span>
                    <span className="text-4xl text-white">
                        {lastRaceResult?.points}
                    </span>
                </div>
                <div className="p-4 flex flex-col justify-center items-center">
                    <span className="text-lg text-gray-400">Рейтинг</span>
                    <span className="text-4xl text-white">
                        <ValueFormatter value={lastRaceResult?.currentPoints}/>
                    </span>
                </div>
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={lastRaceResult?.opponentCar.id}
                    initial={{opacity: 0, scale: 0.9}}
                    animate={{opacity: 1, scale: 1}}
                    exit={{opacity: 0, scale: 0.9}}
                    transition={{duration: 0.4}}
                    className="relative mt-4"
                >
                    <div className="relative">
                        <img
                            src={lastRaceResult?.opponentCar.image}
                            alt={lastRaceResult?.opponentCar.name}
                            className={`w-50 h-auto`}
                        />
                    </div>
                </motion.div>
            </AnimatePresence>

            <div className="flex items-center justify-center rounded-3xl">
                <div className="p-2 flex flex-col justify-center items-center">
                    <span className="text-lg text-gray-400">Машина соперника</span>
                    <span className="text-4xl text-white">
                        {lastRaceResult?.opponentCar.name}
                    </span>
                </div>
            </div>

            <button
                onClick={closeResultRace}
                className={`absolute bottom-12 left-4 p-4 w-[calc(100%-34px)] flex justify-center items-center bg-blue-500 rounded-3xl text-white text-2xl`}>
                Вернуться
            </button>

        </div>
    );
};

export default ResultRace;