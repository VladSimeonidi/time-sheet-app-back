import {
  validateNewTimeSheet,
  validateUpdateTimeSheet,
} from "../validators/timesheet";
import TimeSheetModel from "../models/timesheet";
import { Response, Request } from "express";
import { Types } from "mongoose";
import LeaveModel from "../models/leave";

export const createTimeSheet = async (req: Request, res: Response) => {
  try {
    const { error } = validateNewTimeSheet(req.body);

    if (error) return res.status(400).send(error.details[0].message);

    const { employee, date } = req.body;

    if (!employee) return res.status(400).send("No employee provided");

    if (!date) return res.status(400).send("No start_date provided");

    const normalizedDate = new Date(date).setHours(0, 0, 0, 0);

    const conflictingTimeSheet = await LeaveModel.findOne({
      employee: employee,

      start_date: {
        $lte: normalizedDate,
      },

      end_date: {
        $gte: normalizedDate,
      },
    });

    if (conflictingTimeSheet)
      return res
        .status(400)
        .json(
          `Error: "Cannot add sick time sheet on a day with existing leave`
        );

    const newTimeSheetModel = new TimeSheetModel({ ...req.body });

    await newTimeSheetModel.save();

    const newTimeSheet = newTimeSheetModel.toObject();

    return res.status(200).json(newTimeSheet);
  } catch (error: any) {
    res.status(500).json(`Error: ${error.message}`);
  }
};

export const getTimeSheetsPaginated = async (req: Request, res: Response) => {
  try {
    const pageNumber: number = Number(req.query.pageNumber);

    const pageSize: number = Number(req.query.pageSize);

    if (!pageNumber || !pageSize)
      return res
        .status(400)
        .send("No parameter, page number or page size is NaN");

    const timeSheets = await TimeSheetModel.find()
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .populate("employee")
      .sort({ date: -1 })
      .lean();

    const documentsTotal = await TimeSheetModel.countDocuments();

    res.status(200).json({ items: timeSheets, totalRecords: documentsTotal });
  } catch (error: any) {
    res.status(500).json(`Error: ${error.message}`);
  }
};

export const updateTimeSheet = async (req: Request, res: Response) => {
  try {
    const { error } = validateUpdateTimeSheet(req.body);

    if (error) return res.status(400).send(error.details[0].message);

    const { id } = req.params;

    if (!Types.ObjectId.isValid(id))
      return res.status(400).send("Invalid ObjectId");

    const timeSheet = await TimeSheetModel.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true }
    ).lean();

    if (!timeSheet) return res.status(404).json("Employee not found!");

    res.status(200).json(timeSheet);
  } catch (error: any) {
    res.status(500).json(`Error: ${error.message}`);
  }
};

export const deleteTimeSheet = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!Types.ObjectId.isValid(id))
      return res.status(400).send("Invalid ObjectId");

    const timeSheet = await TimeSheetModel.findOneAndDelete({ _id: id }).lean();

    if (!timeSheet) return res.status(404).json("Employee not found!");

    res.status(200).json(timeSheet);
  } catch (error: any) {
    res.status(500).json(`Error: ${error.message}`);
  }
};
