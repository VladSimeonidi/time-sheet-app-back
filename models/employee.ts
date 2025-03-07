import mongoose, { Schema } from "mongoose";
import { Employee } from "./interfaces/schemas/employee";

const employeeSchema = new Schema<Employee>(
  {
    firstname: {
      type: String,
      required: true,
    },

    surname: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    username: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      required: true,
    },

    employment_status: {
      type: String,
      required: true,
    },

    weekly_hours: {
      type: Number,
      required: true,
    },
  },

  { timestamps: true }
);

const EmployeeModel = mongoose.model<Employee>("Employee", employeeSchema);

export default EmployeeModel;
