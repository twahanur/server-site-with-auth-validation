import express from 'express';
import { CourseControllers } from './course.controller';
import validateRequest from '../../middlewares/validateRequest';
import { CourseValidations } from './course.validation';
import { USER_ROLE } from '../user/user.constant';
import auth from '../../middlewares/auth';

const router = express.Router();
router.post(
  '/',
  auth(USER_ROLE.admin),
  validateRequest(CourseValidations.createCourseValidationSchema),
  CourseControllers.createCourse,
);
router.get('/', CourseControllers.getAllCourses);
router.put('/:courseId', auth(USER_ROLE.admin), CourseControllers.updateCourse);

router.get('/:courseId/reviews', CourseControllers.getSingleCourseWithReviews);

export const CourseRoutes = router;
