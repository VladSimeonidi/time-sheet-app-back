import joi from "joi";
import { Types } from "mongoose";

const objectIdValidator = (value: any, helpers: any) => {
  if (!Types.ObjectId.isValid(value)) {
    return helpers.message("{{#label}} must be a valid ObjectId");
  }
  return value;
};

export function validateLeave(requestBody: any) {
  const schema = joi.object({
    employee: joi
      .string()
      .length(24)
      .custom(objectIdValidator, "ObjectId validation")
      .required(),
    leave_type: joi.string().required(),
    start_date: joi.date().required(),
    end_date: joi.date().required(),
    status: joi.string().required(),
  });

  return schema.validate(requestBody);
}

export function validateUpdateLeave(requestBody: any) {
  const schema = joi
    .object({
      employee: joi
        .string()
        .length(24)
        .custom(objectIdValidator, "ObjectId validation"),
      leave_type: joi.string(),
      start_date: joi.date(),
      end_date: joi.date(),
      status: joi.string(),
    })
    .min(1);

  return schema.validate(requestBody);
}
