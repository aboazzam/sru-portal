import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/dal";
import { prisma } from "@/lib/db";

const statusConfig: Record<string, { label: string; bg: string; color: string; icon: string; border: string }> = {
  PENDING:  { label: "قيد المراجعة", bg: "#FEF3C7", color: "#D97706", icon: "⏳", border: "#D97706" },
  APPROVED: { label: "مقبول",        bg: "#DCFCE7", color: "#16A34A", icon: "✅", border: "#16A34A" },
  REJECTED: { label: "مرفوض",        bg: "#FEE2E2", color: "#DC2626", icon: "❌", border: "#DC2626" },
};

const serviceIcons = ["📋", "📄", "🎓", "📝", "🏠", "🚌", "🏥", "📚", "💼", "🎯", "🔑", "🖨️"];

export default async function MyRequestsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const applications = await prisma.serviceApplications.findMany({
    where: { userId: user.id },
    include: {
      service: { select: { id: true, title: true, description: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const pending  = applications.filter((a) => a.status === "PENDING");
  const approved = applications.filter((a) => a.status === "APPROVED");
  const rejected = applications.filter((a) => a.status === "REJECTED");

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-[#1A2A30]">طلباتي</h1>
          <p className="text-[#8FA4AB] text-sm mt-0.5">
            {applications.length} طلب · {pending.length} قيد المراجعة · {approved.length} مقبول
          </p>
        </div>
        <Link
          href="/services/catalog"
          className="text-sm font-bold px-4 py-2 rounded-xl text-white transition-opacity hover:opacity-90"
          style={{ background: "linear-gradient(to left, #059669, #047857)" }}
        >
          + تقدّم لخدمة جديدة
        </Link>
      </div>

      {applications.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#E8EDEF] py-20 text-center">
          <p className="text-4xl mb-3">📭</p>
          <h3 className="font-bold text-[#1A2A30] text-base">لا توجد طلبات بعد</h3>
          <p className="text-[#8FA4AB] text-sm mt-1 mb-4">تصفّح الكتالوج وقدّم طلبك</p>
          <Link
            href="/services/catalog"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
            style={{ background: "linear-gradient(to left, #059669, #047857)" }}
          >
            📋 كتالوج الخدمات
          </Link>
        </div>
      ) : (
        <div className="space-y-6">

          {/* Pending */}
          {pending.length > 0 && (
            <div className="bg-white rounded-2xl shadow-sm border border-[#E8EDEF] overflow-hidden">
              <div className="px-5 py-4 border-b border-[#E8EDEF] flex items-center gap-2">
                <span>⏳</span>
                <h2 className="font-bold text-[#1A2A30] text-sm">قيد المراجعة</h2>
                <span className="ms-auto text-xs font-bold text-[#D97706]">{pending.length}</span>
              </div>
              <div className="divide-y divide-[#F4F7F8]">
                {pending.map((app, i) => {
                  const sc = statusConfig.PENDING;
                  return (
                    <div key={app.id} className="px-5 py-4 hover:bg-[#F9FAFB] transition-colors">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#FEF9E7] flex items-center justify-center text-xl shrink-0">
                          {serviceIcons[i % serviceIcons.length]}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm text-[#1F2937]">{app.service.title}</p>
                          {app.service.description && (
                            <p className="text-xs text-[#6B7280] mt-0.5 line-clamp-1">{app.service.description}</p>
                          )}
                          <p className="text-xs text-[#9CA3AF] mt-1">
                            تاريخ التقديم: {app.createdAt.toLocaleDateString("ar-SA", { day: "numeric", month: "long", year: "numeric" })}
                          </p>
                        </div>
                        <span className="shrink-0 text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: sc.bg, color: sc.color }}>
                          {sc.icon} {sc.label}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Approved */}
          {approved.length > 0 && (
            <div className="bg-white rounded-2xl shadow-sm border border-[#E8EDEF] overflow-hidden">
              <div className="px-5 py-4 border-b border-[#E8EDEF] flex items-center gap-2">
                <span>✅</span>
                <h2 className="font-bold text-[#1A2A30] text-sm">مقبولة</h2>
                <span className="ms-auto text-xs font-bold text-[#16A34A]">{approved.length}</span>
              </div>
              <div className="divide-y divide-[#F4F7F8]">
                {approved.map((app, i) => {
                  const sc = statusConfig.APPROVED;
                  return (
                    <div key={app.id} className="px-5 py-4 hover:bg-[#F9FAFB] transition-colors">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#ECFDF5] flex items-center justify-center text-xl shrink-0">
                          {serviceIcons[(i + 3) % serviceIcons.length]}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm text-[#1F2937]">{app.service.title}</p>
                          {app.service.description && (
                            <p className="text-xs text-[#6B7280] mt-0.5 line-clamp-1">{app.service.description}</p>
                          )}
                          <p className="text-xs text-[#9CA3AF] mt-1">
                            تاريخ التقديم: {app.createdAt.toLocaleDateString("ar-SA", { day: "numeric", month: "long", year: "numeric" })}
                          </p>
                        </div>
                        <span className="shrink-0 text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: sc.bg, color: sc.color }}>
                          {sc.icon} {sc.label}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Rejected */}
          {rejected.length > 0 && (
            <div className="space-y-2">
              <h2 className="font-bold text-[#8FA4AB] text-sm">مرفوضة</h2>
              {rejected.map((app) => (
                <div key={app.id} className="bg-[#F9FAFB] rounded-xl border border-[#E8EDEF] px-5 py-3.5 flex items-center justify-between gap-3 opacity-75">
                  <p className="font-medium text-[#374151] text-sm">{app.service.title}</p>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#FEE2E2] text-[#DC2626]">❌ مرفوض</span>
                </div>
              ))}
            </div>
          )}

        </div>
      )}

    </div>
  );
}
