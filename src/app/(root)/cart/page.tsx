"use client";

import Link from "next/link";
import { ArrowLeft, ShoppingBag, ShieldCheck, Truck, Mail, Trash2, Loader2, Sparkles, CheckCircle2 } from "lucide-react";
import { ROUTES } from "@/constants";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { clearBuyNowItem, removeFromCart, updateQuantity } from "@/store/slices/cartSlice";
import { useEffect } from "react";
import { useShipping } from "@/hooks/useShipping";

export default function CartPage() {
  const dispatch = useAppDispatch();
  const items = useAppSelector((s) => s.cart.items);

  useEffect(() => {
    dispatch(clearBuyNowItem());
  }, [dispatch]);

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const {
    shippingFee,
    isFreeShipping,
    amountNeededForFreeShipping,
    freeShippingProgress,
    estimatedDeliveryDays,
    total,
    isCalculating,
  } = useShipping(subtotal);

  return (
    <section className="app-container w-full flex-1 py-10">
      {items.length === 0 ? (
        /* ── Empty state ── */
        <div className="flex flex-col items-center justify-center py-28 text-center">
          <ShoppingBag className="mb-5 h-20 w-20 text-gray-300" />
          <h2 className="mb-2 text-xl font-bold text-gray-900">Your cart is empty</h2>
          <p className="mb-6 text-sm text-gray-500">
            Add some products to your cart to get started.
          </p>
          <Link
            href={ROUTES.MARKETPLACE}
            className="bg-primary hover:bg-primary/90 rounded-lg px-6 py-2.5 text-sm font-semibold text-white"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        /* ── Cart with items ── */
        <>
          <Link
            href={ROUTES.MARKETPLACE}
            className="mb-6 flex w-fit items-center gap-1.5 text-sm font-medium text-gray-500 duration-200 hover:text-gray-800"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Marketplace
          </Link>
          <h1 className="mb-1 text-2xl font-extrabold text-gray-900">Cart</h1>
          <p className="mb-6 text-sm text-gray-500">Review your items before checkout</p>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Items */}
            <div className="lg:col-span-2">
              <div className="rounded-xl border border-gray-200 bg-white p-5">
                {items.map((item, idx) => (
                  <div key={item.id}>
                    {idx > 0 && <div className="my-4 border-t border-gray-200" />}
                    <div className="flex items-start gap-4">
                      {/* Product image placeholder */}
                      <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-blue-50">
                        <ShoppingBag className="h-8 w-8 text-blue-300" />
                      </div>
                      <div className="flex flex-1 flex-col gap-2">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="text-sm font-bold text-gray-900">{item.name}</p>
                            <p className="text-primary text-xs font-semibold">
                              ${item.price.toFixed(2)}
                            </p>
                          </div>
                          <button
                            onClick={() => dispatch(removeFromCart(item.id))}
                            className="flex items-center gap-1 text-xs text-red-500 hover:underline"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            Remove
                          </button>
                        </div>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() =>
                              dispatch(updateQuantity({ id: item.id, quantity: item.quantity - 1 }))
                            }
                            className="flex h-7 w-7 items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50"
                          >
                            −
                          </button>
                          <span className="w-5 text-center text-sm font-semibold">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }))
                            }
                            className="flex h-7 w-7 items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50"
                          >
                            +
                          </button>
                        </div>
                        <p className="text-right text-sm font-semibold text-gray-700">
                          Item total: ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order summary */}
            <div className="h-fit rounded-xl border border-gray-200 bg-white p-5">
              <h2 className="mb-4 text-base font-bold text-gray-900">Order Summary</h2>

              {/* Free Shipping Progress Indicator */}
              {isFreeShipping ? (
                <div className="mb-4 flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50/70 p-2.5 text-xs text-emerald-800">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                  <span>
                    You qualified for <strong>FREE Shipping</strong>!
                  </span>
                </div>
              ) : (
                <div className="mb-4 rounded-lg border border-blue-100 bg-blue-50/60 p-2.5 text-xs">
                  <div className="mb-1.5 flex items-center justify-between text-gray-700">
                    <span className="flex items-center gap-1 font-medium">
                      <Sparkles className="h-3.5 w-3.5 text-primary" />
                      Add <strong className="text-primary font-bold">${amountNeededForFreeShipping.toFixed(2)}</strong> more for <strong>Free Shipping</strong>
                    </span>
                    <span className="text-[11px] font-semibold text-gray-500">{Math.round(freeShippingProgress)}%</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-blue-100">
                    <div
                      className="bg-primary h-full rounded-full transition-all duration-300"
                      style={{ width: `${freeShippingProgress}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="mb-3 flex justify-between text-sm text-gray-600">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>

              <div className="mb-3 flex justify-between text-sm text-gray-600">
                <span className="flex items-center gap-1.5">
                  Shipping
                  {isCalculating && (
                    <Loader2 className="h-3 w-3 animate-spin text-gray-400" />
                  )}
                </span>
                <span className={shippingFee === 0 ? "font-semibold text-emerald-600" : "font-medium text-gray-900"}>
                  {shippingFee === 0 ? "Free" : `$${shippingFee.toFixed(2)}`}
                </span>
              </div>

              {/* Estimated Delivery Notice */}
              {estimatedDeliveryDays && (
                <div className="mb-4 flex items-center justify-between rounded-lg bg-gray-50 px-2.5 py-1.5 text-xs text-gray-600">
                  <span className="flex items-center gap-1.5">
                    <Truck className="h-3.5 w-3.5 text-primary" />
                    Estimated Delivery
                  </span>
                  <span className="font-semibold text-gray-800">{estimatedDeliveryDays}</span>
                </div>
              )}

              <div className="mb-5 flex justify-between border-t border-gray-200 pt-3 text-base font-extrabold text-gray-900">
                <span>Total</span>
                <span className="text-primary">${total.toFixed(2)}</span>
              </div>

              <Link
                href={ROUTES.CHECKOUT}
                onClick={() => dispatch(clearBuyNowItem())}
                className="bg-primary hover:bg-primary/90 mb-3 block w-full rounded-lg py-3 text-center text-sm font-semibold text-white transition-colors"
              >
                Proceed to Checkout
              </Link>
              <Link
                href={ROUTES.MARKETPLACE}
                className="mb-4 block w-full rounded-lg border border-gray-200 py-3 text-center text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Continue Shopping
              </Link>
              <div className="flex flex-col gap-2 border-t border-gray-200 pt-4">
                {[
                  { icon: ShieldCheck, label: "Secure payment" },
                  { icon: Truck, label: `Fast delivery (${estimatedDeliveryDays})` },
                  { icon: Mail, label: "Order confirmation by email" },
                ].map((b) => (
                  <div key={b.label} className="flex items-center gap-2 text-xs text-gray-500">
                    <b.icon className="h-4 w-4 text-gray-400" />
                    {b.label}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </section>
  );
}
