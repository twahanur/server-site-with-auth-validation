import httpStatus from 'http-status';
import { Schema, model } from 'mongoose';
import AppError from '../../errors/AppError';
import { TCategory } from './category.interface';

const categorySchema = new Schema<TCategory>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  {
    timestamps: true,
  },
);

categorySchema.pre('save', async function (next) {
  const isCategory = await Category.findOne({
    name: this.name,
  });
  if (isCategory) {
    throw new AppError(httpStatus.NOT_FOUND, 'This Category is already exist!');
  }
  next();
});

export const Category = model<TCategory>('Category', categorySchema);
