import React, {useContext, useEffect, useRef, useState} from 'react';
import { motion } from 'framer-motion';
import car from '../../images/auto.png';
import {UserContext} from "../../contexts/UserContext.tsx";

const useScreenSize = () => {
    const [size, setSize] = useState({ width: window.innerWidth, height: window.innerHeight });

    useEffect(() => {
        const handleResize = () => setSize({ width: window.innerWidth, height: window.innerHeight });
        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return size;
};

interface RaceProps {
    onClose: () => void;
    onShowResults: () => void;
}

const Race: React.FC<RaceProps> = ({ onClose, onShowResults }) => {

    const { height } = useScreenSize();
    const userContext = useContext(UserContext);
    const { photo, name } = userContext?.userInfo ?? {};
    const lastResult = userContext?.lastRaceResult;

    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const scrollSpeed = 214000;
    const raceDuration = 13;

    const [isRaceOver, setIsRaceOver] = useState(false);
    const [timeLeft, setTimeLeft] = useState(raceDuration);
    const [carsPositioned, setCarsPositioned] = useState(false);

    const startY = height * 1.2;
    const positionY = -height * 0.3;
    const yOffset = positionY * 0.25;
    const finishY = -height;

    const leftCarSpeed = lastResult?.result == "WIN" ? 1 : 2;
    const rightCarSpeed = lastResult?.result == "WIN" ? 2 : 1;

    const shouldMoveUp = timeLeft <= 2;

    useEffect(() => {
        const scrollInterval = setInterval(() => {
            if (scrollContainerRef.current != null && !shouldMoveUp) {
                scrollContainerRef.current.scrollTop += scrollSpeed;
            }
        }, 70);

        const timerInterval = setInterval(() => {
            setTimeLeft(prevTime => {
                if (prevTime <= 0) {
                    clearInterval(timerInterval);
                    setIsRaceOver(true);
                    
                    onClose();
                    onShowResults();
                    return 0;
                }
                return prevTime - 1;
            });
        }, 1000);

        const timeout = setTimeout(() => {
            clearInterval(scrollInterval);
            clearInterval(timerInterval);
            setIsRaceOver(true);
        }, raceDuration * 1000);

        return () => {
            clearInterval(scrollInterval);
            clearInterval(timerInterval);
            clearTimeout(timeout);
        };
    }, [carsPositioned, onClose, onShowResults, shouldMoveUp]);

    const leftPositions = [
        positionY,
        positionY + yOffset,
        positionY - yOffset,
        positionY + yOffset,
        positionY - yOffset,
        positionY + yOffset,
        positionY - yOffset,
        positionY + yOffset
    ];

    const rightPositions = [
        positionY,
        positionY - yOffset,
        positionY + yOffset,
        positionY - yOffset,
        positionY + yOffset,
        positionY - yOffset,
        positionY + yOffset,
        positionY + yOffset
    ]

    const getHeightScroll = (): number => {
        return 2147483647;
    };

    return (
        <div className="relative w-full h-screen overflow-hidden bg-black text-white">
            <div
                ref={scrollContainerRef}
                className="relative w-full h-screen overflow-hidden"
                style={{scrollBehavior: 'smooth'}}
            >
                <div
                    className="relative w-full"
                    style={{height: `${getHeightScroll()}px`}}
                >
                    <div
                        className="absolute top-0 left-1/2 transform -translate-x-1/2 h-full w-1"
                        style={{
                            backgroundImage: 'repeating-linear-gradient(white 0%, white 50%, transparent 50%, transparent 100%)',
                            backgroundSize: '1px 64px',
                        }}
                    />
                </div>
            </div>

            {(isRaceOver || shouldMoveUp) && (
                <motion.div
                    className="absolute top-0 left-0 w-full transform"
                    initial={{y: -32}}
                    animate={{
                        y: 0
                    }}
                    transition={{
                        duration: 0.5,
                    }}
                    style={{
                        height: '32px',
                        backgroundColor: 'white',
                    }}
                />
            )}

            {!isRaceOver && (
                <>
                    <motion.div
                        className={`absolute bottom-0 left-[15%] transform`}
                        initial={{y: startY}}
                        animate={{
                            y: carsPositioned ? ( (isRaceOver || shouldMoveUp) ? finishY : leftPositions ) : positionY,
                        }}
                        onAnimationComplete={() => {
                            if (!carsPositioned) setCarsPositioned(true);
                        }}
                        transition={{
                            duration: carsPositioned ? (shouldMoveUp ? leftCarSpeed : 15) : 2,
                            repeat: carsPositioned && !shouldMoveUp ? Infinity : 0,
                        }}
                    >
                        <div className="relative">
                            <img src={car} alt="Left Car" className="w-24"/>
                            <img
                                src={photo}
                                alt="Left User"
                                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12"
                            />
                        </div>
                    </motion.div>

                    <motion.div
                        className={`absolute bottom-0 right-[15%] transform`}
                        initial={{y: startY}}
                        animate={{
                            y: carsPositioned ? ( (isRaceOver || shouldMoveUp) ? finishY : rightPositions ) : positionY,
                        }}
                        onAnimationComplete={() => {
                            if (!carsPositioned) setCarsPositioned(true);
                        }}
                        transition={{
                            duration: carsPositioned ? (shouldMoveUp ? rightCarSpeed : 15) : 2,
                            repeat: carsPositioned && !shouldMoveUp ? Infinity : 0,
                        }}
                    >
                        <div className="relative">
                            <img src={car} alt="Right Car" className="w-24"/>
                            <img
                                src={lastResult?.opponentImage}
                                alt="Right User"
                                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12"
                            />
                        </div>
                    </motion.div>
                </>
            )}

            <div className="absolute bottom-0 w-full flex justify-between items-center px-16 py-8 text-lg font-bold">
                <span>
                    {(name?.split(" ")[0].trim().length ?? 0) < 5
                        ? `${name?.split(" ")[0].trim()}${'\u00A0'.repeat(5 - (name?.split(" ")[0].trim().length ?? 0))}`
                        : name?.split(" ")[0].trim()}
                </span>
                <span>
                    {(lastResult?.opponentName.split(" ")[0].trim().length ?? 0) < 5
                        ? `${lastResult?.opponentName.split(" ")[0].trim()}${'\u00A0'.repeat(5 - (lastResult?.opponentName.split(" ")[0].trim().length ?? 0))}`
                        : lastResult?.opponentName.split(" ")[0].trim()}
                </span>
            </div>
        </div>
    );
};

export default Race;
