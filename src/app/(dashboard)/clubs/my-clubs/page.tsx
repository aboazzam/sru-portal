import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/dal";
import { prisma } from "@/lib/db";
import CouncilApplyButton from "./_components/CouncilApplyButton";

const membershipStatusLabel: Record<string, string> = {
  PENDING:  "قيد المراجعة",
  APPROVED: "عضو نشط",
  REJECTED: "مرفوض",
};
const membershipStatusStyle: Record<string, string> = {
  PENDING:  "bg-amber-100 text-amber-700",
  APPROVED: "bg-green-100 text-green-700",
  REJECTED: "bg-red-100 text-red-600",
};

const councilStatusLabel: Record<string, string> = {
  PENDING:  "طلب مجلس قيد المراجعة",
  APPROVED: "عضو مجلس الإدارة",
  REJECTED: "طلب المجلس مرفوض",
};

export default async function MyClubsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const memberships = await prisma.clubMembership.findMany({
    where: { userId: user.id },
    include: {
      club: {
        select: {
          id: true,
          name: true,
          description: true,
          _count: { select: { memberships: { where: { status: "APPROVED" } }, activities: true } },
        },
      },
      activityParticipations: {
        select: { pointsEarned: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const councilApps = await prisma.councilApplication.findMany({
    where: { userId: user.id },
    select: { clubId: true, status: true },
  });
  const councilMap = new Map(councilApps.map((c) => [c.clubId, c.status]));

  const totalPoints = memberships.reduce(
    (sum, m) => sum + m.activityParticipations.reduce((s, p) => s + p.pointsEarned, 0),
    0
  );
  const approvedMemberships = memberships.filter((m) => m.status === "APPROVED");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">ناديي</h1>
        <p className="text-gray-500 text-sm mt-0.5">
          عضويتك في {memberships.length} {memberships.length === 1 ? "ناد" : "أندية"}
        </p>
      </div>

      {/* Summary stats */}
      {memberships.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "إجمالي الأندية",    value: memberships.length,          color: "bg-yellow-50 border-yellow-200 text-yellow-700"  },
            { label: "عضويات مقبولة",     value: approvedMemberships.length,  color: "bg-green-50  border-green-200  text-green-700"   },
            { label: "نقاط من الأنشطة",   value: totalPoints,                 color: "bg-purple-50 border-purple-200 text-purple-700"  },
          ].map((s) => (
            <div key={s.label} className={`rounded-xl border p-4 text-center ${s.color}`}>
              <p className="text-2xl font-bold">{s.value}</p>
              <p className="text-xs opacity-80 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Memberships list */}
      {memberships.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 py-16 text-center space-y-3">
          <p className="text-gray-400">لم تنضم إلى أي ناد بعد</p>
          <Link
            href="/clubs"
            className="inline-block px-5 py-2.5 bg-yellow-600 text-white rounded-lg text-sm font-semibold hover:bg-yellow-700 transition-colors"
          >
            استعرض الأندية
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {memberships.map((m) => {
            const myPoints = m.activityParticipations.reduce((s, p) => s + p.pointsEarned, 0);
            const councilStatus = councilMap.get(m.club.id) ?? null;
            return (
              <div
                key={m.id}
                className={`bg-white rounded-xl border p-5 space-y-4 ${
                  m.status === "APPROVED" ? "border-yellow-300" : "border-gray-200"
                }`}
              >
                {/* Club header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-yellow-100 text-yellow-700 flex items-center justify-center text-lg font-bold shrink-0">
                      {m.club.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-bold text-gray-900">{m.club.name}</h3>
                      <p className="text-xs text-gray-400">
                        {m.club._count.memberships} عضو · {m.club._count.activities} نشاط
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${membershipStatusStyle[m.status]}`}>
                      {membershipStatusLabel[m.status]}
                    </span>
                    {m.status === "APPROVED" && myPoints > 0 && (
                      <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-medium">
                        +{myPoints} نقطة
                      </span>
                    )}
                  </div>
                </div>

                {m.club.description && (
                  <p className="text-gray-500 text-xs leading-relaxed">{m.club.description}</p>
                )}

                {/* Council section for approved members */}
                {m.status === "APPROVED" && (
                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <div>
                      <p className="text-xs font-medium text-gray-700">مجلس الإدارة</p>
                      {councilStatus ? (
                        <p className="text-xs text-gray-400">{councilStatusLabel[councilStatus]}</p>
                      ) : (
                        <p className="text-xs text-gray-400">التقدّم لعضوية مجلس الإدارة</p>
                      )}
                    </div>
                    <CouncilApplyButton clubId={m.club.id} existingStatus={councilStatus} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
