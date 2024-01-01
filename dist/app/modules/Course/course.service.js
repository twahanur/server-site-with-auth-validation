"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseServices = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const course_model_1 = require("./course.model");
const course_utils_1 = require("./course.utils");
const review_model_1 = require("../Review/review.model");
const createCourseIntoDB = (payload, tokenData) => __awaiter(void 0, void 0, void 0, function* () {
    payload.createdBy = tokenData._id;
    payload.durationInWeeks = (0, course_utils_1.calculateDurationInWeeks)(payload.startDate, payload.endDate);
    const result = yield course_model_1.Course.create(payload);
    return result;
});
const getAllCoursesFromDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { page = 1, limit = 10, sortBy = 'title', sortOrder = 'asc', minPrice, maxPrice, tags, startDate, endDate, language, provider, durationInWeeks, level, } = payload;
        const query = {};
        if (sortOrder !== 'asc' && sortOrder !== 'desc') {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "SortOrder must be 'asc' or 'desc'");
        }
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice)
                query.price.$gte = parseFloat(minPrice);
            if (maxPrice)
                query.price.$lte = parseFloat(maxPrice);
        }
        if (tags)
            query['tags.name'] = tags;
        if (startDate)
            query.startDate = { $gte: startDate };
        if (endDate)
            query.endDate = { $lte: endDate };
        if (language)
            query.language = language;
        if (provider)
            query.provider = provider;
        if (durationInWeeks) {
            const calculatedEndDate = new Date(startDate);
            calculatedEndDate.setDate(calculatedEndDate.getDate() +
                7 * parseInt(durationInWeeks, 10));
            query.startDate = { $lte: calculatedEndDate };
        }
        if (level)
            query['details.level'] = level;
        const sortOptions = {};
        sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;
        const courses = yield course_model_1.Course.find(query)
            .sort(sortOptions)
            .skip((parseInt(page, 10) - 1) * parseInt(limit, 10))
            .limit(parseInt(limit, 10))
            .populate('createdBy');
        const total = yield course_model_1.Course.countDocuments(query);
        const meta = { page: Number(page), limit: Number(limit), total: total };
        return { courses, meta };
    }
    catch (error) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Failed to retrieved courses');
    }
});
const getBestCourseFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield review_model_1.Review.aggregate([
            {
                $group: {
                    _id: '$courseId',
                    averageRating: { $avg: '$rating' },
                    reviewCount: { $sum: 1 },
                },
            },
            {
                $sort: { averageRating: -1 },
            },
            {
                $limit: 1,
            },
        ]);
        if (result.length === 0) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'No courses found');
        }
        const bestCourseId = result[0]._id;
        const averageRating = result[0].averageRating;
        const reviewCount = result[0].reviewCount;
        const bestCourse = yield course_model_1.Course.findById(bestCourseId).populate('createdBy');
        if (!bestCourse) {
            throw new AppError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'Server Error, Course is not exists');
        }
        const response = {
            success: true,
            statusCode: http_status_1.default.OK,
            message: 'Best course retrieved successfully',
            data: {
                course: Object.assign({}, ((bestCourse === null || bestCourse === void 0 ? void 0 : bestCourse.toObject()) || [])),
                averageRating,
                reviewCount,
            },
        };
        return response;
    }
    catch (error) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, error.message || 'Failed to find the best course');
    }
});
const updateCourseIntoDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const validCourse = yield course_model_1.Course.findById(id);
    if (validCourse) {
        const { tags, details, durationInWeeks } = payload, remainingCourseData = __rest(payload, ["tags", "details", "durationInWeeks"]);
        const modifiedUpdatedData = Object.assign({}, remainingCourseData);
        if (details && Object.keys(details).length) {
            for (const [key, value] of Object.entries(details)) {
                modifiedUpdatedData[`details.${key}`] = value;
            }
        }
        if (durationInWeeks) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'cannot update duration week property');
        }
        const existingCourse = yield course_model_1.Course.findById(id);
        if (tags && tags.length > 0) {
            tags.forEach((tag) => __awaiter(void 0, void 0, void 0, function* () {
                var _a;
                const { name, isDeleted } = tag;
                const tagExists = (_a = existingCourse === null || existingCourse === void 0 ? void 0 : existingCourse.tags) === null || _a === void 0 ? void 0 : _a.some((t) => t.name === name);
                if (isDeleted && tagExists) {
                    yield course_model_1.Course.findByIdAndUpdate(id, {
                        $pull: { tags: { name, isDeleted: false } },
                    });
                }
                else if (!isDeleted && !tagExists) {
                    yield course_model_1.Course.findByIdAndUpdate(id, {
                        $addToSet: { tags: { name, isDeleted: false } },
                    });
                }
            }));
        }
        if (modifiedUpdatedData.endDate && existingCourse) {
            modifiedUpdatedData.durationInWeeks = (0, course_utils_1.calculateDurationInWeeks)(existingCourse.startDate.toString(), modifiedUpdatedData.endDate.toString());
        }
        const result = yield course_model_1.Course.findByIdAndUpdate(id, modifiedUpdatedData, {
            new: true,
            runValidators: true,
        }).populate('createdBy');
        return result;
    }
    else {
        throw new AppError_1.default(404, 'Invalid id | Course is not found');
    }
});
const getSingleCourseWithReviewsFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const course = yield course_model_1.Course.findById(id).populate('createdBy');
        if (!course) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Course not found');
        }
        const reviews = yield review_model_1.Review.findOne({ courseId: id });
        return { course, reviews };
    }
    catch (error) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Failed to get course details and reviews');
    }
});
exports.CourseServices = {
    createCourseIntoDB,
    getAllCoursesFromDB,
    updateCourseIntoDB,
    getBestCourseFromDB,
    getSingleCourseWithReviewsFromDB,
};
