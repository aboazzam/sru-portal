import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/dal";
import { prisma } from "@/lib/db";
import {
  graduationRequirements,
  graduationTimeline,
  ceremonyDetails,
} from "@/lib/mock/graduates";
import { getTranslations } from "next-intl/server";

export default async function GraduatesPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const t = await getTranslations("Graduates");

  const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
    completed:   { label: t("status.completed"),   color: "#16A34A", bg: "#DCFCE7" },
    in_progress: { label: t("status.in_progress"), color: "#D97706", bg: "#FEF3C7" },
    pending:     { label: t("status.pending"),      color: "#DC2626", bg: "#FEE2E2" },
    waived:      { label: t("status.waived"),       color: "#6B7280", bg: "#F3F4F6" },
  };

  const [userRecord, schApps, trainingEnrollments] = await Promise.all([
    prisma.user.findUnique({ where: { id: user.id }, select: { points: true, createdAt: true } }),
    prisma.scholarshipApplication.count({ where: { userId: user.id } }),
    prisma.trainingEnrollment.count({ where: { userId: user.id } }),
  ]);

  const completed  = graduationRequirements.filter((r) => r.status === "completed" || r.status === "waived").length;
  const total      = graduationRequirements.length;
  const overallPct = Math.round((completed / total) * 100);

  const nextDeadline = graduationTimeline.find((item) => !item.done);

  return (
    <div className="space-y-6">

      {/* Hero */}
      <div
        className="rounded-2xl p-6 text-white shadow-sm"
        style={{ background: "linear-gradient(135deg, #BE185D 0%, #9F1239 100%)" }}
      >
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <p className="text-rose-300 text-xs mb-1">{t("overview.module")}</p>
            <h1 className="text-2xl font-bold">{t("overview.welcome", { name: user.name.split(" ")[0] })} 🎓</h1>
            <p className="text-rose-200 text-sm mt-1">
              {(userRecord?.points ?? 0) > 0 && `${userRecord!.points} · `}
              {t("overview.memberSince", { date: new Date(userRecord?.createdAt ?? Date.now()).toLocaleDateString("ar-SA", { month: "long", year: "numeric" }) })}
            </p>
          </div>
          <div className="shrink-0 w-14 h-14 rounded-full bg-white/20 flex items-center justify-center text-2xl font-bold">
            {user.name.charAt(0)}
          </div>
        </div>

        {/* Readiness bar */}
        <div className="mt-5">
          <div className="flex justify-between text-xs text-white/80 mb-1.5">
            <span>{t("overview.requirementsProgress")}</span>
            <span>{t("overview.completionRatio", { done: completed, total, pct: overallPct })}</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2.5">
            <div
              className="h-2.5 rounded-full bg-white transition-all"
              style={{ width: `${overallPct}%` }}
            />
          </div>
          {overallPct < 100 && (
            <div className="mt-2 flex items-center justify-between">
              <p className="text-white/60 text-xs">{t("overview.completeCta")}</p>
              <Link href="/graduates/requirements" className="text-xs font-semibold underline text-white/80 hover:text-white">
                {t("overview.viewDetails")} ←
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: t("overview.stats.requirements"), value: `${completed}/${total}`, icon: "✅", color: "border-green-200  bg-green-50  text-green-700"  },
          { label: t("overview.stats.readiness"),   value: `${overallPct}%`,        icon: "📊", color: "border-rose-200   bg-rose-50   text-rose-700"   },
          { label: t("overview.stats.scholarships"), value: schApps,                icon: "🎓", color: "border-purple-200 bg-purple-50 text-purple-700" },
          { label: t("overview.stats.training"),     value: trainingEnrollments,    icon: "🏢", color: "border-blue-200   bg-blue-50   text-blue-700"   },
        ].map((s) => (
          <div key={s.label} className={`rounded-xl border p-4 ${s.color}`}>
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-2xl font-bold tabular-nums">{s.value}</p>
                <p className="text-xs font-medium mt-0.5">{s.label}</p>
              </div>
              <span className="text-xl">{s.icon}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Requirements snapshot */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span>📋</span>
              <h2 className="font-bold text-gray-800 text-sm">{t("overview.requirementsTitle")}</h2>
            </div>
            <Link href="/graduates/requirements" className="text-xs text-rose-600 hover:underline font-medium">{t("overview.viewAll")}</Link>
          </div>
          <div className="divide-y divide-gray-50">
            {graduationRequirements.slice(0, 5).map((req) => {
              const cfg = statusConfig[req.status as keyof typeof statusConfig];
              return (
                <div key={req.id} className="px-5 py-3 flex items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{req.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{req.detail}</p>
                  </div>
                  <span
                    className="shrink-0 text-xs font-semibold px-2.5 py-0.5 rounded-full"
                    style={{ color: cfg.color, background: cfg.bg }}
                  >
                    {cfg.label}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="px-5 py-3 bg-gray-50 border-t border-gray-100">
            <Link href="/graduates/requirements" className="text-xs font-semibold text-rose-600 hover:underline flex items-center justify-center gap-1">
              {t("overview.viewAllReqs", { n: total })} ←
            </Link>
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span>🗓️</span>
              <h2 className="font-bold text-gray-800 text-sm">{t("overview.timelineTitle")}</h2>
            </div>
            {nextDeadline && (
              <span className="text-xs font-medium text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
                {t("overview.nextDeadline")}: {new Date(nextDeadline.date).toLocaleDateString("ar-SA", { day: "numeric", month: "short" })}
              </span>
            )}
          </div>
          <div className="px-5 py-4 space-y-3">
            {graduationTimeline.map((step, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs shrink-0 mt-0.5 ${
                  step.done ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"
                }`}>
                  {step.done ? "✓" : idx + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium ${step.done ? "text-gray-400 line-through" : "text-gray-800"}`}>
                    {step.label}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {new Date(step.date).toLocaleDateString("ar-SA", { day: "numeric", month: "long", year: "numeric" })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Ceremony banner */}
      <div className="bg-gradient-to-l from-rose-700 to-rose-900 rounded-2xl p-5 text-white">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl">🎓</span>
              <h2 className="font-bold text-lg">{t("overview.ceremony.title")}</h2>
            </div>
            <p className="text-rose-200 text-sm">
              {new Date(ceremonyDetails.date).toLocaleDateString("ar-SA", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
            </p>
            <p className="text-rose-300 text-xs mt-1">
              🕙 {ceremonyDetails.time} · 📍 {ceremonyDetails.venue}، {ceremonyDetails.city}
            </p>
            <p className="text-rose-300 text-xs mt-0.5">
              {t("overview.ceremony.registrationDeadline", { date: new Date(ceremonyDetails.registrationDeadline).toLocaleDateString("ar-SA", { day: "numeric", month: "long" }) })}
            </p>
          </div>
          <Link
            href="/graduates/ceremony"
            className="shrink-0 px-5 py-2.5 bg-white text-rose-700 rounded-xl text-sm font-bold hover:bg-rose-50 transition-colors"
          >
            {ceremonyDetails.registered ? t("overview.ceremony.registered") : t("overview.ceremony.registerNow")}
          </Link>
        </div>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {[
          { href: "/graduates/requirements", icon: "✅", label: t("overview.links.requirements"), color: "bg-green-50  border-green-200  text-green-700"  },
          { href: "/graduates/ceremony",     icon: "🎓", label: t("overview.links.ceremony"),     color: "bg-rose-50   border-rose-200   text-rose-700"   },
          { href: "/graduates/documents",    icon: "📄", label: t("overview.links.documents"),    color: "bg-blue-50   border-blue-200   text-blue-700"   },
          { href: "/alumni",                 icon: "🤝", label: t("overview.links.alumni"),       color: "bg-purple-50 border-purple-200 text-purple-700" },
          { href: "/alumni/jobs",            icon: "💼", label: t("overview.links.jobs"),         color: "bg-amber-50  border-amber-200  text-amber-700"  },
          { href: "/alumni/card",            icon: "🪪", label: t("overview.links.card"),         color: "bg-teal-50   border-teal-200   text-teal-700"   },
        ].map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl border font-medium text-sm transition-all hover:shadow-sm hover:-translate-y-0.5 ${link.color}`}
          >
            <span className="text-lg">{link.icon}</span>
            {link.label}
          </Link>
        ))}
      </div>

    </div>
  );
}
