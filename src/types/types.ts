export interface ResponseDTO {
  status: number;
  message: string;
  data?: any;
  error?: any;
  pagination?: {
    total: number;
    currentPage: number;
    totalPages: number;
    pageSize: number;
    hasMore: boolean;
  };
}

export type PaginatedResponse<T, K extends string = "data"> = {
  [key in K]: T[];
} & {
  total: number;
  currentPage: number;
  totalPages: number;
  pageSize: number;
  hasMore: boolean;
};

export interface PaginationParams {
  page?: number;
  pageSize?: number;
}

export interface UserType {
  id: Number;
  email: string;
  sub?: string | null;
  name?: string | null;
  given_name?: string | null;
  family_name?: string | null;
  picture?: string | null;
  locale?: string | null;
  hd?: string | null;
  profile?: string | null;
}

export type ENV = {
  DB: D1Database;
  BACKEND_URL: string;
  FRONTEND_URL: string;
  JWT_SECRET: string;
};

export interface GooglePayload {
  email: string;
  sub: string;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  locale: string;
  hd: string;
  profile: string;
}

export interface JWTPayload {
  email: string;
  sub: number;
  exp: number;
  signature?: string;
}
