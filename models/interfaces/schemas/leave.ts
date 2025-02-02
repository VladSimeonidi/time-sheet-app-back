import { Schema, Document } from "mongoose";

export interface Leave extends Document {
  employee: Schema.Types.ObjectId;
  leave_type: string;
  start_date: Date;
  end_date: Date;
  status: string;
}
