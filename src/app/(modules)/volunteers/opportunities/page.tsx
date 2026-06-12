import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/dal";
import { prisma } from "@/lib/db";
import VolunteerApplyButton from "./_components/VolunteerApplyButton";

const volIcons = ["🌱", "📚", "🏥", "🎯", "♻️", "💻", "🏆", "🎓", "🤲", "🌍", "🎨", "🔬"];

export default async function OpportunitiesPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const now = new Date();

  const [opportunities, myApplications] = await Promise.all([
    prisma.volunteerOpportunity.findMany({
      orderBy: [{ date: "asc" }, { createdAt: "desc" }],
      select: { id: true, title: true, description: true, date: true },
    }),
    prisma.volunteerApplication.findMany({
      where: { userId: user.id },
      select: { opportunityId: true, status: true },
    }),
  ]);

  const appliedMap = new Map(myApplications.map((a) => [a.opportunityId, a.status]));

  const upcoming = opportunities.filter((o) => !o.date || o.date >= now);
  const past     = opportunities.filter((o) => o.date && o.date < now);

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#1A2A30]">فرص التطوع</h1>
        <p className="text-[#8FA4AB] text-sm mt-0.5">
          {upcoming.length} فرصة متاحة للتسجيل
        </p>
      </div>

      {/* Available opportunities */}
      {upcoming.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#E8EDEF] py-20 text-center">
          <p className="text-4xl mb-3">🤝</p>
          <h3 className="font-bold text-[#1A2A30] text-base">لا توجد فرص متاحة حالياً</h3>
          <p className="text-[#8FA4AB] text-sm mt-1">تفقّد الصفحة قريباً لاكتشاف فرص جديدة</p>
        </div>
      ) : (
        <div className="space-y-3">
          {upcoming.map((opp, i) => {
            const appStatus = appliedMap.get(opp.id);
            const applied   = appStatus !== undefined;

            return (
              <div
                key={opp.id}
                className="bg-white rounded-2xl border border-[#E8EDEF] p-5 flex flex-col sm:flex-row sm:items-start gap-4 hover:shadow-sm transition-shadow"
              >
                {/* Date badge */}
                <div className="shrink-0 w-14 h-14 rounded-xl bg-[#FFF7ED] flex flex-col items-center justify-center text-center">
                  {opp.date ? (
                    <>
                      <span className="text-lg font-bold text-[#EA580C] leading-none">
                        {opp.date.toLocaleDateString("ar-SA", { day: "numeric" })}
                      </span>
                      <span className="text-[10px] text-[#9CA3AF] leading-none mt-0.5">
                        {opp.date.toLocaleDateString("ar-SA", { month: "short" })}
                      </span>
                    </>
                  ) : (
                    <span className="text-2xl">{volIcons[i % volIcons.length]}</span>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 space-y-1.5">
                  <p className="font-bold text-[#1F2937] text-sm">{opp.title}</p>
                  {opp.description && (
                    <p className="text-xs text-[#6B7280] leading-relaxed line-clamp-3">{opp.description}</p>
                  )}
                  {opp.date && (
                    <p className="text-xs text-[#9CA3AF]">
                      📅 {opp.date.toLocaleDateString("ar-SA", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
                    </p>
                  )}
                </div>

                {/* Action */}
                <div className="shrink-0 self-start">
                  <VolunteerApplyButton
                    opportunityId={opp.id}
                    alreadyApplied={applied}
                    existingStatus={appStatus}
                    isPast={false}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Past opportunities */}
      {past.length > 0 && (
        <div className="space-y-3">
          <h2 className="font-bold text-[#8FA4AB] text-sm">فرص منتهية</h2>
          <div className="space-y-2">
            {past.map((opp) => {
              const appStatus = appliedMap.get(opp.id);
              return (
                <div
                  key={opp.id}
                  className="bg-[#F9FAFB] rounded-xl border border-[#E8EDEF] p-4 flex items-center justify-between gap-4 opacity-70"
                >
                  <div className="min-w-0">
                    <p className="font-semibold text-[#374151] text-sm">{opp.title}</p>
                    {opp.date && (
                      <p className="text-xs text-[#9CA3AF] mt-0.5">
                        {opp.date.toLocaleDateString("ar-SA", { day: "numeric", month: "long", year: "numeric" })}
                      </p>
                    )}
                  </div>
                  <VolunteerApplyButton
                    opportunityId={opp.id}
                    alreadyApplied={appStatus !== undefined}
                    existingStatus={appStatus}
                    isPast={true}
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
}
