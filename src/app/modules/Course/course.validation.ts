import { z } from 'zod';

const TTagValidationSchema = z.object({
  name: z.string(),
  isDeleted: z.boolean().optional(),
});

const TCourseDetailsValidationSchema = z.object({
  level: z.string(),
  description: z.string(),
});

export const TCourseValidationSchema = z.object({
  title: z.string(),
  instructor: z.string(),
  categoryId: z.string(), // Assuming you get it as a string; adjust if it's another type
  price: z.number(),
  tags: z.array(TTagValidationSchema),
  startDate: z.string(),
  endDate: z.string(),
  language: z.string(),
  provider: z.string(),
  details: TCourseDetailsValidationSchema,
  isDeleted: z.boolean().optional(),
});

export const createCourseValidationSchema = TCourseValidationSchema;

export const updateCourseValidationSchema = TCourseValidationSchema.partial();
export const CourseValidations = {
  createCourseValidationSchema,
  updateCourseValidationSchema,
};
