import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/dal";
import { prisma } from "@/lib/db";
import { trainingAlerts, type AlertType } from "@/lib/mock/training";

const alertConfig: Record<AlertType, { icon: string; border: string; bg: string; text: string }> = {
  urgent:  { icon: "🔴", border: "#DC2626", bg: "#FEE2E2", text: "#DC2626" },
  warning: { icon: "🟡", border: "#D97706", bg: "#FEF3C7", text: "#D97706" },
  success: { icon: "✅", border: "#16A34A", bg: "#DCFCE7", text: "#16A34A" },
  info:    { icon: "ℹ️",  border: "#6CAEBD", bg: "#E8F6F8", text: "#4A8FA0" },
};

const statusColors: Record<string, { bg: string; color: string; label: string }> = {
  PENDING:   { bg: "#FEF3C7", color: "#D97706", label: "قيد المراجعة" },
  APPROVED:  { bg: "#DCFCE7", color: "#16A34A", label: "مقبول" },
  REJECTED:  { bg: "#FEE2E2", color: "#DC2626", label: "مرفوض" },
  COMPLETED: { bg: "#DBEAFE", color: "#2563EB", label: "مكتمل" },
};

const quickLinks = [
  { href: "/training/catalog",      label: "كتالوج البرامج",  icon: "📚", color: "#6CAEBD" },
  { href: "/training/my-courses",   label: "دوراتي",          icon: "🎓", color: "#875E9E" },
  { href: "/training/certificates", label: "الشهادات",        icon: "🏆", color: "#4A8FA0" },
  { href: "/training/requests",     label: "طلب تدريبي",      icon: "📝", color: "#6CAEBD" },
];

