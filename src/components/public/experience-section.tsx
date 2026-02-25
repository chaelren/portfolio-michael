"use client";

import { useState } from "react";
import { Briefcase, GraduationCap } from "lucide-react";

interface ExperienceProps {
  experiences: Array<{
    id: string;
    type: string;
    position: string;
    company: string;
    companyUrl: string | null;
    location: string | null;
    description: string | null;
    startDate: string;
    endDate: string | null;
    isCurrent: boolean;
  }>;
  educations: Array<{
    id: string;
    institution: string;
    degree: string;
    field: string;
    location: string | null;
    description: string | null;
    gpa: number | null;
    startDate: string;
    endDate: string | null;
    isCurrent: boolean;
  }>;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", { year: "numeric", month: "short" });
}

const typeLabels: Record<string, string> = {
  WORK: "Work", ORGANIZATION: "Organization", VOLUNTEER: "Volunteer",
  FREELANCE: "Freelance", INTERNSHIP: "Internship",
};

export default function ExperienceSection({ experiences, educations }: ExperienceProps) {
  const [tab, setTab] = useState<"experience" | "education">("experience");

  return (
    <section id="experience" className="py-20 px-4 bg-slate-50 dark:bg-slate-900/30">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8">
          <span className="bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">Experience & Education</span>
        </h2>

        <div className="flex justify-center gap-1 mb-10 bg-white dark:bg-slate-900/50 p-1 rounded-lg border border-slate-200 dark:border-slate-800 w-fit mx-auto shadow-sm">
          <button onClick={() => setTab("experience")} className={`px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${tab === "experience" ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white" : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"}`}>
            <Briefcase className="w-4 h-4 inline mr-2" />Experience
          </button>
          <button onClick={() => setTab("education")} className={`px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${tab === "education" ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white" : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"}`}>
            <GraduationCap className="w-4 h-4 inline mr-2" />Education
          </button>
        </div>

        <div className="relative">
          <div className="absolute left-4 top-0 bottom-0 w-px bg-slate-200 dark:bg-slate-800" />

          {tab === "experience" && experiences.map((exp) => (
            <div key={exp.id} className="relative pl-12 pb-10 last:pb-0">
              <div className="absolute left-2.5 top-1 w-3 h-3 rounded-full bg-blue-500 border-2 border-white dark:border-slate-950" />
              <div className="p-5 rounded-xl bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-colors shadow-sm">
                <div className="flex gap-4">
                  {/* Image Left */}
                  {exp.companyUrl && (
                    <div className="shrink-0">
                      <img src={exp.companyUrl} alt={exp.company} className="w-14 h-14 rounded-lg object-cover border border-slate-200 dark:border-slate-700" />
                    </div>
                  )}

                  {/* Content Right */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className="font-semibold text-slate-900 dark:text-white">{exp.position}</h3>
                      <span className="px-2 py-0.5 text-xs rounded-full bg-blue-50 text-blue-600 border border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20">{typeLabels[exp.type] || exp.type}</span>
                      {exp.isCurrent && <span className="px-2 py-0.5 text-xs rounded-full bg-green-50 text-green-600 border border-green-200 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20">Current</span>}
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">
                      {exp.company}
                      {exp.location && <span> · {exp.location}</span>}
                    </p>
                    <p className="text-slate-400 dark:text-slate-500 text-xs mt-1">{formatDate(exp.startDate)} — {exp.isCurrent ? "Present" : exp.endDate ? formatDate(exp.endDate) : "N/A"}</p>
                    {exp.description && <p className="text-slate-600 dark:text-slate-300 text-sm mt-3 leading-relaxed">{exp.description}</p>}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {tab === "education" && educations.map((edu) => (
            <div key={edu.id} className="relative pl-12 pb-10 last:pb-0">
              <div className="absolute left-2.5 top-1 w-3 h-3 rounded-full bg-indigo-500 border-2 border-white dark:border-slate-950" />
              <div className="p-5 rounded-xl bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-colors shadow-sm">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h3 className="font-semibold text-slate-900 dark:text-white">{edu.degree}</h3>
                  {edu.isCurrent && <span className="px-2 py-0.5 text-xs rounded-full bg-green-50 text-green-600 border border-green-200 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20">Current</span>}
                </div>
                <p className="text-slate-600 dark:text-slate-400 text-sm">{edu.institution} · {edu.field}</p>
                <p className="text-slate-400 dark:text-slate-500 text-xs mt-1">
                  {formatDate(edu.startDate)} — {edu.isCurrent ? "Present" : edu.endDate ? formatDate(edu.endDate) : "N/A"}
                  {edu.gpa && <span> · GPA: {edu.gpa}</span>}
                </p>
                {edu.description && <p className="text-slate-600 dark:text-slate-300 text-sm mt-3 leading-relaxed">{edu.description}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}