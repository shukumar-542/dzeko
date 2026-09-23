"use client";

import { useCalculateShippingQuery, useGetShippingSettingsQuery } from "@/store/apis";

export function useShipping(subtotal: number) {
  const { data: settingsEnvelope, isLoading: isSettingsLoading } = useGetShippingSettingsQuery();
  const {
    data: calcEnvelope,
    isLoading: isCalcLoading,
    isFetching: isCalcFetching,
    error: calcError,
  } = useCalculateShippingQuery(subtotal, {
    skip: subtotal <= 0,
  });

  const settings = settingsEnvelope?.data;
  const calc = calcEnvelope?.data;

  const defaultFee = settings?.defaultShippingFee ?? 5;
  const threshold = calc?.threshold ?? settings?.freeShippingThreshold ?? 30;
  const isFreeShipping =
    calc?.isFreeShipping ?? (subtotal >= threshold && threshold > 0);

  // Dynamic shipping fee:
  // Subtotal = 0 means empty cart -> shipping is 0
  // Free shipping -> 0
  // Otherwise use calculate endpoint's shippingFee or default fee
  const shippingFee = subtotal === 0 ? 0 : isFreeShipping ? 0 : (calc?.shippingFee ?? defaultFee);

  const amountNeededForFreeShipping =
    calc?.amountNeededForFreeShipping ?? Math.max(0, threshold - subtotal);

  const freeShippingProgress =
    threshold > 0 ? Math.min(100, Math.max(0, (subtotal / threshold) * 100)) : 0;

  const estimatedDeliveryDays = settings?.estimatedDeliveryDays ?? "2-4 business days";
  const total = subtotal + shippingFee;
  const isCalculating = (isCalcLoading || isCalcFetching) && subtotal > 0;

  return {
    settings,
    shippingCalc: calc,
    shippingFee,
    isFreeShipping,
    threshold,
    amountNeededForFreeShipping,
    freeShippingProgress,
    estimatedDeliveryDays,
    total,
    isCalculating,
    isSettingsLoading,
    calcError,
  };
}
