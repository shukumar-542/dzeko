import Image from "next/image";
import Titlebar from "../common/Titlebar";

const AppScreens = () => {
  return (
    <section className="py-16 md:py-20">
      <div className="app-container">
        <Titlebar
          title="Përjetoni aplikacionin tonë celular" // Experience Our Mobile App
          description="Një përvojë e fuqishme mësimi, gjithmonë me ju" // A powerful learning experience right in your pocket
        />

        <div className="mx-auto mt-14 w-full max-w-2xl">
          <div className="flex items-end justify-center gap-6 md:gap-0">
            {/* Left Phone */}
            <div className="flex min-w-0 flex-1 justify-center">
              <div className="w-full max-w-48">
                <Image
                  src="/phone1.png"
                  alt="Quiz Screen"
                  width={420}
                  height={900}
                  className="h-auto w-full object-contain"
                />
                <p className="mt-4 text-center text-sm font-medium text-gray-600">Quiz Screen</p>
              </div>
            </div>

            {/* Middle Phone */}
            <div className="flex min-w-0 flex-[1.08] justify-center">
              <div className="w-full max-w-56">
                <Image
                  src="/phone22.png"
                  alt="Student Dashboard"
                  width={420}
                  height={900}
                  className="h-auto w-full object-contain"
                  priority
                />
                <p className="mt-4 text-center text-sm font-medium text-gray-600">
                  Student Dashboard
                </p>
              </div>
            </div>

            {/* Right Phone */}
            <div className="flex min-w-0 flex-1 justify-center">
              <div className="w-full max-w-48">
                <Image
                  src="/phone11.png"
                  alt="Test Archive"
                  width={420}
                  height={900}
                  className="h-auto w-full object-contain"
                />
                <p className="mt-4 text-center text-sm font-medium text-gray-600">Test Archive</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AppScreens;
