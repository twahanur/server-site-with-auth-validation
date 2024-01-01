import { z } from 'zod';

const createCategoryValidationSchema = z.object({
  name: z.string({
    invalid_type_error: 'Category name must be string',
    required_error: 'Name is required',
  }),
});

export const CategoryValidation = {
  createCategoryValidationSchema,
};
