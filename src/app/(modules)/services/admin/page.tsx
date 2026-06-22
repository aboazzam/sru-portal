import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/dal";
import { prisma } from "@/lib/db";
import RequestsTable from "./_components/RequestsTable";

const ADMIN_ROLES = ["ADMIN", "SUBADMIN"];

export default async function ServiceAdminPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (!ADMIN_ROLES.includes(user.role)) redirect("/services");

  const [applications, services] = await Promise.all([
    prisma.serviceApplications.findMany({
      include: {
        user:    { select: { id: true, name: true, email: true } },
        service: { select: { id: true, title: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.studentService.findMany({
      orderBy: { createdAt: "asc" },
      select: { id: true, title: true },
    }),
  ]);

  const pending  = applications.filter((a) => a.status === "PENDING").length;
  const approved = applications.filter((a) => a.status === "APPROVED").length;
  const rejected = applications.filter((a) => a.status === "REJECTED").length;

  // Serialise dates so they cross the server→client boundary safely
  const serialised = applications.map((a) => ({
    ...a,
    createdAt: a.createdAt.toISOString(),
    updatedAt: a.updatedAt.toISOString(),
  }));

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#1A2A30]">إدارة طلبات الخدمات</h1>
        <p className="text-[#8FA4AB] text-sm mt-0.5">
          مراجعة وقبول أو رفض طلبات الطلاب المقدَّمة
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "إجمالي الطلبات",  value: applications.length, icon: "📋", color: "#6B46C1" },
          { label: "قيد المراجعة",    value: pending,              icon: "⏳", color: "#D97706" },
          { label: "مقبولة",          value: approved,             icon: "✅", color: "#16A34A" },
          { label: "مرفوضة",          value: rejected,             icon: "❌", color: "#DC2626" },
        ].map((s) => (
          <div
            key={s.label}
            className="bg-white rounded-xl border border-[#E8EDEF] p-4 hover:shadow-sm transition-shadow"
          >
            <div className="text-2xl mb-1">{s.icon}</div>
            <p className="text-xl font-bold" style={{ color: s.color }}>{s.value}</p>
            <p className="text-xs text-[#8FA4AB] mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Requests table (client component for filtering + modal) */}
      <RequestsTable applications={serialised} services={services} />

    </div>
  );
}
