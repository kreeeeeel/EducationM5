import React, {useContext} from 'react';
import {UserContext} from '../contexts/UserContext';
import {FaTrophy} from "react-icons/fa";
import {motion} from "framer-motion";
import logo from "../images/top.png";

const Top: React.FC = () => {
    const userContext = useContext(UserContext);

    if (!userContext) {
        return null;
    }

    const {topRacers} = userContext;

    return <div className="flex flex-col min-h-screen bg-gradient-to-b from-[#071333] to-[#0B1428] text-white">
        <main className="flex-1 p-4 pt-20 pb-20">
            <div className="text-center text-white">
                <div className="mt-4 flex justify-center items-center">
                    <img
                        src={logo}
                        alt={logo}
                    />
                </div>

                <div className="mt-4 flex justify-center items-center">
                    <FaTrophy className="mr-2 text-2xl"/>
                    <h1 className="text-2xl font-bold">Рейтинг лучших</h1>
                </div>
                <h1 className="text-sm text-gray-500 font-bold">Обновляется каждый день в 00:00</h1>
            </div>
            <div
                className="mt-2 mb-2 p-6 py-1 bg-gradient-to-b from-[#1C1C36] to-[#292966] rounded-3xl shadow-black shadow-lg">
                {topRacers!.map((racer, index) => (
                    <motion.div
                        key={racer.id}
                        className={`flex items-center py-2 ${index === topRacers!.length - 1 ? '' : 'border-b border-gray-700'}`}
                        initial={{opacity: 0, y: 20}}
                        animate={{opacity: 1, y: 0}}
                        transition={{delay: index * 0.1}}
                    >
                        <div className="text-2xl font-bold w-12 text-yellow-400">
                            {index + 1}
                        </div>
                        <img
                            src={racer.image}
                            alt={racer.name}
                            className="w-10 h-10 rounded-full object-cover mr-4"
                        />
                        <div className="flex-1">
                            <div className="text-lg font-medium text-white">
                                {racer.name}
                            </div>
                            <div className="text-sm text-gray-400">
                                {racer.car.name}
                            </div>
                        </div>
                        <div className="flex items-center text-lg font-mono text-green-400">
                            <FaTrophy className="mr-1"/>
                            {racer.rating}
                        </div>
                    </motion.div>
                ))}
            </div>
        </main>
    </div>
};

export default Top;
