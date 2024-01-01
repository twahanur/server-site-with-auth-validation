"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserValidation = void 0;
// import { UserStatus } from './user.constant';
const zod_1 = require("zod");
const userValidationSchema = zod_1.z.object({
    email: zod_1.z
        .string({
        invalid_type_error: 'Email must be a string',
    })
        .email({ message: 'Invalid email format' })
        .refine((data) => !!data, { message: 'Email is required' }),
    password: zod_1.z
        .string({
        invalid_type_error: 'Password must be a string',
    })
        .refine((data) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&]{8,}$/.test(data), {
        message: 'Password must be complex with at least one uppercase letter, one lowercase letter, one digit, and one special character',
    })
        .refine((data) => !!data, { message: 'Password is required' }),
    role: zod_1.z
        .string({
        invalid_type_error: 'Role must be a string',
    })
        .optional(),
});
const loginValidationSchema = zod_1.z.object({
    username: zod_1.z.string({ required_error: 'Username is required.' }),
    password: zod_1.z.string({ required_error: 'Password is required' }),
});
const changePasswordValidationSchema = zod_1.z.object({
    currentPassword: zod_1.z.string({
        required_error: 'Old password is required',
    }),
    newPassword: zod_1.z.string({ required_error: 'Password is required' }),
});
exports.UserValidation = {
    userValidationSchema,
    loginValidationSchema,
    changePasswordValidationSchema,
};
