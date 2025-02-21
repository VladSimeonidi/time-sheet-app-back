import { adjustDateRange } from "../utils/dateUtils";
import {
  fetchTimesheets,
  fetchLeaves,
  buildSummaryMap,
  generateWeeklySummary,
  fetchEmployee,
} from "../utils/summaryUtils";

export const getEmployeeSummaryService = async (
  id: string,
  startDate: string,
  endDate: string
) => {
  const { adjustedStart, adjustedEnd } = adjustDateRange(startDate, endDate);

  const [timesheets, leaves, employee] = await Promise.all([
    fetchTimesheets(id, adjustedStart, adjustedEnd),
    fetchLeaves(id, adjustedStart, adjustedEnd),
    fetchEmployee(id),
  ]);

  const summaryMap = buildSummaryMap(timesheets, leaves);
  return {
    employee,
    weeklySummary: generateWeeklySummary(
      adjustedStart,
      adjustedEnd,
      summaryMap
    ),
  };
};
