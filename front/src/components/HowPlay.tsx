import React from 'react';
import { FaTimesCircle, FaQuestionCircle, FaGasPump, FaFlagCheckered, FaTrophy, FaThumbsUp } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

type HowPlayModalProps = {
    onClose: () => void;
};

export const HowPlay: React.FC<HowPlayModalProps> = ({onClose}) => {
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
                        onClick={onClose}
                        className="absolute top-3 right-3 text-gray-400 hover:text-white transition-colors"
                    >
                        <FaTimesCircle className="w-6 h-6" />
                    </button>

                    <div className="flex items-center space-x-4">
                        <FaQuestionCircle className="w-6 h-6" />
                        <h3 className="text-lg font-semibold text-white truncate overflow-hidden overflow-ellipsis whitespace-nowrap">
                            Как играть?
                        </h3>
                    </div>

                    <div className="mt-4 text-gray-300 text-base">
                        <p className="mb-4">
                            Приветствуем вас! Это уникальный бот, который был разработан для хакатона <strong>М5</strong>.
                        </p>
                        <p className="mb-4">
                            Здесь вы можете прокачивать свой бизнес, улучшая свой доход <span className="text-yellow-400">Топлива</span> <FaGasPump className="inline-block text-yellow-400" />, участвовать в гонках <FaFlagCheckered className="inline-block text-white" />, прокачивать свой автомобиль, увеличивать свой <span className="text-green-500">Рейтинг гонщика</span> <FaTrophy className="inline-block text-green-500" /> и покорять таблицу лидеров!
                        </p>
                        <p className="mb-4">
                            Приглашайте друзей и получайте различные бонусы!
                        </p>
                        <p>
                            Приятной игры!
                        </p>
                    </div>

                    <button
                        onClick={onClose}
                        className="mt-2 w-full py-3 bg-yellow-600 text-white font-bold text-lg rounded-xl hover:bg-yellow-500 transition-colors duration-300 flex items-center justify-center space-x-2"
                    >
                        <FaThumbsUp className="w-6 h-6" />
                        <span>Спасибо!</span>
                    </button>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );    
};

export default HowPlay;