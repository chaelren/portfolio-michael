import { Github, Linkedin, Instagram, Mail, Download, ArrowDown } from "lucide-react";

interface HeroProps {
  hero: {
    greeting: string;
    name: string;
    title: string;
    subtitle: string | null;
    description: string;
    resumeUrl: string | null;
    avatarUrl: string | null;
  };
  socialLinks: Array<{
    platform: string;
    url: string;
    icon: string | null;
  }>;
}

const iconMap: Record<string, React.ReactNode> = {
  github: <Github className="w-5 h-5" />,
  linkedin: <Linkedin className="w-5 h-5" />,
  instagram: <Instagram className="w-5 h-5" />,
  mail: <Mail className="w-5 h-5" />,
};

export default function HeroSection({ hero, socialLinks }: HeroProps) {
  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center px-4 pt-20">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-600/5 via-transparent to-transparent" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />

      <div className="relative max-w-3xl mx-auto text-center">
        {hero.avatarUrl && (
          <div className="mb-8 flex justify-center">
            <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-slate-200 dark:border-slate-700 shadow-xl shadow-blue-500/10">
              <img src={hero.avatarUrl} alt={hero.name} className="w-full h-full object-cover" />
            </div>
          </div>
        )}

        <p className="text-slate-500 dark:text-slate-400 text-lg mb-2">{hero.greeting}</p>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4">
          <span className="bg-gradient-to-r from-slate-900 via-slate-700 to-slate-500 dark:from-white dark:via-slate-200 dark:to-slate-400 bg-clip-text text-transparent">
            {hero.name}
          </span>
        </h1>
        <h2 className="text-xl sm:text-2xl text-blue-600 dark:text-blue-400 font-semibold mb-3">{hero.title}</h2>
        {hero.subtitle && <p className="text-slate-500 dark:text-slate-400 text-lg mb-6">{hero.subtitle}</p>}
        <p className="text-slate-600 dark:text-slate-300 max-w-xl mx-auto leading-relaxed mb-8">{hero.description}</p>

        <div className="flex items-center justify-center gap-4 mb-10">
          <a href="#contact" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium transition-all shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40">
            <Mail className="w-4 h-4" />Get in Touch
          </a>
          {hero.resumeUrl && (
            <a href={hero.resumeUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:border-slate-400 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800/50 font-medium transition-all">
              <Download className="w-4 h-4" />Download CV
            </a>
          )}
        </div>

        {socialLinks.length > 0 && (
          <div className="flex items-center justify-center gap-3">
            {socialLinks.map((link) => (
              <a key={link.url} href={link.url} target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-all" title={link.platform}>
                {iconMap[link.platform.toLowerCase()] || iconMap[link.icon?.toLowerCase() || ""] || <span className="text-sm">{link.platform}</span>}
              </a>
            ))}
          </div>
        )}

        <div className="mt-16 flex justify-center animate-bounce">
          <ArrowDown className="w-5 h-5 text-slate-400 dark:text-slate-500" />
        </div>
      </div>
    </section>
  );
}