import MinerSection from '../components/MinerSection';
import WorkshopSection from '../components/WorkshopSection';
import { HowPlay } from '../components/HowPlay'
import React, { useState } from 'react';

interface MainProps {
  onShowBuyFuel: () => void;
}

const Main: React.FC<MainProps> = ({onShowBuyFuel}) => {
  const [showModal, setShowModal] = useState(false);

  const handleShowModal = () => {
    document.body.style.overflow = 'hidden'
    setShowModal(true);
  };

  const handleCloseModal = () => {
    document.body.style.overflowX = 'hidden';
    document.body.style.overflowY = 'auto';
    setShowModal(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-[#071333] to-[#0B1428] text-white">
      <main className="flex-1 p-4 pt-20 pb-20">
        <MinerSection onOpenHowPlay={handleShowModal} />
        <WorkshopSection onShowBuyFuel={onShowBuyFuel} />
      </main>
        {showModal && (
          <HowPlay onClose={handleCloseModal}/>
        )}
    </div>
  );
};

export default Main;
