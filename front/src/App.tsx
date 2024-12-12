import React, {useContext, useState} from 'react';
import {BrowserRouter as Router, Route, Routes, useLocation} from 'react-router-dom';
import {AnimatePresence, motion} from 'framer-motion';
import Main from './pages/Main';
import Car from './pages/Car.tsx';
import Friends from './pages/Friends';
import {UserContext} from './contexts/UserContext';
import Tasks from './pages/Tasks';
import Top from './pages/Top.tsx';
import Footer from './components/Footer';
import Header from './components/Header';
import ErrorPage from './pages/ErrorPage';
import BuyFuelFromStars from './components/BuyFuelFromStars';
import {TonConnectUIProvider} from "@tonconnect/ui-react";
import {publicUrl} from './helpers/publicUrl.ts';
import {TonProof} from "./components/task/TonProof.tsx";
import ScrollToTop from './components/ScrollToTop.tsx';
import Race from "./components/race/Race.tsx";
import StartRace from "./components/race/StartRace.tsx";
import ResultRace from "./components/race/ResultRace.tsx";
import {ErrorType} from "./types/ErrorType.ts";
import ErrorModal from "./components/ErrorModal.tsx";

enum ModalType {
    BUY_FUEL = 'BUY_FUEL',
    START_RACE = 'START_RACE',
    RACE = 'RACE',
    RESULT_RACE = 'RESULT_RACE',
}

interface AnimatedProps {
    onShowBuyFuel: () => void;
    onShowStartRace: () => void;
}

const AnimatedRoutes: React.FC<AnimatedProps> = ({onShowBuyFuel, onShowStartRace}) => {
    const location = useLocation();

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={location.pathname}
                initial={{opacity: 0}}
                animate={{opacity: 1}}
                exit={{opacity: 0}}
                transition={{duration: 0.4}}
            >
                <Routes location={location}>
                    <Route path="/" element={<Main onShowBuyFuel={onShowBuyFuel}/>}/>
                    <Route path="/tasks" element={<Tasks/>}/>
                    <Route path="/ride" element={<Car onShowBuyFuel={onShowBuyFuel} onStartRace={onShowStartRace}/>}/>
                    <Route path="/friends" element={<Friends/>}/>
                    <Route path="/top" element={<Top/>}/>
                </Routes>
            </motion.div>
        </AnimatePresence>
    );
}

const AppContent: React.FC = () => {
    const userContext = useContext(UserContext);
    const [showModalBuyFuel, setShowModalBuyFuel] = useState(false);
    const [isStartRace, setStatusStartRace] = useState(false);
    const [isRace, setStatusRace] = useState(false);
    const [isResultRace, setStatusResultRace] = useState(false);

    const handleModal = (type: ModalType, action: 'open' | 'close') => {
        if (action === 'open') {
            document.body.style.overflow = 'hidden';
            if (navigator.vibrate) {
                navigator.vibrate(100);
            }
        } else {
            document.body.style.overflowX = 'hidden';
            document.body.style.overflowY = 'auto';
        }

        switch (type) {
            case ModalType.BUY_FUEL:
                setShowModalBuyFuel(action === 'open');
                break;
            case ModalType.START_RACE:
                setStatusStartRace(action === 'open');
                break;
            case ModalType.RACE:
                setStatusRace(action === 'open');
                break;
            case ModalType.RESULT_RACE:
                setStatusResultRace(action === 'open');
                break;
            default:
                throw new Error(`Unknown modal type: ${type}`);
        }
    };

    document.body.style.overflowY = 'auto';
    return (
        userContext?.error == ErrorType.SERVER_NOT_RESPONDING ? (
            <ErrorPage/>
        ) : (
            isResultRace ? (
                    <ResultRace onClose={() => handleModal(ModalType.RESULT_RACE, "close")}/>
                ) :
                isRace ? (
                    <Race onShowResults={() => handleModal(ModalType.RESULT_RACE, "open")}
                          onClose={() => handleModal(ModalType.RACE, "close")}/>
                ) : (
                    isStartRace ? (
                        <StartRace
                            onStartRace={() => handleModal(ModalType.RACE, "open")}
                            onClose={() => handleModal(ModalType.START_RACE, "close")}
                        />
                    ) : (
                        <Router>
                            <ScrollToTop/>
                            <Header onShow={() => handleModal(ModalType.BUY_FUEL, "open")}/>
                            <div className="flex-grow">
                                <AnimatedRoutes
                                    onShowStartRace={() => handleModal(ModalType.START_RACE, "open")}
                                    onShowBuyFuel={() => handleModal(ModalType.BUY_FUEL, "open")}
                                />
                            </div>
                            <Footer/>
                            {showModalBuyFuel && (
                                <BuyFuelFromStars onClose={() => handleModal(ModalType.BUY_FUEL, "close")}/>
                            )}
                            {userContext?.error != null && <ErrorModal/>}
                        </Router>
                    )
                )
        )
    );
};

const App: React.FC = () => {
    return (
        <TonConnectUIProvider
            manifestUrl={publicUrl('tonconnect-manifest.json')}
            actionsConfiguration={{
                twaReturnUrl: 'https://t.me/shabashoff_game_bot/tm5'
            }}
        >
            <TonProof/>
            <AppContent/>
        </TonConnectUIProvider>
    );
};

export default App;
