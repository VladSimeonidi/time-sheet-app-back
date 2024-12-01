import { validateLeave, validateUpdateLeave } from "../validators/leave";
import { Response, Request } from "express";
import { Types } from "mongoose";
import LeaveModel from "../models/leave";
import TimeSheetModel from "../models/timesheet";

export const createLeave = async (req: Request, res: Response) => {
  try {
    const { error } = validateLeave(req.body);

    if (error) return res.status(400).send(error.details[0].message);

    const { employee, start_date } = req.body;

    if (!employee) return res.status(400).send("No employee provided");

    if (!start_date) return res.status(400).send("No start_date provided");

    const normalizedStartDate = new Date(start_date).setHours(0, 0, 0, 0);

    const conflictingTimeSheet = await TimeSheetModel.findOne({
      employee: employee,
      date: normalizedStartDate,
    });

    if (conflictingTimeSheet)
      return res
        .status(400)
        .json(
          `Error: "Cannot add sick leave on a day with existing work hours`
        );

    const newLeaveModel = new LeaveModel(req.body);

    await newLeaveModel.save();

    const newLeave = newLeaveModel.toObject();

    return res.status(200).json(newLeave);
  } catch (error: any) {
    res.status(500).json(`Error: ${error.message}`);
  }
};

export const getLeavesPaginated = async (req: Request, res: Response) => {
  try {
    const pageNumber: number = Number(req.query.pageNumber);

    const pageSize: number = Number(req.query.pageSize);

    if (!pageNumber || !pageSize)
      return res
        .status(400)
        .send("No parameter, page number or page size is NaN");

    const leave = await LeaveModel.find()
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .populate("employee")
      .sort({ updatedAt: -1 })
      .lean();

    const documentsTotal = await LeaveModel.countDocuments();

    res.status(200).json({ items: leave, totalRecords: documentsTotal });
  } catch (error: any) {
    res.status(500).json(`Error: ${error.message}`);
  }
};

export const updateLeave = async (req: Request, res: Response) => {
  try {
    const { error } = validateUpdateLeave(req.body);

    if (error) return res.status(400).send(error.details[0].message);

    const { id } = req.params;

    if (!Types.ObjectId.isValid(id))
      return res.status(400).send("Invalid ObjectId");

    const leave = await LeaveModel.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true }
    ).lean();

    if (!leave) return res.status(404).json("Leave not found!");

    res.status(200).json(leave);
  } catch (error: any) {
    res.status(500).json(`Error: ${error.message}`);
  }
};

export const deleteLeave = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!Types.ObjectId.isValid(id))
      return res.status(400).send("Invalid ObjectId");

    const leave = await LeaveModel.findOneAndDelete({ _id: id }).lean();

    if (!leave) return res.status(404).json("Employee not found!");

    res.status(200).json(leave);
  } catch (error: any) {
    res.status(500).json(`Error: ${error.message}`);
  }
};
