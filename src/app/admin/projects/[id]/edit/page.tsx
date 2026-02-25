import { auth } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import AdminHeader from "@/components/admin/admin-header";
import ProjectForm from "@/components/admin/project-form";

interface EditProjectPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProjectPage({ params }: EditProjectPageProps) {
  const session = await auth();
  if (!session) redirect("/admin/login");

  const { id } = await params;

  const project = await prisma.project.findUnique({
    where: { id },
  });

  if (!project) notFound();

  return (
    <div className="min-h-screen bg-slate-950">
      <AdminHeader user={session.user} />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Edit Project</h1>
          <p className="text-slate-400 mt-1">
            Update project: {project.title}
          </p>
        </div>

        <ProjectForm mode="edit" initialData={project} />
      </main>
    </div>
  );
}
