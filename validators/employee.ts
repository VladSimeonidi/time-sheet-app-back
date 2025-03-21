import joi from "joi";

export function validateNewEmployee(requestBody: any) {
  const schema = joi.object({
    email: joi
      .string()
      .email({ tlds: { allow: false } })
      .required(),
    username: joi.string().required(),
    firstname: joi.string().required(),
    surname: joi.string().required(),
    role: joi.string().required(),
    employment_status: joi.string().required(),
    weekly_hours: joi.number().required(),
  });

  return schema.validate(requestBody);
}

export function validateUpdateEmployee(requestBody: any) {
  const schema = joi
    .object({
      email: joi.string().email({ tlds: { allow: false } }),
      username: joi.string(),
      firstname: joi.string(),
      surname: joi.string(),
      role: joi.string(),
      employment_status: joi.string(),
      weekly_hours: joi.number(),
    })
    .min(1);

  return schema.validate(requestBody);
}

export function validatePagination(requestBody: any) {
  const schema = joi.object({
    pageNumber: joi.number().integer().min(1).required(),
    pageSize: joi.number().integer().min(1).required(),
  });

  return schema.validate(requestBody);
}

export function validateTimeRange(requestBody: any) {
  const schema = joi.object({
    startDate: joi.date().required(),
    endDate: joi.date().required(),
  });

  return schema.validate(requestBody);
}
