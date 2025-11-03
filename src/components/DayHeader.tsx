import React from 'react';

interface DayHeaderProps {
  day: Date;
  getDayName: (date: Date) => string;
  formatDate: (date: Date) => string;
}

const DayHeader: React.FC<DayHeaderProps> = ({ day, getDayName, formatDate }) => {
  return (
    <div className="border border-gray-300 p-3 text-center min-h-12 flex flex-col items-center justify-center text-sm bg-blue-300 text-blue-950 font-bold sticky top-0 z-20">
      <div className="font-bold">{getDayName(day)}</div>
      <div className="text-xs opacity-90">{formatDate(day)}</div>
    </div>
  );
};

export default DayHeader;