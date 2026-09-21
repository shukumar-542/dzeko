export const APP_NAME = "Testora";

export const ROUTES = {
  HOME: "/",
  CONTACT: "/contact",
  LOGIN: "/login",
  REGISTER: "/register",
  FORGOT_PASSWORD: "/forgot-password",
  CHECK_EMAIL: "/check-email",
  VERIFY_CODE: "/verify-code",
  RESET_PASSWORD: "/reset-password",
  DASHBOARD: "/dashboard",
  PROFILE: "/profile",
  ABOUT: "/about",
  PACKAGES: "/packages",
  MARKETPLACE: "/marketplace",
  CART: "/cart",
  CHECKOUT: "/checkout",
  ORDER_CONFIRMATION: "/order-confirmation",
  ORDERS: "/orders",
  MY_PACKAGES: "/my-packages",
  BLOG: "/blog",
  PRIVACY_POLICY: "/privacy-policy",
  TERMS_OF_SERVICE: "/terms-of-service",
} as const;

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://10.10.28.81:5009/api/v1";

export const PAGINATION_DEFAULTS = {
  PAGE: 1,
  LIMIT: 10,
} as const;
