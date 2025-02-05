import mongoose, { Schema } from "mongoose";
import { Leave } from "./interfaces/schemas/leave";

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

LeaveSchema.pre("save", async function (next) {
  const LeaveModel = mongoose.model("Leave");

  const overlappingLeave = await LeaveModel.findOne({
    employee: this.employee,
    $or: [
      {
        start_date: { $lte: this.end_date },
        end_date: { $gte: this.start_date },
      },
    ],
  });

  if (overlappingLeave) {
    return next(
      new Error("Overlapping leave period exists for this employee.")
    );
  }

  this.start_date.setUTCHours(0, 0, 0, 0);
  this.end_date.setUTCHours(23, 59, 59, 999);
  next();
});

LeaveSchema.index({ employee: 1, start_date: 1, end_date: 1 });

const LeaveModel = mongoose.model<Leave>("Leave", LeaveSchema);

export default LeaveModel;
