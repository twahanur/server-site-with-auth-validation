/* eslint-disable no-unused-vars */
import { Model } from 'mongoose';
import { USER_ROLE } from './user.constant';

export type TLoginUser = {
  _id: unknown;
  username: string;
  password: string;
};

export interface TUser {
  _id: string;
  passwordChangedAt: boolean;
  username: string;
  email: string;
  password: string;
  passwordHistory?: [
    {
      password: string;
      lastUpdate: Date;
    },
  ];
  role?: 'admin' | 'user';
  createdAt?: Date;
  updatedAt?: Date;
}
export interface TUpdatePassword {
  currentPassword: string;
  newPassword: string;
}

export interface UserModel extends Model<TUser> {
  isUserExistsByUserName(username: string): Promise<TUser>;
  isPasswordMatched(
    plainTextPassword: string,
    hashedPassword: string,
  ): Promise<boolean>;
  isPasswordUsedBefore(
    plainTextPassword: string,
    userData: TUser,
  ): Promise<boolean>;
  isJWTIssuedBeforePasswordChanged(
    passwordChangedTimestamp: Date,
    jwtIssuedTimestamp: number,
  ): boolean;
}

export type TUserRole = keyof typeof USER_ROLE;