export default async function TrainingDashboard() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const [myEnrollments, availableCount] = await Promise.all([
    prisma.trainingEnrollment.findMany({
      where: { userId: user.id },
      include: {
        training: {
          select: { id: true, title: true, category: true, instructor: true, startDate: true, status: true },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.training.count({
      where: { status: { in: ["UPCOMING", "ONGOING"] } },
    }),
  ]);

  const activeEnrollments  = myEnrollments.filter((e) => e.status === "PENDING" || e.status === "APPROVED");
  const completedEnrollments = myEnrollments.filter((e) => e.status === "COMPLETED");

  // Upcoming sessions: active enrollments with future startDate
  const now = new Date();
  const upcomingSessions = activeEnrollments
    .filter((e) => e.training.startDate && e.training.startDate > now)
    .sort((a, b) => (a.training.startDate?.getTime() ?? 0) - (b.training.startDate?.getTime() ?? 0))
    .slice(0, 4);

  const completedPct = myEnrollments.length > 0
    ? Math.round((completedEnrollments.length / myEnrollments.length) * 100)
    : 0;

  return (
    <div className="space-y-6">
      {/* Hero */}
      <div
        className="rounded-2xl p-6 text-white shadow-sm"
        style={{ background: "linear-gradient(135deg, #6CAEBD 0%, #4A8FA0 100%)" }}
      >
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <p className="text-white/70 text-xs mb-1">التدريب والتطوير — جامعة سليمان الراجحي</p>
            <h1 className="text-xl font-bold">مرحباً، {user.name.split(" ")[0]} 👋</h1>
            <p className="text-white/80 text-sm mt-0.5">{user.email}</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <span
              className="text-xs font-bold px-3 py-1.5 rounded-full"
              style={{ background: "rgba(255,255,255,0.2)" }}
            >
              🎯 {myEnrollments.length} تسجيل
            </span>
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-xl font-bold">
              {user.name.charAt(0)}
            </div>
          </div>
        </div>

        {/* Completion progress */}
        <div className="mt-5">
          <div className="flex justify-between text-xs text-white/80 mb-1.5">
            <span>المكتملة: {completedEnrollments.length} برنامج</span>
            <span>الجارية: {activeEnrollments.length} برنامج</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2.5">
            <div
              className="h-2.5 rounded-full bg-white transition-all"
              style={{ width: `${completedPct}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-white/70 mt-1.5">
            <span>{completedPct}% نسبة الإكمال</span>
            <span>الكل: {myEnrollments.length} برنامج</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "الجارية والمسجّلة",  value: String(activeEnrollments.length),   icon: "📖", color: "#6CAEBD" },
          { label: "المكتملة",            value: String(completedEnrollments.length), icon: "✅", color: "#16A34A" },
          { label: "برامج متاحة",         value: String(availableCount),              icon: "📚", color: "#4A8FA0" },
          { label: "إجمالي التسجيلات",    value: String(myEnrollments.length),        icon: "🏆", color: "#875E9E" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-[#E8EDEF] p-4 hover:shadow-sm transition-shadow">
            <div className="text-2xl mb-1">{s.icon}</div>
            <p className="text-lg font-bold" style={{ color: s.color }}>{s.value}</p>
            <p className="text-xs text-[#8FA4AB] mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Alerts */}
      {trainingAlerts.length > 0 && (
        <div className="space-y-3">
          <h2 className="font-bold text-[#1A2A30] text-sm flex items-center gap-2">
            <span>🔔</span> التنبيهات
          </h2>
          {trainingAlerts.map((alert) => {
            const ac = alertConfig[alert.type];
            return (
              <div
                key={alert.id}
                className="bg-white rounded-xl border overflow-hidden flex items-start gap-4 px-5 py-4 shadow-sm"
                style={{ borderColor: ac.border, borderRightWidth: "4px" }}
              >
                <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg shrink-0" style={{ background: ac.bg }}>
                  {ac.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-[#1F2937]">{alert.title}</p>
                  <p className="text-xs text-[#6B7280] mt-0.5">{alert.detail}</p>
                </div>
                {alert.daysLeft != null && (
                  <span className="shrink-0 text-xs font-bold px-2 py-1 rounded-full" style={{ background: ac.bg, color: ac.text }}>
                    بعد {alert.daysLeft} يوم
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Quick links + Upcoming sessions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick links */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#E8EDEF] p-5">
          <h2 className="font-bold text-[#1A2A30] text-sm mb-4 flex items-center gap-2">
            <span>⚡</span> روابط سريعة
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {quickLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex flex-col items-center gap-2 p-4 rounded-xl border border-[#E8EDEF] hover:shadow-sm transition-all group text-center"
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ background: link.color + "18" }}>
                  {link.icon}
                </div>
                <span className="text-xs font-medium text-[#506570] group-hover:text-[#4A8FA0] transition-colors">{link.label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Upcoming sessions */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#E8EDEF] overflow-hidden">
          <div className="px-5 py-4 border-b border-[#E8EDEF] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span>📅</span>
              <h2 className="font-bold text-[#1A2A30] text-sm">الجلسات القادمة</h2>
            </div>
            <Link href="/training/my-courses" className="text-xs font-medium hover:underline" style={{ color: "#6CAEBD" }}>
              عرض الكل
            </Link>
          </div>
          {upcomingSessions.length === 0 ? (
            <div className="px-5 py-8 text-center">
              <p className="text-[#8FA4AB] text-sm">لا توجد جلسات قادمة</p>
              <Link href="/training/catalog" className="text-xs font-semibold mt-2 block hover:underline" style={{ color: "#6CAEBD" }}>
                تصفّح البرامج المتاحة ←
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-[#F4F7F8]">
              {upcomingSessions.map((e) => (
                <div key={e.id} className="px-5 py-3.5 flex items-start gap-3 hover:bg-[#F4F7F8] transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-[#E8F6F8] flex items-center justify-center text-sm shrink-0 mt-0.5">
                    📅
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-[#1F2937] leading-snug line-clamp-2">{e.training.title}</p>
                    <p className="text-xs text-[#9CA3AF] mt-0.5">
                      {e.training.startDate
                        ? new Date(e.training.startDate).toLocaleDateString("ar-SA", { day: "numeric", month: "long" })
                        : "—"}
                      {e.training.instructor && ` · ${e.training.instructor}`}
                    </p>
                  </div>
                  <span className="shrink-0 text-xs font-medium px-2 py-0.5 rounded-full" style={{ background: "#E8F6F8", color: "#4A8FA0" }}>
                    {e.training.status === "ONGOING" ? "جارٍ" : "قادم"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Active enrollments */}
      {activeEnrollments.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-[#E8EDEF] overflow-hidden">
          <div className="px-5 py-4 border-b border-[#E8EDEF] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span>🎓</span>
              <h2 className="font-bold text-[#1A2A30] text-sm">الدورات الجارية والمسجّلة</h2>
            </div>
            <Link href="/training/my-courses" className="text-xs font-medium hover:underline" style={{ color: "#6CAEBD" }}>
              إدارة دوراتي
            </Link>
          </div>
          <div className="divide-y divide-[#F4F7F8]">
            {activeEnrollments.slice(0, 5).map((enr) => {
              const sc = statusColors[enr.status];
              return (
                <div key={enr.id} className="px-5 py-4 hover:bg-[#F9FAFB] transition-colors">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-[#E8F6F8] flex items-center justify-center text-base shrink-0">
                        🎓
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-[#1F2937] leading-snug">{enr.training.title}</p>
                        <p className="text-xs text-[#8FA4AB] mt-0.5">
                          {enr.training.instructor && `${enr.training.instructor} · `}
                          {enr.training.category ?? ""}
                        </p>
                        {enr.training.startDate && (
                          <p className="text-xs text-[#9CA3AF] mt-0.5">
                            تبدأ {new Date(enr.training.startDate).toLocaleDateString("ar-SA", { day: "numeric", month: "long", year: "numeric" })}
                          </p>
                        )}
                      </div>
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full shrink-0" style={{ background: sc.bg, color: sc.color }}>
                      {sc.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
