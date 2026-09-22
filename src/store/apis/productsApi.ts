import { API_BASE_URL } from "@/constants";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { ApiEnvelope } from "./authApi";

// ---- Response shapes (backend theke asha real data onujayi) ----

export interface ProductCategory {
  _id: string;
  id: string;
  name: string;
  image: string;
  slug: string;
}

export interface ProductVariant {
  _id: string;
  sku: string;
  color: string;
  size: string;
  price: number;
  compareAtPrice: number;
  discountPercentage: number;
  savingsAmount: number;
  stock: number;
  image: string;
}

export interface Product {
  _id: string;
  title: string;
  slug: string;
  sku: string;
  description: string;
  price: number;
  compareAtPrice: number;
  discountPercentage: number;
  savingsAmount: number;
  stock: number;
  status: "active" | "inactive" | "draft" | string;
  category: ProductCategory;
  brand: string;
  images: string[];
  variants: ProductVariant[];
  isDeleted: boolean;
  lowStockAlert: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductsMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// Product list response e "meta" thake, sadharon ApiEnvelope theke alada
export type ProductsResponse = ApiEnvelope<Product[]> & { meta: ProductsMeta };

// ---- Request params (Postman e dekha shob query onujayi) ----

export interface GetProductsParams {
  page?: number;
  limit?: number;
  searchTerm?: string; // title, description, category er upor search kore
  isLowStock?: boolean;
  inStock?: boolean;
  hasDiscount?: boolean;
  sort?: string; // e.g. "price" ba "-price"
  minPrice?: number;
  maxPrice?: number;
}

export const productsApi = createApi({
  reducerPath: "productsApi",
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
  tagTypes: ["Products", "Product"],
  endpoints: (builder) => ({
    getProducts: builder.query<ProductsResponse, GetProductsParams | void>({
      query: (args) => {
        const params: Record<string, string | number | boolean> = {};
        const {
          page,
          limit,
          searchTerm,
          isLowStock,
          inStock,
          hasDiscount,
          sort,
          minPrice,
          maxPrice,
        } = args ?? {};

        if (page !== undefined) params.page = page;
        if (limit !== undefined) params.limit = limit;
        if (searchTerm) params.searchTerm = searchTerm;
        if (isLowStock !== undefined) params.isLowStock = isLowStock;
        if (inStock !== undefined) params.inStock = inStock;
        if (hasDiscount !== undefined) params.hasDiscount = hasDiscount;
        if (sort) params.sort = sort;
        if (minPrice !== undefined) params.minPrice = minPrice;
        if (maxPrice !== undefined) params.maxPrice = maxPrice;

        return { url: "/products", method: "GET", params };
      },
      providesTags: ["Products"],
    }),
    // GET {{baseUrl}}/products/{slug}
    getProductBySlug: builder.query<ApiEnvelope<Product>, string>({
      query: (slug) => ({ url: `/products/${slug}`, method: "GET" }),
      providesTags: (_result, _error, slug) => [{ type: "Product", id: slug }],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useLazyGetProductsQuery,
  useGetProductBySlugQuery,
} = productsApi;