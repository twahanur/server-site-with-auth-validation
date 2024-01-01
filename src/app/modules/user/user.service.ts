/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import config from '../../config';
import AppError from '../../errors/AppError';
import { TLoginUser, TUser } from './user.interface';
import { User } from './user.model';
import { createToken } from './user.utils';
import bcrypt from 'bcrypt';
import { JwtPayload } from 'jsonwebtoken';

const createUserIntoDB = async (payload: TUser) => {
  const data = await User.create(payload);
  const result = {
    _id: data._id,
    username: data.username,
    email: data.email,
    role: data.role,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  };
  return result;
};

const userLogin = async (payload: TLoginUser) => {
  const user = await User.isUserExistsByUserName(payload.username);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !');
  }
  if (!(await User.isPasswordMatched(payload?.password, user?.password)))
    throw new AppError(httpStatus.FORBIDDEN, 'Password do not matched');
  const jwtPayload = {
    _id: user._id as string,
    role: user.role as string,
    email: user.email as string,
    username: user.username as string,
  };

  const token = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  );
  const data = {
    _id: user._id,
    username: user.username,
    email: user.email,
    role: user.role,
  };
  return {
    data,
    token,
  };
};
const changePassword = async (
  userData: JwtPayload,
  payload: { currentPassword: string; newPassword: string },
) => {
  const user = await User.isUserExistsByUserName(userData.username);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found!');
  }

  if (
    !(await User.isPasswordMatched(payload?.currentPassword, user?.password))
  ) {
    throw new AppError(httpStatus.FORBIDDEN, 'Password does not match');
  }
  await User.isPasswordUsedBefore(payload.newPassword, user);

  const newHashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_salt_rounds),
  );

  const passwordHistory = { password: user.password, lastUpdate: new Date() };
  const data: TUser | any = await User.findOneAndUpdate(
    {
      id: userData.userId,
      role: userData.role,
    },
    {
      password: newHashedPassword,
      $push: { passwordHistory: { $each: [passwordHistory], $slice: -2 } },
      passwordChangedAt: new Date(),
    },
    { new: true }, // To return the updated document
  );
  return data;
};

export const UserServices = {
  createUserIntoDB,
  userLogin,
  changePassword,
};
