import React from 'react';
import { type Lesson } from '../utils/types';

interface CalendarCellProps {
  slotDate: Date;
  schedule: any[];
  lessons: Lesson[];
  onSlotSelect?: (slot: { startTime: Date; endTime: Date }) => void;
}

// Проверяем, находится ли время в расписании преподавателя
const isInSchedule = (date: Date, schedule: any[]): boolean => {
  return schedule.some(item => {
    const start = new Date(item.startTime);
    const end = new Date(item.endTime);
    return date >= start && date < end;
  });
};

// Проверяем, есть ли урок в это время
const getLessonAtTime = (date: Date, lessons: Lesson[]): Lesson | null => {
  return lessons.find(lesson => {
    const start = new Date(lesson.startTime);
    const end = new Date(lesson.endTime);
    // Проверяем, начинается ли урок в этом временном слоте
    const slotStart = new Date(date);
    const slotEnd = new Date(date);
    slotEnd.setMinutes(slotEnd.getMinutes() + 30);
    
    // Урок пересекается со слотом, если:
    // 1. Время начала урока находится в слоте (включая начало, исключая конец)
    // 2. Время начала слота находится в уроке
    return (start >= slotStart && start < slotEnd) || 
           (slotStart >= start && slotStart < end);
  }) || null;
};

// Проверяем, является ли это время началом урока
const isLessonStart = (date: Date, lessons: Lesson[]): boolean => {
  return lessons.some(lesson => {
    const start = new Date(lesson.startTime);
    const slotStart = new Date(date);
    // Урок начинается в этом слоте, если время начала урока совпадает с началом слота
    return start.getTime() === slotStart.getTime();
  });
};

// Получаем продолжительность урока в слотах (30-минутных интервалах)
const getLessonSlotSpan = (lesson: Lesson): number => {
  const start = new Date(lesson.startTime);
  const end = new Date(lesson.endTime);
  const diffMinutes = (end.getTime() - start.getTime()) / (1000 * 60);
  // Округляем до ближайшего целого числа слотов (каждый слот = 30 минут)
  return Math.max(1, Math.round(diffMinutes / 30));
};

// Определяем стиль для слота
const getSlotStyle = (date: Date, schedule: any[], lessons: Lesson[]) => {
  const lesson = getLessonAtTime(date, lessons);
  
  if (lesson) {
    // Если это начало урока, показываем его как забронированный слот
    if (isLessonStart(date, lessons)) {
      return "bg-red-300 cursor-pointer hover:bg-red-400";
    }
    // Если это продолжение урока, скрываем его
    return "hidden";
  }
  
  if (isInSchedule(date, schedule)) {
    return "bg-green-200 cursor-pointer hover:bg-green-300";
  }
  
  return "bg-gray-100";
};

const CalendarCell: React.FC<CalendarCellProps> = ({
  slotDate,
  schedule,
  lessons,
  onSlotSelect
}) => {
  const slotEndDate = new Date(slotDate);
  slotEndDate.setMinutes(slotEndDate.getMinutes() + 30);
  
  const lesson = getLessonAtTime(slotDate, lessons);
  const isStart = isLessonStart(slotDate, lessons);
  const slotSpan = lesson ? getLessonSlotSpan(lesson) : 1;
  const slotStyle = getSlotStyle(slotDate, schedule, lessons);
  
  // Если это продолжение урока, не рендерим ничего
  if (lesson && !isStart) {
    return null;
  }
  
  // Обработчик нажатия на слот
  const handleSlotClick = () => {
    // Проверяем, что слот находится в расписании преподавателя и не пересекается с уроком
    if (onSlotSelect && isInSchedule(slotDate, schedule)) {
      const lesson = getLessonAtTime(slotDate, lessons);
      if (!lesson) {
        onSlotSelect({ startTime: slotDate, endTime: slotEndDate });
      }
    }
  };

  return (
    <div
      className={`border border-gray-300 p-1 text-center min-h-12 flex items-center justify-center text-sm relative transition-all ${slotStyle}`}
      onClick={() => {
        if (lesson) {
          alert(`Урок с ${new Date(lesson.startTime).toLocaleString()} по ${new Date(lesson.endTime).toLocaleString()}\nСтудент: ${lesson.student}\nДлительность: ${lesson.duration} минут`);
        } else if (isInSchedule(slotDate, schedule)) {
          handleSlotClick();
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