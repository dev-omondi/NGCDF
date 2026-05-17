import Joi from "joi";

const passwordRules = Joi.string()
    .min(8)
    .max(128)
    .pattern(/[A-Z]/, "uppercase")
    .pattern(/[a-z]/, "lowercase")
    .pattern(/[0-9]/, "number")
    .pattern(/[@$!%*?&#^()_+\-=]/, "special character")
    .required()
    .messages({
        "string.empty":        "Password is required",
        "string.min":          "Password must be at least 8 characters",
        "string.max":          "Password must not exceed 128 characters",
        "string.pattern.name": "Password must contain at least one {#name}",
        "any.required":        "Password is required",
    });

export const registerSchema = Joi.object({
    firstName: Joi.string().trim().min(2).max(50).required().messages({
        "string.empty": "First name is required",
        "any.required": "First name is required",
        "string.min":   "First name must be at least 2 characters",
        "string.max":   "First name must not exceed 50 characters",
    }),
    secondName: Joi.string().trim().min(2).max(50).required().messages({
        "string.empty": "Second name is required",
        "any.required": "Second name is required",
        "string.min":   "Second name must be at least 2 characters",
        "string.max":   "Second name must not exceed 50 characters",
    }),
    email: Joi.string().trim().lowercase().email({ tlds: { allow: false } }).required().messages({
        "string.empty": "Email is required",
        "string.email": "Please provide a valid email",
        "any.required": "Email is required",
    }),
    password: passwordRules,
});