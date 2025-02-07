import TimeSheetModel from "../models/timesheet";

export async function getTimesheetDatesForEmployee(
  employeeId: string
): Promise<Date[]> {
  const timesheets = await TimeSheetModel.find({ employee: employeeId });

  const dates: Date[] = timesheets.map((timesheet) => {
    return timesheet.date;
  });

  return dates;
}
