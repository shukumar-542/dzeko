"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAppSelector } from "@/store/hooks";
import { ROUTES } from "@/constants";
import { toast } from "sonner";

interface UseAuthGuardOptions {
  redirectUrl?: string;
  message?: string;
}

export function useAuthGuard(options?: UseAuthGuardOptions) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const [isChecking, setIsChecking] = useState(true);
  const hasRedirected = useRef(false);

  const redirectTarget = options?.redirectUrl || pathname;
  const message = options?.message ?? "Please log in to continue.";

  useEffect(() => {
    if (!isAuthenticated) {
      if (!hasRedirected.current) {
        hasRedirected.current = true;
        if (message) {
          toast.error(message);
        }
        const loginUrl = `${ROUTES.LOGIN}?redirect=${encodeURIComponent(redirectTarget)}`;
        router.replace(loginUrl);
      }
    } else {
      const timer = setTimeout(() => {
        setIsChecking(false);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, redirectTarget, router, message]);

  return { isAuthenticated, isChecking };
}
