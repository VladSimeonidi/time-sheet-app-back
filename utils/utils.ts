import { Model, Schema } from "mongoose";

interface employeeDateRange {
  employee: any;
  startDate: number;
  endDate: number;
}

export async function hasConflictingTimeSheet(
  model: Model<any>,
  dateRange: employeeDateRange
): Promise<boolean> {
  const existingTime = await model.findOne({
    employee: dateRange.employee,
    date: {
      $gte: dateRange.startDate,
      $lte: dateRange.endDate,
    },
  });

  if (existingTime) {
    return true;
  } else {
    return false;
  }
}
