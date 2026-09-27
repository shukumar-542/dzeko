import Link from "next/link";
import { ROUTES } from "@/constants";
import { Download, Monitor } from "lucide-react";
import Image from "next/image";

const Banner = () => {
  return (
    <section className="from-primary/10 relative flex items-center overflow-hidden bg-linear-to-b to-white py-16 md:py-24">
      <div className="app-container flex size-full flex-col-reverse gap-12 md:flex-row md:items-center md:gap-16">
        {/* Left text */}
        <div className="flex-1 space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-600 uppercase">
            <span className="bg-primary h-2 w-2 rounded-full" />
            Smart exam preparation platform
          </div>

          {/* title */}
          <h1 className="text-4xl leading-none font-extrabold tracking-tight text-gray-900 md:text-6xl">
            Master Your Exams with{" "}
            <span className="bg-primary block bg-clip-text text-transparent">Testora</span>
          </h1>

          {/* description */}
          <p className="max-w-xl text-lg text-gray-500">
            Comprehensive preparation platform for Semimatura, Matura, and University Entrance
            exams. Practice with thousands of questions, take full exam simulations, and track your
            progress.
          </p>

          {/* actions */}
          <div className="flex flex-wrap gap-3">
            <Link
              href={ROUTES.PACKAGES}
              className="from-primary to-primary2 hover:from-primary/90 hover:to-primary2/90 flex items-center gap-2 rounded-lg bg-linear-to-r px-5 py-3 text-sm font-medium text-white shadow-sm transition duration-200"
            >
              <Monitor className="h-4 w-4" />
              View Packages
            </Link>
            <button className="border-primary hover:bg-primary/5 text-primary flex items-center gap-2 rounded-lg border bg-white px-5 py-3 text-sm font-medium transition duration-200">
              <Download className="h-4 w-4" />
              Download App
            </button>
          </div>
        </div>

        {/* Right phone mockup */}
        <div className="relative flex shrink-0 items-center justify-center">
          <Image
            src="/banner.png"
            alt="Hero"
            width={300}
            height={560}
            className="h-auto w-64 md:w-full"
          />
        </div>
      </div>
    </section>
  );
};

export default Banner;
