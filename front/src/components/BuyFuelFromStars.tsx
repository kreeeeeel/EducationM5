import React, { useContext, useEffect, useState } from 'react';
import { FaTimesCircle, FaGasPump, FaStar, FaPlus, FaShoppingCart } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import ValueFormatter from './ValueFormatter';
import { UserContext } from '../contexts/UserContext';
import { fetchUserInfo } from '../api/UserInfoApi.tsx';
import {Trade} from "../types/Trade.ts";

type BuyFuelFromStarsModalProps = {
    onClose: () => void;
};

export const BuyFuelFromStars: React.FC<BuyFuelFromStarsModalProps> = ({ onClose }) => {
    const userContext = useContext(UserContext);
    const { trades } = userContext || { trades: [] };
    const [isReferred, setIsReferred] = useState<boolean>(false);
    
    const [selectedTrade, setSelectedTrade] = useState<Trade | null>(null);

    useEffect(() => {
        if (trades!.length > 0) {
            setSelectedTrade(trades![0]);
        }
    }, [trades]);

    const handleTradeClick = (trade: Trade) => {
        setSelectedTrade(trade);
    };

    const handleBuy = () => {
        setIsReferred(true)
        window.Telegram.WebApp.openTelegramLink(selectedTrade!.link);
    }

    const handleClose = async () => {
        onClose();

        if (isReferred) {
            const userInfo = await fetchUserInfo()
            userContext?.setUserInfo(userInfo)
        }
    }

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-end z-50"
            >
                <motion.div
                    initial={{ y: '100vh', opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }} 
                    exit={{ y: '100vh', opacity: 0 }} 
                    transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                    className="bg-[#1C1C36] p-6 w-full max-w-full shadow-lg relative rounded-t-3xl"
                >
                    <button
                        onClick={handleClose}
                        className="absolute top-3 right-3 text-gray-400 hover:text-white transition-colors"
                    >
                        <FaTimesCircle className="w-6 h-6" />
                    </button>

                    <div className="flex items-center w-full space-x-3  mb-4">
                        <div className="flex-shrink-0">
                            <FaPlus className="text-2xl text-green-400"/>
                        </div>
                        <div className="flex-1">
                            <h3 className="text-2xl text-white truncate">
                                Пополнение
                            </h3>
                            <div className="flex items-center space-x-1 text-lg text-gray-300 mt-[-8px]">
                                <span className="text-gray-400">TG Stars на топливо</span>
                            </div>
                        </div>
                    </div>


                    <div className="h-[300px] overflow-y-auto mb-4 hide-scrollbar">
                        {trades && trades.map((trade: Trade) => (
                            <div
                                key={trade.link}
                                onClick={() => handleTradeClick(trade)}
                                className={`flex items-center justify-between bg-gray-800 border-2 border-gray-400 rounded-3xl p-4 mb-2 cursor-pointer 
                                ${selectedTrade?.link === trade.link ? 'border-green-400' : 'opacity-75'}`}
                            >
                                <div className="flex items-center ml-1 font-bold">
                                    <FaGasPump className="text-yellow-400 text-2xl mt-1 ml-1" />
                                    <div className="flex items-center ml-3 text-2xl text-yellow-400">
                                        <span className="text-lg">+</span>
                                        <ValueFormatter value={trade.exchange} />
                                        <span className="text-white">&nbsp;топлива</span>
                                    </div>
                                </div>
                                <div className="flex items-center mr-2 text-2xl">
                                    <span className="text-white mr-2">
                                        <ValueFormatter value={trade.price} />
                                    </span>
                                    <FaStar className="text-yellow-400" />
                                </div>
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={handleBuy}
                        className="mt-2 w-full py-3 bg-green-800 text-white font-bold text-2xl rounded-3xl hover:bg-green-400 transition-colors duration-300 flex items-center justify-center space-x-2"
                    >
                        <FaShoppingCart className="w-6 h-6" />
                        <span>Перейти к оплате</span>
                    </button>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default BuyFuelFromStars;
