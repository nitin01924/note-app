import Joi from "joi";

//
// !!==================== Register-Schema ====================!!
export const registerSchema = Joi.object({
  name: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
});

//
// !!==================== Login-Schema ====================!!
export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
});
