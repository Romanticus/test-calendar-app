import React from 'react';
import { formatDate} from '../utils/utils';

interface DayHeaderProps {
  day: Date;
}

const getDayName = (date: Date): string => {
  const days = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
  return days[date.getDay()];
};

const DayHeader: React.FC<DayHeaderProps> = ({ day }) => {
  return (
    <div className="border border-gray-300 p-3 text-center min-h-12 flex flex-col items-center justify-center text-sm bg-blue-300 text-blue-950 font-bold sticky top-0 z-20">
      <div className="font-bold">{getDayName(day)}</div>
      <div className="text-xs opacity-90">{formatDate(day)}</div>
    </div>
  );
};

export default DayHeader;