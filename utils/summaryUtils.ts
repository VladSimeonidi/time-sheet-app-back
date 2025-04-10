import EmployeeModel from "../models/employee";
import { Leave } from "../models/interfaces/schemas/leave";
import { TimeSheet } from "../models/interfaces/schemas/timesheet";
import LeaveModel from "../models/leave";
import TimeSheetModel from "../models/timesheet";

export const fetchTimesheets = async (id: string, start: Date, end: Date) => {
  return await TimeSheetModel.find({
    employee: id,
    date: { $gte: start, $lte: end },
  }).sort({ date: 1 });
};

export const fetchLeaves = async (id: string, start: Date, end: Date) => {
  return await LeaveModel.find({
    employee: id,
    $or: [{ start_date: { $gte: start } }, { end_date: { $lte: end } }],
  }).sort({ start_date: 1 });
};

export const fetchEmployee = async (id: string) => {
  return await EmployeeModel.findOne({
    _id: id,
  });
};

export const buildSummaryMap = (items: (TimeSheet | Leave)[][]) => {
  const summaryMap = new Map<string, SummaryEmployee>();

  items.flat().forEach((item) => {
    if ("start_date" in item) {
      // Handling Leave
      let currentDate = new Date(item.start_date);
      while (currentDate <= item.end_date) {
        const dateStr = currentDate.toISOString().split("T")[0];
        summaryMap.set(dateStr, {
          date: new Date(currentDate),
          day_of_week: currentDate.toLocaleString("en-US", { weekday: "long" }),
          type: "Leave",
          leave_type: item.leave_type,
          status: item.status,
        });
        currentDate.setDate(currentDate.getDate() + 1);
      }
    } else {
      // Handling TimeSheet
      summaryMap.set(item.date.toISOString().split("T")[0], {
        date: item.date,
        day_of_week: item.date.toLocaleString("en-US", { weekday: "long" }),
        type: "Work",
        start_time: item.start_time,
        end_time: item.end_time,
        total_hours: item.total_hours_worked,
        status: item.timesheet_status,
      });
    }
  });

  return summaryMap;
};

export const generateWeeklySummary = (
  start: Date,
  end: Date,
  summaryMap: Map<string, SummaryEmployee>
) => {
  let weeklySummary = [];
  let currentWeek: CurrentWeek = {
    weekStart: "",
    weekEnd: "",
    totalHours: 0,
    days: [],
  };
  let currentDate = new Date(start);

  while (currentDate <= end) {
    const dateStr = currentDate.toISOString().split("T")[0];

    if (currentWeek.days.length === 0) {
      currentWeek.weekStart = dateStr;
    }

    const daySummary = summaryMap.get(dateStr) || {
      date: new Date(currentDate),
      day_of_week: currentDate.toLocaleString("en-GB", { weekday: "long" }),
      type: null,
      start_time: null,
      end_time: null,
      total_hours: 0,
      status: null,
      leave_type: null,
    };

    currentWeek.days.push(daySummary);

    if (
      daySummary.type === "Work" &&
      daySummary.total_hours &&
      daySummary.status !== "denied"
    ) {
      currentWeek.totalHours += daySummary.total_hours;
    }

    if (currentWeek.days.length === 7) {
      currentWeek.weekEnd = dateStr;
      weeklySummary.push(currentWeek);
      currentWeek = { weekStart: "", weekEnd: "", totalHours: 0, days: [] };
    }

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return weeklySummary;
};
