import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/dal";
import { prisma } from "@/lib/db";

type UnifiedStatus = "PENDING" | "APPROVED" | "REJECTED" | "COMPLETED";

const statusConfig: Record<UnifiedStatus, { label: string; color: string; bg: string }> = {
  PENDING:   { label: "قيد المراجعة", color: "#d97706", bg: "#fef3c7" },
  APPROVED:  { label: "مقبول",        color: "#16a34a", bg: "#dcfce7" },
  REJECTED:  { label: "مرفوض",        color: "#dc2626", bg: "#fee2e2" },
  COMPLETED: { label: "مكتمل",        color: "#2563eb", bg: "#dbeafe" },
};

type RequestRow = {
  id: string;
  type: string;
  category: string;
  status: UnifiedStatus;
  date: Date;
};

export default async function MyRequestsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const [scholarships, trainings, volunteers, activities, services] = await Promise.all([
    prisma.scholarshipApplication.findMany({
      where: { userId: user.id },
      include: { scholarship: { select: { title: true } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.trainingEnrollment.findMany({
      where: { userId: user.id },
      include: { training: { select: { title: true } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.volunteerApplication.findMany({
      where: { userId: user.id },
      include: { opportunity: { select: { title: true } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.activityApplication.findMany({
      where: { userId: user.id },
      include: { activity: { select: { title: true } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.serviceApplications.findMany({
      where: { userId: user.id },
      include: { service: { select: { title: true } } },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const rows: RequestRow[] = [
    ...scholarships.map((r) => ({
      id: `SCH-${r.id.slice(-5).toUpperCase()}`,
      type: r.scholarship.title,
      category: "منحة دراسية",
      status: r.status as UnifiedStatus,
      date: r.createdAt,
    })),
    ...trainings.map((r) => ({
      id: `TRN-${r.id.slice(-5).toUpperCase()}`,
      type: r.training.title,
      category: "تدريب تعاوني",
      status: r.status as UnifiedStatus,
      date: r.createdAt,
    })),
    ...volunteers.map((r) => ({
      id: `VOL-${r.id.slice(-5).toUpperCase()}`,
      type: r.opportunity.title,
      category: "تطوع",
      status: r.status as UnifiedStatus,
      date: r.createdAt,
    })),
    ...activities.map((r) => ({
      id: `ACT-${r.id.slice(-5).toUpperCase()}`,
      type: r.activity.title,
      category: "نشاط طلابي",
      status: r.status as UnifiedStatus,
      date: r.createdAt,
    })),
    ...services.map((r) => ({
      id: `SVC-${r.id.slice(-5).toUpperCase()}`,
      type: r.service.title,
      category: "خدمة طلابية",
      status: r.status as UnifiedStatus,
      date: r.createdAt,
    })),
  ].sort((a, b) => b.date.getTime() - a.date.getTime());

  const counts = {
    PENDING:   rows.filter((r) => r.status === "PENDING").length,
    APPROVED:  rows.filter((r) => r.status === "APPROVED").length,
    COMPLETED: rows.filter((r) => r.status === "COMPLETED").length,
    REJECTED:  rows.filter((r) => r.status === "REJECTED").length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Link href="/sanad" className="hover:text-[#3D1F6E] transition-colors">سند</Link>
        <span>/</span>
        <span className="text-[#3D1F6E] font-medium">طلباتي</span>
      </div>

      {/* Status summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {(Object.entries(counts) as [UnifiedStatus, number][]).map(([status, count]) => {
          const cfg = statusConfig[status];
          return (
            <div key={status} className="bg-white rounded-xl border border-purple-100 p-4 text-center">
              <div className="text-2xl font-bold" style={{ color: cfg.color }}>{count}</div>
              <div className="text-xs text-gray-500 mt-0.5">{cfg.label}</div>
            </div>
          );
        })}
      </div>

      {/* Requests table */}
      <div className="bg-white rounded-2xl shadow-sm border border-purple-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-purple-50 flex items-center justify-between">
          <h2 className="font-bold text-[#3D1F6E]">جميع الطلبات</h2>
          <span className="text-xs text-gray-400">{rows.length} طلب</span>
        </div>

        {rows.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-gray-400">لا توجد طلبات بعد</p>
            <p className="text-gray-300 text-xs mt-1">سجّل في المنح أو الأنشطة أو الفرص التطوعية</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#F5F3FF]">
                <tr>
                  <th className="px-4 py-3 text-start text-xs font-bold text-[#3D1F6E]">رقم الطلب</th>
                  <th className="px-4 py-3 text-start text-xs font-bold text-[#3D1F6E]">نوع الطلب</th>
                  <th className="px-4 py-3 text-start text-xs font-bold text-[#3D1F6E] hidden sm:table-cell">التصنيف</th>
                  <th className="px-4 py-3 text-start text-xs font-bold text-[#3D1F6E] hidden sm:table-cell">التاريخ</th>
                  <th className="px-4 py-3 text-start text-xs font-bold text-[#3D1F6E]">الحالة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {rows.map((req) => {
                  const cfg = statusConfig[req.status];
                  return (
                    <tr key={req.id} className="hover:bg-[#F5F3FF]/50 transition-colors">
                      <td className="px-4 py-3 font-mono text-xs text-[#6B46C1] font-bold">{req.id}</td>
                      <td className="px-4 py-3 font-medium text-[#1F2937] max-w-[200px] truncate">{req.type}</td>
                      <td className="px-4 py-3 text-gray-400 text-xs hidden sm:table-cell">{req.category}</td>
                      <td className="px-4 py-3 text-gray-400 text-xs hidden sm:table-cell">
                        {req.date.toLocaleDateString("ar-SA")}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className="inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full"
                          style={{ color: cfg.color, background: cfg.bg }}
                        >
                          {cfg.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
