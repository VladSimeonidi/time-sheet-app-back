import { Express } from "express";
import userRouter from "./employee";
import timeSheetRouter from "./timesheet";
import leaveRouter from "./leave";
import UnavailableDatesRouter from "./unavailable-dates";

function useRoutes(app: Express): void {
  app.use("/api/employees", userRouter);
  app.use("/api/timesheets", timeSheetRouter);
  app.use("/api/leaves", leaveRouter);
  app.use("/api/unavailable-dates", UnavailableDatesRouter);
}

export default useRoutes;
