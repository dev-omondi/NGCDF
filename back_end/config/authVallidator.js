
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
        "string.min":      "Password must be at least 8 characters",
        "string.max":      "Password must not exceed 128 characters",
        "string.pattern.name": "Password must contain at least one {#name}",
        "any.required":    "Password is required",
    });

export const registerSchema = Joi.object({
    firstName:  Joi.string().trim().min(2).max(50).required().messages({
        "any.required": "First name is required",
        "string.min":   "First name must be at least 2 characters",
    }),
    secondName: Joi.string().trim().min(2).max(50).required().messages({
        "any.required": "Second name is required",
        "string.min":   "Second name must be at least 2 characters",
    }),
    email: Joi.string().trim().email({ tlds: { allow: false } }).required().messages({
        "string.email":  "Please provide a valid email",
        "any.required":  "Email is required",
    }),
    password:passwordRules,
    confirmPassword: Joi.any()
        .equal(Joi.ref("password"))
        .required()
        .messages({
            "any.only":"Passwords do not match",
            "any.required":"Please confirm your password",
        }),
});