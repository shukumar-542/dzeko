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
      <h1 className="mb-1 text-2xl font-bold text-gray-900">
        Krijoni llogarinë tuaj në Testora
        {/* Create your Testora account */}
      </h1>
      <p className="mb-6 text-sm text-gray-500">
        Përdorni të njëjtën llogari si në ueb, ashtu edhe në aplikacion
        {/* Use one account across both Web and App */}
      </p>

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
