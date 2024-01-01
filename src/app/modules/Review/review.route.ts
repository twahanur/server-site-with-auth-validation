import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { ReviewValidation } from './review.validation';
import { reviewController } from './review.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';
const router = express.Router();

router.post(
  '/',
  auth(USER_ROLE.user),
  validateRequest(ReviewValidation.createReviewValidationSchema),
  reviewController.createReview,
);


router.get('/', reviewController.getAllReview);

export const ReviewRoutes = router;
