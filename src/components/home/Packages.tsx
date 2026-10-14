import { Check, Star } from "lucide-react";
import Titlebar from "../common/Titlebar";

function Packages() {
  const packages = [
    {
      name: "Paketa e Semimaturës", // Semimatura Package
      description: "Përgatitje për Semimaturën me kuize dhe teste praktike.", // Preparation for semimatura with quizzes and practice tests.
      features: [
        "Pyetje sipas lëndëve", // Subject-based questions
        "Teste nga provimet e viteve të kaluara", // Past exam tests
        "Kuize praktike", // Practice quizzes
        "Ndjekja e performancës", // Performance tracking
      ],
      featured: false,
    },
    {
      name: "Paketa e Maturës", // Matura Package
      description:
        "Përgatitje për provimin kombëtar të Maturës me ushtrime sipas lëndëve dhe simulime.", // Preparation for the national matura exam with subject practice and simulations.
      features: [
        "Mbulim gjithëpërfshirës i lëndëve", // Comprehensive subject coverage
        "Simulime të plota të provimit", // Full exam simulations
        "Analiza të detajuara", // Detailed analytics
        "Monitorimi i përparimit", // Progress monitoring
      ],
      featured: false,
    },
    {
      name: "Paketa e Provimeve Pranuese", // Entrance Exam Package
      description:
        "Përgatitje për provimet pranuese në universitet, sipas fakultetit ose departamentit të zgjedhur.", // Preparation for university entrance exams depending on the selected faculty or department.
      features: [
        "Përmbajtje specifike për fakultetin", // Faculty-specific content
        "Zgjidhni drejtimin e studimit", // Select your study direction
        "Teste praktike të specializuara", // Specialized practice tests
        "Përgatitje e fokusuar", // Targeted preparation
      ],
      note: "* Zgjidhni fakultetin tuaj pas abonimit", // Select your specific faculty after subscribing
      featured: false,
    },
    {
      name: "Paketa me Qasje të Plotë", // Full Access Package
      description: "Qasje e plotë në përgatitjen për Maturën, plus një provim pranues sipas zgjedhjes suaj.", // Complete access to Matura preparation plus one entrance exam of your choice.
      features: [
        "Përgatitje e plotë për Maturën", // Complete Matura preparation
        "Një provim pranues sipas zgjedhjes", // One entrance exam of choice
        "Të gjitha mënyrat e ushtrimit", // All practice modes
        "Mbështetje premium", // Premium support
      ],
      note: "Nuk përfshin Semimaturën ose të gjitha provimet pranuese", // Does not include Semimatura or all entrance exams
      badge: "E rekomanduar", // Featured
      featured: true,
    },
  ];

  return (
    <section className="bg-blue-50/60 py-16 md:py-20">
      <div className="app-container">
        <Titlebar
          title="Zgjidhni Paketën Tuaj" // Choose Your Package
          description="Zgjidhni paketën që i përshtatet më së miri nevojave tuaja për përgatitjen e provimeve" // Select the package that best fits your exam preparation needs
        />

        <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
          {packages.map((pkg) => (
            <div
              key={pkg.name}
              className={`relative flex min-h-96 flex-col rounded-xl p-5 shadow-sm ${
                pkg.featured
                  ? "border-primary from-primary/90 to-primary2/90 bg-linear-to-br text-white shadow-md"
                  : "border-gray-200 bg-white"
              }`}
            >
              {pkg.featured && pkg.badge && (
                <div className="bg-primary absolute -top-3 left-1/2 inline-flex -translate-x-1/2 items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold text-white shadow-sm">
                  <Star className="h-3.5 w-3.5 fill-white text-white" />
                  {pkg.badge}
                </div>
              )}

              <div className="flex flex-1 flex-col">
                <h3
                  className={`text-lg font-bold ${pkg.featured ? "text-white" : "text-gray-900"}`}
                >
                  {pkg.name}
                </h3>

                <p
                  className={`mt-2 text-sm ${pkg.featured ? "text-blue-50/90" : "text-gray-500"}`}
                >
                  {pkg.description}
                </p>

                <ul className="mt-3 flex flex-1 flex-col gap-2">
                  {pkg.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-2.5 text-sm"
                    >
                      <Check
                        className={`mt-0.5 h-4 w-4 shrink-0 ${
                          pkg.featured ? "text-blue-100" : "text-primary"
                        }`}
                      />
                      <span
                        className={`leading-6 ${pkg.featured ? "text-white/90" : "text-gray-700"}`}
                      >
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                {pkg.note && (
                  <div
                    className={`mt-3 rounded-md px-2 py-1.5 text-xs ${
                      pkg.featured
                        ? "bg-white text-gray-700"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {pkg.note}
                  </div>
                )}
              </div>

              <button
                className={`mt-4 w-full rounded-md border px-4 py-3 text-sm font-medium ${
                  pkg.featured
                    ? "bg-primary hover:bg-primary/90 border-primary text-white"
                    : "border-primary text-primary"
                }`}
              >
                Abonohu // Subscribe
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Packages;