import {
  validateNewEmployee,
  validateUpdateEmployee,
  validatePagination,
  validateTimeRange,
} from "../validators/employee";
import EmployeeModel from "../models/employee";
import { Response, Request } from "express";
import { Types } from "mongoose";
import { getEmployeeSummaryService } from "../services/employeeSummaryService";

export const createEmployee = async (req: Request, res: Response) => {
  try {
    const { error, value: data } = validateNewEmployee(req.body);

    if (error) return res.status(400).send(error.details[0].message);

    let isEmailExist = await EmployeeModel.findOne({
      email: data.email,
    });

    if (isEmailExist) {
      return res.status(400).json("Employee with such email exists");
    }

    const newEmployeeModel = new EmployeeModel(data);

    await newEmployeeModel.save();

    const newEmployee = newEmployeeModel.toObject();

    return res.status(200).json(newEmployee);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllEmployees = async (req: Request, res: Response) => {
  try {
    const employees = await EmployeeModel.find().lean();

    if (!employees) return res.status(404).json("Employees are not found!");

    res.status(200).json(employees);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getEmployee = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!Types.ObjectId.isValid(id))
      return res.status(400).send("Invalid ObjectId");

    const employee = await EmployeeModel.findOne({ _id: id }).lean();

    if (!employee) return res.status(404).json("Employee not found!");

    res.status(200).json(employee);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getEmployeesPaginated = async (req: Request, res: Response) => {
  try {
    const { error, value } = validatePagination(req.query);

    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { pageNumber, pageSize } = value;

    const employees = await EmployeeModel.find()
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .sort({ surname: 1 })
      .lean();

    const documentsTotal = await EmployeeModel.countDocuments();

    res.status(200).json({ items: employees, totalRecords: documentsTotal });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateEmployee = async (req: Request, res: Response) => {
  try {
    const { error, value: data } = validateUpdateEmployee(req.body);

    if (error) return res.status(400).send(error.details[0].message);

    const { id } = req.params;

    if (!Types.ObjectId.isValid(id))
      return res.status(400).send("Invalid ObjectId");

    const employee = await EmployeeModel.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true }
    ).lean();

    if (!employee) return res.status(404).json("Employee not found!");

    res.status(200).json(employee);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getEmployeeSummary = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid employee ID" });
    }

    const { error, value: timeRange } = validateTimeRange(req.query);

    if (error) return res.status(400).send(error.details[0].message);

    const { startDate, endDate } = timeRange;

    const summary = await getEmployeeSummaryService(id, startDate, endDate);

    res.status(200).json(summary);
  } catch (error: any) {
    res.status(500).json({ message: { error: error.message } });
  }
};

export const deleteEmployee = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!Types.ObjectId.isValid(id))
      return res.status(400).send("Invalid ObjectId");

    const employee = await EmployeeModel.findOneAndDelete({ _id: id }).lean();

    if (!employee) return res.status(404).json("Employee not found!");

    res.status(200).json(employee);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
