import LeaveModel from "../../models/leave";

function getDatesBetween(start_date: Date, end_date: Date): Date[] {
  const dates: Date[] = [];
  let currentDate = new Date(start_date);

  currentDate.setUTCHours(0, 0, 0, 0);

  while (currentDate <= end_date) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
}

export async function getLeaveDaysForEmployee(
  employeeId: string
): Promise<Date[]> {
  const leaves = await LeaveModel.find({ employee: employeeId });

  let allLeaveDays: Date[] = [];

  leaves.forEach((leave) => {
    const leaveDates = getDatesBetween(leave.start_date, leave.end_date);
    allLeaveDays = allLeaveDays.concat(leaveDates);
  });

  allLeaveDays = Array.from(
    new Set(allLeaveDays.map((date) => date.toISOString()))
  ).map((date) => new Date(date));

  return allLeaveDays;
}
