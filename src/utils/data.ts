import type { ScheduleItem, Lesson } from "./types";

  // Пример расписания преподавателя
  export const schedule: ScheduleItem[] = [
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
  export const lessons: Lesson[] = [
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
