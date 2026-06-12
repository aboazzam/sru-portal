import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/dal";
import { prisma } from "@/lib/db";

const statusConfig: Record<string, { label: string; bg: string; color: string; icon: string }> = {
  PENDING:  { label: "قيد المراجعة", bg: "#FEF3C7", color: "#D97706", icon: "⏳" },
  APPROVED: { label: "مقبول",        bg: "#DCFCE7", color: "#16A34A", icon: "✅" },
  REJECTED: { label: "مرفوض",        bg: "#FEE2E2", color: "#DC2626", icon: "❌" },
};

const volIcons = ["🌱", "📚", "🏥", "🎯", "♻️", "💻", "🏆", "🎓", "🤲", "🌍"];

export default async function VolunteersDashboard() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const now = new Date();

  const [totalOpportunities, upcomingOpportunities, myApplications] = await Promise.all([
    prisma.volunteerOpportunity.count(),
    prisma.volunteerOpportunity.findMany({
      where: { OR: [{ date: null }, { date: { gte: now } }] },
      orderBy: { date: "asc" },
      take: 4,
      select: { id: true, title: true, description: true, date: true },
    }),
    prisma.volunteerApplication.findMany({
      where: { userId: user.id },
      include: { opportunity: { select: { id: true, title: true, date: true } } },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const pendingCount  = myApplications.filter((a) => a.status === "PENDING").length;
  const approvedCount = myApplications.filter((a) => a.status === "APPROVED").length;
  const recentApps    = myApplications.slice(0, 4);

  return (
    <div className="space-y-6">

      {/* Hero */}
      <div
        className="rounded-2xl p-6 text-white shadow-sm"
        style={{ background: "linear-gradient(135deg, #EA580C 0%, #C2410C 100%)" }}
      >
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <p className="text-white/70 text-xs mb-1">التطوع والمشاركة المجتمعية — جامعة سليمان الراجحي</p>
            <h1 className="text-xl font-bold">مرحباً، {user.name.split(" ")[0]} 👋</h1>
            <p className="text-white/80 text-sm mt-0.5">{user.email}</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            {approvedCount > 0 && (
              <span
                className="text-xs font-bold px-3 py-1.5 rounded-full"
                style={{ background: "rgba(255,255,255,0.2)" }}
              >
                🏅 متطوع نشط
              </span>
            )}
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-xl font-bold">
              {user.name.charAt(0)}
            </div>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between gap-4 flex-wrap">
          <p className="text-white/70 text-sm">
            {myApplications.length === 0
              ? "لم تُقدّم أي طلب تطوع بعد — اكتشف الفرص المتاحة"
              : `${myApplications.length} طلب تطوع · ${pendingCount} قيد المراجعة · ${approvedCount} مقبول`}
          </p>
          <Link
            href="/volunteers/opportunities"
            className="text-xs font-bold px-4 py-2 rounded-xl text-white transition-all hover:bg-white/20"
            style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.3)" }}
          >
            اكتشف الفرص ←
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "فرص متاحة",       value: String(totalOpportunities),        icon: "🤝", color: "#EA580C" },
          { label: "قيد المراجعة",    value: String(pendingCount),              icon: "⏳", color: "#D97706" },
          { label: "مقبولة",          value: String(approvedCount),             icon: "✅", color: "#16A34A" },
          { label: "إجمالي طلباتي",   value: String(myApplications.length),     icon: "📋", color: "#4A8FA0" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-[#E8EDEF] p-4 hover:shadow-sm transition-shadow">
            <div className="text-2xl mb-1">{s.icon}</div>
            <p className="text-lg font-bold" style={{ color: s.color }}>{s.value}</p>
            <p className="text-xs text-[#8FA4AB] mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Upcoming opportunities + recent applications */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Upcoming opportunities */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#E8EDEF] overflow-hidden">
          <div className="px-5 py-4 border-b border-[#E8EDEF] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span>📅</span>
              <h2 className="font-bold text-[#1A2A30] text-sm">أقرب الفرص</h2>
            </div>
            <Link href="/volunteers/opportunities" className="text-xs font-medium hover:underline" style={{ color: "#EA580C" }}>
              عرض الكل
            </Link>
          </div>

          {upcomingOpportunities.length === 0 ? (
            <div className="px-5 py-10 text-center">
              <p className="text-[#8FA4AB] text-sm">لا توجد فرص قادمة حالياً</p>
            </div>
          ) : (
            <div className="divide-y divide-[#F4F7F8]">
              {upcomingOpportunities.map((opp, i) => (
                <div key={opp.id} className="px-5 py-4 hover:bg-[#FFF7ED] transition-colors">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#FFF7ED] flex items-center justify-center text-lg shrink-0">
                      {volIcons[i % volIcons.length]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-[#1F2937] leading-snug">{opp.title}</p>
                      {opp.date && (
                        <p className="text-xs text-[#9CA3AF] mt-1">
                          📅 {opp.date.toLocaleDateString("ar-SA", { day: "numeric", month: "long", year: "numeric" })}
                        </p>
                      )}
                      {opp.description && (
                        <p className="text-xs text-[#6B7280] mt-0.5 line-clamp-2">{opp.description}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="px-5 py-3 bg-[#F4F7F8] border-t border-[#E8EDEF]">
            <Link
              href="/volunteers/opportunities"
              className="text-xs font-semibold flex items-center justify-center gap-1 hover:opacity-80 transition-opacity"
              style={{ color: "#EA580C" }}
            >
              عرض جميع فرص التطوع ←
            </Link>
          </div>
        </div>

        {/* Recent applications */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#E8EDEF] overflow-hidden">
          <div className="px-5 py-4 border-b border-[#E8EDEF] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span>📋</span>
              <h2 className="font-bold text-[#1A2A30] text-sm">آخر طلباتي</h2>
            </div>
            {myApplications.length > 0 && (
              <Link href="/volunteers/my-applications" className="text-xs font-medium hover:underline" style={{ color: "#EA580C" }}>
                عرض الكل
              </Link>
            )}
          </div>

          {recentApps.length === 0 ? (
            <div className="px-5 py-10 text-center">
              <p className="text-3xl mb-2">📭</p>
              <p className="text-sm text-[#8FA4AB]">لا توجد طلبات بعد</p>
              <Link
                href="/volunteers/opportunities"
                className="inline-block mt-3 text-xs font-semibold px-4 py-2 rounded-xl text-white"
                style={{ background: "#EA580C" }}
              >
                تطوّع الآن
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-[#F4F7F8]">
              {recentApps.map((app) => {
                const sc = statusConfig[app.status] ?? statusConfig.PENDING;
                return (
                  <div key={app.id} className="px-5 py-4 hover:bg-[#F9FAFB] transition-colors">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-xl bg-[#FFF7ED] flex items-center justify-center text-base shrink-0">🤝</div>
                        <div className="min-w-0">
                          <p className="font-semibold text-sm text-[#1F2937] leading-snug">{app.opportunity.title}</p>
                          <p className="text-xs text-[#9CA3AF] mt-0.5">
                            {app.createdAt.toLocaleDateString("ar-SA", { day: "numeric", month: "long" })}
                          </p>
                        </div>
                      </div>
                      <span className="shrink-0 text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: sc.bg, color: sc.color }}>
                        {sc.icon} {sc.label}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>

      {/* Info banner */}
      <div
        className="rounded-2xl px-6 py-5 flex items-start gap-4"
        style={{ background: "linear-gradient(to left, #FFF7ED, #FFEDD5)", border: "1px solid #FDBA74" }}
      >
        <span className="text-2xl shrink-0">🌟</span>
        <div>
          <p className="font-bold text-[#9A3412] text-sm mb-1">لماذا التطوع؟</p>
          <p className="text-xs text-[#C2410C] leading-relaxed">
            يُسهم التطوع في إثراء تجربتك الجامعية وتطوير مهاراتك القيادية والإنسانية · يُحتسب في سجلك الأكاديمي · يُعزّز ملفك الشخصي أمام أصحاب العمل · وتحصل على شهادة تطوع رسمية من الجامعة.
          </p>
        </div>
      </div>

    </div>
  );
}
