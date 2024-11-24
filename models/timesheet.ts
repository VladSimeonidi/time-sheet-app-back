import mongoose, { Schema } from "mongoose";
import { TimeSheet } from "./interfaces/schemas/timesheet";

const TimeSheetSchema = new Schema<TimeSheet>(
  {
    employee: {
      type: Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },

    date: {
      type: Date,
      required: true,
    },

    start_time: {
      type: Date,
      required: true,
    },

    end_time: {
      type: Date,
      required: true,
    },

    breaks: {
      type: Boolean,
      required: true,
    },

    total_hours_worked: {
      type: Number,
      required: true,
    },

    timesheet_status: {
      type: String,
      required: true,
    },
  },

  { timestamps: true }
);

TimeSheetSchema.pre("save", function (next) {
  this.date.setUTCHours(0, 0, 0, 0);
  next();
});

TimeSheetSchema.index({ employee: 1, date: 1 }, { unique: true });

const TimeSheetModel = mongoose.model<TimeSheet>("TimeSheet", TimeSheetSchema);

export default TimeSheetModel;
