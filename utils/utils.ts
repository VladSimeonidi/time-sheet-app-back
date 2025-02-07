import { Model, Schema } from "mongoose";

export async function IsConflictingTimeSheet(
  model: Model<any>,
  employee: Schema.Types.ObjectId,
  startDate: number,
  endDate: number
): Promise<boolean> {
  const existingTime = await model.findOne({
    employee: employee,
    date: {
      $gte: startDate,
      $lte: endDate,
    },
  });

  if (existingTime) {
    return true;
  } else {
    return false;
  }
}
