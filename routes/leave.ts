import express, { Router } from "express";

import {
  createLeave,
  getLeavesPaginated,
  updateLeave,
  deleteLeave,
} from "../controllers/leave";

const router: Router = express.Router();

router.post("/", createLeave);
router.get("/paginated", getLeavesPaginated);
router.put("/:id", updateLeave);
router.delete("/:id", deleteLeave);

export default router;
