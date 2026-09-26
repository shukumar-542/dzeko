"use client";

import { ROUTES } from "@/constants";
import { useShipping } from "@/hooks/useShipping";
import {
  getErrorMessage,
  useCreateCheckoutMutation,
  useGetCouponsQuery,
  type CheckoutRequest,
  type PaymentMethodType,
} from "@/store/apis";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { clearBuyNowItem, clearCart } from "@/store/slices/cartSlice";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  CreditCard,
  Loader2,
  Lock,
  ShieldCheck,
  Sparkles,
  Tag,
  Truck,
  X,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const QUICK_CITIES = [
  "San Francisco",
  "New York",
  "Los Angeles",
  "Chicago",
  "Austin",
  "Seattle",
  "Prishtina",
  "Prizren",
];

export default function CheckoutPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  // Auth state
  const { isAuthenticated, user } = useAppSelector((s) => s.auth);

  // Cart state
  const cartItems = useAppSelector((s) => s.cart.items);
  const buyNowItem = useAppSelector((s) => s.cart.buyNowItem);
  const items = buyNowItem ? [buyNowItem] : cartItems;

  // Subtotal & Shipping calculation
  const subtotal = items.reduce(
    (sum: number, i: { price: number; quantity: number }) => sum + i.price * i.quantity,
    0
  );
  const {
    shippingFee,
    isFreeShipping,
    amountNeededForFreeShipping,
    freeShippingProgress,
    estimatedDeliveryDays,
    isCalculating: isShippingCalculating,
  } = useShipping(subtotal);

  // Checkout API Mutation
  const [createCheckout, { isLoading: isSubmittingOrder }] = useCreateCheckoutMutation();

  // Coupons API Query
  const { data: couponsData } = useGetCouponsQuery();
  const availableCoupons = couponsData?.data ?? [];

  // Form State
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>("stripe");
  const [agreed, setAgreed] = useState(false);
  const [form, setForm] = useState({
    fullName: user?.name ?? "",
    email: user?.email ?? "",
    phoneNumber: "",
    streetAddress: "",
    city: "San Francisco",
    state: "CA",
    postalCode: "94105",
    country: "United States",
    customerNotes: "Please call before delivery",
  });

  // Coupon state
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discountValue: number;
    discountType: "percentage" | "fixed";
  } | null>(null);

  // Sync user info into form if logged in
  useEffect(() => {
    if (user) {
      setForm((prev) => ({
        ...prev,
        fullName: prev.fullName || user.name || "",
        email: prev.email || user.email || "",
      }));
    }
  }, [user]);

  // Discount calculation
  let discountAmount = 0;
  if (appliedCoupon && subtotal > 0) {
    if (appliedCoupon.discountType === "percentage") {
      discountAmount = (subtotal * appliedCoupon.discountValue) / 100;
    } else {
      discountAmount = appliedCoupon.discountValue;
    }
    discountAmount = Math.min(discountAmount, subtotal);
  }

  const finalTotal = Math.max(0, subtotal - discountAmount) + shippingFee;

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleApplyCoupon(e?: React.FormEvent) {
    if (e) e.preventDefault();
    const codeToApply = couponInput.trim().toUpperCase();
    if (!codeToApply) {
      toast.error("Please enter a coupon code");
      return;
    }

    // Check with available coupons list from backend
    const found = availableCoupons.find(
      (c) => c.code.toUpperCase() === codeToApply && c.isActive
    );

    if (found) {
      if (found.minOrderAmount && subtotal < found.minOrderAmount) {
        toast.error(`Minimum order amount for this coupon is $${found.minOrderAmount}`);
        return;
      }
      setAppliedCoupon({
        code: found.code,
        discountValue: found.discountValue,
        discountType: found.discountType,
      });
      toast.success(`Coupon "${found.code}" applied!`);
    } else {
      // Allow custom/fallback coupons such as TESTORA20
      if (codeToApply === "TESTORA20") {
        setAppliedCoupon({
          code: "TESTORA20",
          discountValue: 20,
          discountType: "percentage",
        });
        toast.success(`Coupon "TESTORA20" applied for 20% off!`);
      } else {
        // Still allow applying the coupon code to send to backend checkout
        setAppliedCoupon({
          code: codeToApply,
          discountValue: 0,
          discountType: "fixed",
        });
        toast.info(`Coupon "${codeToApply}" will be applied at checkout.`);
      }
    }
  }

  function handleRemoveCoupon() {
    setAppliedCoupon(null);
    setCouponInput("");
    toast.info("Coupon removed");
  }

  async function handlePlaceOrder(e: React.FormEvent) {
    e.preventDefault();

    if (items.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }

    if (!form.fullName.trim() || !form.phoneNumber.trim() || !form.streetAddress.trim()) {
      toast.error("Please fill in all required shipping address fields.");
      return;
    }

    if (!isAuthenticated) {
      toast.error("Please log in to complete your checkout.");
      router.push(`${ROUTES.LOGIN}?redirect=${ROUTES.CHECKOUT}`);
      return;
    }

    // Build the exact checkout payload required by /orders/checkout
    const payload: CheckoutRequest = {
      items: items.map((i: any) => ({
        product: i.id,
        quantity: i.quantity,
      })),
      shippingAddress: {
        fullName: form.fullName.trim(),
        phoneNumber: form.phoneNumber.trim(),
        streetAddress: form.streetAddress.trim(),
        city: form.city.trim(),
        state: form.state.trim() || "CA",
        postalCode: form.postalCode.trim(),
        country: form.country.trim() || "United States",
      },
      paymentMethod,
      couponCode: appliedCoupon?.code || undefined,
      customerNotes: form.customerNotes.trim() || undefined,
    };

    try {
      const response = await createCheckout(payload).unwrap();

      // Clear cart
      if (buyNowItem) {
        dispatch(clearBuyNowItem());
      } else {
        dispatch(clearCart());
      }

      // 1. Stripe Checkout redirect
       if (paymentMethod === "stripe") {
        const stripeUrl =
          response.data?.checkoutUrl || response.data?.url || response.data?.sessionUrl;
        if (stripeUrl) {
          toast.success("Redirecting to secure Stripe checkout...");
          window.location.href = stripeUrl;
          return;
        }
      }

      // 2. Cash on Delivery or completed order
      toast.success(response.message || "Order placed successfully!");
      const orderId = response.data?._id || response.data?.id || response.data?.orderId || "";
      router.push(
        `${ROUTES.ORDER_CONFIRMATION}?method=${paymentMethod}&name=${encodeURIComponent(
          form.fullName
        )}&city=${encodeURIComponent(form.city)}&address=${encodeURIComponent(
          form.streetAddress
        )}&postal=${encodeURIComponent(form.postalCode)}&phone=${encodeURIComponent(
          form.phoneNumber
        )}&total=${finalTotal.toFixed(2)}&subtotal=${subtotal.toFixed(2)}&shipping=${shippingFee.toFixed(2)}${orderId ? `&orderId=${encodeURIComponent(orderId)}` : ""
        }`
      );
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, "Failed to place order. Please try again."));
    }
  }

  return (
    <section className="app-container w-full flex-1 py-10">
      <Link
        href={buyNowItem ? ROUTES.MARKETPLACE : ROUTES.CART}
        onClick={() => {
          if (buyNowItem) dispatch(clearBuyNowItem());
        }}
        className="mb-6 flex w-fit items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-800 transition"
      >
        <ArrowLeft className="h-4 w-4" />
        {buyNowItem ? "Back to Marketplace" : "Back to Cart"}
      </Link>

      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-gray-900">Checkout</h1>
        <p className="mt-1 text-sm text-gray-500">
          Enter your delivery details and choose a payment method.
        </p>
      </div>

      {/* Auth Notice if not logged in */}
      {!isAuthenticated && (
        <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-xl border border-amber-200 bg-amber-50/90 p-4 text-amber-900 shadow-xs">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 shrink-0 text-amber-600 mt-0.5" />
            <div>
              <p className="text-sm font-semibold">Account login required</p>
              <p className="text-xs text-amber-700 mt-0.5">
                You must be logged in to place an order. Your cart items are saved.
              </p>
            </div>
          </div>
          <Link
            href={`${ROUTES.LOGIN}?redirect=${ROUTES.CHECKOUT}`}
            className="shrink-0 rounded-lg bg-amber-600 px-4 py-2 text-xs font-semibold text-white hover:bg-amber-700 transition"
          >
            Log In to Checkout
          </Link>
        </div>
      )}

      <form onSubmit={handlePlaceOrder}>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left Column: Delivery & Payment Details */}
          <div className="space-y-6 lg:col-span-2">
            {/* Shipping Address */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-xs">
              <div className="mb-5 flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2">
                  <Truck className="h-5 w-5 text-primary" />
                  <h2 className="text-base font-bold text-gray-900">Shipping Address</h2>
                </div>
                <span className="text-xs text-gray-400">* Required fields</span>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-gray-700">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      name="fullName"
                      required
                      placeholder="Jane Doe"
                      value={form.fullName}
                      onChange={handleChange}
                      className="focus:border-primary w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-semibold text-gray-700">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      name="phoneNumber"
                      required
                      placeholder="+14155552671"
                      value={form.phoneNumber}
                      onChange={handleChange}
                      className="focus:border-primary w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:outline-none transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold text-gray-700">
                    Email Address (Optional)
                  </label>
                  <input
                    name="email"
                    type="email"
                    placeholder="jane@testora.com"
                    value={form.email}
                    onChange={handleChange}
                    className="focus:border-primary w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:outline-none transition"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold text-gray-700">
                    Street Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="streetAddress"
                    required
                    placeholder="123 Testora Avenue, Suite 400"
                    value={form.streetAddress}
                    onChange={handleChange}
                    className="focus:border-primary w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:outline-none transition"
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-gray-700">
                      City <span className="text-red-500">*</span>
                    </label>
                    <input
                      name="city"
                      required
                      placeholder="San Francisco"
                      value={form.city}
                      onChange={handleChange}
                      className="focus:border-primary w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:outline-none transition"
                      list="city-suggestions"
                    />
                    <datalist id="city-suggestions">
                      {QUICK_CITIES.map((c) => (
                        <option key={c} value={c} />
                      ))}
                    </datalist>
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-semibold text-gray-700">
                      State / Province <span className="text-red-500">*</span>
                    </label>
                    <input
                      name="state"
                      required
                      placeholder="CA"
                      value={form.state}
                      onChange={handleChange}
                      className="focus:border-primary w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:outline-none transition"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-gray-700">
                      Postal / ZIP Code <span className="text-red-500">*</span>
                    </label>
                    <input
                      name="postalCode"
                      required
                      placeholder="94105"
                      value={form.postalCode}
                      onChange={handleChange}
                      className="focus:border-primary w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-semibold text-gray-700">
                      Country <span className="text-red-500">*</span>
                    </label>
                    <input
                      name="country"
                      required
                      placeholder="United States"
                      value={form.country}
                      onChange={handleChange}
                      className="focus:border-primary w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:outline-none transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold text-gray-700">
                    Delivery Notes (Optional)
                  </label>
                  <textarea
                    name="customerNotes"
                    rows={2}
                    placeholder="e.g. Please call before delivery, gate code #1234"
                    value={form.customerNotes}
                    onChange={handleChange}
                    className="focus:border-primary w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none transition resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-xs">
              <div className="mb-5 flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-primary" />
                  <h2 className="text-base font-bold text-gray-900">Payment Method</h2>
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Lock className="h-3.5 w-3.5 text-emerald-600" />
                  <span>256-Bit SSL Encrypted</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Stripe / Card */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod("stripe")}
                  className={`flex flex-col text-left p-4 rounded-xl border-2 transition-all ${paymentMethod === "stripe"
                      ? "border-primary bg-primary/5 shadow-xs"
                      : "border-gray-200 hover:border-gray-300 bg-white"
                    }`}
                >
                  <div className="flex items-center justify-between w-full mb-2">
                    <div className="flex items-center gap-2">
                      <CreditCard
                        className={`h-5 w-5 ${paymentMethod === "stripe" ? "text-primary" : "text-gray-500"
                          }`}
                      />
                      <span className="font-bold text-sm text-gray-900">Card (Stripe)</span>
                    </div>
                    <span
                      className={`h-4 w-4 rounded-full border flex items-center justify-center ${paymentMethod === "stripe"
                          ? "border-primary bg-primary"
                          : "border-gray-300"
                        }`}
                    >
                      {paymentMethod === "stripe" && (
                        <span className="h-1.5 w-1.5 rounded-full bg-white" />
                      )}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Pay securely with Credit / Debit Card via Stripe Checkout.
                  </p>
                </button>

                {/* Cash on Delivery */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod("cash_on_delivery")}
                  className={`flex flex-col text-left p-4 rounded-xl border-2 transition-all ${paymentMethod === "cash_on_delivery"
                      ? "border-primary bg-primary/5 shadow-xs"
                      : "border-gray-200 hover:border-gray-300 bg-white"
                    }`}
                >
                  <div className="flex items-center justify-between w-full mb-2">
                    <div className="flex items-center gap-2">
                      <Truck
                        className={`h-5 w-5 ${paymentMethod === "cash_on_delivery" ? "text-primary" : "text-gray-500"
                          }`}
                      />
                      <span className="font-bold text-sm text-gray-900">Cash on Delivery</span>
                    </div>
                    <span
                      className={`h-4 w-4 rounded-full border flex items-center justify-center ${paymentMethod === "cash_on_delivery"
                          ? "border-primary bg-primary"
                          : "border-gray-300"
                        }`}
                    >
                      {paymentMethod === "cash_on_delivery" && (
                        <span className="h-1.5 w-1.5 rounded-full bg-white" />
                      )}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Pay in cash when your order is delivered to your address.
                  </p>
                </button>
              </div>

              {/* Informational banner depending on payment method */}
              <div className="mt-4 rounded-lg bg-gray-50 p-3.5 text-xs text-gray-600 border border-gray-100 flex items-start gap-2.5">
                {paymentMethod === "stripe" ? (
                  <>
                    <Lock className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <span>
                      After clicking <strong>Place Order</strong>, you will be redirected to
                      Stripe&apos;s encrypted checkout portal to complete your payment safely.
                    </span>
                  </>
                ) : (
                  <>
                    <Truck className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <span>
                      Please keep the exact amount ready upon delivery. Our courier will contact
                      you prior to arrival.
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Terms Agreement */}
            <label className="flex cursor-pointer items-center gap-2.5 rounded-xl border border-gray-200 bg-white p-4 shadow-xs">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="accent-primary h-4 w-4 rounded cursor-pointer"
              />
              <span className="text-xs text-gray-600">
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
          </div>

          {/* Right Column: Order Summary */}
          <div className="h-fit rounded-xl border border-gray-200 bg-white p-5 shadow-xs">
            <div className="mb-4 flex items-center justify-between border-b border-gray-100 pb-3">
              <h2 className="text-base font-bold text-gray-900">Order Summary</h2>
              {buyNowItem && (
                <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-semibold text-primary">
                  Buy Now
                </span>
              )}
            </div>

            {/* Items list */}
            <div className="mb-4 max-h-64 overflow-y-auto space-y-3 pr-1">
              {items.length > 0 ? (
                items.map((item: any) => (
                  <div key={item.id} className="flex items-start gap-3">
                    <div className="bg-primary/5 flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-primary/10">
                      <ShieldCheck className="text-primary h-5 w-5" />
                    </div>

                    <div className="flex-1">
                      <p className="text-xs font-semibold text-gray-800 line-clamp-1">{item.name}</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Qty: {item.quantity} · ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-4 text-center">
                  <p className="text-sm text-gray-500">Your cart is empty.</p>
                  <Link
                    href={ROUTES.MARKETPLACE}
                    className="text-primary mt-2 inline-block text-xs font-semibold hover:underline"
                  >
                    Go to Marketplace
                  </Link>
                </div>
              )}
            </div>

            {/* Free Shipping Progress Indicator */}
            {items.length > 0 &&
              (isFreeShipping ? (
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
                      Add{" "}
                      <strong className="text-primary font-bold">
                        ${amountNeededForFreeShipping.toFixed(2)}
                      </strong>{" "}
                      more for <strong>Free Shipping</strong>
                    </span>
                    <span className="text-[11px] font-semibold text-gray-500">
                      {Math.round(freeShippingProgress)}%
                    </span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-blue-100">
                    <div
                      className="bg-primary h-full rounded-full transition-all duration-300"
                      style={{ width: `${freeShippingProgress}%` }}
                    />
                  </div>
                </div>
              ))}

            {/* Coupon / Promo Code Input */}
            <div className="mb-4 border-t border-b border-gray-100 py-3">
              {appliedCoupon ? (
                <div className="flex items-center justify-between rounded-lg bg-emerald-50/80 border border-emerald-200 p-2.5 text-xs text-emerald-800">
                  <div className="flex items-center gap-1.5 font-medium">
                    <Tag className="h-3.5 w-3.5 text-emerald-600" />
                    <span>
                      Coupon <strong>{appliedCoupon.code}</strong> applied!
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveCoupon}
                    className="p-1 hover:text-emerald-950 transition"
                    title="Remove coupon"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ) : (
                <div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Coupon code (e.g. TESTORA20)"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      className="focus:border-primary flex-1 rounded-lg border border-gray-200 px-3 py-2 text-xs focus:outline-none uppercase"
                    />
                    <button
                      type="button"
                      onClick={() => handleApplyCoupon()}
                      className="rounded-lg bg-gray-900 px-3 py-2 text-xs font-semibold text-white hover:bg-gray-800 transition"
                    >
                      Apply
                    </button>
                  </div>
                  {availableCoupons.length > 0 && (
                    <p className="mt-1.5 text-[11px] text-gray-500">
                      Available: <span className="font-semibold text-primary">{availableCoupons[0]?.code}</span> ({availableCoupons[0]?.description || "Special Discount"})
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Calculations Breakdown */}
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-medium">
                  <span>Coupon Discount</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span className="flex items-center gap-1.5">
                  Shipping
                  {isShippingCalculating && (
                    <Loader2 className="h-3 w-3 animate-spin text-gray-400" />
                  )}
                </span>
                <span
                  className={
                    shippingFee === 0
                      ? "font-semibold text-emerald-600"
                      : "font-medium text-gray-900"
                  }
                >
                  {shippingFee === 0 ? "Free" : `$${shippingFee.toFixed(2)}`}
                </span>
              </div>

              {estimatedDeliveryDays && (
                <div className="flex items-center justify-between rounded-lg bg-gray-50 px-2.5 py-1.5 text-xs text-gray-600">
                  <span className="flex items-center gap-1.5">
                    <Truck className="h-3.5 w-3.5 text-primary" />
                    Estimated Delivery
                  </span>
                  <span className="font-semibold text-gray-800">{estimatedDeliveryDays}</span>
                </div>
              )}
            </div>

            <div className="my-4 border-t border-gray-200 pt-3 flex justify-between text-base font-extrabold text-gray-900">
              <span>Total</span>
              <span className="text-primary text-lg">${finalTotal.toFixed(2)}</span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!agreed || items.length === 0 || isSubmittingOrder}
              className="bg-primary hover:bg-primary/90 flex w-full items-center justify-center gap-2 rounded-lg py-3.5 text-sm font-bold text-white shadow-xs disabled:cursor-not-allowed disabled:opacity-50 transition-all"
            >
              {isSubmittingOrder ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Processing Order...
                </>
              ) : paymentMethod === "stripe" ? (
                <>
                  <CreditCard className="h-4 w-4" />
                  Pay with Stripe · ${finalTotal.toFixed(2)}
                </>
              ) : (
                <>
                  <ShieldCheck className="h-4 w-4" />
                  Place Order (Cash on Delivery)
                </>
              )}
            </button>

            <div className="mt-4 flex flex-col gap-2 border-t border-gray-100 pt-4 text-xs text-gray-400">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-3.5 w-3.5 text-gray-400" />
                <span>Buyer Protection & Guarantee</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="h-3.5 w-3.5 text-gray-400" />
                <span>Fast & Tracked delivery</span>
              </div>
            </div>
          </div>
        </div>
      </form>
    </section>
  );
}
