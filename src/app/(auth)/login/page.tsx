"use client";

import { ROUTES } from "@/constants";
import { cn } from "@/lib/utils";
import { getErrorMessage, useLoginMutation } from "@/store/apis";
import { useAppDispatch } from "@/store/hooks";
import { setCredentials } from "@/store/slices/authSlice";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Eye, EyeOff, Lock, Mail } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const schema = z.object({
  email: z.string().min(1, "Email is required").email("Please enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type FormValues = z.infer<typeof schema>;

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect");
  const dispatch = useAppDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [login, { isLoading: isLoggingIn }] = useLoginMutation();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormValues) => {
    try {
      const response = await login({ email: data.email, password: data.password }).unwrap();
      dispatch(
        setCredentials({
          user: {
            id: response.data.userId || "",
            name: data.email.split("@")[0] || "User",
            email: data.email,
            role: "student",
          },
          token: response.data.accessToken,
        })
      );
      toast.success(response.message || "Login successful.");
      const destination =
        redirectUrl && redirectUrl.startsWith("/") ? redirectUrl : ROUTES.HOME;
      router.push(destination);
    } catch (error) {
      toast.error(getErrorMessage(error, "Invalid credentials. Please try again."));
    }
  };

  const isSubmittingForm = isSubmitting || isLoggingIn;

  return (
    <div className="w-full max-w-100">
      <h1 className="mb-1 text-2xl font-bold text-gray-900">
        Mirë se vini në Testora
        {/* Welcome to Testora */}
      </h1>
      <p className="mb-6 text-sm text-gray-500">
        Një llogari funksionon si në ueb, ashtu edhe në aplikacion
        {/* One account works on both Web and App */}
      </p>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
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
            <p className="mt-1.5 flex items-center gap-1 text-xs text-red-500">
              <AlertCircle className="h-3 w-3" />
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Password */}
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">Password</label>
            <Link
              href={ROUTES.FORGOT_PASSWORD}
              className="text-primary text-xs font-medium hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Lock className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              {...register("password")}
              placeholder="Enter your password"
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
              onClick={() => setShowPassword((v) => !v)}
              className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1.5 flex items-center gap-1 text-xs text-red-500">
              <AlertCircle className="h-3 w-3" />
              {errors.password.message}
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
          {isSubmittingForm ? "Logging in..." : "Log In"}
        </button>
      </form>

      {/* OAuth */}
      <div className="my-5 flex items-center gap-3">
        <div className="h-px flex-1 bg-gray-200" />
        <span className="text-xs text-gray-400">Or continue with</span>
        <div className="h-px flex-1 bg-gray-200" />
      </div>
      <div className="space-y-3"></div>

      <p className="mt-6 text-center text-sm text-gray-500">
        Don&apos;t have an account?{" "}
        <Link href={ROUTES.REGISTER} className="text-primary font-medium hover:underline">
          Sign Up
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full max-w-100 py-10 text-center">
          <p className="text-sm text-gray-400">Loading login...</p>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
