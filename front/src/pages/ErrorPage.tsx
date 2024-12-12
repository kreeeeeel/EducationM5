import React from 'react';
import logo from '../images/main_logo.png'; // Убедитесь, что путь к логотипу правильный

const ErrorPage: React.FC = () => {
    return (
        <div className="fixed inset-0 flex flex-col items-center justify-center text-center bg-gradient-to-b from-[#071333] to-[#0B1428] text-white z-50">
            <img className="w-82 h-84 mb-4" src={logo} alt="App Icon"/>
            <h1 className="text-3xl font-bold">Игра M5</h1>
            <p className="text-sm text-gray-500 mb-6">Это точно последний заезд..</p>

            <h1 className="text-2xl text-gray-400 font-bold">В данный момент сервер не доступен..</h1>
        </div>
    );
};

export default ErrorPage;