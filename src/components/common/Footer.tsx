import { Logo } from "@/components/common/Logo";
import { ROUTES } from "@/constants";
import Image from "next/image";
import Link from "next/link";
import logo from "../../../public/icon.png";

const COLUMNS = [
  {
    heading: "Produkti", // Product
    links: [
      { label: "Paketat", href: ROUTES.PACKAGES }, // Packages
      { label: "Tregu", href: ROUTES.MARKETPLACE }, // Marketplace
      { label: "Shkarkoni aplikacionin", href: "#" }, // Download app
    ],
  },
  {
    heading: "Kompania", // Company
    links: [
      { label: "Rreth nesh", href: ROUTES.ABOUT }, // About
      { label: "Blogu", href: ROUTES.BLOG }, // Blog
    ],
  },

  {
    heading: "Informacione ligjore", // Legal
    links: [
      { label: "Politika e privatësisë", href: ROUTES.PRIVACY_POLICY }, // Privacy Policy
      { label: "Kushtet e shërbimit", href: ROUTES.TERMS_OF_SERVICE }, // Terms of Service
    ],
  },
  // {
  //   heading: "Mbështetja", // Support
  //   links: [
  //     { label: "Kontakti", href: ROUTES.CONTACT }, // Contact
  //     { label: "Pyetjet e shpeshta", href: `${ROUTES.CONTACT}#faq` }, // FAQ
  //   ],
  // },
];

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-gray-200 bg-slate-50">
      <div className="app-container">
        <div className="grid grid-cols-2 gap-8 py-14 md:grid-cols-4 md:gap-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            {/* <Logo /> */}
            <Link href={ROUTES.HOME} className="flex items-center gap-2">
              <Image
                src={logo}
                alt="Logoja e Testora" // Testora Logo
                width={96}
                height={96}
                quality={100}
                className="h-9 w-8 object-contain"
                priority
              />

              <span className="text-xl font-bold tracking-tight text-gray-900">
                Testora
              </span>
            </Link>

            <p className="mt-4 max-w-55 text-sm leading-6 text-slate-500">
              Platforma juaj gjithëpërfshirëse për përgatitjen e provimeve
              {/* Your comprehensive exam preparation platform */}
            </p>
          </div>

          {/* Columns */}
          {COLUMNS.map((col) => (
            <div key={col.heading}>
              <h4 className="mb-4 text-sm font-semibold text-slate-900">
                {col.heading}
              </h4>
              <ul className="flex flex-col gap-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-sm text-slate-500 duration-200 hover:text-slate-900"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-200 py-7 text-center text-sm text-slate-500">
          © 2026 Testora. Të gjitha të drejtat e rezervuara.
          {/* © 2026 Testora. All rights reserved. */}
        </div>
      </div>
    </footer>
  );
}