import React, { useContext, useState, useEffect, useRef } from 'react';
import { UserContext } from '../../contexts/UserContext';
import { FaCalendarAlt, FaTimesCircle, FaGasPump, FaCheckCircle, FaClock, FaPlus } from 'react-icons/fa';
import { motion } from 'framer-motion';
import ValueFormatter from '../ValueFormatter';
import {fetchRewardOfDay} from "../../api/RewardOfDayApi.tsx";
import {DailyReward} from "../../types/DailyReward.ts";
import {ErrorType} from "../../types/ErrorType.ts";

interface TaskWeekModalProps {
    onClose: () => void;
}

const TaskWeekModal: React.FC<TaskWeekModalProps> = ({ onClose }) => {
    const userContext = useContext(UserContext);
    const [currentDaily, setCurrentDaily] = useState<DailyReward | null>(null);
    const [remainingTime, setRemainingTime] = useState<number>(0);
    const [currentDailyIndex, setCurrentDailyIndex] = useState<number>(0);
    const containerRef = useRef<HTMLDivElement>(null);

    const { userInfo, setUserInfo, setError } = userContext ?? {}

    useEffect(() => {
        const data = userInfo?.dailyReward.find(it => it.isCanTake || it.isCanTakeInFuture)
        if (data && containerRef.current) {

            setCurrentDaily(data)
            setCurrentDailyIndex(data?.day)

            const dayElement = containerRef.current.children[data.day] as HTMLElement;
            if (dayElement) {
                const containerWidth = containerRef.current.clientWidth;
                const elementWidth = dayElement.clientWidth;
                const elementOffsetLeft = dayElement.offsetLeft;

                const scrollPosition = elementOffsetLeft - (containerWidth / 2) + (elementWidth / 2) - 15;
                containerRef.current.scrollTo({
                    left: scrollPosition,
                    behavior: 'smooth',
                });
            }
        }

        const calculateRemainingTime = () => {
            if (userInfo && userInfo.nextClaimAt) {
                const dateNow = new Date();
                const dateNextDay = new Date();

                dateNextDay.setDate(dateNextDay.getDate() + 1);
                dateNextDay.setHours(0, 0, 0, 0);

                const differenceInSeconds = Math.floor((dateNextDay.getTime() - dateNow.getTime()) / 1000)
                setRemainingTime(differenceInSeconds > 0 ? differenceInSeconds : 0);
            }
        };

        calculateRemainingTime();

        const interval = setInterval(() => {
            calculateRemainingTime();
        }, 1000);

        return () => clearInterval(interval);
    }, [userInfo]);

    const handleClaimDailyReward = async () => {
        if (!currentDaily || !setUserInfo || !userInfo) {
            return
        }

        try {
            const data = await fetchRewardOfDay(currentDailyIndex)
            if (!data) {
                setError?.(ErrorType.ERROR_WEEK_TASK);
                return;
            }

            const dailyReward = userInfo!.dailyReward
            dailyReward[currentDailyIndex] = data

            setUserInfo(prev => prev ? {...prev, fuel: prev.fuel + data.reward, dailyReward: dailyReward} : prev);
            setCurrentDaily(userInfo.dailyReward[currentDaily.day + 1]);
            setCurrentDailyIndex(currentDailyIndex + 1);
        } catch (err) {
            setError?.(ErrorType.ERROR_WEEK_TASK);
        }
    }

    const formatTime = (seconds: number): string => {
        const h = Math.floor(seconds / 3600); 
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60; 
        return `${h}ч ${m}м ${s}с`;
    };    

    return (
        <motion.div 
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-end z-50"
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
        >
            <motion.div
                className="bg-[#1C1C36] p-6 w-full shadow-lg relative rounded-t-3xl"
                initial={{ y: '100vh', opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: '100vh', opacity: 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 25 }}
            >
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-400 hover:text-white"
                >
                    <FaTimesCircle className="w-6 h-6" />
                </button>
    
                <div className="flex items-center">
                    <FaCalendarAlt className="text-2xl mr-2" style={{ color: 'rgb(231, 139, 230)' }} />
                    <h3 className="text-2xl text-white truncate overflow-hidden overflow-ellipsis whitespace-nowrap">
                        Ежедневная награда
                    </h3>
                </div>
    
                <div className="mt-4 overflow-x-auto hide-scrollbar flex space-x-4 p-2" ref={containerRef}>
                    {userInfo?.dailyReward.map((day) => (
                        <motion.div
                            key={day.day}
                            className={`max-w-32 flex flex-col items-center p-4 cursor-pointer rounded-2xl transition-all duration-300 
                                        ${day.day == currentDaily?.day ? 'border-2 border-green-500' : 'border-2 border-gray-700 opacity-75 pointer-events-none'}`}
                        >
                            <div className="ml-2 mr-2 flex flex-col items-center justify-center">
                                <FaGasPump className="ml-1 mt-2 text-3xl text-orange-500" />
                                <p className="mt-4 text-3xl font-semibold text-white">
                                    +
                                    <ValueFormatter value={day.reward}/>
                                </p>
                                <p className="text-xl text-gray-400">День&nbsp;{day.day + 1}</p>
                                {day.isCompleted ? (
                                    <FaCheckCircle className="ml-1 mt-2 text-xl text-green-500" />
                                ) : day.isCanTake || day.isCanTakeInFuture ? (
                                    <FaClock className="ml-1 mt-2  text-xl text-gray-500" />
                                ) : (
                                    <FaTimesCircle className="ml-1 mt-2  text-xl text-red-500" />
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
    

                <div className="mt-6 text-center">
                    <button
                        className={`w-full font-semibold py-3 px-4 rounded-3xl flex items-center justify-center 
                            ${currentDaily?.isCanTake ? 'bg-green-800 text-white' : 'bg-transparent border-2 border-green-500 text-green-500'}`}
                        onClick={handleClaimDailyReward}
                        disabled={currentDaily?.isCompleted || !currentDaily?.isCanTake}
                    >
                        {!currentDaily?.isCompleted && currentDaily?.isCanTake ? (
                            <>
                                <FaPlus className="mr-2 text-2xl text-white" />
                                <span className='text-2xl text-white'>Забрать награду</span>
                            </>
                        ) : (
                            <>
                                <FaClock className="mr-2 text-2xl text-gray-500" />
                                <span className='text-2xl text-gray-500'>{formatTime(remainingTime)}</span>
                            </>
                        )}
                    </button>
                </div>
    
            </motion.div>
        </motion.div>
    );    
};

export default TaskWeekModal;