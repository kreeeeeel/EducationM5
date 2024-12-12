import React from 'react';
import { FaCalendarAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';

interface TaskWeekCardProps {
    onClick: () => void;
    onClose: () => void;
}

const TaskWeekCard: React.FC<TaskWeekCardProps> = ({ onClick }) => {
    return (
        <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-[#1C1C36] to-[#292966] rounded-3xl p-3 shadow-3xl cursor-pointer flex flex-col items-start transition-opacity duration-300"
            onClick={onClick}
        >
            <div className="flex items-center w-full space-x-3">
                <div className="flex-shrink-0">
                    <FaCalendarAlt className="text-4xl" style={{ color: 'rgb(231, 139, 230)' }} />
                </div>
                <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white truncate overflow-hidden overflow-ellipsis whitespace-nowrap">
                        Ежедневная награда
                    </h3>
                    <div className="flex items-center text-sm text-gray-400">
                        Каждый день - разные бонусы!
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default TaskWeekCard;