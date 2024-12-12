import React from 'react';
import logo from './images/main_logo.png';
import oilRig from './images/oil_rig.png';
import raceImg from './images/test_race.png';
import airdropLogo from './images/airdrop-page.png'
import tonLogo from './images/ton_symbol.svg';
import friendsLogo from './images/friend_page.png';
import tasksLogo from './images/task_page.png';

import usePreloadImages from "./hooks/usePreloadImages.ts";

const Preloader: React.FC<{ loading: boolean }> = ({loading}) => {

    usePreloadImages([oilRig, raceImg, airdropLogo, tonLogo, friendsLogo, tasksLogo]);

    return (
        <div
            className="fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-[#071333] to-[#0B1428] text-white z-50">
            <img className="w-82 h-84 mb-4" src={logo} alt="App Icon"/>
            <h1 className="text-3xl font-bold">Игра M5</h1>
            <p className="text-sm text-gray-500 mb-6">Это точно последний заезд..</p>
            {loading && (
                <div className="w-64 h-4 bg-[#28284C] rounded-full overflow-hidden mb-6">
                    <div className="h-full bg-[#F5D251] animate-progress"></div>
                </div>
            )}
        </div>
    );
};

export default Preloader;