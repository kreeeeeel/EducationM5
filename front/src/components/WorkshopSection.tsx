// src/components/WorkshopSection.tsx

import React, { useContext } from 'react';
import { FaGasPump, FaTools, FaOilCan, FaCar, FaFlagCheckered, FaLock } from 'react-icons/fa'; // Иконка для отображения стоимости
import { UserContext } from '../contexts/UserContext';
import { Business, BusinessType } from '../types/Business';
import { fetchUpdateBusiness } from '../api/UpdateBusinessApi.tsx'; // Импорт функции upgradeBusiness
import ValueFormatter from './ValueFormatter';
import {ErrorType} from "../types/ErrorType.ts";

interface WorkshopSectionProps {
    onShowBuyFuel: () => void;
}

const WorkshopSection: React.FC<WorkshopSectionProps> = ({onShowBuyFuel}) => {
    const userContext = useContext(UserContext);
    const { businesses, setBusinesses, userInfo, setUserInfo, setError } = userContext!;

    const handleUpgrade = async (business: Business) => {
        if (!userInfo) {
            setError(ErrorType.ERROR_CLAIM);
            return;
        }

        if (userInfo.fuel < business.upgradeCost) {
            onShowBuyFuel();
            return;
        }

        try {
            const result = await fetchUpdateBusiness(business.id);
            
            if (!result) {
                setError(ErrorType.ERROR_CLAIM);
                return;
            }
            
            const { id, newLevel, newCost, businessPassiveIncome, newPassiveIncome } = result;
            const updatedBusinesses = businesses?.map(b => {
                if (b.id === id) {
                    return {
                        ...b,
                        level: newLevel,
                        upgradeCost: newCost,
                        passiveIncome: b.passiveIncome + businessPassiveIncome,
                        isOwned: true,
                    };
                }
                return b;
            }) || [];
            setBusinesses(updatedBusinesses);
            
            setUserInfo(prev => prev ? {
                ...prev,
                passiveIncome: newPassiveIncome,
                fuel: (prev.fuel + (result.exp.bonus ?? 0)) - business.upgradeCost,
                exp: result.exp.newExp,
                level: result.exp.newLevel ?? userInfo.level,
            } : prev);
        } catch (error) {
            setError(ErrorType.ERROR_CLAIM);
        }
    };

    if (!businesses) {
        return <div className="text-center text-white">Загрузка бизнесов...</div>;
    }

    const renderBusinessIcon = (type: BusinessType) => {
        switch (type) {
            case 'CLAIM_TIME':
                return <FaOilCan className="text-white text-sm mr-2 mb-0.5" /> 
            case 'DISCOUNT_UPGRADE_CAR':
                return <FaTools  className="text-white text-sm mr-2 mb-0.5" />
            case 'RACING_TIME':
                return <FaFlagCheckered className="text-white text-sm mr-2 mb-0.5" />
            default:
                return <FaCar className="text-white text-sm mr-2 mb-0.5" />
        }
    }

    return (
        <section className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {businesses.map((business) => {
                const canAfford = (userInfo?.fuel ?? 0) >= business.upgradeCost;
                const requiredLevelMet = (userInfo?.level ?? 1) >= business.requiredLevel;
    
                return (
                    <div
                        key={business.id}
                        className={`relative bg-gradient-to-b from-[#1C1C36] to-[#292966] rounded-3xl p-6 shadow-lg flex flex-col justify-between transition-transform`}
                        style={{
                            backgroundImage: `linear-gradient(rgba(28, 28, 54, 0.85), rgba(41, 41, 102, 0.85)), url(${business.image})`,
                            backgroundPosition: 'center right',
                            backgroundRepeat: 'no-repeat',
                            backgroundSize: 'auto 100%',
                        }}
                    >
                        
                        <div className={!requiredLevelMet ? ('blur-md') : ''}>
                            <div className="flex items-center mb-1">
                                {renderBusinessIcon(business.type)}
                                <div className="flex flex-1 items-center ml-2">
                                    <h3 className="text-lg font-bold font-mono text-white">{business.name}</h3>
                                    <span className="ml-4 bg-gray-500 text-xs font-bold px-2 py-1 rounded-full">
                                        Ур. {business.level}
                                    </span>
                                </div>
                            </div>

                            <p className="text-sm text-gray-300 mb-2">
                                {business.description}
                            </p>

                            <div className="flex justify-between items-center">
                                <div className="flex items-center">
                                    <FaGasPump className="text-yellow-400 mr-2 text-xs" />
                                    <span className="text-sm font-mono text-white">
                                        <span className="font-bold text-yellow-400">
                                            <ValueFormatter value={business.passiveIncome} />
                                        </span>
                                        &nbsp;в минуту.
                                    </span>
                                </div>

                                {requiredLevelMet && (
                                    <button
                                        onClick={() => handleUpgrade(business)}
                                        disabled={business.level >= business.maxLevel}
                                        className={`${
                                            business.level >= business.maxLevel
                                                ? 'bg-gray-500 cursor-not-allowed'
                                                : canAfford
                                                ? 'bg-green-500 hover:bg-green-600'
                                                : 'bg-red-500 cursor-not-allowed'
                                        } text-white font-bold py-2 px-4 rounded-full text-base transition-transform duration-300 flex items-center justify-center`}
                                    >
                                        {business.level >= business.maxLevel ? ('MAX') : (
                                            <>
                                                <ValueFormatter value={business.upgradeCost} />
                                                <FaGasPump className="w-4 h-4 ml-1" />
                                            </>
                                        )}
                                    </button>
                                )}
                            </div>
                        </div>

                        {!requiredLevelMet && (
                            <div className="absolute inset-0 flex items-center justify-center flex-col">
                                <FaLock className="text-white text-3xl" />
                                <p className="text-white text-lg mt-4">
                                    Требуется <span className="text-orange-500 font-bold">{business.requiredLevel}</span> уровень игрока
                                </p>
                            </div>
                        )}
                    </div>
                );
            })}
        </section>
    );    
};

export default WorkshopSection;
