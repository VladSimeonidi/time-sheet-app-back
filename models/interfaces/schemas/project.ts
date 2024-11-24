import { Document } from "mongoose";

export interface Project extends Document {
  employee_id: string;
  project_name: string;
  description: string;
  start_date: Date;
  end_date: Date;
}
