import express, { Router } from "express";
import {
  createTimeSheet,
  getTimeSheetsPaginated,
  updateTimeSheet,
  deleteTimeSheet,
  getDisabledDates,
} from "../controllers/timesheet";

const router: Router = express.Router();

router.post("/", createTimeSheet);
router.get("/paginated", getTimeSheetsPaginated);
router.get("/disabled-dates/:id", getDisabledDates);
router.put("/:id", updateTimeSheet);
router.delete("/:id", deleteTimeSheet);

export default router;
