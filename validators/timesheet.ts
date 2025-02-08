import joi from "joi";
import { Types } from "mongoose";

const objectIdValidator = (value: any, helpers: any) => {
  if (!Types.ObjectId.isValid(value)) {
    return helpers.message("{{#label}} must be a valid ObjectId");
  }
  return value;
};

export function validateNewTimeSheet(requestBody: any) {
  const schema = joi.object({
    employee: joi
      .string()
      .length(24)
      .custom(objectIdValidator, "ObjectId validation")
      .required(),
    date: joi.date().required(),
    start_time: joi.date().required(),
    end_time: joi.date().required(),
    breaks: joi.boolean().required(),
    total_hours_worked: joi.number().min(1).required(),
    timesheet_status: joi.string().required(),
  });

  return schema.validate(requestBody);
}

export function validateUpdateTimeSheet(requestBody: any) {
  const schema = joi
    .object({
      employee: joi
        .string()
        .length(24)
        .custom(objectIdValidator, "ObjectId validation"),
      date: joi.date(),
      start_time: joi.date(),
      end_time: joi.date(),
      breaks: joi.boolean(),
      total_hours_worked: joi.number().min(1),
      timesheet_status: joi.string(),
    })
    .min(1);

  return schema.validate(requestBody);
}
