import React, {useContext} from 'react';
import {Task, MissionType} from '../../types/Task';
import {motion} from 'framer-motion';
import {
    FaTelegramPlane,
    FaGasPump,
    FaCheckCircle,
    FaFlag,
    FaUsers,
    FaBullhorn,
    FaCar, FaBusinessTime
} from 'react-icons/fa';
import tonLogo from '../../images/ton_symbol.svg';
import {UserContext} from '../../contexts/UserContext.tsx';
import ValueFormatter from '../ValueFormatter.tsx';
import {BiSolidCarMechanic} from "react-icons/bi";

type TaskCardProps = {
    task: Task;
    onClick: () => void;
};

const TaskCard: React.FC<TaskCardProps> = ({task, onClick}) => {
    const userContext = useContext(UserContext);
    const isWalletConnected = userContext?.userInfo?.details?.walletAddress != null;

    const isCompleted =
        task.isCompleted || (task.type === 'CONNECT_WALLET' && isWalletConnected);

    const renderPlatformIcon = (type: MissionType) => {
        switch (type) {
            case 'SUBSCRIBE_TG':
                return <FaTelegramPlane className="text-blue-500 text-4xl"/>;
            case 'RACE_VICTORIES':
                return <FaFlag className="text-green-500 text-4xl"/>;
            case 'WALLET_TRANSACTION':
                return <img src={tonLogo} className="text-green-500 w-9 h-9" alt={tonLogo}/>;
            case 'CONNECT_WALLET':
                return <img src={tonLogo} className="text-green-500 w-9 h-9" alt={tonLogo}/>;
            case 'INVITE_FRIENDS':
                return <FaUsers className="text-purple-500 text-4xl"/>;
            case 'ADVERTISING_VIEWED':
                return <FaBullhorn className="text-orange-600 text-4xl"/>;
            case 'NUMBER_OF_RACES':
                return <FaCar className="text-sky-400 text-4xl"/>;
            case 'UPGRADE_CAR':
                return <BiSolidCarMechanic className="text-sky-400 text-4xl"/>
            case 'UPGRADE_BUSINESS':
                return <FaBusinessTime className="text-red-400 text-4xl"/>
            default:
                return <FaCheckCircle className="text-gray-400 text-4xl"/>;
        }
    };

    return (
        <motion.div
            onClick={() => !isCompleted && onClick()}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            key={task.type}
            className={`bg-gradient-to-r from-[#1C1C36] to-[#292966] rounded-3xl p-3 shadow-lg cursor-pointer transition-opacity duration-300
                ${isCompleted ? 'opacity-50 cursor-not-allowed' : 'opacity-100'}
            `}
        >
            <div className={isCompleted ? 'opacity-50' : ''}>
                <div className="flex items-center w-full space-x-3">
                    <div className="flex-shrink-0">{renderPlatformIcon(task.type)}</div>
                    <div className="flex-1">
                        <h3 className="text-lg text-white truncate">
                            {task.title}
                        </h3>
                        <div className="flex items-center space-x-1 text-sm text-gray-300">
                            Награда:&nbsp;
                            <span className="text-sm text-yellow-400">+
                                <ValueFormatter value={task.reward}/>
                            </span>
                            <FaGasPump className="w-4 h-4 text-yellow-400" />
                        </div>
                    </div>
                    {isCompleted && (
                        <div className="flex items-center justify-end flex-1">
                            <FaCheckCircle className="text-green-400 text-lg" />
                        </div>
                    )}
                </div>
            </div>
        </motion.div>

    );
};

export default TaskCard;