import React from 'react';
import { type Lesson } from '../types';

interface CalendarCellProps {
  slotDate: Date;
  slotEndDate: Date;
  slotStyle: string;
  lesson: Lesson | null;
  isStart: boolean;
  slotSpan: number;
  isInSchedule: (date: Date) => boolean;
  handleSlotClick: (startTime: Date, endTime: Date) => void;
}

const CalendarCell: React.FC<CalendarCellProps> = ({
  slotDate,
  slotEndDate,
  slotStyle,
  lesson,
  isStart,
  slotSpan,
  isInSchedule,
  handleSlotClick
}) => {
  // Если это продолжение урока, не рендерим ничего
  if (lesson && !isStart) {
    return null;
  }

  return (
    <div
      className={`border border-gray-300 p-1 text-center min-h-12 flex items-center justify-center text-sm relative transition-all ${slotStyle}`}
      onClick={() => {
        if (lesson) {
          alert(`Урок с ${new Date(lesson.startTime).toLocaleString()} по ${new Date(lesson.endTime).toLocaleString()}\nСтудент: ${lesson.student}\nДлительность: ${lesson.duration} минут`);
        } else if (isInSchedule(slotDate)) {
          handleSlotClick(slotDate, slotEndDate);
        }
      }}
      style={isStart && lesson ? { 
        gridRow: `span ${slotSpan}`,
        zIndex: 10
      } : {}}
    >
      {isStart && lesson && (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-2 bg rounded shadow">
          <div className="text-xs font-bold text-white text-center">
            <div className="font-bold truncate px-1">{lesson.student}</div>
            <div>{lesson.duration} мин</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarCell;