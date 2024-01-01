"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewValidation = void 0;
const zod_1 = require("zod");
const createReviewValidationSchema = zod_1.z.object({
    courseId: zod_1.z.string({
        invalid_type_error: 'Course ID must be a string',
        required_error: 'Course ID is required',
    }),
    rating: zod_1.z
        .number({
        invalid_type_error: 'Rating must be a number',
        required_error: 'Rating is required',
    })
        .int()
        .min(1, 'Rating must be at least 1')
        .max(5, 'Rating cannot exceed 5'),
});
exports.ReviewValidation = {
    createReviewValidationSchema,
};
