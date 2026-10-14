import {
  Monitor,
  CheckCircle,
  Download,
  GraduationCap,
  Target,
  Users,
  Activity,
} from "lucide-react";
import PageHero from "@/components/common/PageHero";

export default function AboutPage() {
  return (
    <section className="flex-1 bg-slate-50">
      <PageHero
        title="Rreth Testora" // About Testora
        description="Testora është platforma kryesore arsimore në Kosovë, e përkushtuar për t'i ndihmuar studentët të shkëlqejnë në provimet e tyre më të rëndësishme përmes mjeteve dhe burimeve gjithëpërfshirëse të përgatitjes." // Testora is Kosovo's leading educational platform dedicated to helping students excel in their most important exams through comprehensive preparation tools and resources.
      />

      <div className="app-container flex flex-col gap-6 py-10">
        {/* Misioni ynë // Our Mission */}
        <div className="border-l-primary rounded-xl border border-l-[3px] bg-white p-6">
          <div className="mb-4 flex size-10 items-center justify-center rounded-xl bg-blue-50">
            <GraduationCap className="text-primary size-4.5" />
          </div>
          <h2 className="mb-2 text-lg font-semibold text-slate-900">
            Misioni ynë {/* Our Mission */}
          </h2>
          <p className="mb-4 text-sm leading-relaxed text-slate-500">
            Misioni ynë është t'i ndihmojmë studentët të përgatiten më mirë për
            provimet që përcaktojnë të ardhmen e tyre akademike.
            {/* Our mission is to help students prepare better for the exams that shape their academic future. */}
          </p>
          <ul className="flex flex-col gap-2">
            {[
              "Teste praktike të bazuara në strukturën reale të provimeve", // Practice tests based on real exam structures
              "Kuize sipas lëndëve për ushtrime të shpejta", // Subject-based quizzes for quick practice
              "Materiale mësimore të organizuara", // Organized learning materials
              "Mundësia për të ndjekur përparimin gjatë përgatitjes", // The ability to track progress during preparation
            ].map((item) => (
              <li
                key={item}
                className="before:bg-primary relative pl-4 text-[13.5px] leading-snug text-slate-500 before:absolute before:top-1.75 before:left-0 before:size-1.25 before:rounded-full before:content-['']"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Çfarë mbështesim // What We Support */}
        <div className="rounded-xl border bg-white p-6">
          <h2 className="mb-1.5 text-lg font-semibold text-slate-900">
            Çfarë mbështesim {/* What We Support */}
          </h2>
          <p className="mb-5 text-sm text-slate-400">
            Tri etapa kryesore akademike për të cilat përgatisim studentët.
            {/* Three key academic milestones we prepare students for. */}
          </p>
          <div className="flex flex-col gap-5">
            {[
              {
                num: 1,
                title: "Përgatitja për Semimaturën", // Semi-Matura Preparation
                desc: "Materiale praktike dhe teste që i ndihmojnë studentët të kuptojnë strukturën e provimit të Semimaturës dhe të përmirësojnë njohuritë në lëndët kryesore.", // Practice materials and tests that help students understand the structure of the Semi-Matura exam and improve their knowledge in key subjects.
              },
              {
                num: 2,
                title: "Provimi i Maturës", // Matura Examination
                desc: "Përgatitje e strukturuar për provimin kombëtar të Maturës përmes kuizeve, testeve praktike dhe materialeve mësimore që i ndihmojnë studentët të ndihen më të sigurt.", // Structured preparation for the national Matura exam through quizzes, practice tests, and study materials that help students feel more confident.
              },
              {
                num: 3,
                title: "Provimet pranuese në universitet", // University Entrance Exams
                desc: "Përgatitje për provimet pranuese në universitete dhe fakultete të ndryshme përmes pyetjeve praktike që pasqyrojnë strukturën reale të provimeve pranuese.", // Preparation for university entrance exams across different faculties through practice questions that reflect real admission test structures.
              },
            ].map(({ num, title, desc }) => (
              <div key={num} className="flex gap-4">
                <div className="bg-primary mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white">
                  {num}
                </div>
                <div>
                  <h4 className="mb-1 text-[14.5px] font-semibold text-slate-900">
                    {title}
                  </h4>
                  <p className="text-[13px] leading-relaxed text-slate-500">
                    {desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Vlerat tona // Our Values */}
        <div>
          <h2 className="mb-4 text-center text-xl font-semibold text-slate-900">
            Vlerat tona {/* Our Values */}
          </h2>
          <div className="grid grid-cols-3 gap-3.5">
            {[
              {
                icon: <Target className="text-primary size-4" />,
                title: "Përgatitje e fokusuar", // Focused Preparation
                desc: "Projektuar për t'i ndihmuar studentët të përqendrohen te pyetjet dhe temat më të rëndësishme për provimet reale.", // Designed to help students focus on questions and topics that matter most for real exams.
              },
              {
                icon: <Users className="text-primary size-4" />,
                title: "Krijuar për studentët", // Built for Students
                desc: "Çdo veçori është krijuar për ta bërë përgatitjen për provime më të thjeshtë dhe më të kuptueshme.", // Every feature is crafted to make exam preparation simpler and easier to understand.
              },
              {
                icon: <Activity className="text-primary size-4" />,
                title: "Rezultate reale", // Real Results
                desc: "Ndiqni përparimin dhe kuptoni më mirë nivelin tuaj të përgatitjes përmes informacioneve të dobishme.", // Track progress and better understand preparation levels through actionable insights.
              },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="rounded-2xl border bg-white p-5">
                <div className="mb-3 flex size-8 items-center justify-center rounded-[8px] bg-blue-50">
                  {icon}
                </div>
                <h4 className="mb-1.5 text-[13.5px] font-semibold text-slate-900">
                  {title}
                </h4>
                <p className="text-[12px] leading-relaxed text-slate-500">
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Pse studentët zgjedhin Testora // Why Students Choose */}
        <div className="border-l-primary rounded-2xl border border-l-[3px] bg-white px-7 py-6">
          <div className="mb-4 flex size-10 items-center justify-center rounded-xl bg-blue-50">
            <CheckCircle className="text-primary size-4.5" />
          </div>
          <h2 className="mb-3 text-lg font-semibold text-slate-900">
            Pse studentët zgjedhin Testora
            {/* Why Students Choose Testora */}
          </h2>
          <ul className="flex flex-col gap-2">
            {[
              "Pyetje praktike të bazuara në strukturën reale të provimeve", // Practice questions based on real exam structures
              "Përmbajtje mësimore e organizuar sipas lëndëve", // Learning content organized by subjects
              "Ndjekja e përparimit gjatë përgatitjes", // Progress tracking during preparation
              "Qasje përmes uebit dhe aplikacionit celular", // Access through both web and mobile app
            ].map((item) => (
              <li
                key={item}
                className="before:bg-primary relative pl-4 text-[13.5px] leading-snug text-slate-500 before:absolute before:top-1.75 before:left-0 before:size-1.25 before:rounded-full before:content-['']"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Si funksionon // How It Works */}
        <div className="via-primary from-primary to-primary2 rounded-2xl bg-linear-to-br p-7">
          <h2 className="mb-5 text-lg font-semibold text-white">
            Si funksionon Testora {/* How Testora Works */}
          </h2>
          <ol className="mb-6 flex flex-col gap-2.5">
            {[
              "Zgjidhni paketën e përgatitjes për provimin që dëshironi.", // Choose the preparation package for the exam you want.
              "Shkarkoni aplikacionin celular Testora.", // Download the Testora mobile application.
              "Hyni në llogarinë tuaj dhe përdorni kuizet, testet dhe materialet.", // Log into your account and access quizzes, tests, and materials.
              "Ushtroni rregullisht dhe ndiqni përparimin tuaj.", // Practice regularly and track your progress.
            ].map((step, i) => (
              <li
                key={i}
                className="flex gap-2.5 text-[13.5px] text-blue-100"
              >
                <span className="shrink-0 font-semibold text-white">
                  {i + 1}.
                </span>
                {step}
              </li>
            ))}
          </ol>
          <div className="flex flex-wrap gap-2.5">
            <button className="flex items-center gap-2 rounded-md border border-white px-4 py-2 text-sm font-medium text-white transition hover:bg-white/5">
              <Monitor className="size-3.5" /> Shikoni paketat
              {/* View Packages */}
            </button>
            <button className="text-primary flex items-center gap-2 rounded-md bg-white px-4 py-2 text-sm font-medium transition hover:bg-blue-50">
              <Download className="size-3.5" /> Shkarkoni aplikacionin
              {/* Download App */}
            </button>
          </div>
        </div>

        {/* CTA */}
        <div className="rounded-2xl border bg-white px-8 py-12 text-center">
          <p className="mx-auto mb-6 max-w-2xl text-2xl leading-tight font-normal text-slate-900">
            Filloni përgatitjen për provimet tuaja më të rëndësishme akademike
            dhe bëjeni procesin e të mësuarit më të strukturuar dhe më efektiv.
            {/* Start preparing for your most important academic exams and make your study process more structured and effective. */}
          </p>
          <div className="flex flex-wrap justify-center gap-2.5">
            <button className="bg-primary hover:bg-primary/90 rounded-md px-5 py-2.5 text-sm font-medium text-white transition">
              Shikoni paketat {/* View Packages */}
            </button>
            <button className="rounded-md border border-gray-200 px-5 py-2.5 text-sm font-medium transition hover:bg-gray-50">
              Shkarkoni aplikacionin Testora
              {/* Download the Testora App */}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}