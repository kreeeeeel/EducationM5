import React from 'react';
import {AnimatePresence, motion} from 'framer-motion';
import {FaTimesCircle, FaSmileWink, FaTachometerAlt} from 'react-icons/fa';
import {FaCar, FaCartShopping} from "react-icons/fa6";
import {TbSteeringWheel} from "react-icons/tb";
import {GiCarWheel} from "react-icons/gi";

type CarBuyProps = {
    onClose: () => void;
};

const CarBuyModal: React.FC<CarBuyProps> = ({onClose}) => {
    return (
        <AnimatePresence>
            <motion.div
                initial={{opacity: 0}}
                animate={{opacity: 1}}
                exit={{opacity: 0}}
                className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-end z-50"
            >
                <motion.div
                    initial={{y: '100vh', opacity: 0}}
                    animate={{y: 0, opacity: 1}}
                    exit={{y: '100vh', opacity: 0}}
                    transition={{type: 'spring', stiffness: 500, damping: 25}}
                    className="bg-[#1C1C36] p-6 w-full max-w-full shadow-lg relative rounded-t-3xl"
                >
                    <button
                        onClick={onClose}
                        className={`absolute top-3 right-3 text-gray-400 hover:text-white transition-colors`}
                    >
                        <FaTimesCircle className="w-6 h-6"/>
                    </button>
                    <div>
                        <div className="mt-4 flex justify-center items-center text-white text-2xl">
                            <FaCartShopping className="mr-2"/>
                            <h2 className="text-center">Поздравляем с покупкой!</h2>
                        </div>
                        <span className="flex justify-center items-center text-gray-400 text-xl">Теперь вы владелец данного авто</span>
                        <div className="flex justify-center relative items-center">
                            <div className="p-4 flex flex-col justify-center items-center">
                                <span className="text-sm text-gray-400">Мощность</span>
                                <FaTachometerAlt className="h-12 w-12 text-red-400"/>
                            </div>
                            <div className="p-4 flex flex-col justify-center items-center">
                                <span className="text-sm text-gray-400">Управл.</span>
                                <TbSteeringWheel className="h-12 w-12 text-green-400"/>
                            </div>
                            <div className="p-4 flex flex-col justify-center items-center">
                                <span className="text-sm text-gray-400">Тормоза</span>
                                <GiCarWheel className="h-12 w-12 text-blue-400"/>
                            </div>
                            <div className="p-4 flex flex-col justify-center items-center">
                                <span className="text-sm text-gray-400">Внешка</span>
                                <FaCar className="h-12 w-12 text-yellow-400"/>
                            </div>
                        </div>
                        <div className="pt-4 px-4 flex justify-center items-center w-full">
                            <span className="text-lg text-gray-300 text-center">
                                Улучшайте своё авто, учавствуйте в заездах и побеждайте!
                            </span>
                        </div>
                        <button
                            onClick={onClose}
                            className={`mt-4 w-full flex items-center justify-center bg-blue-600 text-white text-2xl font-bold py-3 px-4 rounded-3xl transition duration-300`}
                        >
                            <FaSmileWink className="mt-1 mr-2"/>
                            Приятной игры
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default CarBuyModal;