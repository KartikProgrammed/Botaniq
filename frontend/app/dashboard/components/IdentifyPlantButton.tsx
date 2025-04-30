// dashboard/components/IdentifyPlantButton.tsx
import React from 'react';

interface IdentifyPlantButtonProps {
  onOpenModal: () => void;
}

const IdentifyPlantButton: React.FC<IdentifyPlantButtonProps> = ({ onOpenModal }) => {
  return (
    <button
      onClick={onOpenModal}
      className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
    >
      + Identify Plant
    </button>
  );
};

export default IdentifyPlantButton;