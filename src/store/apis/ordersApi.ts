import { API_BASE_URL } from "@/constants";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { ApiEnvelope } from "./authApi";

export interface CheckoutItem {
  product: string;
  quantity: number;
}

export interface ShippingAddress {
  fullName: string;
  phoneNumber: string;
  streetAddress: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export type PaymentMethodType = "stripe" | "cash_on_delivery";

export interface CheckoutRequest {
  items: CheckoutItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: PaymentMethodType;
  couponCode?: string;
  customerNotes?: string;
}

export interface CheckoutResponseData {
  url?: string;
  sessionUrl?: string;
  orderId?: string;
  _id?: string;
  id?: string;
  order?: any;
  totalAmount?: number;
  [key: string]: any;
}

export interface Coupon {
  _id: string;
  id?: string;
  code: string;
  description?: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  minOrderAmount?: number;
  maxDiscountAmount?: number;
  isActive: boolean;
  startDate?: string;
  expiryDate?: string;
}

export const ordersApi = createApi({
  reducerPath: "ordersApi",
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
  tagTypes: ["Orders", "Coupons"],
  endpoints: (builder) => ({
    // POST {{baseUrl}}/orders/checkout
    createCheckout: builder.mutation<ApiEnvelope<CheckoutResponseData>, CheckoutRequest>({
      query: (body) => ({
        url: "/orders/checkout",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Orders"],
    }),

    // GET {{baseUrl}}/orders/my-orders
    getMyOrders: builder.query<ApiEnvelope<any[]>, void>({
      query: () => ({ url: "/orders/my-orders", method: "GET" }),
      providesTags: ["Orders"],
    }),

    // GET {{baseUrl}}/coupons
    getCoupons: builder.query<ApiEnvelope<Coupon[]>, void>({
      query: () => ({ url: "/coupons", method: "GET" }),
      providesTags: ["Coupons"],
    }),
  }),
});

export const {
  useCreateCheckoutMutation,
  useGetMyOrdersQuery,
  useGetCouponsQuery,
  useLazyGetCouponsQuery,
} = ordersApi;
