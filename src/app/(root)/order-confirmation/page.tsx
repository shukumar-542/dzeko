"use client";

import { Suspense } from "react";
import Link from "next/link";
import { CheckCircle, ShoppingBag, MapPin, CreditCard, Package, Home } from "lucide-react";
import { ROUTES } from "@/constants";
import { useSearchParams } from "next/navigation";

function OrderConfirmedContent() {
  const params = useSearchParams();
  const name = params.get("name") ?? "Customer";
  const city = params.get("city") ?? "";
  const address = params.get("address") ?? "";
  const postal = params.get("postal") ?? "";
  const phone = params.get("phone") ?? "";
  const rawMethod = params.get("method");
  const method =
    rawMethod === "cash_on_delivery" || rawMethod === "cod"
      ? "Cash on Delivery"
      : "Card (Stripe)";
  const total = params.get("total") ?? "0.00";
  const subtotal = params.get("subtotal") ?? "0.00";
  const shipping = params.get("shipping") ?? "0.00";

  // deterministic order id derived from order params to avoid impure random calls
  const seed = `${name}|${phone}|${total}|${subtotal}|${shipping}`;
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) % 100000;
  }
  const customOrderId = params.get("orderId");
  const orderId = customOrderId || `ORD-2026-${String(hash).padStart(5, "0")}`;
  const date = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

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
              <span className="font-semibold text-gray-900">{method}</span>
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
              <span className="text-gray-900">${subtotal}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Shipping</span>
              <span className="text-gray-900">
                {parseFloat(shipping) === 0 ? "Free" : `$${shipping}`}
              </span>
            </div>
            <div className="flex justify-between border-t border-gray-200 pt-2 font-bold">
              <span>Total</span>
              <span className="text-primary">${total}</span>
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
            <p className="font-medium text-gray-900">{name}</p>
          </div>
          <div>
            <p className="mb-0.5 text-xs text-gray-400">Phone</p>
            <p className="font-medium text-gray-900">{phone || "—"}</p>
          </div>
          <div>
            <p className="mb-0.5 text-xs text-gray-400">City</p>
            <p className="font-medium text-gray-900">{city || "—"}</p>
          </div>
          <div>
            <p className="mb-0.5 text-xs text-gray-400">Postal Code</p>
            <p className="font-medium text-gray-900">{postal || "—"}</p>
          </div>
          {address && (
            <div className="col-span-2">
              <p className="mb-0.5 text-xs text-gray-400">Address</p>
              <p className="font-medium text-gray-900">{address}</p>
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
