import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/dal";
import { prisma } from "@/lib/db";

const statusConfig: Record<string, { label: string; color: string; bg: string; icon: string }> = {
  APPROVED: { label: "مقبول",         color: "#16A34A", bg: "#DCFCE7", icon: "✅" },
  REJECTED: { label: "مرفوض",         color: "#DC2626", bg: "#FEE2E2", icon: "❌" },
  PENDING:  { label: "قيد المراجعة",  color: "#D97706", bg: "#FEF3C7", icon: "⏳" },
};

export default async function TrackPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const applications = await prisma.scholarshipApplication.findMany({
    where: { userId: user.id },
    include: { scholarship: { select: { title: true, amount: true } } },
    orderBy: { createdAt: "desc" },
  });

  const activeApp = applications.find((a) => a.status === "APPROVED");
  const hasActiveScholarship = !!activeApp;

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-[#8FA4AB]">
        <Link href="/scholarships" className="hover:text-[#875E9E] transition-colors">المنح والحلول المالية</Link>
        <span>/</span>
        <span className="text-[#1A2A30] font-medium">تتبع الطلب</span>
      </div>

      {/* Hero */}
      <div
        className="rounded-2xl p-6 text-white shadow-sm"
        style={{ background: "linear-gradient(135deg, #875E9E 0%, #6CAEBD 100%)" }}
      >
        <div className="flex items-center gap-3">
          <span className="text-4xl">🔍</span>
          <div>
            <h1 className="text-xl font-bold">تتبع حالة الطلب</h1>
            <p className="text-white/80 text-sm mt-0.5">
              {applications.length === 0
                ? "لا توجد طلبات مقدّمة بعد"
                : `${applications.length} طلب مقدّم`}
            </p>
          </div>
        </div>
      </div>

      {/* Active scholarship */}
      {hasActiveScholarship && activeApp && (
        <div className="bg-white rounded-2xl shadow-sm border border-[#E8EDEF] overflow-hidden">
          <div
            className="px-5 py-3 flex items-center gap-2"
            style={{ background: "linear-gradient(to left, #875E9E08, #6CAEBD08)", borderBottom: "1px solid #E8EDEF" }}
          >
            <span>✨</span>
            <h2 className="font-bold text-[#1A2A30] text-sm">المنحة النشطة الحالية</h2>
            <span
              className="ms-auto text-xs font-semibold px-2.5 py-1 rounded-full"
              style={{ background: "#DCFCE7", color: "#16A34A" }}
            >
              ✅ نشطة
            </span>
          </div>
          <div className="p-5">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <h3 className="font-bold text-[#1F2937] text-base">{activeApp.scholarship.title}</h3>
                <p className="text-[#8FA4AB] text-sm mt-0.5">
                  تاريخ القبول:{" "}
                  {new Date(activeApp.updatedAt).toLocaleDateString("ar-SA", {
                    day: "numeric", month: "long", year: "numeric",
                  })}
                </p>
                {activeApp.scholarship.amount != null && (
                  <p className="text-sm font-semibold mt-2" style={{ color: "#16A34A" }}>
                    قيمة المنحة: {activeApp.scholarship.amount.toLocaleString("ar-SA")} ر.س
                  </p>
                )}
              </div>
              <div
                className="w-16 h-16 rounded-2xl flex flex-col items-center justify-center shrink-0"
                style={{ background: "linear-gradient(135deg, #875E9E18, #6CAEBD18)" }}
              >
                <span className="text-2xl">🏅</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* No active scholarship */}
      {!hasActiveScholarship && (
        <div className="bg-white rounded-2xl border border-[#E8EDEF] p-12 text-center">
          <p className="text-4xl mb-3">📭</p>
          <h3 className="font-bold text-[#1A2A30] text-base">لا توجد منحة نشطة حالياً</h3>
          <p className="text-[#8FA4AB] text-sm mt-1 mb-4">يمكنك التقديم على إحدى المنح المتاحة</p>
          <Link
            href="/scholarships/apply"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
            style={{ background: "linear-gradient(to left, #875E9E, #6A4A7E)" }}
          >
            📝 تقديم طلب الآن
          </Link>
        </div>
      )}

      {/* Application history */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#E8EDEF] overflow-hidden">
        <div className="px-5 py-4 border-b border-[#E8EDEF] flex items-center gap-2">
          <span>📜</span>
          <h2 className="font-bold text-[#1A2A30] text-sm">سجل الطلبات</h2>
        </div>

        {applications.length === 0 ? (
          <div className="p-10 text-center">
            <p className="text-[#8FA4AB]">لا يوجد سجل طلبات سابقة</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#F4F7F8]">
                <tr>
                  <th className="px-5 py-3 text-start text-xs font-bold text-[#506570]">نوع المنحة</th>
                  <th className="px-5 py-3 text-start text-xs font-bold text-[#506570]">تاريخ التقديم</th>
                  <th className="px-5 py-3 text-start text-xs font-bold text-[#506570]">آخر تحديث</th>
                  <th className="px-5 py-3 text-center text-xs font-bold text-[#506570]">الحالة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F4F7F8]">
                {applications.map((app) => {
                  const cfg = statusConfig[app.status] ?? statusConfig.PENDING;
                  return (
                    <tr key={app.id} className="hover:bg-[#F9FAFB] transition-colors">
                      <td className="px-5 py-3.5 font-semibold text-[#1F2937]">{app.scholarship.title}</td>
                      <td className="px-5 py-3.5 text-[#6B7280]">
                        {new Date(app.createdAt).toLocaleDateString("ar-SA", {
                          day: "numeric", month: "long", year: "numeric",
                        })}
                      </td>
                      <td className="px-5 py-3.5 text-[#6B7280]">
                        {new Date(app.updatedAt).toLocaleDateString("ar-SA", {
                          day: "numeric", month: "long", year: "numeric",
                        })}
                      </td>
                      <td className="px-5 py-3.5 text-center">
                        <span
                          className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full"
                          style={{ color: cfg.color, background: cfg.bg }}
                        >
                          {cfg.icon} {cfg.label}
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

      {/* Apply again CTA */}
      <div
        className="rounded-2xl p-5 flex items-center justify-between gap-4 flex-wrap"
        style={{ background: "linear-gradient(to left, #875E9E18, #6CAEBD18)", border: "1px solid #D8C8E8" }}
      >
        <div>
          <p className="font-bold text-[#1A2A30] text-sm">هل تريد التقديم على منحة جديدة؟</p>
          <p className="text-xs text-[#6B7280] mt-0.5">تصفّح المنح المتاحة وقدّم طلبك للعام القادم</p>
        </div>
        <Link
          href="/scholarships/apply"
          className="shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
          style={{ background: "linear-gradient(to left, #875E9E, #6A4A7E)" }}
        >
          📝 تقديم طلب جديد
        </Link>
      </div>
    </div>
  );
}
