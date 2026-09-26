import { API_BASE_URL } from "@/constants";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { ApiEnvelope } from "./authApi";

// NOTE: real /blog/list response onujayi update kora holo. Full field list
// confirm na howa porjonto baki field gulo optional/guess rekhe deya holo —
// prottekta field lagle real response-e dekhe niye add koro.
export interface BlogPost {
  _id: string;
  title: string;
  slug?: string;
  excerpt?: string;
  content?: string;
  category?: string;
  status: "draft" | "published" | string;
  image: string | null;
  author?: string;
  readTime?: string;
  isFeatured?: boolean;
  publishedAt: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface BlogListMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// Real shape: { statusCode, success, message, data: { data: BlogPost[], meta } }
export interface BlogListData {
  data: BlogPost[];
  meta: BlogListMeta;
}
export interface StashData {
  practiceQuestions: number;
  fullExamTests: number;
  subjectsCovered: number;
  practiceModes: number;
}

export type BlogListResponse = ApiEnvelope<BlogListData>;

export interface GetBlogListParams {
  page?: number;
  limit?: number;
  category?: string;
  status?: string;
  searchTerm?: string;
}

export const blogApi = createApi({
  reducerPath: "blogApi",
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
  tagTypes: ["Blog"],
  endpoints: (builder) => ({
    // GET {{baseUrl}}/blog/list?page=&limit=&category=&status=&searchTerm=
    getBlogList: builder.query<BlogListResponse, GetBlogListParams | void>({
      query: (args) => {
        const params: Record<string, string | number> = {};
        const { page, limit, category, status, searchTerm } = args ?? {};

        if (page !== undefined) params.page = page;
        if (limit !== undefined) params.limit = limit;
        if (category) params.category = category;
        if (status) params.status = status;
        if (searchTerm) params.searchTerm = searchTerm;

        return { url: "/blog/list", method: "GET", params };
      },
      providesTags: ["Blog"],
    }),
    // GET {{baseUrl}}/blog/details/{blogId}
    getBlogDetails: builder.query<ApiEnvelope<BlogPost>, string>({
      query: (blogId) => ({ url: `/blog/details/${blogId}`, method: "GET" }),
      providesTags: (_result, _error, blogId) => [{ type: "Blog", id: blogId }],
    }),
    getStash : builder.query<ApiEnvelope<StashData>, void>({
      query: () => ({ url: `/home/dashboard/platform-stats`, method: "GET" }),
      // providesTags: (_result, _error, blogId) => [{ type: "Blog", id: blogId }],
    }),

  }),
});

export const { useGetBlogListQuery, useGetBlogDetailsQuery, useGetStashQuery } = blogApi;