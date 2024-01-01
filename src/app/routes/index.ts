import { Router } from 'express';
import { CourseRoutes } from '../modules/Course/course.route';
import { singleCourseRouter } from '../modules/Course/course.singleCourseRouter';
import { ReviewRoutes } from '../modules/Review/review.route';
import { CategoryRoutes } from '../modules/Catrgory/category.route';
import { UserRoutes } from '../modules/user/user.route';

const router = Router();

const moduleRoutes = [
  {
    path: '/auth',
    route: UserRoutes,
  },
  {
    path: '/course',
    route: singleCourseRouter,
  },
  {
    path: '/courses',
    route: CourseRoutes,
  },
  {
    path: '/categories',
    route: CategoryRoutes,
  },
  {
    path: '/reviews',
    route: ReviewRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
