interface SummaryEmployee {
  date: Date;
  day_of_week: string;
  type: "Work" | "Leave" | null;
  start_time?: Date | null;
  end_time?: Date | null;
  total_hours?: number | null;
  status: string | null;
  leave_type?: string | null;
}

interface CurrentWeek {
  weekStart: string;
  weekEnd: string;
  totalHours: number;
  days: SummaryEmployee[];
}
