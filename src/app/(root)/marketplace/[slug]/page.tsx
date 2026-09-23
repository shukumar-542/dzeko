"use client";

import { use, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound, useRouter } from "next/navigation";
import { ArrowLeft, ShoppingCart, Heart, Truck, ShieldCheck, RefreshCw, Check } from "lucide-react";
import { ROUTES } from "@/constants";
import { useAppDispatch } from "@/store/hooks";
import { addToCart, setBuyNowItem } from "@/store/slices/cartSlice";
import {
  useGetProductBySlugQuery,
  useGetProductsQuery,
  useGetShippingSettingsQuery,
  type ProductVariant,
} from "@/store/apis";

// NOTE: eta route folder [slug]/page.tsx hisebe hote hobe, karon backend
// /products/{slug} diye product khoje, /products/{id} diye na.
// params key "slug" (route folder [slug]) othoba "id" (route folder [id]) — dutoi accept kore
export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug?: string; id?: string }>;
}) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug ?? resolvedParams.id ?? "";
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { data, isLoading, isError } = useGetProductBySlugQuery(slug);
  const product = data?.data;

  const { data: shippingSettingsData } = useGetShippingSettingsQuery();
  const shippingSettings = shippingSettingsData?.data;

  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);

  // Related products: same category theke, nijeke bade
  const { data: relatedData } = useGetProductsQuery(
    { limit: 8 },
    { skip: !product }
  );
  const related = useMemo(() => {
    if (!product || !relatedData?.data) return [];
    return relatedData.data
      .filter((p) => p._id !== product._id && p.category?._id === product.category?._id)
      .slice(0, 4);
  }, [product, relatedData]);

  if (isError) notFound();

  if (isLoading || !product) {
    return (
      <section className="app-container flex-1 py-10">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
          <div className="h-80 w-full animate-pulse rounded-2xl bg-gray-100" />
          <div className="space-y-3">
            <div className="h-4 w-24 animate-pulse rounded bg-gray-100" />
            <div className="h-7 w-2/3 animate-pulse rounded bg-gray-100" />
            <div className="h-24 w-full animate-pulse rounded bg-gray-100" />
          </div>
        </div>
      </section>
    );
  }

  const displayPrice = selectedVariant?.price ?? product.price;
  const displayCompareAt = selectedVariant?.compareAtPrice ?? product.compareAtPrice;
  const displayDiscount = selectedVariant?.discountPercentage ?? product.discountPercentage;
  const displayStock = selectedVariant?.stock ?? product.stock;
  const images = product.images?.length ? product.images : [];
  const galleryImage = selectedVariant?.image ?? images[activeImage] ?? images[0];
  const inStock = displayStock > 0;

  const colors = Array.from(new Set(product.variants.map((v) => v.color).filter(Boolean)));
  const sizes = Array.from(new Set(product.variants.map((v) => v.size).filter(Boolean)));

  function pickVariant(color?: string, size?: string) {
    if (!product) return;
    const nextColor = color ?? selectedVariant?.color;
    const nextSize = size ?? selectedVariant?.size;
    const match = product.variants.find(
      (v) => (!nextColor || v.color === nextColor) && (!nextSize || v.size === nextSize)
    );
    setSelectedVariant(match ?? null);
  }

  function handleAddToCart() {
    if (!product) return;
    for (let i = 0; i < qty; i++) {
      dispatch(
        addToCart({
          id: selectedVariant?._id ?? product._id,
          name: selectedVariant
            ? `${product.title} (${selectedVariant.color} / ${selectedVariant.size})`
            : product.title,
          price: displayPrice,
          category: product.category?.name ?? "Uncategorized",
        })
      );
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  function handleBuyNow() {
    if (!product) return;
    dispatch(
      setBuyNowItem({
        id: selectedVariant?._id ?? product._id,
        name: selectedVariant
          ? `${product.title} (${selectedVariant.color} / ${selectedVariant.size})`
          : product.title,
        price: displayPrice,
        category: product.category?.name ?? "Uncategorized",
        quantity: qty,
      })
    );
    router.push(ROUTES.CHECKOUT);
  }

  return (
    <section className="app-container flex-1 py-10">
      <Link
        href={ROUTES.MARKETPLACE}
        className="mb-6 flex w-fit items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-800"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Marketplace
      </Link>

      <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
        <div>
          <div className="relative flex h-80 w-full items-center justify-center overflow-hidden rounded-2xl bg-blue-50">
            {galleryImage ? (
              <Image
                src={galleryImage}
                alt={product.title}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            ) : (
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-blue-100">
                <ShoppingCart className="h-12 w-12 text-blue-400" />
              </div>
            )}
          </div>
          {images.length > 1 && (
            <div className="mt-3 flex gap-2">
              {images.map((img, i) => (
                <button
                  key={img + i}
                  type="button"
                  onClick={() => setActiveImage(i)}
                  className={`relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-md border-2 bg-gray-50 ${
                    activeImage === i ? "border-primary" : "border-gray-100"
                  }`}
                >
                  <Image src={img} alt={`${product.title} ${i + 1}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <div className="mb-1 flex items-start justify-between gap-3">
            <p className="text-primary text-xs font-medium">
              {product.category?.name}
              {product.brand ? ` · ${product.brand}` : ""}
            </p>
            <button className="flex h-9 w-9 items-center justify-center rounded-md border border-gray-200 text-gray-400 hover:text-red-500">
              <Heart className="h-4.5 w-4.5" />
            </button>
          </div>

          <h1 className="mb-1 text-2xl font-extrabold text-gray-900">{product.title}</h1>
          <p className="mb-4 text-sm text-gray-500">{product.description}</p>

          <div className="mb-1 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-gray-900">
              ${displayPrice.toFixed(2)}
            </span>
            {displayDiscount > 0 && (
              <>
                <span className="text-base text-gray-400 line-through">
                  ${displayCompareAt.toFixed(2)}
                </span>
                <span className="text-primary text-sm font-semibold">
                  {displayDiscount}% off
                </span>
              </>
            )}
          </div>

          <p
            className={`mb-4 flex items-center gap-1.5 text-sm font-medium ${
              inStock ? "text-green-600" : "text-red-500"
            }`}
          >
            <Check className="h-4 w-4" /> {inStock ? "In Stock" : "Out of Stock"}
          </p>

          {colors.length > 0 && (
            <div className="mb-4">
              <p className="mb-2 text-sm font-semibold text-gray-800">Color</p>
              <div className="flex flex-wrap gap-2">
                {colors.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => pickVariant(c, undefined)}
                    className={`rounded-full border px-3 py-1.5 text-xs font-medium ${
                      selectedVariant?.color === c
                        ? "border-primary bg-primary text-white"
                        : "border-gray-200 text-gray-600"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}

          {sizes.length > 0 && (
            <div className="mb-4">
              <p className="mb-2 text-sm font-semibold text-gray-800">Size</p>
              <div className="flex flex-wrap gap-2">
                {sizes.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => pickVariant(undefined, s)}
                    className={`rounded-full border px-3 py-1.5 text-xs font-medium ${
                      selectedVariant?.size === s
                        ? "border-primary bg-primary text-white"
                        : "border-gray-200 text-gray-600"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mb-4 border-t border-gray-100 pt-4">
            <p className="mb-2 text-sm font-semibold text-gray-800">Description</p>
            <p className="text-sm text-gray-500">{product.description}</p>
          </div>

          <div className="mb-4">
            <p className="mb-2 text-sm font-semibold text-gray-800">Quantity</p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50"
              >
                -
              </button>
              <span className="w-6 text-center text-sm font-semibold">{qty}</span>
              <button
                onClick={() => setQty((q) => Math.min(displayStock, q + 1))}
                className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50"
              >
                +
              </button>
            </div>
          </div>

          <div className="mb-4 grid grid-cols-2 gap-3">
            <button
              onClick={handleAddToCart}
              disabled={!inStock}
              className="border-primary text-primary hover:bg-primary/5 flex items-center justify-center gap-2 rounded-md border py-3 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ShoppingCart className="h-4 w-4" />
              {added ? "Added!" : "Add to Cart"}
            </button>
            <button
              onClick={handleBuyNow}
              disabled={!inStock}
              className="bg-primary hover:bg-primary/90 rounded-md py-3 text-sm font-semibold text-white duration-200 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Buy Now
            </button>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-3 border-t border-gray-100 pt-4 text-center">
            {[
              { icon: Truck, label: "Free Shipping" },
              { icon: ShieldCheck, label: "Secure Payment" },
              { icon: RefreshCw, label: "Easy Returns" },
            ].map((b) => (
              <div key={b.label} className="flex flex-col items-center gap-1">
                <b.icon className="h-5 w-5 text-gray-400" />
                <span className="text-[10px] text-gray-500">{b.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-lg font-bold text-slate-900">Specifications</h2>
          <table className="w-full">
            <tbody>
              {[
                { label: "SKU", value: selectedVariant?.sku ?? product.sku },
                { label: "Brand", value: product.brand },
                { label: "Category", value: product.category?.name },
                { label: "Stock", value: `${displayStock} units` },
                ...(colors.length ? [{ label: "Available Colors", value: colors.join(", ") }] : []),
                ...(sizes.length ? [{ label: "Available Sizes", value: sizes.join(", ") }] : []),
              ].map((s) => (
                <tr key={s.label} className="border-b border-gray-200 last:border-b-0">
                  <td className="py-2.5 text-xs text-slate-500">{s.label}</td>
                  <td className="py-2.5 text-right text-xs font-semibold text-slate-700">
                    {s.value}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-lg font-bold text-slate-900">Product Variants</h2>
          {product.variants.length > 0 ? (
            <ul className="space-y-2.5">
              {product.variants.map((v) => (
                <li
                  key={v._id}
                  className="flex items-center justify-between rounded-md bg-slate-50 px-3 py-2 text-sm text-slate-700"
                >
                  <span className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-500" />
                    {v.color} / {v.size}
                  </span>
                  <span className="font-semibold">${v.price.toFixed(2)}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-500">This product has no variants.</p>
          )}
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6">
        <h2 className="mb-4 text-lg font-bold text-slate-900">Shipping Information</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {[
            {
              title: "Delivery Time",
              body: `Standard delivery within ${shippingSettings?.estimatedDeliveryDays ?? "2-4 business days"}. Tracked delivery available.`,
            },
            {
              title: "Shipping Cost",
              body: `Free shipping on orders over $${shippingSettings?.freeShippingThreshold ?? 30}. Standard shipping $${shippingSettings?.defaultShippingFee ?? 5} for orders under $${shippingSettings?.freeShippingThreshold ?? 30}.`,
            },
            {
              title: "Return Policy",
              body: "30-day return policy for unopened items in original packaging. Full refund guaranteed.",
            },
          ].map((info) => (
            <div key={info.title} className="rounded-xl bg-slate-50 p-4">
              <p className="mb-1 text-sm font-semibold text-slate-800">{info.title}</p>
              <p className="text-xs leading-5 text-slate-600">{info.body}</p>
            </div>
          ))}
        </div>
      </div>

      {related.length > 0 && (
        <div className="mt-10">
          <h2 className="mb-5 text-xl font-bold text-slate-900">Related Products</h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {related.map((r) => (
              <Link
                key={r._id}
                href={`${ROUTES.MARKETPLACE}/${r.slug}`}
                className="flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white"
              >
                <div className="relative flex h-32 items-center justify-center overflow-hidden bg-sky-50">
                  {r.images?.[0] ? (
                    <Image src={r.images[0]} alt={r.title} fill className="object-cover" />
                  ) : (
                    <ShoppingCart className="text-primary/70 h-10 w-10" />
                  )}
                </div>
                <div className="p-3">
                  <p className="text-primary text-[10px] font-semibold tracking-wide uppercase">
                    {r.category?.name}
                  </p>
                  <p className="mt-0.5 line-clamp-1 text-xs font-semibold text-slate-900">
                    {r.title}
                  </p>
                  <p className="mt-1 text-sm font-bold text-slate-900">${r.price.toFixed(2)}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}