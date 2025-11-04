import React from 'react';
import { formatDate } from '../utils/utils';

interface CalendarHeaderProps {
  currentDate: Date;
  view: "day" | "3days" | "week";
  onPrevious: () => void;
  onNext: () => void;
}

const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  currentDate,
  view,
  onPrevious,
  onNext,
   
}) => {
  const getViewTitle = () => {
    switch (view) {
      case "week":
        return `7 дней с ${formatDate(currentDate)}`;
      case "3days":
        return `3 дня с ${formatDate(currentDate)}`;
      default:
        return formatDate(currentDate);
    }
  };

  return (
    <div className="flex sticky z-30 top-2.5 justify-between items-center mb-6 bg-linear-to-r from-blue-300 to-indigo-300 p-4 rounded-lg shadow-lg">
      <button 
        onClick={onPrevious}
        className="px-4 py-2 cursor-pointer hover:bg-blue-200 bg-white bg-opacity-20 hover:bg-opacity-30 text-blue-900 font-bold rounded-lg transition-all backdrop-blur-sm"
      >
        &lt; Назад
      </button>
      
      <div className="text-2xl max-sm:text-base font-bold  text-blue-900 text-center grow mx-4">
        {getViewTitle()}
      </div>
      
      <button 
        onClick={onNext}
        className="px-4 py-2 cursor-pointer hover:bg-blue-200 bg-white bg-opacity-20 hover:bg-opacity-30 text-blue-900 font-bold rounded-lg transition-all backdrop-blur-sm"
      >
        Вперед &gt;
      </button>
    </div>
  );
};

export default CalendarHeader;