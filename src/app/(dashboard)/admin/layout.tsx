import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/dal";
import AdminSidebar from "./_components/AdminSidebar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") redirect("/dashboard");

  return (
    <div
      className="-mx-6 -my-6 flex"
      style={{ minHeight: "calc(100vh - 73px)" }}
    >
      <AdminSidebar userName={user.name} />
      <div className="flex-1 min-w-0 bg-gray-50 overflow-auto">
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
