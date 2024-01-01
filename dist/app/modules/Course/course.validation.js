"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseValidations = exports.updateCourseValidationSchema = exports.createCourseValidationSchema = exports.TCourseValidationSchema = void 0;
const zod_1 = require("zod");
const TTagValidationSchema = zod_1.z.object({
    name: zod_1.z.string(),
    isDeleted: zod_1.z.boolean().optional(),
});
const TCourseDetailsValidationSchema = zod_1.z.object({
    level: zod_1.z.string(),
    description: zod_1.z.string(),
});
exports.TCourseValidationSchema = zod_1.z.object({
    title: zod_1.z.string(),
    instructor: zod_1.z.string(),
    categoryId: zod_1.z.string(),
    price: zod_1.z.number(),
    tags: zod_1.z.array(TTagValidationSchema),
    startDate: zod_1.z.string(),
    endDate: zod_1.z.string(),
    language: zod_1.z.string(),
    provider: zod_1.z.string(),
    details: TCourseDetailsValidationSchema,
    isDeleted: zod_1.z.boolean().optional(),
});
exports.createCourseValidationSchema = exports.TCourseValidationSchema;
exports.updateCourseValidationSchema = exports.TCourseValidationSchema.partial();
exports.CourseValidations = {
    createCourseValidationSchema: exports.createCourseValidationSchema,
    updateCourseValidationSchema: exports.updateCourseValidationSchema,
};
