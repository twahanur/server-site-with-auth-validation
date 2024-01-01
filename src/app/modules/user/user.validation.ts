// import { UserStatus } from './user.constant';
import { z } from 'zod';
const userValidationSchema = z.object({
  email: z
    .string({
      invalid_type_error: 'Email must be a string',
    })
    .email({ message: 'Invalid email format' })
    .refine((data) => !!data, { message: 'Email is required' }),
  password: z
    .string({
      invalid_type_error: 'Password must be a string',
    })
    .refine(
      (data) =>
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&]{8,}$/.test(
          data,
        ),
      {
        message:
          'Password must be complex with at least one uppercase letter, one lowercase letter, one digit, and one special character',
      },
    )
    .refine((data) => !!data, { message: 'Password is required' }),
  role: z
    .string({
      invalid_type_error: 'Role must be a string',
    })
    .optional(),
});

const loginValidationSchema = z.object({
  username: z.string({ required_error: 'Username is required.' }),
  password: z.string({ required_error: 'Password is required' }),
});

const changePasswordValidationSchema = z.object({
  currentPassword: z.string({
    required_error: 'Old password is required',
  }),
  newPassword: z.string({ required_error: 'Password is required' }),
});

export const UserValidation = {
  userValidationSchema,
  loginValidationSchema,
  changePasswordValidationSchema,
};
