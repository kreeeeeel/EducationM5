import {
    FaTimesCircle,
    FaCheckCircle,
    FaArrowUp,
    FaTelegramPlane,
    FaFlag,
    FaUsers, FaBullhorn, FaCar, FaBusinessTime
} from 'react-icons/fa';
import {motion, AnimatePresence} from 'framer-motion';
import {MissionType, Task} from '../../types/Task';
import tonLogo from "../../images/ton_symbol.svg";
import {useTonConnectUI} from "@tonconnect/ui-react";
import {fetchTransaction} from '../../api/TransactionApi.tsx';
import React, {useContext, useState} from "react";
import {UserContext} from "../../contexts/UserContext.tsx";
import {BiSolidCarMechanic} from "react-icons/bi";

type TaskModalProps = {
    selectedTask: Task | null;
    onClose: () => void;
    onCheck: () => void;
    isChecking: boolean;
};

const TaskModal: React.FC<TaskModalProps> = ({
                                                 selectedTask,
                                                 onClose,
                                                 onCheck,
                                                 isChecking,
                                             }) => {
    const [tonConnectUI] = useTonConnectUI();
    const userContext = useContext(UserContext);
    const [isCheckingLocal, setIsCheckingLocal] = useState(isChecking);

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

    const connectAction = async () => {
        await tonConnectUI.openModal();
        onCheck();
        onClose();
    };

    const checkTask = () => {
        onCheck();
        onClose();
    }

    const sendTransaction = async () => {
        try {
            if (!selectedTask?.details) {
                throw new Error('Нет деталей задачи');
            }

            const {address: recipientAddress, amount: amount} = selectedTask.details;
            const taskId = selectedTask.id;

            // Проверяем, что адрес получателя указан
            if (!recipientAddress) {
                throw new Error('Адрес получателя не указан');
            }

            // Получаем адрес пользователя
            const userAddress = tonConnectUI.account?.address;
            if (!userAddress) {
                await tonConnectUI.openModal();
            }

            setIsCheckingLocal(true);

            // Создаем транзакцию
            const transaction = {
                validUntil: Math.floor(Date.now() / 1000) + 300, // Время жизни транзакции (5 минут)
                messages: [
                    {
                        address: recipientAddress, // Адрес получателя
                        amount: amount, // Сумма в нанотонах
                    },
                ],
            };

            // Отправляем транзакцию
            const response = await tonConnectUI.sendTransaction(transaction);

            console.log('Транзакция отправлена:', response);

            // Отправляем данные на бэкенд для проверки
            const backResponse = await fetchTransaction(response.boc, taskId);

            if (backResponse && backResponse.success) {
                userContext?.setTasks((prevTasks) =>
                    prevTasks!.map((task) =>
                        task.id === selectedTask.id ? {...task, isCompleted: true} : task
                    )
                );

                userContext?.setUserInfo((prev) =>
                    prev
                        ? {
                            ...prev,
                            fuel: prev.fuel + (backResponse?.reward ?? 0),
                        }
                        : prev
                );
            }

            onCheck();
            onClose();
        } catch (error) {
            console.error('Ошибка при отправке транзакции:', error);
        } finally {
            setIsCheckingLocal(false);
        }
    };

    if (!selectedTask) {
        return <></>
    }

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
                    className="bg-[#1C1C36] rounded-t-3xl p-6 w-full max-w-full relative"
                >
                    <button
                        onClick={onClose}
                        className={`absolute top-3 right-3 text-gray-400 hover:text-white transition-colors
                        ${isCheckingLocal && selectedTask.type === 'WALLET_TRANSACTION' ? 'opacity-50' : ''}`}
                        disabled={isCheckingLocal && selectedTask.type === 'WALLET_TRANSACTION'}
                    >
                        <FaTimesCircle className="w-6 h-6"/>
                    </button>
                    <div className="space-y-4">
                        <div className="flex flex-col items-center space-y-2">
                            {renderPlatformIcon(selectedTask.type)}
                            <h2 className="text-3xl font-bold text-center">{selectedTask.title}</h2>
                            {selectedTask.isCompleted && (
                                <FaCheckCircle className="text-green-500 w-6 h-6"/>
                            )}
                        </div>
                        <p className="text-lg text-gray-300 text-center">{selectedTask.description}</p>
                        <div className="space-y-4">
                            {selectedTask.type.startsWith('SUBSCRIBE') && (
                                <a
                                    href={selectedTask.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full flex items-center justify-center bg-purple-600 text-white font-bold py-3 px-4 text-2xl rounded-3xl transition duration-300"
                                >
                                    Перейти
                                </a>
                            )}
                            {selectedTask.type === 'CONNECT_WALLET' && (
                                <button
                                    onClick={connectAction}
                                    className={`w-full flex items-center justify-center bg-blue-500 text-white font-bold py-3 px-4 text-2xl rounded-3xl transition duration-300 shadow-lg hover:shadow-xl ${isCheckingLocal ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    disabled={isCheckingLocal}
                                >
                                    <img src={tonLogo} className="w-8 h-8 mt-1" alt="TON Logo"/>
                                    &nbsp; Подключить TG WALLET
                                </button>
                            )}
                            {selectedTask.type === 'WALLET_TRANSACTION' && (
                                <button
                                    onClick={sendTransaction}
                                    className={`w-full flex items-center justify-center bg-blue-500 text-white font-bold py-3 px-4 text-2xl rounded-3xl transition duration-300 shadow-lg hover:shadow-xl ${isCheckingLocal ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    disabled={isCheckingLocal}
                                >
                                    <img src={tonLogo} className="w-8 h-8 mt-1" alt="TON Logo"/>
                                    &nbsp; {isCheckingLocal ? 'Проверяем..' : 'Отправить'}
                                </button>
                            )}
                            {selectedTask.type.indexOf('WALLET') == -1 && (
                                <button
                                    onClick={checkTask}
                                    className={`w-full flex items-center justify-center space-x-2 bg-green-600 text-white font-bold py-3 px-4 text-2xl rounded-3xl transition duration-300
                                        ${isCheckingLocal || selectedTask.isCompleted ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    disabled={isCheckingLocal || selectedTask.isCompleted}
                                >
                                    {isCheckingLocal ? (
                                        <span>Проверка...</span>
                                    ) : (
                                        <>
                                            <FaArrowUp className="w-5 h-5 mt-1"/>
                                            <span>Проверить</span>
                                        </>
                                    )}
                                </button>
                            )}
                            <button
                                onClick={onClose}
                                className={`w-full flex items-center justify-center bg-red-600 text-white py-3 px-4 text-2xl rounded-3xl transition duration-300
                                 ${isCheckingLocal && selectedTask.type === 'WALLET_TRANSACTION' ? 'opacity-50' : ''}`}
                                disabled={isCheckingLocal && selectedTask.type === 'WALLET_TRANSACTION'}
                            >
                                Закрыть
                            </button>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default TaskModal;
