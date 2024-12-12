import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface StartRaceProps {
    onClose: () => void;
    onStartRace: () => void;
}

const StartRace: React.FC<StartRaceProps> = ({ onClose, onStartRace }) => {
    const [currentStep, setCurrentStep] = useState(0); // 0 = Красный, 1 = Желтый, 2 = Зеленый

    const steps = [
        { color: 'red', text: 'На старт' },
        { color: 'yellow', text: 'Внимание' },
        { color: 'green', text: 'Гонка началась!' },
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentStep((prev) => prev + 1);
        }, currentStep === 1 ? 3000 : 2000); // 3 секунды между желтым и зеленым, 2 секунды между остальными

        if (currentStep === steps.length - 1) {
            clearInterval(interval); // Останавливаем светофор
            setTimeout(() => {
                onClose();
                onStartRace();
            }, 1000);
        }

        return () => clearInterval(interval);
    }, [currentStep, onClose, onStartRace, steps.length]);

    return (
        <motion.div
            className="relative w-full h-screen flex flex-col items-center justify-center bg-black text-white"
        >
            <motion.div
                className="w-32 h-32 rounded-full"
                style={{
                    backgroundColor: steps[currentStep]?.color,
                }}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1.2, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{
                    duration: 1,
                }}
            />

            <motion.div
                className="mt-8 flex flex-col items-center space-y-4 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{
                    duration: 0.5,
                }}
            >
                <div className="text-3xl">{steps[currentStep]?.text}</div>
            </motion.div>
        </motion.div>
    );
};

export default StartRace;
