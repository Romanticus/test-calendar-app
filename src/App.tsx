import { useState, useEffect } from "react";
import Calendar from "./components/Calendar";
import { lessons, schedule } from "./utils/data";

function App() {
  const [view, setView] = useState<"day" | "3days" | "week">("week");
  const [slotDuration, setSlotDuration] = useState<number>(30); // по умолчанию фикусруем 30 мин
  const [startDate] = useState<Date>(new Date("2025-08-23T00:00:00Z"));


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

  // Обработчик изменения продолжительности слота
  const handleDurationChange = (duration: number) => {
    setSlotDuration(duration);
  };


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

          {/* Контролы для настройки продолжительности слота */}
          <div className="slot-duration-controls text-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">
              Настройка продолжительности слотов
            </h2>
            <div className="flex flex-wrap justify-center gap-2 mb-3">
              <button
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  slotDuration === 30
                    ? "bg-green-600 text-white shadow-md"
                    : "bg-green-100 text-green-800 hover:bg-green-200"
                }`}
                onClick={() => handleDurationChange(30)}
              >
                30 минут
              </button>
              <button
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  slotDuration === 60
                    ? "bg-green-600 text-white shadow-md"
                    : "bg-green-100 text-green-800 hover:bg-green-200"
                }`}
                onClick={() => handleDurationChange(60)}
              >
                60 минут
              </button>
              <button
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  slotDuration === 90
                    ? "bg-green-600 text-white shadow-md"
                    : "bg-green-100 text-green-800 hover:bg-green-200"
                }`}
                onClick={() => handleDurationChange(90)}
              >
                90 минут
              </button>
            </div>
          
          </div>

          <Calendar
            view={view}
            startDate={startDate}
            schedule={schedule}
            lessons={lessons}
            slotDuration={slotDuration}
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