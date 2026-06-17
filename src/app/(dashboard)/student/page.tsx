import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/dal";
import { prisma } from "@/lib/db";
import { getTranslations } from "next-intl/server";

export default async function StudentOverview() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.role !== "STUDENT") redirect("/dashboard");

  const t = await getTranslations("Student");
  const ts = await getTranslations("Status");
  const tm = await getTranslations("Modules");

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
    prisma.user.findUnique({
      where: { id: user.id },
      select: { points: true, createdAt: true, college: { select: { name: true } } },
    }),
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

  const statusConfig: Record<string, { label: string; bg: string; color: string }> = {
    PENDING:   { label: ts("pending"),   bg: "#FEF3C7", color: "#D97706" },
    APPROVED:  { label: ts("approved"),  bg: "#DCFCE7", color: "#16A34A" },
    REJECTED:  { label: ts("rejected"),  bg: "#FEE2E2", color: "#DC2626" },
    COMPLETED: { label: ts("completed"), bg: "#DBEAFE", color: "#2563EB" },
  };

  const moduleLinks = [
    { href: "/financial",    icon: "💳", label: tm("financial.name"),   primary: "#0E7490", bg: "#ECFEFF" },
    { href: "/scholarships", icon: "🎓", label: tm("scholarships.name"), primary: "#875E9E", bg: "#F3EEF7" },
    { href: "/training",     icon: "🏢", label: tm("training.name"),    primary: "#4A8FA0", bg: "#EFF8FA" },
    { href: "/activities",   icon: "🎯", label: t("overview.typeLabels.activities"), primary: "#2563EB", bg: "#EFF6FF" },
    { href: "/clubs",        icon: "⚽", label: t("overview.typeLabels.clubs"),       primary: "#DC2626", bg: "#FEF2F2" },
    { href: "/volunteers",   icon: "🌱", label: t("overview.typeLabels.volunteer"),   primary: "#EA580C", bg: "#FFF7ED" },
    { href: "/services",     icon: "🛎️", label: t("sidebar.studentServices"),         primary: "#059669", bg: "#ECFDF5" },
    { href: "/news",         icon: "📰", label: t("sidebar.news"),                    primary: "#7C3AED", bg: "#F5F3FF" },
    { href: "/alumni",       icon: "🤝", label: t("sidebar.alumni"),                  primary: "#6A4A7E", bg: "#F5F0F9" },
    { href: "/hala",         icon: "👋", label: t("sidebar.hala"),                    primary: "#0D9488", bg: "#F0FDFA" },
  ];

  type RecentItem = { id: string; title: string; status: string; date: Date; module: string; icon: string; href: string };
  const recentItems: RecentItem[] = [
    ...scholarshipApps.map((a)    => ({ id: a.id, title: a.scholarship.title,   status: a.status, date: a.createdAt, module: t("overview.typeLabels.scholarships"), icon: "🎓", href: "/student/scholarships" })),
    ...trainingEnrollments.map((a) => ({ id: a.id, title: a.training.title,      status: a.status, date: a.createdAt, module: t("overview.typeLabels.training"),     icon: "🏢", href: "/student/trainings"    })),
    ...serviceApps.map((a)         => ({ id: a.id, title: a.service.title,       status: a.status, date: a.createdAt, module: t("overview.typeLabels.services"),     icon: "🛎️", href: "/services"             })),
    ...volunteerApps.map((a)       => ({ id: a.id, title: a.opportunity.title,   status: a.status, date: a.createdAt, module: t("overview.typeLabels.volunteer"),    icon: "🌱", href: "/volunteers"           })),
    ...activityApps.map((a)        => ({ id: a.id, title: a.activity.title,      status: a.status, date: a.createdAt, module: t("overview.typeLabels.activities"),   icon: "🎯", href: "/activities"           })),
    ...clubMemberships.map((a)     => ({ id: a.id, title: a.club.name,           status: a.status, date: a.createdAt, module: t("overview.typeLabels.clubs"),        icon: "⚽", href: "/clubs"                })),
  ]
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 6);

  const pendingCount = recentItems.filter((r) => r.status === "PENDING").length;

  const stats = [
    { label: t("overview.typeLabels.scholarships"), value: scholarshipApps.length,    icon: "🎓", color: "#875E9E", href: "/student/scholarships" },
    { label: t("overview.typeLabels.training"),     value: trainingEnrollments.length, icon: "🏢", color: "#4A8FA0", href: "/student/trainings"    },
    { label: t("overview.typeLabels.services"),     value: serviceApps.length,         icon: "🛎️", color: "#059669", href: "/services"             },
    { label: t("overview.typeLabels.volunteer"),    value: volunteerApps.length,       icon: "🌱", color: "#EA580C", href: "/volunteers"           },
    { label: t("overview.typeLabels.activities"),   value: activityApps.length,        icon: "🎯", color: "#2563EB", href: "/activities"           },
    { label: t("overview.typeLabels.clubs"),        value: clubMemberships.length,     icon: "⚽", color: "#DC2626", href: "/clubs"                },
  ];

  const memberSince = new Date(dbUser?.createdAt ?? Date.now()).toLocaleDateString("ar-SA", { month: "long", year: "numeric" });

  return (
    <div className="space-y-6">

      {/* Hero */}
      <div
        className="rounded-2xl p-6 text-white shadow-sm"
        style={{ background: "linear-gradient(135deg, #155E75 0%, #0E7490 100%)" }}
      >
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <p className="text-cyan-300 text-xs mb-1">{t("overview.module")}</p>
            <h1 className="text-2xl font-bold">{t("overview.welcomeHero", { name: user.name.split(" ")[0] })} 👋</h1>
            <p className="text-cyan-200 text-sm mt-0.5">{user.email}</p>
            {dbUser?.college && (
              <p className="text-cyan-300 text-xs mt-1">🏛️ {dbUser.college.name}</p>
            )}
            <p className="text-cyan-400 text-xs mt-0.5">{t("overview.memberSince", { date: memberSince })}</p>
          </div>
          <div className="text-center bg-white/15 rounded-2xl px-5 py-3 shrink-0">
            <p className="text-amber-300 font-extrabold text-3xl tabular-nums">{points}</p>
            <p className="text-cyan-300 text-xs mt-0.5">{t("overview.earnedPoints")}</p>
          </div>
        </div>

        {pendingCount > 0 && (
          <div className="mt-4 flex items-center justify-between gap-4 bg-white/10 rounded-xl px-4 py-2.5 flex-wrap">
            <p className="text-cyan-100 text-xs">
              ⏳ {t("overview.pendingMsg", { n: pendingCount })}
            </p>
            <Link href="/student/my-applications" className="text-xs font-bold text-white underline hover:no-underline">
              {t("overview.viewAllApps")}
            </Link>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="bg-white rounded-xl border border-gray-200 p-3 text-center hover:shadow-md transition-all hover:-translate-y-0.5"
          >
            <div className="text-xl mb-1">{s.icon}</div>
            <p className="text-lg font-bold" style={{ color: s.color }}>{s.value}</p>
            <p className="text-[10px] text-gray-400 mt-0.5 leading-tight">{s.label}</p>
          </Link>
        ))}
      </div>

      {/* Module links */}
      <div>
        <h2 className="font-bold text-gray-800 text-sm mb-3 flex items-center gap-2">
          <span>🚀</span> {t("overview.availableServices")}
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {moduleLinks.map((mod) => (
            <Link
              key={mod.href}
              href={mod.href}
              className="flex flex-col items-center gap-2 p-4 rounded-2xl border border-gray-200 hover:shadow-md hover:-translate-y-0.5 transition-all text-center group"
              style={{ background: mod.bg }}
            >
              <span className="text-2xl group-hover:scale-110 transition-transform">{mod.icon}</span>
              <span className="text-xs font-semibold text-gray-800">{mod.label}</span>
              <span className="text-[10px] font-bold" style={{ color: mod.primary }}>{t("overview.enterLink")}</span>
            </Link>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Recent activity */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span>📋</span>
              <h2 className="font-bold text-gray-800 text-sm">{t("overview.recentActivity")}</h2>
            </div>
            <Link href="/student/my-applications" className="text-xs text-cyan-600 hover:underline font-medium">{t("overview.viewAll")}</Link>
          </div>
          {recentItems.length === 0 ? (
            <div className="px-5 py-10 text-center">
              <p className="text-3xl mb-2">📭</p>
              <p className="text-sm text-gray-400">{t("overview.noRequests")}</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {recentItems.map((item) => {
                const badge = statusConfig[item.status] ?? statusConfig.PENDING;
                return (
                  <Link key={item.id + item.module} href={item.href} className="block px-5 py-3.5 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-2.5 min-w-0">
                        <span className="text-lg shrink-0">{item.icon}</span>
                        <div className="min-w-0">
                          <p className="font-semibold text-xs text-gray-800 leading-snug truncate">{item.title}</p>
                          <p className="text-[10px] text-gray-400 mt-0.5">
                            {item.module} · {item.date.toLocaleDateString("ar-SA", { day: "numeric", month: "long" })}
                          </p>
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
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
            <span>📅</span>
            <h2 className="font-bold text-gray-800 text-sm">{t("overview.upcomingEvents")}</h2>
          </div>
          {upcomingActivities.length === 0 && upcomingVolunteers.length === 0 ? (
            <div className="px-5 py-10 text-center">
              <p className="text-gray-400 text-sm">{t("overview.noEvents")}</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {[
                ...upcomingActivities.map((a) => ({ ...a, type: t("overview.activityType"),  icon: "🎯", href: "/activities/catalog" })),
                ...upcomingVolunteers.map((a) => ({ ...a, type: t("overview.volunteerType"), icon: "🌱", href: "/volunteers/opportunities" })),
              ]
                .sort((a, b) => {
                  if (!a.date && !b.date) return 0;
                  if (!a.date) return 1;
                  if (!b.date) return -1;
                  return a.date.getTime() - b.date.getTime();
                })
                .slice(0, 6)
                .map((ev) => (
                  <Link key={ev.id + ev.type} href={ev.href} className="block px-5 py-3.5 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start gap-2.5">
                      <span className="text-lg shrink-0">{ev.icon}</span>
                      <div className="min-w-0">
                        <p className="font-semibold text-xs text-gray-800 leading-snug">{ev.title}</p>
                        <p className="text-[10px] text-gray-400 mt-0.5">
                          {ev.type} · {ev.date ? ev.date.toLocaleDateString("ar-SA", { day: "numeric", month: "long", year: "numeric" }) : t("overview.dateTbd")}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
            </div>
          )}
          <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
            <Link href="/activities/catalog" className="text-[10px] font-semibold text-blue-600 hover:underline">{t("overview.activitiesLink")}</Link>
            <Link href="/volunteers/opportunities" className="text-[10px] font-semibold text-orange-600 hover:underline">{t("overview.volunteerLink")}</Link>
          </div>
        </div>

      </div>

      {/* Banner */}
      <div className="rounded-2xl px-6 py-5 flex items-center justify-between gap-4 flex-wrap bg-gradient-to-l from-cyan-50 to-teal-50 border border-cyan-200">
        <div className="flex items-start gap-3">
          <span className="text-2xl">💡</span>
          <div>
            <p className="font-bold text-cyan-800 text-sm">{t("overview.bannerTitle")}</p>
            <p className="text-xs text-cyan-700 leading-relaxed mt-0.5">
              {t("overview.bannerDesc")}
            </p>
          </div>
        </div>
        <Link href="/hala" className="shrink-0 text-xs font-bold px-4 py-2.5 rounded-xl text-white bg-cyan-700 hover:bg-cyan-800 transition-colors">
          {t("overview.studentGuide")}
        </Link>
      </div>

    </div>
  );
}
