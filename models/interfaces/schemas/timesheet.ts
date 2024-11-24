import { Document, Schema } from "mongoose";

export interface TimeSheet extends Document {
  employee: Schema.Types.ObjectId;
  date: Date;
  start_time: Date;
  end_time: Date;
  breaks: boolean;
  total_hours_worked: number;
  timesheet_status: string;
}
