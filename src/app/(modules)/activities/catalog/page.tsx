export const dynamic = 'force-dynamic';

import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getCurrentUser } from "@/lib/dal";
import { prisma } from "@/lib/db";
import ActivityApplyButton from "./_components/ActivityApplyButton";

const actIcons = ["🎭", "⚽", "🎨", "🏆", "🎤", "🌍", "🎓", "🎪", "🏅", "🎶", "🏊", "🎮", "🏋️", "🎯", "🎸"];

export default async function ActivitiesCatalogPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const t = await getTranslations("Activities");

  const now = new Date();

  const [allActivities, myApplications] = await Promise.all([
    prisma.studentActivity.findMany({ orderBy: { date: "asc" } }),
    prisma.activityApplication.findMany({
      where: { userId: user.id },
      select: { activityId: true, status: true },
    }),
  ]);

  const appliedMap = new Map(myApplications.map((a) => [a.activityId, a.status]));

  const upcoming = allActivities.filter((a) => !a.date || a.date >= now);
  const past     = allActivities.filter((a) => a.date && a.date < now);

  const ActivityCard = ({ act, idx }: { act: (typeof allActivities)[0]; idx: number }) => {
    const isPast          = !!act.date && act.date < now;
    const alreadyApplied  = appliedMap.has(act.id);
    const existingStatus  = appliedMap.get(act.id);

    return (
      <div className="bg-white rounded-2xl border border-[#E8EDEF] shadow-sm hover:shadow-md transition-shadow flex flex-col">
        <div
          className="h-2 rounded-t-2xl"
          style={{ background: isPast ? "#D1D5DB" : "linear-gradient(to left, #2563EB, #1D4ED8)" }}
        />
        <div className="p-5 flex flex-col flex-1 gap-3">
          <div className="flex items-start gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
              style={{ background: isPast ? "#F3F4F6" : "#EFF6FF" }}
            >
              {actIcons[idx % actIcons.length]}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-sm text-[#1F2937] leading-snug">{act.title}</h3>
              {act.date && (
                <p className="text-xs mt-1" style={{ color: isPast ? "#9CA3AF" : "#2563EB" }}>
                  📅 {act.date.toLocaleDateString("ar-SA", { day: "numeric", month: "long", year: "numeric" })}
                  {isPast && ` · ${t("catalog.status.ended")}`}
                </p>
              )}
              {!act.date && (
                <p className="text-xs mt-1 text-[#16A34A]">📆 {t("catalog.status.openTbd")}</p>
              )}
            </div>
          </div>

          {act.description && (
            <p className="text-xs text-[#6B7280] leading-relaxed line-clamp-3">{act.description}</p>
          )}

          <div className="mt-auto flex items-center justify-between gap-2">
            <span
              className="text-xs font-medium px-2.5 py-1 rounded-lg"
              style={{ background: isPast ? "#F3F4F6" : "#EFF6FF", color: isPast ? "#6B7280" : "#2563EB" }}
            >
              {isPast ? t("catalog.status.ended") : t("catalog.status.open")}
            </span>
            <ActivityApplyButton
              activityId={act.id}
              alreadyApplied={alreadyApplied}
              existingStatus={existingStatus}
              isPast={isPast}
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#1A2A30]">{t("catalog.title")}</h1>
        <p className="text-sm text-[#8FA4AB] mt-1">
          {t("catalog.subtitle", { upcoming: upcoming.length, past: past.length })}
        </p>
      </div>

      {/* Upcoming */}
      {upcoming.length > 0 ? (
        <section>
          <h2 className="font-bold text-[#1A2A30] text-base mb-4 flex items-center gap-2">
            <span>📅</span> {t("catalog.sectionUpcoming")}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {upcoming.map((act, i) => (
              <ActivityCard key={act.id} act={act} idx={i} />
            ))}
          </div>
        </section>
      ) : (
        <div className="bg-white rounded-2xl border border-[#E8EDEF] px-6 py-12 text-center">
          <p className="text-4xl mb-2">📭</p>
          <p className="text-sm text-[#8FA4AB]">{t("catalog.emptyUpcoming")}</p>
        </div>
      )}

      {/* Past */}
      {past.length > 0 && (
        <section>
          <h2 className="font-bold text-[#6B7280] text-base mb-4 flex items-center gap-2">
            <span>🕐</span> {t("catalog.sectionPast")}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 opacity-80">
            {past.map((act, i) => (
              <ActivityCard key={act.id} act={act} idx={upcoming.length + i} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
