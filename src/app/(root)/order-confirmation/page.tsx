"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import {
  CheckCircle,
  ShoppingBag,
  MapPin,
  CreditCard,
  Package,
  Home,
  Loader2,
  XCircle,
} from "lucide-react";
import { ROUTES } from "@/constants";
import { useSearchParams } from "next/navigation";

/**
 * This page now handles TWO cases:
 *
 * 1. Cash on Delivery (COD) — checkout page redirects here directly with
 *    query params already filled in (method, name, city, address, total,
 *    etc). This path is unchanged from before.
 *
 * 2. Stripe — after payment, Stripe redirects back here via the
 *    `success_url` you configure on the backend, e.g:
 *
 *      success_url: `${FRONTEND_URL}${ROUTES.ORDER_CONFIRMATION}?session_id={CHECKOUT_SESSION_ID}&order_id=<id>`
 *
 *    Since `order_id` is available directly, we fetch the real order from
 *    the backend and fill in the same fields the COD flow already uses, so
 *    the rest of the page renders identically either way.
 *
 * NOTE: `fetchOrderById` below assumes `GET /orders/:id` returning
 * `{ success: boolean, data: {...order} }`. If your real endpoint or RTK
 * Query hook is different, tell me the shape and I'll swap it in.
 */

type OrderFields = {
  orderId: string;
  name: string;
  city: string;
  address: string;
  postal: string;
  phone: string;
  method: string; // "cash_on_delivery" | "cod" | "stripe"
  total: string;
  subtotal: string;
  shipping: string;
};

async function fetchOrderById(orderId: string): Promise<{
  success: boolean;
  data?: Partial<OrderFields>;
  message?: string;
}> {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

  const res = await fetch(`${API_BASE_URL}/orders/${encodeURIComponent(orderId)}`, {
    method: "GET",
    credentials: "include",
  });

  const json = await res.json().catch(() => null);

  if (!res.ok || !json) {
    return { success: false, message: json?.message || "Could not load your order." };
  }

  const order = json.data ?? json;

  return {
    success: true,
    data: {
      orderId: order._id || order.id || orderId,
      method: order.paymentMethod || "stripe",
      name: order.shippingAddress?.fullName,
      city: order.shippingAddress?.city,
      address: order.shippingAddress?.streetAddress,
      postal: order.shippingAddress?.postalCode,
      phone: order.shippingAddress?.phoneNumber,
      total: order.totalAmount != null ? String(order.totalAmount) : undefined,
      subtotal: order.subtotal != null ? String(order.subtotal) : undefined,
      shipping: order.shippingFee != null ? String(order.shippingFee) : undefined,
    },
  };
}

