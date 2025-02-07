import { Request, Response } from "express";
import { getLeaveDaysForEmployee } from "../utils/leaveHelpers";
import { getTimesheetDatesForEmployee } from "../utils/timehsheetHelpers";

export const getDisabledDates = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const allLeaveDaysForEmployee = await getLeaveDaysForEmployee(id);
    const allTimesheetDatesForEmployee = await getTimesheetDatesForEmployee(id);

    const allUnavailableDays = allLeaveDaysForEmployee.concat(
      allTimesheetDatesForEmployee
    );

    const allUniqueUnavailableDays = Array.from(
      new Set(allUnavailableDays.map((date) => date.valueOf()))
    ).map((ms) => new Date(ms));

    return res.status(200).json(allUniqueUnavailableDays);
  } catch (error) {
    return res.status(500).json(`Error: fetching unavailable days`);
  }
};
