import { ROUTES } from '@/constants'
import { CheckCircle, Home, ShoppingBag } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

export default function page() {
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
  )
}
