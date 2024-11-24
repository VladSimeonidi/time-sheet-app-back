import express, { Router } from "express";

import {
  createSickLeave,
  getSickLeavesPaginated,
  updateSickLeave,
  deleteSickLeave,
} from "../controllers/sickLeave";

const router: Router = express.Router();

router.post("/", createSickLeave);
router.get("/paginated", getSickLeavesPaginated);
router.put("/:id", updateSickLeave);
router.delete("/:id", deleteSickLeave);

export default router;
