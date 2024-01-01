import { z } from 'zod';

const createReviewValidationSchema = z.object({
  courseId: z.string({
    invalid_type_error: 'Course ID must be a string',
    required_error: 'Course ID is required',
  }),
  rating: z
    .number({
      invalid_type_error: 'Rating must be a number',
      required_error: 'Rating is required',
    })
    .int()
    .min(1, 'Rating must be at least 1')
    .max(5, 'Rating cannot exceed 5'),
});

export const ReviewValidation = {
  createReviewValidationSchema,
};
