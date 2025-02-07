import express, { Router } from "express";
import { getDisabledDates } from "../controllers/unavailable-dates";

const router: Router = express.Router();

router.get("/:id", getDisabledDates);

export default router;
