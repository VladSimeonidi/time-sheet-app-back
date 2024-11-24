import mongoose, { Schema } from "mongoose";
import { Leave } from "./interfaces/schemas/sickLeave";

const LeaveSchema = new Schema<Leave>(
  {
    employee: {
      type: Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },

    leave_type: {
      type: String,
      required: true,
    },

    start_date: {
      type: Date,
      required: true,
    },

    end_date: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      required: true,
    },
  },

  { timestamps: true }
);

LeaveSchema.pre("save", function (next) {
  this.start_date.setUTCHours(0, 0, 0, 0);
  next();
});

LeaveSchema.index({ employee: 1, date: 1 }, { unique: true });

const LeaveModel = mongoose.model<Leave>("Leave", LeaveSchema);

export default LeaveModel;
