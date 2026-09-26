"use client";

import { ROUTES } from "@/constants";
import { cn } from "@/lib/utils";
import { getErrorMessage, useRegisterUserMutation } from "@/store/apis";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Eye, EyeOff, Lock, Mail, MapPin, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

// const CITY_OPTIONS = ["Dhaka", "Chattogram", "Khulna", "Rajshahi", "Sylhet", "Barishal"];

const schema = z
  .object({
    fullName: z.string().min(2, "Full name must be at least 2 characters"),
    email: z.string().min(1, "Email is required").email("Please enter a valid email"),
    city: z.string().min(1, "City is required"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[a-z]/, "Must include a lowercase letter")
      .regex(/[^A-Za-z0-9]/, "Must include a special character")
      .regex(/[A-Z]/, "Must include an uppercase letter")
      .regex(/[0-9]/, "Must include a number"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    agreeTerms: z
      .boolean()
      .refine((v) => v, "You must agree to Terms of Service and Privacy Policy"),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type FormValues = z.infer<typeof schema>;

export default function RegisterPage() {
  const router = useRouter();
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [registerUser, { isLoading: isRegistering }] = useRegisterUserMutation();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormValues) => {
    try {
      const response = await registerUser({
        fullName: data.fullName,
        city: data.city,
        email: data.email,
        password: data.password,
      }).unwrap();

      toast.success(response.message || "Registration successful. Please verify your email.");
      router.push(
        `${ROUTES.VERIFY_CODE}?email=${encodeURIComponent(data.email)}&mode=verify-email`
      );
    } catch (error) {
      console.log(error)
      toast.error(getErrorMessage(error, "Registration failed. Please try again."));
    }
  };

  const isSubmittingForm = isSubmitting || isRegistering;

  return (
    <div className="w-full max-w-100">
      <h1 className="mb-1 text-2xl font-bold text-gray-900">Create your Testora account</h1>
      <p className="mb-6 text-sm text-gray-500">Use one account across both Web and App</p>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        {/* Full Name */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">Full Name</label>
          <div className="relative">
            <User className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              autoComplete="name"
              {...register("fullName")}
              placeholder="Enter your full name"
              className={cn(
                "w-full rounded-lg border py-2.5 pr-3.5 pl-10 text-sm text-gray-900 placeholder-gray-400 transition outline-none",
                "focus:border-primary focus:ring-primary/20 focus:ring-2",
                errors.fullName
                  ? "border-red-400 bg-red-50 focus:border-red-400 focus:ring-red-400/20"
                  : "border-gray-200 bg-white"
              )}
            />
          </div>
          {errors.fullName && (
            <p className="mt-1 flex items-center gap-1 text-xs text-red-500">
              <AlertCircle className="h-3 w-3" />
              {errors.fullName.message}
            </p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">Email</label>
          <div className="relative">
            <Mail className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              autoComplete="email"
              {...register("email")}
              placeholder="Enter your email"
              className={cn(
                "w-full rounded-lg border py-2.5 pr-3.5 pl-10 text-sm text-gray-900 placeholder-gray-400 transition outline-none",
                "focus:border-primary focus:ring-primary/20 focus:ring-2",
                errors.email
                  ? "border-red-400 bg-red-50 focus:border-red-400 focus:ring-red-400/20"
                  : "border-gray-200 bg-white"
              )}
            />
          </div>
          {errors.email && (
            <p className="mt-1 flex items-center gap-1 text-xs text-red-500">
              <AlertCircle className="h-3 w-3" />
              {errors.email.message}
            </p>
          )}
        </div>

        {/* City */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">City</label>
          <div className="relative">
            <MapPin className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              autoComplete="address-level2"
              {...register("city")}
              placeholder="Enter your city"
              className={cn(
                "w-full rounded-lg border py-2.5 pr-3.5 pl-10 text-sm text-gray-900 placeholder-gray-400 transition outline-none",
                "focus:border-primary focus:ring-primary/20 focus:ring-2",
                errors.city
                  ? "border-red-400 bg-red-50 focus:border-red-400 focus:ring-red-400/20"
                  : "border-gray-200 bg-white"
              )}
            />
          </div>
          {errors.city && (
            <p className="mt-1 flex items-center gap-1 text-xs text-red-500">
              <AlertCircle className="h-3 w-3" />
              {errors.city.message}
            </p>
          )}
        </div>

        {/* Password */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">Password</label>
          <div className="relative">
            <Lock className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type={showPass ? "text" : "password"}
              autoComplete="new-password"
              {...register("password")}
              placeholder="Create a password"
              className={cn(
                "w-full rounded-lg border py-2.5 pr-10 pl-10 text-sm text-gray-900 placeholder-gray-400 transition outline-none",
                "focus:border-primary focus:ring-primary/20 focus:ring-2",
                errors.password
                  ? "border-red-400 bg-red-50 focus:border-red-400 focus:ring-red-400/20"
                  : "border-gray-200 bg-white"
              )}
            />
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setShowPass((v) => !v)}
              className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 flex items-center gap-1 text-xs text-red-500">
              <AlertCircle className="h-3 w-3" />
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">Confirm Password</label>
          <div className="relative">
            <Lock className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type={showConfirm ? "text" : "password"}
              autoComplete="new-password"
              {...register("confirmPassword")}
              placeholder="Confirm your password"
              className={cn(
                "w-full rounded-lg border py-2.5 pr-10 pl-10 text-sm text-gray-900 placeholder-gray-400 transition outline-none",
                "focus:border-primary focus:ring-primary/20 focus:ring-2",
                errors.confirmPassword
                  ? "border-red-400 bg-red-50 focus:border-red-400 focus:ring-red-400/20"
                  : "border-gray-200 bg-white"
              )}
            />
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setShowConfirm((v) => !v)}
              className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="mt-1 flex items-center gap-1 text-xs text-red-500">
              <AlertCircle className="h-3 w-3" />
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <div>
          <label className="flex items-start gap-2.5">
            <input
              type="checkbox"
              {...register("agreeTerms")}
              className="text-primary mt-0.5 h-4 w-4 rounded border-gray-300"
            />
            <span className="text-xs text-gray-500">
              I agree to the{" "}
              <Link href={ROUTES.TERMS_OF_SERVICE} className="text-primary hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href={ROUTES.PRIVACY_POLICY} className="text-primary hover:underline">
                Privacy Policy
              </Link>
              .
            </span>
          </label>
          {errors.agreeTerms && (
            <p className="mt-1 flex items-center gap-1 text-xs text-red-500">
              <AlertCircle className="h-3 w-3" />
              {errors.agreeTerms.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmittingForm}
          className="bg-primary hover:bg-primary/90 flex w-full items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmittingForm && (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
          )}
          {isSubmittingForm ? "Creating account..." : "Sign Up"}
        </button>
      </form>

      {/* OAuth */}
      <div className="my-5 flex items-center gap-3">
        <div className="h-px flex-1 bg-gray-200" />
        <span className="text-xs text-gray-400">Or continue with</span>
        <div className="h-px flex-1 bg-gray-200" />
      </div>
      <div className="space-y-3">
        {/* <button className="flex w-full items-center justify-center gap-3 rounded-lg border border-gray-200 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50">
          <svg className="h-4 w-4" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Continue with Google
        </button> */}
        {/* <button className="flex w-full items-center justify-center gap-3 rounded-lg border border-gray-200 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50">
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
          </svg>
          Continue with Apple
        </button> */}
      </div>

      <p className="mt-6 text-center text-sm text-gray-500">
        Already have an account?{" "}
        <Link href={ROUTES.LOGIN} className="text-primary font-medium hover:underline">
          Login
        </Link>
      </p>
    </div>
  );
}
