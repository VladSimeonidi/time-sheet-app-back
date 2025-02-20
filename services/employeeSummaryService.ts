import { adjustDateRange } from "../utils/dateUtils";
import {
  fetchTimesheets,
  fetchLeaves,
  buildSummaryMap,
  generateWeeklySummary,
} from "../utils/summaryUtils";

export const getEmployeeSummaryService = async (
  id: string,
  startDate: string,
  endDate: string
) => {
  const { adjustedStart, adjustedEnd } = adjustDateRange(startDate, endDate);

  const [timesheets, leaves] = await Promise.all([
    fetchTimesheets(id, adjustedStart, adjustedEnd),
    fetchLeaves(id, adjustedStart, adjustedEnd),
  ]);

  const summaryMap = buildSummaryMap(timesheets, leaves);
  return {
    id,
    weeklySummary: generateWeeklySummary(
      adjustedStart,
      adjustedEnd,
      summaryMap
    ),
  };
};
