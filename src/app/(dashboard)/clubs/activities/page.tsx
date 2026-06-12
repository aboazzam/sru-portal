import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/dal";
import { prisma } from "@/lib/db";
import ParticipateButton from "./_components/ParticipateButton";

export default async function ClubActivitiesPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  // Get user's memberships (approved ones can participate)
  const myMemberships = await prisma.clubMembership.findMany({
    where: { userId: user.id },
    select: { id: true, clubId: true, status: true },
  });

  const approvedClubIds = new Set(
    myMemberships.filter((m) => m.status === "APPROVED").map((m) => m.clubId)
  );
  const membershipIdByClub = new Map(
    myMemberships.filter((m) => m.status === "APPROVED").map((m) => [m.clubId, m.id])
  );

  // All activities across all clubs (show all, not just joined clubs)
  const activities = await prisma.clubActivity.findMany({
    orderBy: [{ date: "desc" }, { createdAt: "desc" }],
    select: {
      id: true,
      title: true,
      description: true,
      points: true,
      date: true,
      club: { select: { id: true, name: true } },
      participations: {
        where: {
          membershipId: {
            in: myMemberships.filter((m) => m.status === "APPROVED").map((m) => m.id),
          },
        },
        select: { id: true, pointsEarned: true },
      },
      _count: { select: { participations: true } },
    },
  });

  const participatedIds = new Set(
    activities.filter((a) => a.participations.length > 0).map((a) => a.id)
  );

  const totalEarned = activities.reduce(
    (sum, a) => sum + a.participations.reduce((s, p) => s + p.pointsEarned, 0),
    0
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">الأنشطة</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            {activities.length} نشاط
            {totalEarned > 0 && ` · كسبت ${totalEarned} نقطة`}
          </p>
        </div>
        {approvedClubIds.size === 0 && (
          <Link
            href="/clubs"
            className="text-xs text-yellow-600 hover:underline"
          >
            انضم لناد للمشاركة في الأنشطة ←
          </Link>
        )}
      </div>

      {/* Points summary for members */}
      {approvedClubIds.size > 0 && (
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "إجمالي الأنشطة",    value: activities.length,                           color: "bg-yellow-50 border-yellow-200 text-yellow-700"  },
            { label: "شاركت فيها",         value: participatedIds.size,                        color: "bg-green-50  border-green-200  text-green-700"   },
            { label: "نقاط مكتسبة",        value: totalEarned,                                 color: "bg-purple-50 border-purple-200 text-purple-700"  },
          ].map((s) => (
            <div key={s.label} className={`rounded-xl border p-4 text-center ${s.color}`}>
              <p className="text-2xl font-bold">{s.value}</p>
              <p className="text-xs opacity-80 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Activities list */}
      {activities.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 py-16 text-center">
          <p className="text-gray-400">لا توجد أنشطة مسجّلة حالياً</p>
        </div>
      ) : (
        <div className="space-y-3">
          {activities.map((act) => {
            const canParticipate = approvedClubIds.has(act.club.id);
            const participated = participatedIds.has(act.id);
            return (
              <div
                key={act.id}
                className={`bg-white rounded-xl border p-5 flex flex-col sm:flex-row sm:items-start gap-4 hover:shadow-sm transition-shadow ${
                  participated ? "border-green-300" : "border-gray-200"
                }`}
              >
                {/* Date badge */}
                <div className="shrink-0 w-14 h-14 rounded-xl bg-yellow-100 text-yellow-700 flex flex-col items-center justify-center text-center">
                  {act.date ? (
                    <>
                      <span className="text-lg font-bold leading-none">
                        {act.date.toLocaleDateString("ar-SA", { day: "numeric" })}
                      </span>
                      <span className="text-[10px] leading-none mt-0.5">
                        {act.date.toLocaleDateString("ar-SA", { month: "short" })}
                      </span>
                    </>
                  ) : (
                    <span className="text-xl">🎯</span>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 space-y-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-gray-900 text-sm">{act.title}</h3>
                    {act.points > 0 && (
                      <span className="text-[10px] font-bold bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded-full">
                        +{act.points} نقطة
                      </span>
                    )}
                  </div>
                  {act.description && (
                    <p className="text-gray-500 text-xs line-clamp-2">{act.description}</p>
                  )}
                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    <span>⭐ {act.club.name}</span>
                    <span>· {act._count.participations} مشارك</span>
                    {act.date && (
                      <span>· {act.date.toLocaleDateString("ar-SA")}</span>
                    )}
                  </div>
                </div>

                {/* Action */}
                <div className="shrink-0">
                  <ParticipateButton
                    activityId={act.id}
                    participated={participated}
                    points={act.points}
                    canParticipate={canParticipate}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
