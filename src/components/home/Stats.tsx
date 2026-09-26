"use client";

import { useGetStashQuery } from "@/store/apis/blogApi";
import { BookOpen, FileText, Layers, Brain } from "lucide-react";

const Stats = () => {
  const { data: stashData, isLoading } = useGetStashQuery();


  const stats = [
    {
      value: stashData?.data?.practiceQuestions ?? 0,
      label: "Practice Questions",
      icon: BookOpen,
    },
    {
      value: stashData?.data?.fullExamTests ?? 0,
      label: "Full Exam Tests",
      icon: FileText,
    },
    {
      value: stashData?.data?.subjectsCovered ?? 0,
      label: "Subjects Covered",
      icon: Layers,
    },
    {
      value: stashData?.data?.practiceModes ?? 0,
      label: "Practice Modes",
      icon: Brain,
    },
  ];

  return (
    <section className="py-16 md:py-20">
      <div className="app-container grid grid-cols-2 gap-6 md:grid-cols-4">
        {stats.map((s) => {
          const Icon = s.icon;

          return (
            <div
              key={s.label}
              className="group rounded-2xl bg-blue-50/60 p-6 text-center shadow-sm"
            >
              {/* icon */}
              <div className="text-primary mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                <Icon className="h-5 w-5" />
              </div>

              {/* value */}
              <p className="text-primary text-3xl font-extrabold">
                {s.value}
              </p>

              {/* label */}
              <p className="mt-1 text-sm text-gray-500">{s.label}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Stats;