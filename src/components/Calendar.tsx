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
  onSlotSelect?: (slot: { startTime: Date; endTime: Date }) => void;
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

                  return (
                    <CalendarCell
                      key={`${dayIndex}-${timeIndex}`}
                      slotDate={slotDate}
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
