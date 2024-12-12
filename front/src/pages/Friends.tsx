import React, {useContext} from 'react';
import {UserContext} from '../contexts/UserContext';
import ValueFormatter from '../components/ValueFormatter';
import {FaGasPump, FaPlus, FaUser} from 'react-icons/fa';
import logo from '../images/friend_page.png';
import inviteFriend from '../images/invite_friend.png';
import {motion} from "framer-motion";

interface RefInfo {
    url: string;
    bonus: number;
    numberOfInvitees: number;
    users: FriendRef[];
}

interface FriendRef {
    name: string;
    photo: string;
    bonus: number;
}

const Friends: React.FC = () => {
    const refInfo = useContext(UserContext)?.userInfo?.referral as RefInfo | undefined;

    if (!refInfo) {
        return <></>;
    }

    const handleInviteFriends = () => {
        const message = `\n🚗💨 Присоединяйся ко мне в M5!\n💰 Получи бонус ${refInfo.bonus} литров бензина! ⛽️🔥`;
        window.Telegram.WebApp.openTelegramLink(
            `https://t.me/share/url?url=${encodeURIComponent(refInfo.url)}&text=${encodeURIComponent(message)}`
        );
    };

    return (
        <div
            className="flex flex-col min-h-screen bg-gradient-to-b from-[#071333] to-[#0B1428] text-white overflow-y-auto">
            <main className="flex-1 mt-16 pb-[156px] overflow-y-auto">
                <div className="text-center">
                    <div className="flex justify-center items-center">
                        <img src={logo} alt={logo}/>
                    </div>
                </div>
                <div className="text-center">
                    <div className="mb-2 flex justify-center items-center">
                        <FaUser className="mr-2 text-2xl"/>
                        <h1 className="text-2xl">Приглашенные друзья</h1>
                    </div>
                </div>

                <div className="mb-8 overflow-x-auto hide-scrollbar w-full">
                    <div className="flex space-x-4 w-max">
                        <div
                            className="ml-4 flex items-center bg-gradient-to-r from-[#1C1C36] to-[#292966] rounded-3xl p-4 cursor-pointer transition-opacity duration-300">
                            <div className="flex-shrink-0">
                                <FaGasPump className="ml-2 w-8 h-8"/>
                            </div>
                            <div className="flex items-center ml-3 text-2xl space-x-2">
                                <h3 className="text-orange-400">+500</h3>
                                <span className="text-white">Бонус за друга</span>
                            </div>
                        </div>
                        <div
                            className="flex items-center bg-gradient-to-r from-[#1C1C36] to-[#292966] rounded-3xl p-4 cursor-pointer transition-opacity duration-300">
                            <div className="flex-shrink-0">
                                <FaGasPump className="ml-2 w-8 h-8"/>
                            </div>
                            <div className="flex items-center text-2xl ml-3 space-x-2">
                                <h3 className="text-orange-400">+500</h3>
                                <span className="text-white">Друг с Премиум</span>
                            </div>
                        </div>
                    </div>
                </div>


                {refInfo.users.length > 0 && (
                    <div
                        className="ml-6 mr-6 mt-2 mb-2 p-4 py-1 bg-gradient-to-b from-[#1C1C36] to-[#292966] rounded-3xl shadow-black shadow-lg">
                        {refInfo.users.map((user: FriendRef, index) => (
                            <motion.div
                                key={user.name}
                                className={`flex items-center py-2 ${index === refInfo.users!.length - 1 ? '' : 'border-b border-gray-700'}`}
                                initial={{opacity: 0, y: 20}}
                                animate={{opacity: 1, y: 0}}
                                transition={{delay: index * 0.1}}
                            >
                                <img
                                    src={user.photo}
                                    alt={user.name}
                                    className="w-12 h-12 rounded-full object-cover mr-4"
                                />
                                <div className="flex-1">
                                    <div className="text-2xl text-white">
                                        {user.name}
                                    </div>
                                </div>

                                <div className="flex items-center text-2xl text-orange-400">
                                    +
                                    <ValueFormatter value={user.bonus}/>
                                    <FaGasPump className="mt-1 ml-1"/>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}

                {refInfo.users.length == 0 && (
                    <div className="mt-12 text-center">
                        <div className="flex justify-center items-center">
                            <img src={inviteFriend} alt={inviteFriend}/>
                        </div>
                        <h2 className="mt-4 text-2xl text-white">
                            Список пуст
                        </h2>
                        <h2 className="text-xl text-gray-400">
                            Пора кого-то пригласить
                        </h2>
                    </div>
                )}

            </main>
            <button
                onClick={handleInviteFriends}
                className="fixed bottom-20 left-4 right-4 flex items-center justify-center space-x-3 bg-yellow-600 text-white text-2xl p-4 border-yellow-600 rounded-3xl w-[calc(100%-34px)]"
            >
                <FaPlus className="mt-1 text-2xl"/>
                <span>Пригласить друзей</span>
            </button>
        </div>
    );
};

export default Friends;
