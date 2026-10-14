import { ROUTES } from "@/constants";
import { Download, Monitor } from "lucide-react";
import Link from "next/link";

function CTA() {
  return (
    <section className="bg-blue-50/60 py-16 md:py-20">
      <div className="app-container bg-primary rounded-xl py-16 text-center text-white md:py-20">
        <div className="mb-8 flex flex-col items-center text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white">
            Filloni përgatitjen sot {/* Start Preparing Today */}
          </h2>
          <p className="mt-2 max-w-2xl text-gray-300">
            Bashkohuni me mijëra studentë që tashmë po arrijnë synimet e tyre në
            provime me Testora {/* Join thousands of students who are already achieving their exam goals with Testora */}
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href={ROUTES.PACKAGES}
            className="hover:bg-primary2/90 bg-primary2 flex items-center gap-2 rounded-lg px-5 py-3 text-sm font-medium text-white shadow-sm transition duration-200"
          >
            <Monitor className="h-4 w-4" />
            Shikoni paketat {/* View Packages */}
          </Link>
          <button className="border-primary text-primary flex items-center gap-2 rounded-lg border bg-white px-5 py-3 text-sm font-medium transition duration-200 hover:bg-white/90">
            <Download className="h-4 w-4" />
            Shkarkoni aplikacionin {/* Download App */}
          </button>
        </div>
      </div>
    </section>
  );
}

export default CTA;