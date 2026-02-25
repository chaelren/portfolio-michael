interface SkillsProps {
  categories: Array<{
    id: string;
    name: string;
    skills: Array<{
      id: string;
      name: string;
      level: string;
      iconUrl: string | null;
    }>;
  }>;
}

const levelColors: Record<string, string> = {
  BEGINNER: "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300",
  INTERMEDIATE: "bg-blue-50 text-blue-600 border border-blue-200 dark:bg-blue-500/15 dark:text-blue-300 dark:border-blue-500/20",
  ADVANCED: "bg-purple-50 text-purple-600 border border-purple-200 dark:bg-purple-500/15 dark:text-purple-300 dark:border-purple-500/20",
  EXPERT: "bg-amber-50 text-amber-600 border border-amber-200 dark:bg-amber-500/15 dark:text-amber-300 dark:border-amber-500/20",
};

export default function SkillsSection({ categories }: SkillsProps) {
  return (
    <section id="skills" className="py-20 px-4 bg-slate-50 dark:bg-slate-900/30">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">
          <span className="bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">Skills & Tech Stack</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {categories.map((category) => (
            <div key={category.id} className="p-6 rounded-xl bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-colors shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">{category.name}</h3>
              <div className="flex flex-wrap gap-2">
                {category.skills.map((skill) => (
                  <span key={skill.id} className={`px-3 py-1.5 rounded-lg text-sm font-medium ${levelColors[skill.level] || levelColors.INTERMEDIATE}`}>
                    {skill.iconUrl && <img src={skill.iconUrl} alt="" className="w-4 h-4 inline mr-1.5 -mt-0.5" />}
                    {skill.name}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}