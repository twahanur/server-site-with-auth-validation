import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { CategoryValidation } from './category.validation';
import { categoryController } from './category.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';
const router = express.Router();

router.post(
  '/',
  auth(USER_ROLE.admin),
  validateRequest(CategoryValidation.createCategoryValidationSchema),
  categoryController.createCategory,
);

router.get('/:courseId', categoryController.getAllCategories);

router.get('/', categoryController.getAllCategories);

export const CategoryRoutes = router;
