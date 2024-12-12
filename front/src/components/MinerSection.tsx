import React, { useState, useEffect, useContext } from 'react';
import { FaArrowUp, FaGasPump, FaStopwatch, FaQuestionCircle } from 'react-icons/fa';
import { MdPlayCircleFilled } from 'react-icons/md';
import { useAdsgram } from '../hooks/useAdsgram';
import { UserContext } from '../contexts/UserContext';
import ValueFormatter from './ValueFormatter';
import { ShowPromiseResult } from '../types/Adsgram';
import logo from '../images/oil_rig.png'
import {fetchClaimReward} from "../api/ClaimRewardApi.tsx";
import {ErrorType} from "../types/ErrorType.ts";

type MinerSectionProps = {
    onOpenHowPlay: () => void;
};

const MinerSection: React.FC<MinerSectionProps> = ({ onOpenHowPlay }) => {
    const userContext = useContext(UserContext);
    const [remainingTime, setRemainingTime] = useState<number>(0);
    const [isCollecting, setIsCollecting] = useState(false);

    if (!userContext) {
        return null;
    }

    const { userInfo, setUserInfo, setError } = userContext;

    const onReward = () => {
        console.log('Пользователь получил вознаграждение');
        setUserInfo((prev) =>
            prev
                ? {
                    ...prev,
                    nextClaimAt: Math.floor(Date.now() / 1000),
                    details: {
                        ...prev.details,
                        adsEntry: (prev.details.adsEntry ?? 0) - 1
                    }
                }
                : prev
        );
    };

    const onError = (result: ShowPromiseResult) => {
        console.error('Ошибка при показе рекламы:', result.description);
    };

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const showAd = useAdsgram({
        blockId: '5081',
        onReward,
        onError,
    });

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
        const calculateRemainingTime = () => {
            if (userInfo && userInfo.nextClaimAt) {
                const now = Math.floor(Date.now() / 1000); // Текущее время в секундах
                const nextClaimTime = userInfo.nextClaimAt;
                const diff = nextClaimTime - now;
                setRemainingTime(diff > 0 ? diff : 0);
            }
        };

        calculateRemainingTime(); // Вызываем сразу

        const interval = setInterval(() => {
            calculateRemainingTime();
        }, 1000); // Обновляем каждую секунду

        return () => clearInterval(interval); // Очищаем интервал при размонтировании
    }, [userInfo]);

    const handleCollectClick = async () => {
        if (remainingTime > 0) return; // Если время ещё не наступило, ничего не делаем

        setIsCollecting(true);
        try {
            const rewardData = await fetchClaimReward(); // Собираем награду
            if (!userInfo || !rewardData) {
                setError(ErrorType.ERROR_CLAIM);
                return;
            }

            setUserInfo({
                ...userInfo,
                fuel: rewardData.currentFuel,
                nextClaimAt: rewardData.dateNextClaim,
                exp: rewardData.exp.newExp,
                level: rewardData.exp.newLevel ?? userInfo.level,
            });
        } catch (error) {
            setError(ErrorType.ERROR_CLAIM);
        } finally {
            setIsCollecting(false);
        }
    };

    const formatTime = (seconds: number): string => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}м ${s}с`;
    };

    return (
        <section
            className="relative w-screen -mx-4 flex space-x-4 mb-4"
            style={{
                backgroundImage: `url(${logo})`,
                backgroundPosition: 'center left calc(100% - 24px)',
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'auto 100%',
            }}

        >
            <div className="w-1/2 bg-transparent mt-8 mb-16 flex flex-col items-center text-center justify-between">
                <div className="w-full bg-[#1E1E3B] rounded-tr-[24px] flex flex-col items-start text-left ml-0 p-4 mr-8">
                    <h2 className="font-mono font-bold text-xl ml-4 text-white">Ваш майнер</h2>
                    <p className="font-mono font-bold text-4xl flex items-center justify-center w-full text-white">
                        <ValueFormatter value={userInfo?.passiveIncome || 0} />
                        <FaGasPump className="w-5 h-5 text-white ml-4 mt-2" />
                    </p>
                </div>

                {remainingTime > 0 || isCollecting ? (
                    <div className="flex w-full bg-[#3E3E6B] rounded-br-[24px] mr-8 overflow-hidden">
                        <div
                            className={`flex-1 flex items-center justify-center py-3 font-mono font-bold text-lg text-white transition-opacity duration-300 opacity-50`}
                        >
                            <FaStopwatch className="text-white mr-2" />
                            <span>{formatTime(remainingTime)}</span>
                        </div>
                        {(userInfo?.details?.adsEntry ?? 0) > 0 ? (
                            <button
                                onClick={showAd}
                                className={`flex items-center justify-center bg-yellow-600 px-4 py-3 font-mono font-bold text-lg text-white transition-opacity duration-300 opacity-100`}
                            >
                                <MdPlayCircleFilled />
                            </button>
                        ) : null}
                    </div>
                ) : (
                    <button
                        onClick={handleCollectClick}
                        className={`w-full flex items-center justify-center bg-[#3E3E6B] border-none rounded-br-[24px] py-3 font-mono font-bold text-lg text-white transition-opacity duration-300 mr-8 ${remainingTime > 0 || isCollecting
                            ? 'opacity-50 cursor-not-allowed'
                            : 'opacity-100 hover:bg-[#4F4F7A]'
                            }`}
                    >
                        <FaArrowUp className="text-white mr-2" />
                        <span>ЗАБРАТЬ</span>
                    </button>
                )}

                <button
                    onClick={onOpenHowPlay}
                    className="absolute bottom-[-24px] left-4 flex items-center justify-center space-x-3 bg-yellow-600 text-white text-lg font-bold px-4 py-2 border-2 border-yellow-600 rounded-xl animate-scale-up-down w-[calc(100%-38px)]"
                >
                    <FaQuestionCircle className="text-2xl" />
                    <span>Как играть?</span>
                </button>
            </div>
        </section>
        
    );
};

export default MinerSection;
