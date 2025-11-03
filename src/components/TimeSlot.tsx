import React from 'react';

interface TimeSlotProps {
  time: string;
}

const TimeSlot: React.FC<TimeSlotProps> = ({ time }) => {
  return (
    <div className="border border-gray-300 p-3 text-center min-h-12 flex items-center justify-center text-sm bg-gray-100 font-medium text-gray-700 sticky left-0 z-20">
      {time}
    </div>
  );
};

export default TimeSlot;