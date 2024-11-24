import {
  validateNewEmployee,
  validateUpdateEmployee,
} from "../validators/employee";
import EmployeeModel from "../models/employee";
import { Response, Request } from "express";
// import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Types } from "mongoose";

export const createEmployee = async (req: Request, res: Response) => {
  try {
    const { error } = validateNewEmployee(req.body);

    if (error) return res.status(400).send(error.details[0].message);

    // let { email, password } = req.body;

    let { email } = req.body;

    let isEmailExist = await EmployeeModel.findOne({
      email: email,
    });

    if (isEmailExist) {
      return res.status(400).json("Employee with such email exists");
    }

    // const salt = bcrypt.genSaltSync(10);

    // const hash = bcrypt.hashSync(password, salt);

    // const newEmployeeModel = new EmployeeModel({ ...req.body, password: hash });

    const newEmployeeModel = new EmployeeModel(req.body);

    await newEmployeeModel.save();

    const newEmployee = newEmployeeModel.toObject();

    return res.status(200).json(newEmployee);
  } catch (error: any) {
    res.status(500).json(`Error: ${error.message}`);
  }
};

export const loginEmployee = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const employeeDocument = await EmployeeModel.findOne({ email });

    if (!employeeDocument) return res.status(404).json("Employee not found!");

    // const isMatchPasswords: boolean = await bcrypt.compare(
    //   password,
    //   employeeDocument.password
    // );

    // if (!isMatchPasswords)
    //   return res.status(404).json("You entered a wrong password!");

    const employee = employeeDocument.toObject();

    const payload = {
      _id: employee._id,
      username: employee.username,
      email: employee.email,
    };

    const secretKey = process.env.SECRET_KEY;

    if (!secretKey) throw new Error("Error on server in employee controllers");

    let jwtToken = jwt.sign(payload, secretKey, {
      expiresIn: "24hr",
    });

    return res.status(200).json({
      token: `Bearer ${jwtToken}`,
      employee: payload,
    });
  } catch (error: any) {
    res.status(500).json(`Error: ${error.message}`);
  }
};

export const getAllEmployees = async (req: Request, res: Response) => {
  try {
    const employees = await EmployeeModel.find().lean();

    if (!employees) return res.status(404).json("Employees are not found!");

    res.status(200).json(employees);
  } catch (error: any) {
    res.status(500).json(`Error: ${error.message}`);
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
    res.status(500).json(`Error: ${error.message}`);
  }
};

export const getEmployeesPaginated = async (req: Request, res: Response) => {
  try {
    const pageNumber: number = Number(req.query.pageNumber);

    const pageSize: number = Number(req.query.pageSize);

    if (!pageNumber || !pageSize)
      return res
        .status(400)
        .send("No parameter, page number or page size is NaN");

    if (pageNumber <= 0)
      return res.status(400).send("Page number less or equals zero");

    const employees = await EmployeeModel.find()
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .sort({ surname: 1 })
      .lean();

    const documentsTotal = await EmployeeModel.countDocuments();

    res.status(200).json({ items: employees, totalRecords: documentsTotal });
  } catch (error: any) {
    res.status(500).json(`Error: ${error.message}`);
  }
};

export const updateEmployee = async (req: Request, res: Response) => {
  try {
    const { error } = validateUpdateEmployee(req.body);

    if (error) return res.status(400).send(error.details[0].message);

    const { id } = req.params;

    if (!Types.ObjectId.isValid(id))
      return res.status(400).send("Invalid ObjectId");

    const employee = await EmployeeModel.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true }
    ).lean();

    if (!employee) return res.status(404).json("Employee not found!");

    res.status(200).json(employee);
  } catch (error: any) {
    res.status(500).json(`Error: ${error.message}`);
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
    res.status(500).json(`Error: ${error.message}`);
  }
};
