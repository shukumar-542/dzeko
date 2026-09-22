import { API_BASE_URL } from "@/constants";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface ApiEnvelope<T = unknown> {
  statusCode: number;
  success: boolean;
  message: string;
  data: T;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginData {
  accessToken: string;
  refreshToken?: string;
  userId?: string;
}

export interface RegisterRequest {
  fullName: string;
  city: string;
  email: string;
  password: string;
}

export interface OtpRequest {
  email: string;
  otp: string;
}

export interface EmailRequest {
  email: string;
}

export interface ResetPasswordRequest {
  email: string;
  newPassword: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export function getErrorMessage(error: unknown, fallback = "Something went wrong."): string {
  if (!error || typeof error !== "object") return fallback;

  if ("data" in error && error.data && typeof error.data === "object") {
    const apiError = error.data as { message?: unknown };
    if (typeof apiError.message === "string") return apiError.message;
  }

  if ("error" in error && typeof error.error === "string") return error.error;

  return fallback;
}

export const authApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const state = getState() as { auth?: { token?: string | null } };
      const token = state.auth?.token;
      if (token) {
        headers.set("authorization", token.startsWith("Bearer ") ? token : `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    login: builder.mutation<ApiEnvelope<LoginData>, LoginRequest>({
      query: (body) => ({ url: "/auth/login", method: "POST", body }),
    }),
    registerUser: builder.mutation<ApiEnvelope<{ id: string; email: string }>, RegisterRequest>({
      query: (body) => ({ url: "/user/create", method: "POST", body }),
    }),
    verifyEmail: builder.mutation<
      ApiEnvelope<{ accessToken?: string; refreshToken?: string }>,
      OtpRequest
    >({
      query: (body) => ({ url: "/auth/verify-email", method: "POST", body }),
    }),
    resendOtp: builder.mutation<ApiEnvelope<unknown>, EmailRequest>({
      query: (body) => ({ url: "/auth/resend-otp", method: "POST", body }),
    }),
    forgotPassword: builder.mutation<ApiEnvelope<unknown>, EmailRequest>({
      query: (body) => ({ url: "/auth/forgot-password", method: "POST", body }),
    }),
    resetPasswordOtp: builder.mutation<ApiEnvelope<unknown>, EmailRequest>({
      query: (body) => ({ url: "/auth/reset-password-otp", method: "POST", body }),
    }),
    verifyResetPassword: builder.mutation<ApiEnvelope<unknown>, OtpRequest>({
      query: (body) => ({ url: "/auth/verify/reset-password", method: "POST", body }),
    }),
    resetPassword: builder.mutation<ApiEnvelope<unknown>, ResetPasswordRequest>({
      query: (body) => ({ url: "/auth/reset-password", method: "POST", body }),
    }),
    socialLogin: builder.mutation<ApiEnvelope<LoginData>, Record<string, unknown>>({
      query: (body) => ({ url: "/auth/social-login", method: "POST", body }),
    }),
    refreshToken: builder.mutation<ApiEnvelope<LoginData>, RefreshTokenRequest>({
      query: (body) => ({ url: "/auth/refresh-token", method: "POST", body }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterUserMutation,
  useVerifyEmailMutation,
  useResendOtpMutation,
  useForgotPasswordMutation,
  useResetPasswordOtpMutation,
  useVerifyResetPasswordMutation,
  useResetPasswordMutation,
  useSocialLoginMutation,
  useRefreshTokenMutation,
} = authApi;


