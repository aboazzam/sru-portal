import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/dal";
import ServicesSidebar from "./_components/ServicesSidebar";

const ROLE_LABELS: Record<string, string> = {
  STUDENT:   "طالب",
  FACULTY:   "عضو هيئة التدريس",
  ADMIN:     "مدير النظام",
  ORGANIZER: "منظم فعاليات",
  SUBADMIN:  "مشرف النظام",
};

const ADMIN_ROLES = ["ADMIN", "SUBADMIN"];

export default async function ServicesLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return (
    <div className="flex" style={{ minHeight: "calc(100vh - 64px)" }}>
      <ServicesSidebar
        userName={user.name}
        userRole={ROLE_LABELS[user.role] ?? ""}
        isAdmin={ADMIN_ROLES.includes(user.role)}
      />
      <div className="flex-1 min-w-0 bg-[#F4F7F8] overflow-auto">
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
