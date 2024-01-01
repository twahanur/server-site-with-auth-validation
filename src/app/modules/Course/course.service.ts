/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import {
  TCourse,
  TCourseQuery,
  TGetAllCoursesPayloadType,
  TTag,
} from './course.interface';
import { Course } from './course.model';
import { calculateDurationInWeeks } from './course.utils';
import { Review } from '../Review/review.model';

const createCourseIntoDB = async (payload: TCourse, tokenData: any) => {
  payload.createdBy = tokenData._id;
  payload.durationInWeeks = calculateDurationInWeeks(
    payload.startDate,
    payload.endDate,
  );
  const result = await Course.create(payload);

  return result;
};

const getAllCoursesFromDB = async (payload: TGetAllCoursesPayloadType) => {
  try {
    const {
      page = 1,
      limit = 10,
      sortBy = 'title',
      sortOrder = 'asc',
      minPrice,
      maxPrice,
      tags,
      startDate,
      endDate,
      language,
      provider,
      durationInWeeks,
      level,
    } = payload;
    const query: TCourseQuery | any = {};

    if (sortOrder !== 'asc' && sortOrder !== 'desc') {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "SortOrder must be 'asc' or 'desc'",
      );
    }
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice as string);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice as string);
    }
    if (tags) query['tags.name'] = tags;
    if (startDate) query.startDate = { $gte: startDate };
    if (endDate) query.endDate = { $lte: endDate };
    if (language) query.language = language;
    if (provider) query.provider = provider;
    if (durationInWeeks) {
      const calculatedEndDate = new Date(startDate as string);
      calculatedEndDate.setDate(
        calculatedEndDate.getDate() +
          7 * parseInt(durationInWeeks as string, 10),
      );
      query.startDate = { $lte: calculatedEndDate };
    }
    if (level) query['details.level'] = level;

    const sortOptions: Record<string, any> = {};
    sortOptions[sortBy as string] = sortOrder === 'asc' ? 1 : -1;
    const courses = await Course.find(query)
      .sort(sortOptions)
      .skip((parseInt(page as string, 10) - 1) * parseInt(limit as string, 10))
      .limit(parseInt(limit as string, 10))
      .populate('createdBy');

    const total = await Course.countDocuments(query);
    const meta = { page: Number(page), limit: Number(limit), total: total };

    return { courses, meta };
  } catch (error) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to retrieved courses');
  }
};

const getBestCourseFromDB = async () => {
  try {
    const result = await Review.aggregate([
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
      throw new AppError(httpStatus.NOT_FOUND, 'No courses found');
    }

    const bestCourseId = result[0]._id;
    const averageRating = result[0].averageRating;
    const reviewCount = result[0].reviewCount;

    const bestCourse =
      await Course.findById(bestCourseId).populate('createdBy');
    if (!bestCourse) {
      throw new AppError(
        httpStatus.INTERNAL_SERVER_ERROR,
        'Server Error, Course is not exists',
      );
    }

    const response = {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Best course retrieved successfully',
      data: {
        course: {
          ...(bestCourse?.toObject() || []),
        },
        averageRating,
        reviewCount,
      },
    };

    return response;
  } catch (error: any) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      error.message || 'Failed to find the best course',
    );
  }
};

const updateCourseIntoDB = async (id: string, payload: Partial<TCourse>) => {
  const validCourse = await Course.findById(id);
  if (validCourse) {
    const { tags, details, durationInWeeks, ...remainingCourseData } = payload;
    const modifiedUpdatedData: Record<string, unknown> = {
      ...remainingCourseData,
    };

    if (details && Object.keys(details).length) {
      for (const [key, value] of Object.entries(details)) {
        modifiedUpdatedData[`details.${key}`] = value;
      }
    }
    if (durationInWeeks) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'cannot update duration week property',
      );
    }
    const existingCourse: TCourse | null = await Course.findById(id);
    if (tags && tags.length > 0) {
      tags.forEach(async (tag: TTag) => {
        const { name, isDeleted } = tag;
        const tagExists = existingCourse?.tags?.some((t) => t.name === name);
        if (isDeleted && tagExists) {
          await Course.findByIdAndUpdate(id, {
            $pull: { tags: { name, isDeleted: false } },
          });
        } else if (!isDeleted && !tagExists) {
          await Course.findByIdAndUpdate(id, {
            $addToSet: { tags: { name, isDeleted: false } },
          });
        }
      });
    }

    if (modifiedUpdatedData.endDate && existingCourse) {
      modifiedUpdatedData.durationInWeeks = calculateDurationInWeeks(
        existingCourse.startDate.toString(),
        modifiedUpdatedData.endDate.toString(), // Assuming endDate is also of type Date
      );
    }

    const result = await Course.findByIdAndUpdate(id, modifiedUpdatedData, {
      new: true,
      runValidators: true,
    }).populate('createdBy');
    return result;
  } else {
    throw new AppError(404, 'Invalid id | Course is not found');
  }
};

const getSingleCourseWithReviewsFromDB = async (id: string) => {
  try {
    const course = await Course.findById(id).populate('createdBy');
    if (!course) {
      throw new AppError(httpStatus.NOT_FOUND, 'Course not found');
    }
    const reviews = await Review.findOne({ courseId: id });
    return { course, reviews };
  } catch (error) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Failed to get course details and reviews',
    );
  }
};

export const CourseServices = {
  createCourseIntoDB,
  getAllCoursesFromDB,
  updateCourseIntoDB,
  getBestCourseFromDB,
  getSingleCourseWithReviewsFromDB,
};
