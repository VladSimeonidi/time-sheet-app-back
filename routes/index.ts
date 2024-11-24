import { Express } from "express";
import userRouter from "./employee";
import authRouter from "./auth";
import timeSheetRouter from "./timesheet";
import sickLeaveRouter from "./sickLeave";

function useRoutes(app: Express): void {
  app.use("/api/auth", authRouter);
  app.use("/api/employees", userRouter);
  app.use("/api/timesheets", timeSheetRouter);
  app.use("/api/sick-leaves", sickLeaveRouter);
}

export default useRoutes;
