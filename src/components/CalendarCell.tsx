import React from 'react';
import { type Lesson } from '../utils/types';

interface CalendarCellProps {
  slotDate: Date;
  slotDuration?: number; // в мин (30 мин по умолчанию)
  schedule: any[];
  lessons: Lesson[];
  onSlotSelect?: (slot: { startTime: Date; endTime: Date }) => void;
}

// Проверяем, находится ли время в расписании преподавателя
const isInSchedule = (date: Date, slotDuration: number, schedule: any[]): boolean => {
  const slotEnd = new Date(date);
  slotEnd.setMinutes(slotEnd.getMinutes() + slotDuration);
  
  return schedule.some(item => {
    const start = new Date(item.startTime);
    const end = new Date(item.endTime);
    // Проверяем пересечение слота с расписанием
    return date < end && slotEnd > start;
  });
};

// Проверяем, есть ли урок, который пересекается с этим слотом
const getLessonAtTime = (date: Date, slotDuration: number, lessons: Lesson[]): Lesson | null => {
  const slotEnd = new Date(date);
  slotEnd.setMinutes(slotEnd.getMinutes() + slotDuration);
  
  return lessons.find(lesson => {
    const lessonStart = new Date(lesson.startTime);
    const lessonEnd = new Date(lesson.endTime);
    // Проверяем пересечение слота с уроком
    return date < lessonEnd && slotEnd > lessonStart;
  }) || null;
};

// Проверяем, является ли это время началом урока (учитывая продолжительность слота)
const isLessonStart = (date: Date, slotDuration: number, lessons: Lesson[]): boolean => {
  return lessons.some(lesson => {
    const lessonStart = new Date(lesson.startTime);
    const slotEnd = new Date(date);
    slotEnd.setMinutes(slotEnd.getMinutes() + slotDuration);
    
    // Урок начинается в этом слоте, если время начала урока находится в слоте
    return lessonStart >= date && lessonStart <= slotEnd;
  });
};

// Получаем продолжительность урока в слотах
const getLessonSlotSpan = (lesson: Lesson, slotDuration: number): number => {
  const start = new Date(lesson.startTime);
  const end = new Date(lesson.endTime);
  const diffMinutes = (end.getTime() - start.getTime()) / (1000 * 60);
  // Округляем до ближайшего целого числа слотов
  return Math.max(1, Math.ceil(diffMinutes / slotDuration));
};

// Определяем стиль для слота
const getSlotStyle = (date: Date, slotDuration: number, schedule: any[], lessons: Lesson[]) => {
  const lesson = getLessonAtTime(date, slotDuration, lessons);
  
  if (lesson) {
    // Если это начало урока, показываем его как забронированный слот
    if (isLessonStart(date, slotDuration, lessons)) {
      return "bg-red-300 cursor-pointer hover:bg-red-400";
    }
    // Если это продолжение урока, скрываем его
    return "hidden";
  }
  
  if (isInSchedule(date, slotDuration, schedule)) {
    return "bg-green-200 cursor-pointer hover:bg-green-300";
  }
  
  return "bg-gray-100";
};

const CalendarCell: React.FC<CalendarCellProps> = ({
  slotDate,
  slotDuration = 30, // Default to 30 minutes
  schedule,
  lessons,
  onSlotSelect
}) => {
  const slotEndDate = new Date(slotDate);
  slotEndDate.setMinutes(slotEndDate.getMinutes() + slotDuration);
  
  const lesson = getLessonAtTime(slotDate, slotDuration, lessons);
  const isStart = isLessonStart(slotDate, slotDuration, lessons);
  const slotSpan = lesson ? getLessonSlotSpan(lesson, slotDuration) : 1;
  const slotStyle = getSlotStyle(slotDate, slotDuration, schedule, lessons);
  
  // Если это продолжение урока, не рендерим ничего
  if (lesson && !isStart) {
    return null;
  }
  
  // Обработчик нажатия на слот
  const handleSlotClick = () => {
    // Проверяем, что слот находится в расписании преподавателя и не пересекается с уроком
    if (onSlotSelect && isInSchedule(slotDate, slotDuration, schedule)) {
      const lesson = getLessonAtTime(slotDate, slotDuration, lessons);
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
        } else if (isInSchedule(slotDate, slotDuration, schedule)) {
          handleSlotClick();
        }
      }}
      style={isStart && lesson ? { 
        gridRow: `span ${slotSpan}`,
        zIndex: 10
      } : {}}
    >
      {isStart && lesson && (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-2 rounded shadow">
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