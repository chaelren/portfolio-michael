import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminHeader from "@/components/admin/admin-header";
import ProjectForm from "@/components/admin/project-form";

export default async function NewProjectPage() {
  const session = await auth();
  if (!session) redirect("/admin/login");

  return (
    <div className="min-h-screen bg-slate-950">
      <AdminHeader user={session.user} />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">New Project</h1>
          <p className="text-slate-400 mt-1">
            Tambahkan project baru ke portfolio kamu
          </p>
        </div>

        <ProjectForm mode="create" />
      </main>
    </div>
  );
}
