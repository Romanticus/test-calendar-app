import React, { useState, useEffect } from "react";
import CalendarHeader from "./CalendarHeader";
import TimeSlot from "./TimeSlot";
import DayHeader from "./DayHeader";
import CalendarCell from "./CalendarCell";
import { type ScheduleItem, type Lesson } from "../utils/types";
import  { addDays } from "../utils/utils";
 
export type CalendarProps = {
  view: "day" | "3days" | "week";
  startDate: Date;
  schedule: ScheduleItem[];
  lessons: Lesson[];
  slotDuration?: number; // в мин
  onSlotSelect?: (slot: { startTime: Date; endTime: Date }) => void;
};

const Calendar: React.FC<CalendarProps> = ({
  view,
  startDate,
  schedule,
  lessons,
  slotDuration = 30, // 30 по умолчанию
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

  // Генерируем временные слоты в зависимости от slotDuration
  const generateTimeSlots = () => {
    const slots = [];
    const totalMinutes = 24 * 60; // 24 hours in minutes
    
    for (let minutes = 0; minutes < totalMinutes; minutes += slotDuration) {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      slots.push(
        `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}`
      );
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

  return (
    <div className="p-6 max-w-6xl mx-auto font-sans">
      <CalendarHeader
        currentDate={currentDate}
        view={view}
        onPrevious={goToPrevious}
        onNext={goToNext}
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
            <div className="border sticky border-gray-300 p-3 min-h-12 bg-blue-300 text-white font-bold top-0 left-0 z-21"></div>

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

                  return (
                    <CalendarCell
                      key={`${dayIndex}-${timeIndex}`}
                      slotDate={slotDate}
                      slotDuration={slotDuration}
                      schedule={schedule}
                      lessons={lessons}
                      onSlotSelect={onSlotSelect}
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