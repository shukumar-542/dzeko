"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import {
  ShoppingCart,
  ChevronDown,
  ShoppingBag,
  UserCircle2,
  LogOut,
  Package,
  Menu,
  X,
} from "lucide-react";
import { Logo } from "@/components/common/Logo";
import { ROUTES } from "@/constants";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { logout } from "@/store/slices/authSlice";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { clearCart } from "@/store/slices/cartSlice";

const NAV_LINKS = [
  { label: "Home", href: ROUTES.HOME },
  { label: "About", href: ROUTES.ABOUT },
  { label: "Packages", href: ROUTES.PACKAGES },
  { label: "Marketplace", href: ROUTES.MARKETPLACE },
  { label: "Blog", href: ROUTES.BLOG },
];

export default function Header() {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAppSelector((s) => s.auth);
  const cartItems = useAppSelector((s) => s.cart.items);
  const cartCount = cartItems.reduce((sum, i) => sum + i.quantity, 0);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-100 bg-white/95 backdrop-blur">
      <div className="app-container flex items-center justify-between py-3.5">
        <Logo size="md" />

        {/* Desktop nav links */}
        <div className="hidden items-center gap-7 md:flex">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              className={cn(
                "text-sm font-medium duration-200",
                pathname === l.href ? "text-primary" : "text-gray-500 hover:text-gray-900"
              )}
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* Right side: cart + user/auth + hamburger */}
        <div className="flex items-center gap-2">
          <Link href={ROUTES.CART} className="relative p-1.5 text-gray-600 hover:text-gray-900">
            <ShoppingCart className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white duration-200">
                {cartCount}
              </span>
            )}
          </Link>

          {isAuthenticated && user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen((o) => !o)}
                className="flex items-center gap-2 rounded-lg border border-gray-100 px-2 py-1.5 text-sm text-gray-700 hover:bg-gray-50 sm:px-3"
              >
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="hidden font-medium sm:block">{user.name}</span>
                <ChevronDown
                  className={`hidden h-3.5 w-3.5 text-gray-400 transition-transform sm:block ${dropdownOpen ? "rotate-180" : ""}`}
                />
              </button>

              {dropdownOpen && (
                <div className="absolute top-full right-0 mt-2 w-52 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-lg">
                  <div className="border-b border-gray-100 px-4 py-3">
                    <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                    <p className="truncate text-xs text-gray-400">{user.email}</p>
                  </div>
                  <div className="py-1">
                    <Link
                      href={ROUTES.ORDERS}
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <ShoppingBag className="h-4 w-4 text-gray-400" />
                      My Orders
                    </Link>
                    <Link
                      href={ROUTES.PROFILE}
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <UserCircle2 className="h-4 w-4 text-gray-400" />
                      Account / Profile
                    </Link>
                    <Link
                      href={ROUTES.MY_PACKAGES}
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <Package className="h-4 w-4 text-gray-400" />
                      My Packages
                    </Link>
                  </div>
                  <div className="border-t border-gray-100 py-1">
                    <button
                      onClick={() => {
                        dispatch(logout());
                        dispatch(clearCart());
                        setDropdownOpen(false);
                      }}
                      className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden items-center gap-2 md:flex">
              <Link
                href={ROUTES.LOGIN}
                className="hover:text-primary rounded-md px-4 py-2 text-sm font-medium text-gray-600 duration-200 hover:bg-blue-50"
              >
                Login
              </Link>
              <Link
                href={ROUTES.REGISTER}
                className="rounded-md bg-linear-to-r from-[#2360A5] to-[#4584CA] px-4 py-2 text-sm font-medium text-white transition duration-200 hover:from-[#2360A5]/90 hover:to-[#4584CA]/90"
              >
                Register
              </Link>
            </div>
          )}

          {/* Hamburger — mobile only */}
          <button
            className="p-1.5 text-gray-600 hover:text-gray-900 md:hidden"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="border-t border-gray-100 bg-white px-4 pb-4 md:hidden">
          <div className="flex flex-col gap-1 pt-3">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.label}
                href={l.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                {l.label}
              </Link>
            ))}
          </div>
          {!isAuthenticated && (
            <div className="mt-3 flex gap-3 border-t border-gray-100 pt-3">
              <Link
                href={ROUTES.LOGIN}
                onClick={() => setMobileOpen(false)}
                className="flex-1 rounded-md border border-gray-200 py-2.5 text-center text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Login
              </Link>
              <Link
                href={ROUTES.REGISTER}
                onClick={() => setMobileOpen(false)}
                className="flex-1 rounded-md bg-blue-600 py-2.5 text-center text-sm font-semibold text-white hover:bg-blue-700"
              >
                Register
              </Link>
            </div>
          )}
          {isAuthenticated && user && (
            <div className="mt-3 border-t border-gray-100 pt-3">
              <div className="mb-2 flex items-center gap-3 px-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                  <p className="truncate text-xs text-gray-400">{user.email}</p>
                </div>
              </div>
              {[
                { label: "My Orders", href: ROUTES.ORDERS },
                { label: "Account / Profile", href: ROUTES.PROFILE },
                { label: "My Packages", href: ROUTES.MY_PACKAGES },
              ].map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-lg px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                >
                  {item.label}
                </Link>
              ))}
              <button
                onClick={() => {
                  dispatch(logout());
                  dispatch(clearCart())
                  setMobileOpen(false);
                }}
                className="mt-1 w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium text-red-500 hover:bg-red-50"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
