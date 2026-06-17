import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/dal";
import { prisma } from "@/lib/db";
import EnrollButton from "./_components/EnrollButton";
import { getTranslations } from "next-intl/server";

const filters = ["all", "upcoming", "ongoing", "mine", "expired"] as const;

export default async function StudentTrainingsPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.role !== "STUDENT") redirect("/dashboard");

  const t = await getTranslations("Student");
  const ts = await getTranslations("Status");

  const { filter } = await searchParams;

  const trainingStatusConfig: Record<string, { label: string; bg: string; color: string }> = {
    UPCOMING:  { label: ts("upcoming"),  bg: "#DBEAFE", color: "#2563EB" },
    ONGOING:   { label: ts("ongoing"),   bg: "#DCFCE7", color: "#16A34A" },
    COMPLETED: { label: ts("ended"),     bg: "#F3F4F6", color: "#6B7280" },
    CANCELLED: { label: ts("cancelled"), bg: "#FEE2E2", color: "#DC2626" },
  };

  const enrStatusConfig: Record<string, { label: string; bg: string; color: string }> = {
    PENDING:   { label: ts("pending"),   bg: "#FEF3C7", color: "#D97706" },
    APPROVED:  { label: ts("approved"),  bg: "#DCFCE7", color: "#16A34A" },
    REJECTED:  { label: ts("rejected"),  bg: "#FEE2E2", color: "#DC2626" },
    COMPLETED: { label: ts("completed"), bg: "#DBEAFE", color: "#2563EB" },
  };

  const filterLabels: Record<string, string> = {
    all:      t("trainingsPage.filters.all"),
    upcoming: t("trainingsPage.filters.upcoming"),
    ongoing:  t("trainingsPage.filters.ongoing"),
    mine:     t("trainingsPage.filters.mine"),
    expired:  t("trainingsPage.filters.expired"),
  };

  const [trainings, myEnrollments] = await Promise.all([
    prisma.training.findMany({
      orderBy: { startDate: "asc" },
      select: {
        id: true, title: true, description: true, instructor: true,
        category: true, capacity: true, startDate: true, endDate: true, status: true,
        _count: { select: { enrollments: true } },
      },
    }),
    prisma.trainingEnrollment.findMany({
      where: { userId: user.id },
      select: {
        trainingId: true, status: true, createdAt: true,
        training: { select: { title: true, category: true, startDate: true, status: true } },
      },
    }),
  ]);

  const enrolledIds = new Set(myEnrollments.map((e) => e.trainingId));

  const filtered = (() => {
    if (filter === "upcoming") return trainings.filter((t) => t.status === "UPCOMING");
    if (filter === "ongoing")  return trainings.filter((t) => t.status === "ONGOING");
    if (filter === "expired")  return trainings.filter((t) => t.status === "COMPLETED" || t.status === "CANCELLED");
    if (filter === "mine")     return trainings.filter((t) => enrolledIds.has(t.id));
    return trainings;
  })();

  const openCount = trainings.filter((t) => t.status === "UPCOMING" || t.status === "ONGOING").length;

  return (
    <div className="space-y-5">

      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Link href="/student" className="hover:text-cyan-600 transition-colors">{t("trainingsPage.breadcrumb")}</Link>
        <span>/</span>
        <span className="text-gray-800 font-medium">{t("trainingsPage.title")}</span>
      </div>

      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t("trainingsPage.title")}</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            {t("trainingsPage.subtitle", { available: openCount, enrolled: myEnrollments.length })}
          </p>
        </div>
        <Link href="/training" className="text-xs font-medium text-cyan-600 hover:underline bg-cyan-50 px-3 py-1.5 rounded-lg border border-cyan-200">
          {t("trainingsPage.browseAll")}
        </Link>
      </div>

      {/* My enrollments summary */}
      {myEnrollments.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-800 text-sm">{t("trainingsPage.myEnrollments")}</h2>
          </div>
          <ul className="divide-y divide-gray-50">
            {myEnrollments.map((enr) => {
              const tCfg  = trainingStatusConfig[enr.training.status] ?? trainingStatusConfig.UPCOMING;
              const eCfg  = enrStatusConfig[enr.status] ?? enrStatusConfig.PENDING;
              return (
                <li key={enr.trainingId} className="px-5 py-4 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="font-medium text-gray-800 text-sm">{enr.training.title}</p>
                    <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                      {enr.training.category && <span className="text-xs text-gray-400">{enr.training.category}</span>}
                      {enr.training.startDate && (
                        <span className="text-xs text-gray-400">
                          · {enr.training.startDate.toLocaleDateString("ar-SA")}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full" style={{ background: tCfg.bg, color: tCfg.color }}>
                      {tCfg.label}
                    </span>
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full" style={{ background: eCfg.bg, color: eCfg.color }}>
                      {eCfg.label}
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {filters.map((f) => {
          const isActive = (!filter && f === "all") || filter === f;
          const href = f === "all" ? "/student/trainings" : `/student/trainings?filter=${f}`;
          return (
            <Link
              key={f}
              href={href}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                isActive ? "bg-cyan-600 text-white shadow-sm" : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
              }`}
            >
              {filterLabels[f]}
            </Link>
          );
        })}
      </div>

      {/* Training cards */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 py-12 text-center">
          <p className="text-2xl mb-2">🔍</p>
          <p className="text-gray-400 text-sm">{t("trainingsPage.empty")}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((tr) => {
            const isFull       = tr.capacity !== null && tr._count.enrollments >= tr.capacity;
            const unavailable  = tr.status === "CANCELLED" || tr.status === "COMPLETED";
            const enrolled     = enrolledIds.has(tr.id);
            const cfg          = trainingStatusConfig[tr.status] ?? trainingStatusConfig.UPCOMING;
            const pct          = tr.capacity ? Math.round((tr._count.enrollments / tr.capacity) * 100) : 0;

            return (
              <div
                key={tr.id}
                className={`bg-white rounded-xl border p-5 hover:shadow-sm transition-shadow ${
                  unavailable && !enrolled ? "border-gray-100 opacity-70" : "border-gray-200"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-gray-800">{tr.title}</h3>
                      <span
                        className="text-xs font-semibold px-2.5 py-0.5 rounded-full"
                        style={{ background: cfg.bg, color: cfg.color }}
                      >
                        {cfg.label}
                      </span>
                      {enrolled && (
                        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-cyan-100 text-cyan-700">
                          {t("trainingsPage.enrolledBadge")}
                        </span>
                      )}
                    </div>
                    {tr.description && (
                      <p className="text-sm text-gray-500 mt-1.5 line-clamp-2 leading-relaxed">{tr.description}</p>
                    )}
                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-400 flex-wrap">
                      {tr.instructor && <span>👤 {tr.instructor}</span>}
                      {tr.category && <span>🏷️ {tr.category}</span>}
                      {tr.startDate && <span>📅 {tr.startDate.toLocaleDateString("ar-SA")}</span>}
                    </div>
                    {tr.capacity !== null && (
                      <div className="mt-3">
                        <div className="flex justify-between text-xs text-gray-400 mb-1">
                          <span>{t("trainingsPage.enrolled", { n: tr._count.enrollments, cap: tr.capacity })}</span>
                          <span className={isFull ? "text-red-500 font-medium" : ""}>{isFull ? t("trainingsPage.full") : `${pct}%`}</span>
                        </div>
                        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all"
                            style={{ width: `${pct}%`, background: isFull ? "#DC2626" : pct >= 80 ? "#D97706" : "#0E7490" }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="shrink-0">
                    <EnrollButton
                      trainingId={tr.id}
                      enrolled={enrolled}
                      isFull={isFull}
                      unavailable={unavailable}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
