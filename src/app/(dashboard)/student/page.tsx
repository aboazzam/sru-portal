import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/dal";
import { prisma } from "@/lib/db";

// ── Module quick-link tiles ────────────────────────────────────
const moduleLinks = [
  { href: "/financial",    icon: "💳", label: "الخدمات المالية",  primary: "#6CAEBD", bg: "#E8F6F8" },
  { href: "/scholarships", icon: "🎓", label: "المنح الدراسية",   primary: "#875E9E", bg: "#F3EEF7" },
  { href: "/training",     icon: "🏢", label: "التدريب التعاوني", primary: "#4A8FA0", bg: "#EFF8FA" },
  { href: "/activities",   icon: "🎯", label: "الأنشطة",          primary: "#2563EB", bg: "#EFF6FF" },
  { href: "/clubs",        icon: "⚽", label: "الأندية",          primary: "#DC2626", bg: "#FEF2F2" },
  { href: "/volunteers",   icon: "🌱", label: "التطوع",           primary: "#EA580C", bg: "#FFF7ED" },
  { href: "/services",     icon: "🛎️", label: "الخدمات",          primary: "#059669", bg: "#ECFDF5" },
  { href: "/news",         icon: "📰", label: "الأخبار",          primary: "#7C3AED", bg: "#F5F3FF" },
  { href: "/alumni",       icon: "🤝", label: "الخريجون",         primary: "#6A4A7E", bg: "#F5F0F9" },
  { href: "/hala",         icon: "👋", label: "هلا بك",           primary: "#0D9488", bg: "#F0FDFA" },
];

const statusBadge = (status: string) => {
  const cfg: Record<string, { label: string; bg: string; color: string }> = {
    PENDING:   { label: "قيد المراجعة", bg: "#FEF3C7", color: "#D97706" },
    APPROVED:  { label: "مقبول",        bg: "#DCFCE7", color: "#16A34A" },
    REJECTED:  { label: "مرفوض",        bg: "#FEE2E2", color: "#DC2626" },
    COMPLETED: { label: "مكتمل",        bg: "#DBEAFE", color: "#2563EB" },
  };
  return cfg[status] ?? cfg.PENDING;
};

