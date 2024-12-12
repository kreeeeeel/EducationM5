import React from 'react';
import { useLocation } from 'react-router-dom';
import {FaHome, FaCar, FaUserFriends, FaTasks, FaTrophy} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Footer: React.FC = () => {
    const location = useLocation();
    const navItems = [
        { icon: <FaHome />, label: 'Главная', link: '/' },
        { icon: <FaTasks />, label: 'Задания', link: '/tasks' },
        { icon: <FaCar />, label: 'Машина', link: '/ride' },
        { icon: <FaUserFriends />, label: 'Друзья', link: '/friends' },
        { icon: <FaTrophy />, label: 'Топ', link: '/top' },
    ];

    return (
        <footer className="bg-gradient-to-b from-[#1C1C36] to-[#292966] p-2 fixed bottom-0 left-0 w-full">
            <div className="flex justify-around items-center h-12">
                {navItems.map((item, index) => (
                    <div key={index} className="flex flex-col items-center text-[#D8D5EC] relative">
                        <Link to={item.link} className="flex flex-col items-center transition-all duration-200">
                            <motion.div
                                className={`text-xl flex items-center justify-center p-2 rounded-full transition-all duration-300 ${location.pathname === item.link ? 'bg-[#F5D251] text-[#292966]' : ''}`}
                                initial={{ y: 0, opacity: 1 }}
                                animate={{
                                    y: location.pathname === item.link ? -10 : 0,
                                    opacity: location.pathname === item.link ? 1 : 0.7,
                                    scale: location.pathname === item.link ? 1.2 : 1,
                                }}
                                exit={{ y: 0, opacity: 1 }}
                                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                            >
                                {item.icon}
                            </motion.div>
                            <span
                                className={`text-xs mb-2 transition-all duration-300 ${
                                    location.pathname === item.link ? 'text-[#F5D251]' : 'text-[#D8D5EC]'
                                }`}
                            >
                                {item.label}
                            </span>
                        </Link>
                    </div>
                ))}
            </div>
        </footer>
    );
};

export default Footer;