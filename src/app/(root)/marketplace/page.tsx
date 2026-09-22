"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronRight, Search, ShoppingCart, SlidersHorizontal, X } from "lucide-react";
import { ROUTES } from "@/constants";
import { useAppDispatch } from "@/store/hooks";
import { addToCart } from "@/store/slices/cartSlice";
import PageHero from "@/components/common/PageHero";
import { useGetProductsQuery, type Product } from "@/store/apis";

const EDUCATION_FILTERS = [
  { key: "all", label: "All Products" },
  { key: "inStock", label: "In Stock" },
  { key: "hasDiscount", label: "On Sale" },
] as const;

const PRICE_MIN = 0;
const PRICE_MAX = 200;

export default function MarketplacePage() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All Products");
  const [expandedCat, setExpandedCat] = useState("");
  const [availability, setAvailability] = useState<(typeof EDUCATION_FILTERS)[number]["key"]>(
    "all"
  );
  const [minPrice, setMinPrice] = useState(PRICE_MIN);
  const [maxPrice, setMaxPrice] = useState(PRICE_MAX);
  const [showFilters, setShowFilters] = useState(false);
  const [visibleCount, setVisibleCount] = useState(9);

  // Search input debounce, jate protita keystroke a API call na hoy
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search.trim()), 400);
    return () => clearTimeout(t);
  }, [search]);

  const { data, isLoading, isFetching, isError } = useGetProductsQuery({
    page: 1,
    limit: 100,
    searchTerm: debouncedSearch || undefined,
    minPrice: minPrice > PRICE_MIN ? minPrice : undefined,
    maxPrice: maxPrice < PRICE_MAX ? maxPrice : undefined,
    inStock: availability === "inStock" ? true : undefined,
    hasDiscount: availability === "hasDiscount" ? true : undefined,
  });

  const products = useMemo(() => data?.data ?? [], [data]);

  // Category list, product data theke dynamically ber kora
  const categories = useMemo(() => {
    const map = new Map<string, number>();
    products.forEach((p) => {
      const name = p.category?.name ?? "Uncategorized";
      map.set(name, (map.get(name) ?? 0) + 1);
    });
    return Array.from(map.entries());
  }, [products]);

  const minPct = ((minPrice - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * 100;
  const maxPct = ((maxPrice - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * 100;

  function handleCatClick(cat: string) {
    setActiveCategory((prev) => (prev === cat ? "All Products" : cat));
    setExpandedCat((prev) => (prev === cat ? "" : cat));
    setVisibleCount(9);
  }

  function handleAddToCart(product: Product) {
    dispatch(
      addToCart({
        id: product._id,
        name: product.title,
        price: product.price,
        category: product.category?.name ?? "Uncategorized",
      })
    );
  }

  function handleBuyNow(product: Product) {
    handleAddToCart(product);
    router.push(ROUTES.CHECKOUT);
  }

  const filtered = useMemo(
    () =>
      products.filter((p) => {
        const matchCat = activeCategory === "All Products" || p.category?.name === activeCategory;
        return matchCat && !p.isDeleted;
      }),
    [products, activeCategory]
  );

  const visible = filtered.slice(0, visibleCount);

  const hasActiveFilters =
    activeCategory !== "All Products" ||
    availability !== "all" ||
    minPrice > PRICE_MIN ||
    maxPrice < PRICE_MAX ||
    search.trim() !== "";

  function resetFilters() {
    setActiveCategory("All Products");
    setExpandedCat("");
    setAvailability("all");
    setMinPrice(PRICE_MIN);
    setMaxPrice(PRICE_MAX);
    setSearch("");
    setVisibleCount(9);
  }

  function handleMinPriceChange(value: number) {
    setMinPrice(Math.min(value, maxPrice - 1));
    setVisibleCount(9);
  }

  function handleMaxPriceChange(value: number) {
    setMaxPrice(Math.max(value, minPrice + 1));
    setVisibleCount(9);
  }

  return (
    <section className="flex-1">
      <PageHero
        title="Marketplace"
        description="Essential tools for school and university students"
      />

      <div className="app-container sm:py-10">
        {/* Search + controls */}
        <div className="mb-6 flex items-center gap-3">
          <div className="relative w-full">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search products, categories, or study essentials"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setVisibleCount(9);
              }}
              className="focus:border-primary focus:ring-primary/10 w-full rounded-md border border-gray-200 bg-white py-2.5 pr-4 pl-9 text-sm text-gray-700 focus:ring-2 focus:outline-none"
            />
          </div>

          <button
            className="flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-2.5 text-sm whitespace-nowrap text-gray-600 lg:hidden"
            onClick={() => setShowFilters(!showFilters)}
            type="button"
          >
            <SlidersHorizontal className="h-4 w-4" />
            {showFilters ? "Hide Filters" : "Show Filters"}
          </button>
        </div>

        <div className="flex flex-col gap-6 lg:flex-row">
          {/* Sidebar */}
          <aside className={`${showFilters ? "block" : "hidden"} w-full shrink-0 lg:block lg:w-72`}>
            <div className="no-scrollbar rounded-2xl border border-gray-200 bg-white p-4 lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto">
              <div className="mb-5 flex items-center justify-between">
                <h3 className="text-sm font-bold text-gray-900">Filter Products</h3>
                {hasActiveFilters && (
                  <button
                    onClick={resetFilters}
                    type="button"
                    className="inline-flex items-center gap-1 rounded bg-red-50 px-2 py-1 text-xs font-semibold text-red-600"
                  >
                    <X className="h-3 w-3" /> Reset
                  </button>
                )}
              </div>

              {/* Dual range price slider */}
              <div className="mb-5">
                <p className="mb-3 text-xs font-semibold tracking-wide text-gray-500 uppercase">
                  Price Range
                </p>

                <div className="relative mb-3 h-6">
                  <div className="absolute top-1/2 h-0.75 w-full -translate-y-1/2 rounded-full bg-gray-200" />
                  <div
                    className="bg-primary absolute top-1/2 h-0.75 -translate-y-1/2 rounded-full"
                    style={{ left: `${minPct}%`, width: `${maxPct - minPct}%` }}
                  />

                  <input
                    type="range"
                    min={PRICE_MIN}
                    max={PRICE_MAX}
                    step={1}
                    value={minPrice}
                    onChange={(e) => handleMinPriceChange(Number(e.target.value))}
                    className="[&::-webkit-slider-thumb]:border-primary [&::-moz-range-thumb]:border-primary pointer-events-none absolute inset-0 h-full w-full cursor-pointer appearance-none bg-transparent [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:bg-white [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:bg-white"
                    style={{ zIndex: minPrice > PRICE_MAX - 20 ? 5 : 3 }}
                  />

                  <input
                    type="range"
                    min={PRICE_MIN}
                    max={PRICE_MAX}
                    step={1}
                    value={maxPrice}
                    onChange={(e) => handleMaxPriceChange(Number(e.target.value))}
                    className="[&::-webkit-slider-thumb]:border-primary [&::-moz-range-thumb]:border-primary pointer-events-none absolute inset-0 h-full w-full cursor-pointer appearance-none bg-transparent [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:bg-white [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:bg-white"
                    style={{ zIndex: 4 }}
                  />
                </div>

                <div className="flex items-center justify-between text-xs text-gray-600">
                  <span>${minPrice}</span>
                  <span className="text-primary font-semibold">${maxPrice}</span>
                </div>
              </div>

              {/* Categories - dynamically from API data */}
              <div className="mb-5">
                <h4 className="mb-2 text-xs font-semibold tracking-wide text-gray-500 uppercase">
                  Categories
                </h4>
                <ul className="space-y-0.5">
                  <li>
                    <button
                      onClick={() => {
                        setActiveCategory("All Products");
                        setExpandedCat("");
                        setVisibleCount(9);
                      }}
                      type="button"
                      className={`flex w-full items-center justify-between rounded-md px-2.5 py-1.5 text-left text-xs ${
                        activeCategory === "All Products" ? "bg-primary text-white" : "text-gray-600"
                      }`}
                    >
                      <span>All Products</span>
                      <span
                        className={`text-[10px] ${
                          activeCategory === "All Products" ? "text-white/70" : "text-gray-400"
                        }`}
                      >
                        {products.length}
                      </span>
                    </button>
                  </li>
                  {categories.map(([name, count]) => (
                    <li key={name}>
                      <button
                        onClick={() => handleCatClick(name)}
                        type="button"
                        className={`flex w-full items-center justify-between rounded-md px-2.5 py-1.5 text-left text-xs ${
                          activeCategory === name ? "bg-primary text-white" : "text-gray-600"
                        }`}
                      >
                        <span>{name}</span>
                        <span
                          className={`text-[10px] ${
                            activeCategory === name ? "text-white/70" : "text-gray-400"
                          }`}
                        >
                          {count}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mb-4">
                <h4 className="mb-2 text-xs font-semibold tracking-wide text-gray-500 uppercase">
                  Availability
                </h4>
                <ul className="space-y-0.5">
                  {EDUCATION_FILTERS.map((f) => (
                    <li key={f.key}>
                      <button
                        onClick={() => {
                          setAvailability(f.key);
                          setVisibleCount(9);
                        }}
                        type="button"
                        className={`w-full rounded-md px-2.5 py-1.5 text-left text-xs ${
                          availability === f.key ? "bg-primary text-white" : "text-gray-600"
                        }`}
                      >
                        {f.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            <div className="my-4 flex items-center justify-between gap-4">
              <p className="text-sm text-gray-500">
                {isLoading || isFetching ? (
                  "Loading products..."
                ) : (
                  <>
                    <span className="font-semibold text-gray-900">{filtered.length}</span> product
                    {filtered.length !== 1 ? "s" : ""} found
                  </>
                )}
              </p>
              {hasActiveFilters && (
                <button
                  onClick={resetFilters}
                  type="button"
                  className="flex items-center gap-1 rounded-md border border-red-600 bg-white px-3 py-1.5 text-xs font-semibold text-red-600"
                >
                  <X className="h-3.5 w-3.5" /> Clear Filters
                </button>
              )}
            </div>

            {isError ? (
              <div className="rounded-2xl border border-dashed border-red-200 bg-red-50 py-20 text-center text-sm text-red-500">
                There was a problem loading the products. Please refresh and try again.
              </div>
            ) : isLoading ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-72 animate-pulse rounded-2xl border border-gray-200 bg-gray-50"
                  />
                ))}
              </div>
            ) : visible.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-gray-200 py-20 text-center text-sm text-gray-400">
                No products found. Try adjusting your filters.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {visible.map((p) => {
                  const isOnSale = p.discountPercentage > 0;
                  const isLowStock = p.stock > 0 && p.stock <= p.lowStockAlert;
                  const outOfStock = p.stock <= 0;
                  const badge = outOfStock
                    ? { label: "Out of Stock", cls: "bg-gray-500 text-white" }
                    : isOnSale
                      ? { label: `${p.discountPercentage}% Off`, cls: "bg-primary text-white" }
                      : isLowStock
                        ? { label: "Low Stock", cls: "bg-amber-500 text-white" }
                        : null;

                  return (
                    <div
                      key={p._id}
                      className="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white"
                    >
                      {badge && (
                        <span
                          className={`absolute top-3 left-3 z-10 rounded-full px-2 py-0.5 text-[10px] font-bold ${badge.cls}`}
                        >
                          {badge.label}
                        </span>
                      )}

                      <Link href={`${ROUTES.MARKETPLACE}/${p.slug}`}>
                        <div className="from-primary/5 relative flex h-44 items-center justify-center overflow-hidden bg-linear-to-br to-blue-50">
                          {p.images?.[0] ? (
                            <Image
                              src={p.images[0]}
                              alt={p.title}
                              fill
                              className="object-cover"
                              sizes="(max-width: 768px) 100vw, 33vw"
                            />
                          ) : (
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white ring-4 ring-white">
                              <ShoppingCart className="text-primary h-8 w-8" />
                            </div>
                          )}
                        </div>
                      </Link>

                      <div className="flex flex-1 flex-col p-4">
                        <p className="text-primary mb-0.5 text-[10px] font-semibold tracking-wide uppercase">
                          {p.category?.name ?? "Uncategorized"}
                          {p.brand ? ` · ${p.brand}` : ""}
                        </p>

                        <Link
                          href={`${ROUTES.MARKETPLACE}/${p.slug}`}
                          className="mb-1 line-clamp-1 text-sm font-bold text-gray-900"
                        >
                          {p.title}
                        </Link>

                        <p className="mb-3 line-clamp-2 flex-1 text-xs text-gray-500">
                          {p.description}
                        </p>

                        <div className="mb-3 flex items-center justify-between">
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-base font-extrabold text-gray-900">
                              ${p.price.toFixed(2)}
                            </span>
                            {isOnSale && (
                              <span className="text-xs text-gray-400 line-through">
                                ${p.compareAtPrice.toFixed(2)}
                              </span>
                            )}
                          </div>
                          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-600">
                            {outOfStock ? "Unavailable" : "Ready to ship"}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            disabled={outOfStock}
                            onClick={() => handleAddToCart(p)}
                            className="border-primary text-primary rounded-md border px-3 py-2 text-xs font-semibold disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            Add to Cart
                          </button>
                          <button
                            type="button"
                            disabled={outOfStock}
                            onClick={() => handleBuyNow(p)}
                            className="bg-primary rounded-md px-3 py-2 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            Buy Now
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {visibleCount < filtered.length && (
              <div className="mt-8 text-center">
                <button
                  type="button"
                  onClick={() => setVisibleCount((n) => n + 6)}
                  className="rounded-md border border-gray-200 px-6 py-2.5 text-sm font-medium text-gray-700"
                >
                  Load More Products
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}