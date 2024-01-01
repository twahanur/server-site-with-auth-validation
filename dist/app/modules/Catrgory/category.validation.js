"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryValidation = void 0;
const zod_1 = require("zod");
const createCategoryValidationSchema = zod_1.z.object({
    name: zod_1.z.string({
        invalid_type_error: 'Category name must be string',
        required_error: 'Name is required',
    }),
});
exports.CategoryValidation = {
    createCategoryValidationSchema,
};
