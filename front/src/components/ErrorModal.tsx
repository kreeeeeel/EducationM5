import React, {useContext} from 'react';
import {AnimatePresence, motion} from 'framer-motion';
import {FaTimesCircle} from 'react-icons/fa';
import {ErrorType} from "../types/ErrorType.ts";
import {UserContext} from "../contexts/UserContext.tsx";
import {MdError} from "react-icons/md";

const ErrorModal: React.FC = () => {
    const userContext = useContext(UserContext);

    const onClose = () => {
        userContext?.setError(null);
    }

    const getDescriptionError = () => {
        if (userContext?.error === null) {
            return "Ошибка: тип ошибки не определён.";
        }

        switch (userContext?.error) {
            case ErrorType.SERVER_NOT_RESPONDING:
                return "Сервер не отвечает. Пожалуйста, проверьте подключение к интернету или попробуйте позже.";
            case ErrorType.ERROR_CAR_BUY:
                return "Не удалось завершить покупку автомобиля. Попробуйте ещё раз.";
            case ErrorType.ERROR_CAR_UPDATE:
                return "Ошибка при обновлении автомобиля. Пожалуйста, попробуйте позже.";
            case ErrorType.ERROR_RACE:
                return "Не удалось начать поиск соперника. Пожалуйста, попробуйте позднее.";
            case ErrorType.ERROR_WEEK_TASK:
                return "Ошибка при обновлении списка недельных задач. Попробуйте обновить страницу.";
            case ErrorType.ERROR_CLAIM:
                return "Не удалось собрать награду. Пожалуйста, попробуйте позже.";
            default:
                return "Произошла неизвестная ошибка, пожалуйста попробуйте обновить страницу.";
        }
    };

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
                        <div className="mt-8 flex flex-col justify-center items-center text-white text-3xl">
                            <MdError className="text-red-500 text-5xl"/>
                            <h2 className="mt-2 text-center">Произошла ошибка!</h2>
                            <span className="mt-8 mb-8 text-gray-400 text-xl text-center">{getDescriptionError()}</span>
                        </div>
                        <button
                            onClick={onClose}
                            className={`mt-4 w-full flex items-center justify-center bg-blue-600 text-white text-2xl font-bold py-3 px-4 rounded-3xl transition duration-300`}
                        >
                            Закрыть
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default ErrorModal;