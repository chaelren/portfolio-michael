import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminHeader from "@/components/admin/admin-header";
import ExperienceManager from "@/components/admin/experience-manager";

export default async function AdminExperiencePage() {
  const session = await auth();
  if (!session) redirect("/admin/login");

  return (
    <div className="min-h-screen bg-slate-950">
      <AdminHeader user={session.user} />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Experience & Education</h1>
          <p className="text-slate-400 mt-1">Kelola riwayat pengalaman dan pendidikan kamu</p>
        </div>
        <ExperienceManager />
      </main>
    </div>
  );
}