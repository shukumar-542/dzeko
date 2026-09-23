import { API_BASE_URL } from "@/constants";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { ApiEnvelope } from "./authApi";

export interface ShippingSettings {
  _id: string;
  isFreeShippingEnabled: boolean;
  defaultShippingFee: number;
  freeShippingThreshold: number;
  estimatedDeliveryDays: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface ShippingCalculation {
  shippingFee: number;
  isFreeShipping: boolean;
  threshold: number;
  amountNeededForFreeShipping: number;
}

export const shippingApi = createApi({
  reducerPath: "shippingApi",
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
  tagTypes: ["Shipping"],
  endpoints: (builder) => ({
    // GET {{baseUrl}}/shipping
    getShippingSettings: builder.query<ApiEnvelope<ShippingSettings>, void>({
      query: () => ({ url: "/shipping", method: "GET" }),
      providesTags: ["Shipping"],
    }),
    // GET {{baseUrl}}/shipping/calculate?subtotal=
    calculateShipping: builder.query<ApiEnvelope<ShippingCalculation>, number>({
      query: (subtotal) => ({
        url: "/shipping/calculate",
        method: "GET",
        params: { subtotal },
      }),
    }),
  }),
});

export const {
  useGetShippingSettingsQuery,
  useCalculateShippingQuery,
  useLazyCalculateShippingQuery,
} = shippingApi;