function OrderConfirmedContent() {
  const params = useSearchParams();

  const sessionId = params.get("session_id");
  const orderIdFromUrl = params.get("order_id") ?? params.get("orderId");
  const isStripeRedirect = Boolean(sessionId || orderIdFromUrl);

  // Fields straight from the URL (this is all COD needs).
  const urlFields: OrderFields = {
    orderId: orderIdFromUrl ?? "",
    name: params.get("name") ?? "Customer",
    city: params.get("city") ?? "",
    address: params.get("address") ?? "",
    postal: params.get("postal") ?? "",
    phone: params.get("phone") ?? "",
    method: params.get("method") ?? "stripe",
    total: params.get("total") ?? "0.00",
    subtotal: params.get("subtotal") ?? "0.00",
    shipping: params.get("shipping") ?? "0.00",
  };

  const [fields, setFields] = useState<OrderFields>(urlFields);
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "error">(
    isStripeRedirect ? "loading" : "ready"
  );
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    // COD (or a direct visit with full details already in the URL) — nothing to fetch.
    if (!isStripeRedirect) return;

    // We have an order_id — fetch the real order and use it as the source of truth.
    if (orderIdFromUrl) {
      let cancelled = false;

      (async () => {
        try {
          const result = await fetchOrderById(orderIdFromUrl);
          if (cancelled) return;

          if (result.success) {
            setFields((prev) => ({ ...prev, ...result.data }));
            setStatus("ready");
          } else {
            setErrorMessage(result.message || "We couldn't confirm your payment.");
            setStatus("error");
          }
        } catch {
          if (!cancelled) {
            setErrorMessage("Something went wrong while confirming your payment.");
            setStatus("error");
          }
        }
      })();

      return () => {
        cancelled = true;
      };
    }

    // Only session_id, no order_id — nothing to fetch it by; show what we have.
    setStatus("ready");
  }, [isStripeRedirect, orderIdFromUrl]);

  // deterministic order id fallback derived from order params (kept for COD,
  // matches previous behavior)
  const seed = `${fields.name}|${fields.phone}|${fields.total}|${fields.subtotal}|${fields.shipping}`;
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) % 100000;
  }
  const orderId = fields.orderId || `ORD-2026-${String(hash).padStart(5, "0")}`;
  const date = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const methodLabel =
    fields.method === "cash_on_delivery" || fields.method === "cod"
      ? "Cash on Delivery"
      : "Card (Stripe)";

  // ---- Loading (Stripe order lookup in progress) ----
  if (status === "loading") {
    return (
      <div className="mx-auto flex max-w-2xl flex-col items-center justify-center px-4 py-24 text-center">
        <Loader2 className="text-primary mb-4 h-9 w-9 animate-spin" />
        <p className="text-sm font-semibold text-gray-900">Confirming your payment...</p>
        <p className="mt-1 text-xs text-gray-500">Please wait, this won&apos;t take long.</p>
      </div>
    );
  }

  // ---- Error (couldn't confirm the Stripe order) ----
  if (status === "error") {
    return (
      <div className="mx-auto flex max-w-2xl flex-col items-center justify-center px-4 py-24 text-center">
        <XCircle className="mb-4 h-12 w-12 text-red-500" />
        <h1 className="text-lg font-extrabold text-gray-900">Payment Not Confirmed</h1>
        <p className="mt-2 max-w-md text-sm text-gray-500">{errorMessage}</p>
        <div className="mt-6 flex gap-3">
          <Link
            href={ROUTES.CHECKOUT}
            className="rounded-lg border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            Back to Checkout
          </Link>
          <Link
            href={ROUTES.MARKETPLACE}
            className="bg-primary hover:bg-primary/90 rounded-lg px-5 py-2.5 text-sm font-semibold text-white"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-5 px-4 py-8 sm:px-6 sm:py-12">
      {/* Confirmed banner */}
      <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">
        <div className="border-primary bg-primary/5 mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border-2">
          <CheckCircle className="text-primary h-7 w-7" />
        </div>
        <h1 className="mb-1 text-xl font-extrabold text-gray-900">Order Confirmed</h1>
        <p className="text-sm text-gray-500">Your order has been successfully placed.</p>
        <p className="text-xs text-gray-400">
          You will receive an email confirmation with your order details.
        </p>
      </div>

      {/* Info grid */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {/* Order information */}
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="mb-3 flex items-center gap-2">
            <Package className="text-primary h-4 w-4" />
            <h2 className="font-bold text-gray-900">Order Information</h2>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Order ID</span>
              <span className="font-semibold text-gray-900">{orderId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Date</span>
              <span className="font-semibold text-gray-900">{date}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Payment Method</span>
              <span className="font-semibold text-gray-900">{methodLabel}</span>
            </div>
          </div>
        </div>

        {/* Payment summary */}
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="mb-3 flex items-center gap-2">
            <CreditCard className="text-primary h-4 w-4" />
            <h2 className="font-bold text-gray-900">Payment Summary</h2>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Subtotal</span>
              <span className="text-gray-900">${fields.subtotal}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Shipping</span>
              <span className="text-gray-900">
                {parseFloat(fields.shipping) === 0 ? "Free" : `$${fields.shipping}`}
              </span>
            </div>
            <div className="flex justify-between border-t border-gray-200 pt-2 font-bold">
              <span>Total</span>
              <span className="text-primary">${fields.total}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Delivery information */}
      <div className="rounded-xl border border-gray-200 bg-white p-5">
        <div className="mb-3 flex items-center gap-2">
          <MapPin className="text-primary h-4 w-4" />
          <h2 className="font-bold text-gray-900">Delivery Information</h2>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="mb-0.5 text-xs text-gray-400">Customer Name</p>
            <p className="font-medium text-gray-900">{fields.name}</p>
          </div>
          <div>
            <p className="mb-0.5 text-xs text-gray-400">Phone</p>
            <p className="font-medium text-gray-900">{fields.phone || "—"}</p>
          </div>
          <div>
            <p className="mb-0.5 text-xs text-gray-400">City</p>
            <p className="font-medium text-gray-900">{fields.city || "—"}</p>
          </div>
          <div>
            <p className="mb-0.5 text-xs text-gray-400">Postal Code</p>
            <p className="font-medium text-gray-900">{fields.postal || "—"}</p>
          </div>
          {fields.address && (
            <div className="col-span-2">
              <p className="mb-0.5 text-xs text-gray-400">Address</p>
              <p className="font-medium text-gray-900">{fields.address}</p>
            </div>
          )}
        </div>
      </div>

      {/* Notice */}
      <div className="bg-primary/5 rounded-xl px-5 py-4 text-center">
        <p className="text-primary text-xs">
          We will process your order shortly and notify you when shipping updates become available.
        </p>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap justify-center gap-3">
        <Link
          href={ROUTES.HOME}
          className="bg-primary hover:bg-primary/90 flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold text-white"
        >
          <Home className="h-4 w-4" />
          Go to Home
        </Link>
        <Link
          href={ROUTES.MARKETPLACE}
          className="flex items-center gap-2 rounded-lg border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
        >
          <ShoppingBag className="h-4 w-4" />
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <section className="flex-1">
      <Suspense
        fallback={<div className="py-20 text-center text-sm text-gray-400">Loading...</div>}
      >
        <OrderConfirmedContent />
      </Suspense>
    </section>
  );
}