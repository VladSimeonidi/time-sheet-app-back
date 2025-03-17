import { validateLeave, validateUpdateLeave } from "../validators/leave";
import { Response, Request } from "express";
import { Types } from "mongoose";
import LeaveModel from "../models/leave";
import TimeSheetModel from "../models/timesheet";
import { hasConflictingTimeSheet } from "../utils/utils";

export const createLeave = async (req: Request, res: Response) => {
  try {
    const { error, value: data } = validateLeave(req.body);

    if (error) return res.status(400).send(error.details[0].message);

    const { employee, start_date, end_date } = data;

    const startDate = new Date(start_date).setHours(0, 0, 0, 0);
    const endDate = new Date(end_date).setHours(0, 0, 0, 0);

    const dateRange = { employee, startDate, endDate };

    const conflictingTimeSheet = await hasConflictingTimeSheet(
      TimeSheetModel,
      dateRange
    );

    if (conflictingTimeSheet)
      return res
        .status(400)
        .json("Can not add sick leave on a day with existing work hours");

    const newLeaveModel = new LeaveModel(data);

    await newLeaveModel.save();

    const newLeave = newLeaveModel.toObject();

    return res.status(200).json(newLeave);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
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
    res.status(500).json({ error: error.message });
  }
};

export const updateLeave = async (req: Request, res: Response) => {
  try {
    const { error, value: data } = validateUpdateLeave(req.body);

    if (error) return res.status(400).send(error.details[0].message);

    const { id } = req.params;

    const { employee, start_date, end_date } = data;

    if (!Types.ObjectId.isValid(id))
      return res.status(400).send("ObjectId is Invalid");

    const startDate = new Date(start_date).setHours(0, 0, 0, 0);
    const endDate = new Date(end_date).setHours(0, 0, 0, 0);

    const dateRange = { employee, startDate, endDate };

    const conflictingTimeSheet = await hasConflictingTimeSheet(
      TimeSheetModel,
      dateRange
    );

    if (conflictingTimeSheet)
      return res
        .status(400)
        .json("Can not add sick leave on a day with existing work hours");

    const leave = await LeaveModel.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true }
    ).lean();

    if (!leave) return res.status(404).json("Leave not found!");

    res.status(200).json(leave);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
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
    res.status(500).json({ error: error.message });
  }
};
