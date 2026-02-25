import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminHeader from "@/components/admin/admin-header";
import CertificationsManager from "@/components/admin/certifications-manager";

export default async function AdminCertificationsPage() {
  const session = await auth();
  if (!session) redirect("/admin/login");

  return (
    <div className="min-h-screen bg-slate-950">
      <AdminHeader user={session.user} />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Certifications</h1>
          <p className="text-slate-400 mt-1">Kelola sertifikasi dan pencapaian kamu</p>
        </div>
        <CertificationsManager />
      </main>
    </div>
  );
}