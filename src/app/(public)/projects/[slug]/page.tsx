import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Github, Calendar } from "lucide-react";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;

  const project = await prisma.project.findUnique({
    where: { slug },
  });

  if (!project || !project.isActive) notFound();

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <Link href="/#projects" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" />Back to Projects
        </Link>

        {project.imageUrl && (
          <div className="rounded-xl overflow-hidden border border-slate-800 mb-8">
            <img src={project.imageUrl} alt={project.title} className="w-full object-cover" />
          </div>
        )}

        <h1 className="text-3xl sm:text-4xl font-bold mb-4">{project.title}</h1>

        <div className="flex items-center gap-4 mb-6 flex-wrap">
          <span className="flex items-center gap-1.5 text-slate-400 text-sm">
            <Calendar className="w-4 h-4" />
            {new Date(project.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long" })}
          </span>
          {project.liveUrl && (
            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm text-blue-400 hover:text-blue-300 transition-colors">
              <ExternalLink className="w-4 h-4" />Live Demo
            </a>
          )}
          {project.githubUrl && (
            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors">
              <Github className="w-4 h-4" />Source Code
            </a>
          )}
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          {project.techStack.map((tech) => (
            <span key={tech} className="px-3 py-1 text-sm rounded-lg bg-blue-500/10 text-blue-300 border border-blue-500/20">{tech}</span>
          ))}
        </div>

        <p className="text-slate-300 text-lg leading-relaxed mb-8">{project.description}</p>

        {project.content && (
          <div className="prose prose-invert prose-slate max-w-none">
            {project.content.split("\n").map((paragraph, i) => (
              paragraph.trim() ? <p key={i} className="text-slate-300 leading-relaxed mb-4">{paragraph}</p> : null
            ))}
          </div>
        )}
      </div>
    </div>
  );
}