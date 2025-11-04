import { useState, useEffect } from "react";
import Calendar from "./components/Calendar";
import { type ScheduleItem, type Lesson } from "./utils/types";

function App() {
  const [view, setView] = useState<"day" | "3days" | "week">("week");
  const [startDate] = useState<Date>(new Date("2025-08-23T00:00:00Z"));

  // Пример расписания преподавателя
  const schedule: ScheduleItem[] = [
    {
      startTime: "2025-08-23T22:30:00+00:00",
      endTime: "2025-08-24T02:29:59+00:00",
    },
    {
      startTime: "2025-08-25T01:30:00+00:00",
      endTime: "2025-08-25T04:59:59+00:00",
    },
    {
      startTime: "2025-08-25T11:00:00+00:00",
      endTime: "2025-08-25T19:29:59+00:00",
    },
    {
      startTime: "2025-08-27T02:30:00+00:00",
      endTime: "2025-08-27T06:59:59+00:00",
    },
    {
      startTime: "2025-08-28T23:00:00+00:00",
      endTime: "2025-08-29T08:29:59+00:00",
    },
    {
      startTime: "2025-08-30T22:30:00+00:00",
      endTime: "2025-08-31T02:29:59+00:00",
    },
    {
      startTime: "2025-09-01T01:30:00+00:00",
      endTime: "2025-09-01T04:59:59+00:00",
    },
    {
      startTime: "2025-09-01T11:00:00+00:00",
      endTime: "2025-09-01T19:29:59+00:00",
    },
  ];

  // Пример уроков
  const lessons: Lesson[] = [
    {
      id: 52,
      duration: 60,
      startTime: "2025-08-25T13:30:00+00:00",
      endTime: "2025-08-25T14:29:59+00:00",
      student: "Алексей",
    },
    {
      id: 53,
      duration: 30,
      startTime: "2025-08-25T15:00:00+00:00",
      endTime: "2025-08-25T15:29:59+00:00",
      student: "Мария",
    },
    {
      id: 54,
      duration: 90,
      startTime: "2025-08-27T03:30:00+00:00",
      endTime: "2025-08-27T04:59:59+00:00",
      student: "Иван",
    },
  ];

  // Обработчик выбора слота
  const handleSlotSelect = (slot: { startTime: Date; endTime: Date }) => {
    alert(
      `Выбран слот с ${slot.startTime.toLocaleString()} по ${slot.endTime.toLocaleString()}`
    );
  };

  // Определение вида в зависимости от ширины экрана
  const getViewForScreenSize = (): "day" | "3days" | "week" => {
    const width = window.innerWidth;
    if (width < 768) {
      return "3days"; // Мобильный вид - 3 дня
    } else {
      return "week"; // Десктопный вид - неделя
    }
  };

  // Обновление вида при изменении размера окна
  useEffect(() => {
    const handleResize = () => {
      setView(getViewForScreenSize());
    };

    window.addEventListener("resize", handleResize);
    // Установка начального вида
    setView(getViewForScreenSize());

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-2 text-blue-900">
          Календарь 
        </h1>
        <p className="text-center text-blue-700 mb-6">
          Расписание занятий и доступное время для бронирования
        </p>

        <div className="bg-white rounded-xl shadow-xl p-6 mb-6">
          <div className="view-controls text-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">
              Выберите вид календаря
            </h2>
            <div className="flex flex-wrap justify-center gap-2">
              <button
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  view === "day"
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-blue-100 text-blue-800 hover:bg-blue-200"
                }`}
                onClick={() => setView("day")}
              >
                День
              </button>
              <button
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  view === "3days"
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-blue-100 text-blue-800 hover:bg-blue-200"
                }`}
                onClick={() => setView("3days")}
              >
                3 дня
              </button>
              <button
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  view === "week"
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-blue-100 text-blue-800 hover:bg-blue-200"
                }`}
                onClick={() => setView("week")}
              >
                Неделя
              </button>
            </div>
          </div>

          <Calendar
            view={view}
            startDate={startDate}
            schedule={schedule}
            lessons={lessons}
            onSlotSelect={handleSlotSelect}
          />
        </div>

        <div className="bg-white rounded-xl shadow-xl p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">Легенда</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-green-500 rounded mr-2"></div>
              <span className="text-gray-700">
                Доступное время для бронирования
              </span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-red-500 rounded mr-2"></div>
              <span className="text-gray-700">Забронированные уроки</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-gray-100 rounded mr-2 border border-gray-300"></div>
              <span className="text-gray-700">Недоступное время</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
