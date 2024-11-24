import mongoose, { Schema } from "mongoose";
import { Project } from "./interfaces/schemas/project";

const ProjectSchema = new Schema<Project>(
  {
    employee_id: {
      type: String,
      required: true,
    },

    project_name: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: false,
    },

    start_date: {
      type: Date,
      required: true,
    },

    end_date: {
      type: Date,
      required: true,
    },
  },

  { timestamps: true }
);

const ProjectModel = mongoose.model<Project>("Project", ProjectSchema);

export default ProjectModel;
