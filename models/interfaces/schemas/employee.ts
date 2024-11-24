import { Document } from "mongoose";

export interface Employee extends Document {
  firstname: string;
  surname: string;
  email: string;
  username: string;
  role: string;
  employment_status: string;
}
