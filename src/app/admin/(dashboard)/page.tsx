import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import {
  FolderOpen,
  MessageSquare,
  Award,
  Briefcase,
  Code2,
  Eye,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import AdminHeader from "@/components/admin/admin-header";

async function getDashboardStats() {
  const [projects, skills, experiences, certifications, messages, unreadMessages] =
    await Promise.all([
      prisma.project.count({ where: { isActive: true } }),
      prisma.skill.count({ where: { isActive: true } }),
      prisma.experience.count({ where: { isActive: true } }),
      prisma.certification.count({ where: { isActive: true } }),
      prisma.contactMessage.count(),
      prisma.contactMessage.count({ where: { status: "UNREAD" } }),
    ]);

  return { projects, skills, experiences, certifications, messages, unreadMessages };
}

export default async function AdminDashboardPage() {
  const session = await auth();
  if (!session) redirect("/admin/login");

  const stats = await getDashboardStats();

  const statCards = [
    {
      title: "Projects",
      value: stats.projects,
      icon: FolderOpen,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
    },
    {
      title: "Skills",
      value: stats.skills,
      icon: Code2,
      color: "text-green-400",
      bg: "bg-green-500/10",
    },
    {
      title: "Experience",
      value: stats.experiences,
      icon: Briefcase,
      color: "text-purple-400",
      bg: "bg-purple-500/10",
    },
    {
      title: "Certifications",
      value: stats.certifications,
      icon: Award,
      color: "text-amber-400",
      bg: "bg-amber-500/10",
    },
    {
      title: "Messages",
      value: stats.messages,
      icon: MessageSquare,
      color: "text-cyan-400",
      bg: "bg-cyan-500/10",
      badge: stats.unreadMessages > 0 ? `${stats.unreadMessages} unread` : undefined,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950">
      <AdminHeader user={session.user} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">
            Welcome back, {session.user.name?.split(" ")[0]} 👋
          </h1>
          <p className="text-slate-400 mt-1">
            Kelola konten portfolio kamu dari dashboard ini.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
          {statCards.map((stat) => (
            <Card
              key={stat.title}
              className="bg-slate-900/50 border-slate-800 hover:border-slate-700 transition-colors"
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-slate-400">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.bg}`}>
                  <stat.icon className={`w-4 h-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-white">
                    {stat.value}
                  </span>
                  {stat.badge && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">
                      {stat.badge}
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Eye className="w-5 h-5 text-slate-400" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                { label: "Manage Projects", href: "/admin/projects", icon: FolderOpen },
                { label: "Manage Skills", href: "/admin/skills", icon: Code2 },
                { label: "Manage Experience", href: "/admin/experience", icon: Briefcase },
                { label: "Manage Certifications", href: "/admin/certifications", icon: Award },
                { label: "View Messages", href: "/admin/messages", icon: MessageSquare },
                { label: "Site Settings", href: "/admin/settings", icon: Eye },
              ].map((action) => (
                <a
                  key={action.label}
                  href={action.href}
                  className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 hover:border-slate-600 transition-all text-slate-300 hover:text-white group"
                >
                  <action.icon className="w-5 h-5 text-slate-500 group-hover:text-blue-400 transition-colors" />
                  <span className="text-sm font-medium">{action.label}</span>
                </a>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}