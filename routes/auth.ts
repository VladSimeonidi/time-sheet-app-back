import express, { Router } from "express";
import { loginEmployee } from "../controllers/employee";

const router: Router = express.Router();

router.post("/login", loginEmployee);

export default router;