export default async function StudentOverview() {
  const user = await getCurrentUser();
  if (!user || user.role !== "STUDENT") redirect("/dashboard");

  const now = new Date();

  const [
    dbUser,
    scholarshipApps,
    trainingEnrollments,
    serviceApps,
    volunteerApps,
    activityApps,
    clubMemberships,
    upcomingActivities,
    upcomingVolunteers,
  ] = await Promise.all([
    prisma.user.findUnique({ where: { id: user.id }, select: { points: true, college: { select: { name: true } } } }),

    prisma.scholarshipApplication.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 3,
      select: { id: true, status: true, createdAt: true, scholarship: { select: { title: true, amount: true } } },
    }),

    prisma.trainingEnrollment.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 3,
      select: { id: true, status: true, createdAt: true, training: { select: { title: true, category: true } } },
    }),

    prisma.serviceApplications.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 3,
      select: { id: true, status: true, createdAt: true, service: { select: { title: true } } },
    }),

    prisma.volunteerApplication.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 3,
      select: { id: true, status: true, createdAt: true, opportunity: { select: { title: true } } },
    }),

    prisma.activityApplication.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 3,
      select: { id: true, status: true, createdAt: true, activity: { select: { title: true } } },
    }),

    prisma.clubMembership.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 3,
      select: { id: true, status: true, createdAt: true, club: { select: { name: true } } },
    }),

    prisma.studentActivity.findMany({
      where: { OR: [{ date: null }, { date: { gte: now } }] },
      orderBy: { date: "asc" },
      take: 3,
      select: { id: true, title: true, date: true },
    }),

    prisma.volunteerOpportunity.findMany({
      where: { OR: [{ date: null }, { date: { gte: now } }] },
      orderBy: { date: "asc" },
      take: 3,
      select: { id: true, title: true, date: true },
    }),
  ]);

  const points = dbUser?.points ?? 0;

  // Build unified recent activity list (tag each with a module)
  type RecentItem = { id: string; title: string; status: string; date: Date; module: string; icon: string; href: string };

  const recentItems: RecentItem[] = [
    ...scholarshipApps.map((a) => ({ id: a.id, title: a.scholarship.title, status: a.status, date: a.createdAt, module: "المنح", icon: "🎓", href: "/scholarships" })),
    ...trainingEnrollments.map((a) => ({ id: a.id, title: a.training.title, status: a.status, date: a.createdAt, module: "التدريب", icon: "🏢", href: "/training" })),
    ...serviceApps.map((a) => ({ id: a.id, title: a.service.title, status: a.status, date: a.createdAt, module: "الخدمات", icon: "🛎️", href: "/services" })),
    ...volunteerApps.map((a) => ({ id: a.id, title: a.opportunity.title, status: a.status, date: a.createdAt, module: "التطوع", icon: "🌱", href: "/volunteers" })),
    ...activityApps.map((a) => ({ id: a.id, title: a.activity.title, status: a.status, date: a.createdAt, module: "الأنشطة", icon: "🎯", href: "/activities" })),
    ...clubMemberships.map((a) => ({ id: a.id, title: a.club.name, status: a.status, date: a.createdAt, module: "الأندية", icon: "⚽", href: "/clubs" })),
  ]
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 6);

  // Summary counts
  const stats = [
    { label: "طلبات المنح",  value: scholarshipApps.length,   icon: "🎓", color: "#875E9E", href: "/scholarships" },
    { label: "التدريب",     value: trainingEnrollments.length, icon: "🏢", color: "#4A8FA0", href: "/training"    },
    { label: "الخدمات",     value: serviceApps.length,         icon: "🛎️", color: "#059669", href: "/services"    },
    { label: "التطوع",      value: volunteerApps.length,       icon: "🌱", color: "#EA580C", href: "/volunteers"  },
    { label: "الأنشطة",     value: activityApps.length,        icon: "🎯", color: "#2563EB", href: "/activities"  },
    { label: "الأندية",     value: clubMemberships.length,      icon: "⚽", color: "#DC2626", href: "/clubs"       },
  ];

  const formatDate = (d: Date) =>
    d.toLocaleDateString("ar-SA", { day: "numeric", month: "long" });

  return (
    <div className="space-y-6">

      {/* ── Hero ─────────────────────────────────────────── */}
      <div
        className="rounded-2xl p-6 text-white shadow-sm"
        style={{ background: "linear-gradient(135deg, #1B5E20 0%, #2D7A35 100%)" }}
      >
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <p className="text-white/60 text-xs mb-1">بوابة الطالب — جامعة سليمان الراجحي</p>
            <h1 className="text-xl font-bold">مرحباً، {user.name.split(" ")[0]} 👋</h1>
            <p className="text-white/70 text-sm mt-0.5">{user.email}</p>
            {dbUser?.college && (
              <p className="text-white/60 text-xs mt-1">🏛️ {dbUser.college.name}</p>
            )}
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="text-center bg-white/10 rounded-xl px-4 py-3">
              <p className="text-amber-300 font-extrabold text-2xl tabular-nums">{points}</p>
              <p className="text-white/60 text-xs">نقطة</p>
            </div>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between gap-4 flex-wrap">
          <p className="text-white/60 text-sm">
            {recentItems.length === 0
              ? "لم تسجّل في أي خدمة بعد — اكتشف ما هو متاح"
              : `${recentItems.length}+ طلب حديث عبر جميع الخدمات`}
          </p>
          <Link
            href="/hala"
            className="text-xs font-bold px-4 py-2 rounded-xl text-white hover:bg-white/20 transition-all"
            style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.3)" }}
          >
            هلا بك 👋
          </Link>
        </div>
      </div>

      {/* ── Stats ────────────────────────────────────────── */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="bg-white rounded-xl border border-[#E8EDEF] p-3 text-center hover:shadow-md transition-all hover:-translate-y-0.5"
          >
            <div className="text-xl mb-1">{s.icon}</div>
            <p className="text-lg font-bold" style={{ color: s.color }}>{s.value}</p>
            <p className="text-[10px] text-[#8FA4AB] mt-0.5 leading-tight">{s.label}</p>
          </Link>
        ))}
      </div>

      {/* ── Module links grid ─────────────────────────────── */}
      <div>
        <h2 className="font-bold text-[#1A2A30] text-sm mb-3 flex items-center gap-2">
          <span>🚀</span> الخدمات المتاحة
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {moduleLinks.map((mod) => (
            <Link
              key={mod.href}
              href={mod.href}
              className="flex flex-col items-center gap-2 p-4 rounded-2xl border border-[#E8EDEF] hover:shadow-md hover:-translate-y-0.5 transition-all text-center group"
              style={{ background: mod.bg }}
            >
              <span className="text-2xl group-hover:scale-110 transition-transform">{mod.icon}</span>
              <span className="text-xs font-semibold text-[#1A2A30]">{mod.label}</span>
              <span className="text-[10px] font-bold" style={{ color: mod.primary }}>دخول ←</span>
            </Link>
          ))}
        </div>
      </div>

      {/* ── Recent activity + Upcoming ───────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Recent activity */}
        <div className="bg-white rounded-2xl border border-[#E8EDEF] shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-[#E8EDEF] flex items-center gap-2">
            <span>📋</span>
            <h2 className="font-bold text-[#1A2A30] text-sm">آخر النشاطات</h2>
          </div>

          {recentItems.length === 0 ? (
            <div className="px-5 py-10 text-center">
              <p className="text-3xl mb-2">📭</p>
              <p className="text-sm text-[#8FA4AB]">لا توجد طلبات حتى الآن</p>
            </div>
          ) : (
            <div className="divide-y divide-[#F4F7F8]">
              {recentItems.map((item) => {
                const badge = statusBadge(item.status);
                return (
                  <Link key={item.id + item.module} href={item.href} className="block px-5 py-3.5 hover:bg-[#F9FAFB] transition-colors">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-2.5 min-w-0">
                        <span className="text-lg shrink-0">{item.icon}</span>
                        <div className="min-w-0">
                          <p className="font-semibold text-xs text-[#1F2937] leading-snug truncate">{item.title}</p>
                          <p className="text-[10px] text-[#9CA3AF] mt-0.5">{item.module} · {formatDate(item.date)}</p>
                        </div>
                      </div>
                      <span
                        className="shrink-0 text-[10px] font-bold px-2 py-1 rounded-full"
                        style={{ background: badge.bg, color: badge.color }}
                      >
                        {badge.label}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Upcoming events */}
        <div className="bg-white rounded-2xl border border-[#E8EDEF] shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-[#E8EDEF] flex items-center gap-2">
            <span>📅</span>
            <h2 className="font-bold text-[#1A2A30] text-sm">الفعاليات القادمة</h2>
          </div>

          {upcomingActivities.length === 0 && upcomingVolunteers.length === 0 ? (
            <div className="px-5 py-10 text-center">
              <p className="text-[#8FA4AB] text-sm">لا توجد فعاليات قريبة</p>
            </div>
          ) : (
            <div className="divide-y divide-[#F4F7F8]">
              {[
                ...upcomingActivities.map((a) => ({ ...a, type: "نشاط",   icon: "🎯", href: "/activities/catalog" })),
                ...upcomingVolunteers.map((a) => ({ ...a, type: "تطوع",   icon: "🌱", href: "/volunteers/opportunities" })),
              ]
                .sort((a, b) => {
                  if (!a.date && !b.date) return 0;
                  if (!a.date) return 1;
                  if (!b.date) return -1;
                  return a.date.getTime() - b.date.getTime();
                })
                .slice(0, 6)
                .map((ev) => (
                  <Link key={ev.id + ev.type} href={ev.href} className="block px-5 py-3.5 hover:bg-[#F9FAFB] transition-colors">
                    <div className="flex items-start gap-2.5">
                      <span className="text-lg shrink-0">{ev.icon}</span>
                      <div className="min-w-0">
                        <p className="font-semibold text-xs text-[#1F2937] leading-snug">{ev.title}</p>
                        <p className="text-[10px] text-[#9CA3AF] mt-0.5">
                          {ev.type} · {ev.date ? ev.date.toLocaleDateString("ar-SA", { day: "numeric", month: "long", year: "numeric" }) : "يحدد لاحقاً"}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
            </div>
          )}

          <div className="px-5 py-3 bg-[#F4F7F8] border-t border-[#E8EDEF] flex items-center justify-between">
            <Link href="/activities/catalog" className="text-[10px] font-semibold text-[#2563EB] hover:underline">الأنشطة ←</Link>
            <Link href="/volunteers/opportunities" className="text-[10px] font-semibold text-[#EA580C] hover:underline">التطوع ←</Link>
          </div>
        </div>

      </div>

      {/* ── Quick action banner ───────────────────────────── */}
      <div
        className="rounded-2xl px-6 py-5 flex items-center justify-between gap-4 flex-wrap"
        style={{ background: "linear-gradient(to left, #F0FDFA, #CCFBF1)", border: "1px solid #99F6E4" }}
      >
        <div className="flex items-start gap-3">
          <span className="text-2xl">💡</span>
          <div>
            <p className="font-bold text-[#0F766E] text-sm">استفد من جميع الخدمات المتاحة</p>
            <p className="text-xs text-[#0D9488] leading-relaxed mt-0.5">
              سجّل في أنشطة وأندية وبرامج تطوع لكسب نقاط تُضاف لملفك الجامعي.
            </p>
          </div>
        </div>
        <Link
          href="/hala"
          className="shrink-0 text-xs font-bold px-4 py-2.5 rounded-xl text-white"
          style={{ background: "#0D9488" }}
        >
          دليل الطالب ←
        </Link>
      </div>

    </div>
  );
}
