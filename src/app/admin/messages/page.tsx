import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminHeader from "@/components/admin/admin-header";
import MessagesInbox from "@/components/admin/messages-inbox";

export default async function AdminMessagesPage() {
  const session = await auth();
  if (!session) redirect("/admin/login");

  return (
    <div className="min-h-screen bg-slate-950">
      <AdminHeader user={session.user} />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Messages</h1>
          <p className="text-slate-400 mt-1">Pesan masuk dari pengunjung website</p>
        </div>
        <MessagesInbox />
      </main>
    </div>
  );
}