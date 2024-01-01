/* eslint-disable @typescript-eslint/no-explicit-any */
import { TReview } from './review.interface';
import { Review } from './review.model';

const createReviewIntoDB = async (payload: TReview, tokenData: any) => {
  payload.createdBy = tokenData._id;
  const result = (await Review.create(payload)).populate('createdBy');
  return result;
};

const getAllReviewFromDB = async () => {
  const result = await Review.find();
  return result;
};

export const ReviewServices = {
  createReviewIntoDB,
  getAllReviewFromDB,
};
