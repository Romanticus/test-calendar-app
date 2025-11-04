export type ScheduleItem = {
  startTime: string;
  endTime: string;
};

export type Lesson = {
  id: number;
  duration: number;
  startTime: string;
  endTime: string;
  student: string;
};

export type CalendarProps = {
  view: "day" | "3days" | "week";
  startDate: Date;
  schedule: ScheduleItem[];
  lessons: Lesson[];
  onSlotSelect?: (slot: { startTime: Date; endTime: Date }) => void;
};

// 