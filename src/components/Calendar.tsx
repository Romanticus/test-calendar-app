import React, { useState, useEffect } from "react";
import CalendarHeader from "./CalendarHeader";
import TimeSlot from "./TimeSlot";
import DayHeader from "./DayHeader";
import CalendarCell from "./CalendarCell";
import { type ScheduleItem, type Lesson } from "../types";

// Вспомогательные функции
export type CalendarProps = {
  view: "day" | "3days" | "week";
  startDate: Date;
  schedule: ScheduleItem[];
  lessons: Lesson[];
  onSlotSelect?: (slot: { startTime: Date; endTime: Date }) => void;
};


export const formatDate = (date: Date): string => {
  return date.toISOString().split("T")[0];
};

export const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

export const isTimeOverlap = (
  start1: Date,
  end1: Date,
  start2: Date,
  end2: Date
): boolean => {
  return start1 < end2 && start2 < end1;
};

 // Получаем название дня недели
 export const getDayName = (date: Date): string => {
    const days = [
      "Понедельник",
      "Вторник",
      "Среда",
      "Четверг",
      "Пятница",
      "Суббота",
      "Воскресенье",
    ];
    return days[date.getDay()];
  };


const Calendar: React.FC<CalendarProps> = ({
  view,
  startDate,
  schedule,
  lessons,
  onSlotSelect,
}) => {
  const [currentDate, setCurrentDate] = useState<Date>(startDate);
  const [daysInView, setDaysInView] = useState<Date[]>([]);

  // Определяем количество дней в зависимости от вида
  useEffect(() => {
    const days: Date[] = [];
    let dayCount = 1;

    if (view === "week") {
      dayCount = 7;
    } else if (view === "3days") {
      dayCount = 3;
    }

    for (let i = 0; i < dayCount; i++) {
      days.push(addDays(currentDate, i));
    }

    setDaysInView(days);
  }, [view, currentDate]);

  // Проверяем, находится ли время в расписании
  const isInSchedule = (date: Date): boolean => {
    return schedule.some((item) => {
      const start = new Date(item.startTime);
      const end = new Date(item.endTime);
      return date >= start && date < end;
    });
  };

  // Проверяем, есть ли урок в это время
  const getLessonAtTime = (date: Date): Lesson | null => {
    return (
      lessons.find((lesson) => {
        const start = new Date(lesson.startTime);
        const end = new Date(lesson.endTime);
        // Проверяем, начинается ли урок в этом временном слоте
        const slotStart = new Date(date);
        const slotEnd = new Date(date);
        slotEnd.setMinutes(slotEnd.getMinutes() + 30);

        // Урок пересекается со слотом, если:
        // 1. Время начала урока находится в слоте (включая начало, исключая конец)
        // 2. Время начала слота находится в уроке
        return (
          (start >= slotStart && start < slotEnd) ||
          (slotStart >= start && slotStart < end)
        );
      }) || null
    );
  };

  // Проверяем, является ли это время началом урока
  const isLessonStart = (date: Date): boolean => {
    return lessons.some((lesson) => {
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

  // Обработчик нажатия на слот
  const handleSlotClick = (startTime: Date, endTime: Date) => {
    // Проверяем, что слот находится в расписании преподавателя и не пересекается с уроком
    if (onSlotSelect && isInSchedule(startTime)) {
      const lesson = getLessonAtTime(startTime);
      if (!lesson) {
        onSlotSelect({ startTime, endTime });
      }
    }
  };

  // Генерируем временные слоты (с 00:00 до 24:00 с шагом 30 минут)
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        slots.push(
          `${hour.toString().padStart(2, "0")}:${minute
            .toString()
            .padStart(2, "0")}`
        );
      }
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

 

  // Навигация
  const goToPrevious = () => {
    if (view === "week") {
      setCurrentDate(addDays(currentDate, -7));
    } else if (view === "3days") {
      setCurrentDate(addDays(currentDate, -3));
    } else {
      setCurrentDate(addDays(currentDate, -1));
    }
  };

  const goToNext = () => {
    if (view === "week") {
      setCurrentDate(addDays(currentDate, 7));
    } else if (view === "3days") {
      setCurrentDate(addDays(currentDate, 3));
    } else {
      setCurrentDate(addDays(currentDate, 1));
    }
  };

  // Определяем стиль для слота
  const getSlotStyle = (date: Date) => {
    const lesson = getLessonAtTime(date);

    if (lesson) {
      // Если это начало урока, показываем его как забронированный слот
      if (isLessonStart(date)) {
        return "bg-red-300 cursor-pointer hover:bg-red-400";
      }
      // Если это продолжение урока, скрываем его
      return "hidden";
    }

    if (isInSchedule(date)) {
      return "bg-green-200 cursor-pointer hover:bg-green-300";
    }

    return "bg-gray-100";
  };

  return (
    <div className="p-6 max-w-6xl mx-auto font-sans">
      <CalendarHeader
        currentDate={currentDate}
        view={view}
        onPrevious={goToPrevious}
        onNext={goToNext}
        formatDate={formatDate}
      />

      <div className="overflow-x-auto rounded-lg shadow-lg">
        <div className="inline-block min-w-full">
          {/* Грид контейнер, с отображением колонок зависящех от view*/}
          <div
            className="grid gap-0"
            style={{
              gridTemplateColumns: `repeat(${
                daysInView.length + 1
              }, minmax(100px, 1fr))`,
            }}
          >
            {/* Верхний левый угол (пустая ячейка) */}
            <div className="border border-gray-300 p-3 min-h-12 bg-blue-300 text-white font-bold sticky top-0 left-0 z-10"></div>

            {/* Заголовки дней */}
            {daysInView.map((day, index) => (
              <DayHeader
                key={index}
                day={day}
              />
            ))}

            {/* Строки календаря */}
            {timeSlots.map((time, timeIndex) => (
              <React.Fragment key={timeIndex}>
                {/* Первая колонка для времени */}
                <TimeSlot time={time} />

                {/* Отрисовка дней */}
                {daysInView.map((day, dayIndex) => {
                  const slotDate = new Date(day);
                  const [hours, minutes] = time.split(":").map(Number);
                  slotDate.setHours(hours, minutes, 0, 0);

                  const slotEndDate = new Date(slotDate);
                  slotEndDate.setMinutes(slotEndDate.getMinutes() + 30);

                  const lesson = getLessonAtTime(slotDate);
                  const slotStyle = getSlotStyle(slotDate);
                  const isStart = isLessonStart(slotDate);
                  const slotSpan = lesson ? getLessonSlotSpan(lesson) : 1;

                  return (
                    <CalendarCell
                      key={`${dayIndex}-${timeIndex}`}
                      slotDate={slotDate}
                      slotEndDate={slotEndDate}
                      slotStyle={slotStyle}
                      lesson={lesson}
                      isStart={isStart}
                      slotSpan={slotSpan}
                      isInSchedule={isInSchedule}
                      handleSlotClick={handleSlotClick}
                    />
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
