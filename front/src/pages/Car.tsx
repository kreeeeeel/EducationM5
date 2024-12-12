import React, {useState} from 'react';
import CarInfoSection from "../components/car/CarInfoSection.tsx";
import CarBuyModal from "../components/car/CarBuyModal.tsx";

interface RideProps {
    onShowBuyFuel: () => void;
    onStartRace: () => void;
}

const Car: React.FC<RideProps> = ({onShowBuyFuel, onStartRace}) => {
    const [isShowBuyCarModal, setShowBuyCarModal] = useState(false);

    const handleShowBuyCarModal = () => {
        document.body.style.overflow = 'hidden'
        if (navigator.vibrate) {
            navigator.vibrate(100);
        }
        setShowBuyCarModal(true);
    };

    const handleCloseBuyCarModal = () => {
        document.body.style.overflowX = 'hidden';
        document.body.style.overflowY = 'auto';
        setShowBuyCarModal(false);
    };

    return (
        <>
            <div className="flex flex-col min-w-full min-h-screen bg-gradient-to-b from-[#071333] to-[#0B1428] text-white">
                <CarInfoSection onShowBuyFuel={onShowBuyFuel} onStartRace={onStartRace} onShowBuyCar={handleShowBuyCarModal}/>
            </div>
            {isShowBuyCarModal && (<CarBuyModal onClose={handleCloseBuyCarModal}/>)}
        </>
    );
};

export default Car;
