import { BookOpen, Brain, CalendarCheck, Users, Smartphone, MessageSquareMore } from "lucide-react";
import Titlebar from "../common/Titlebar";

const Features = () => {
  const features = [
    {
      icon: BookOpen,
      label: "Përmbajtje gjithëpërfshirëse", // Comprehensive Content
      desc: "Qasuni në mijëra pyetje të përzgjedhura me kujdes nga lëndë të ndryshme.", // Access thousands of carefully curated questions across multiple subjects.
      color: "bg-blue-100 text-blue-600",
    },
    {
      icon: Brain,
      label: "Analitika inteligjente", // Smart Analytics
      desc: "Ndiqni performancën tuaj përmes analizave të avancuara dhe informacioneve të personalizuara.", // Track your performance with advanced analytics and targeted insights.
      color: "bg-purple-100 text-purple-600",
    },
    {
      icon: CalendarCheck,
      label: "Orar fleksibël", // Flexible Schedule
      desc: "Studioni me ritmin tuaj dhe ndiqni një orar të personalizuar të të nxënit.", // Study at your own pace with personalized learning schedule.
      color: "bg-teal-100 text-teal-600",
    },
    {
      icon: Users,
      label: "Përmbajtje nga ekspertët", // Expert Content
      desc: "Përmbajtje e krijuar nga edukatorë profesionistë dhe ekspertë të fushave përkatëse.", // Content designed by professional educators and subject matter experts.
      color: "bg-amber-100 text-amber-600",
    },
    {
      icon: Smartphone,
      label: "Mësim përmes celularit", // Mobile Learning
      desc: "Mësoni kudo që të jeni me aplikacionin tonë të fuqishëm për celular.", // Learn on the go with our powerful mobile application.
      color: "bg-cyan-100 text-cyan-600",
    },
    {
      icon: MessageSquareMore,
      label: "Reagime të menjëhershme", // Instant Feedback
      desc: "Merrni shpjegime dhe korrigjime të menjëhershme për çdo pyetje.", // Get immediate explanations and corrections for every question.
      color: "bg-rose-100 text-rose-600",
    },
  ];

  return (
    <section className="bg-blue-50/60 py-16 md:py-20">
      <div className="app-container">
        <Titlebar
          title="Veçoritë e platformës" // Platform Features
          description="Gjithçka që ju nevojitet për të pasur sukses në përgatitjen për provime" // Everything you need to succeed in your exam preparation
        />

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3">
          {features.map((f) => (
            <div key={f.label} className="space-y-3 rounded-xl bg-white p-6 shadow-sm">
              <div className={`flex size-10 items-center justify-center rounded-xl ${f.color}`}>
                <f.icon className="h-6 w-6" />
              </div>

              <p className="mb-1 font-bold text-gray-800">{f.label}</p>
              <p className="text-sm text-gray-500">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;