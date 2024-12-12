import React, {useContext} from 'react';
import {FaGasPump, FaPlus} from 'react-icons/fa';
import {UserContext} from '../contexts/UserContext';
import ValueFormatter from './ValueFormatter';

interface HeaderProps {
    onShow: () => void;
}

const Header: React.FC<HeaderProps> = ({onShow}) => {
    const userContext = useContext(UserContext);
    const {photo, name, exp, level, fuel} = userContext?.userInfo ?? {};
    const progressPercentage = exp && level ? (exp / (level * 100)) * 100 : 0;

    return (
        <header
            className="fixed top-0 left-0 w-full flex justify-between items-center p-4 bg-gradient-to-r from-[#0B1428] to-[#1C1C36] text-white z-50 h-16">
            <div className="flex items-center">
                <img
                    className="w-12 h-12 rounded-full"
                    src={photo}
                    alt="Avatar"
                />
                <div className="ml-3">
                    <div className="flex items-center">
                        <div className="text-lg font-bold mr-2">{name}</div>
                        <div
                            className="text-xs font-bold px-2 py-1 rounded-full bg-gradient-to-r from-[#0FF1CE] to-[#00A5E0] text-white">
                            Ур. {level}
                        </div>
                    </div>
                    <div className="w-full h-1 bg-gray-600 rounded-full mt-1">
                        <div
                            className="h-1 rounded-full"
                            style={{
                                width: `${progressPercentage}%`,
                                background: 'linear-gradient(to right, #0FF1CE, #00A5E0)',
                            }}
                        ></div>
                    </div>
                </div>
            </div>
            <div className="flex items-center space-x-6">
                <div
                    onClick={onShow}
                    className={`flex items-center`}
                >
                    <FaPlus className="mt-1 w-4 h-4 text-green-400"/>
                    <span className="ml-1 text-2xl font-bold">
                        <ValueFormatter value={fuel}/>
                      </span>
                    <FaGasPump className="mt-1 ml-1 w-5 h-5 text-white"/>
                </div>
            </div>
        </header>
    );
};

export default Header;