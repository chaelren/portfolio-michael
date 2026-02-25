import { Github, Linkedin, Instagram, Mail, Heart } from "lucide-react";

interface FooterProps {
  socialLinks: Array<{
    id: string;
    platform: string;
    url: string;
    icon: string | null;
  }>;
}

const iconMap: Record<string, React.ReactNode> = {
  github: <Github className="w-4 h-4" />,
  linkedin: <Linkedin className="w-4 h-4" />,
  instagram: <Instagram className="w-4 h-4" />,
  mail: <Mail className="w-4 h-4" />,
};

export default function Footer({ socialLinks }: FooterProps) {
  return (
    <footer className="py-8 px-4 border-t border-slate-200 dark:border-slate-800">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-slate-500 text-sm flex items-center gap-1">
          Built with <Heart className="w-3 h-3 text-red-500 dark:text-red-400" /> by Michael Caren Sihombing
        </p>

        {socialLinks.length > 0 && (
          <div className="flex items-center gap-2">
            {socialLinks.map((link) => (
              <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" className="p-2 text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors" title={link.platform}>
                {iconMap[link.platform.toLowerCase()] || iconMap[link.icon?.toLowerCase() || ""] || <span className="text-xs">{link.platform}</span>}
              </a>
            ))}
          </div>
        )}

        <p className="text-slate-400 dark:text-slate-600 text-xs">© {new Date().getFullYear()} All rights reserved.</p>
      </div>
    </footer>
  );
}