import { Types } from 'mongoose';

export type TTag = {
  name: string;
  isDeleted: boolean;
};

export type TCourseDetails = {
  level: string;
  description: string;
};

export type TCourse = {
  _id?: string;
  title: string;
  instructor: string;
  categoryId: Types.ObjectId;
  price: number;
  tags: TTag[];
  startDate: string;
  endDate: string;
  language: string;
  provider: string;
  durationInWeeks: number;
  details: TCourseDetails;
  createdBy?: string;
};
export type TGetAllCoursesPayloadType = {
  price?: number;
  page?: string;
  limit?: string;
  sortBy?: "asc" | "desc";
  sortOrder?: string;
  minPrice?: string;
  maxPrice?: string;
  tags?: string;
  startDate?: string;
  endDate?: string;
  language?: string;
  provider?: string;
  durationInWeeks?: string;
  level?: string;
};
export type TCourseQuery = {
  price?: {
    $gte?: number;
    $lte?: number;
  };
  'tags.name'?: {
    $in?: string[] | undefined;
  };
  startDate?: {
    $gte?: Date;
  };
  endDate?: {
    $lte?: Date;
  };
  language?: string;
  provider?: string;
};
