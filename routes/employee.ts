import express, { Router } from "express";
import {
  createEmployee,
  getEmployee,
  getEmployeesPaginated,
  deleteEmployee,
  updateEmployee,
  getAllEmployees,
  getEmployeeSummary,
} from "../controllers/employee";

const router: Router = express.Router();

router.post("/", createEmployee);
router.get("/", getAllEmployees);
router.get("/paginated", getEmployeesPaginated);
router.get("/summary/:id", getEmployeeSummary);
router.get("/:id", getEmployee);
router.put("/:id", updateEmployee);
router.delete("/:id", deleteEmployee);

export default router;
