import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/dal";
import { prisma } from "@/lib/db";
import JoinButton from "./_components/JoinButton";

export default async function ClubsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const [clubs, myMemberships] = await Promise.all([
    prisma.sportsClub.findMany({
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        description: true,
        _count: {
          select: {
            memberships: { where: { status: "APPROVED" } },
            activities: true,
          },
        },
      },
    }),
    prisma.clubMembership.findMany({
      where: { userId: user.id },
      select: { clubId: true, status: true },
    }),
  ]);

  const membershipMap = new Map(myMemberships.map((m) => [m.clubId, m.status]));

  const approvedCount = myMemberships.filter((m) => m.status === "APPROVED").length;
  const pendingCount  = myMemberships.filter((m) => m.status === "PENDING").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">الأندية الطلابية</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            {clubs.length} ناد متاح
            {approvedCount > 0 && ` · أنت عضو في ${approvedCount}`}
            {pendingCount > 0 && ` · ${pendingCount} طلب قيد المراجعة`}
          </p>
        </div>
        <div className="shrink-0 w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center text-2xl">
          ⭐
        </div>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "إجمالي الأندية",  value: clubs.length,    color: "text-yellow-700 bg-yellow-50 border-yellow-200"  },
          { label: "عضويتي",           value: approvedCount,   color: "text-green-700  bg-green-50  border-green-200"   },
          { label: "قيد المراجعة",     value: pendingCount,    color: "text-amber-700  bg-amber-50  border-amber-200"   },
        ].map((s) => (
          <div key={s.label} className={`rounded-xl border p-4 text-center ${s.color}`}>
            <p className="text-2xl font-bold">{s.value}</p>
            <p className="text-xs opacity-80 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Clubs grid */}
      {clubs.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 py-16 text-center">
          <p className="text-gray-400">لا توجد أندية مسجّلة حالياً</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {clubs.map((club) => {
            const myStatus = membershipMap.get(club.id) ?? null;
            const isApproved = myStatus === "APPROVED";
            return (
              <div
                key={club.id}
                className={`bg-white rounded-xl border p-5 flex flex-col gap-4 hover:shadow-md transition-shadow ${
                  isApproved ? "border-yellow-300 ring-1 ring-yellow-200" : "border-gray-200"
                }`}
              >
                {/* Icon + name */}
                <div className="flex items-start gap-3">
                  <div className="w-11 h-11 rounded-xl bg-yellow-100 text-yellow-700 flex items-center justify-center text-xl font-bold shrink-0">
                    {club.name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-gray-900 text-sm leading-snug">{club.name}</h3>
                    {isApproved && (
                      <span className="text-[10px] font-semibold bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full">
                        عضو
                      </span>
                    )}
                  </div>
                </div>

                {club.description && (
                  <p className="text-gray-500 text-xs leading-relaxed line-clamp-2 flex-1">
                    {club.description}
                  </p>
                )}

                {/* Stats row */}
                <div className="flex gap-4 text-xs text-gray-400">
                  <span>👥 {club._count.memberships} عضو</span>
                  <span>🎯 {club._count.activities} نشاط</span>
                </div>

                {/* Action */}
                <div className="flex justify-end">
                  <JoinButton clubId={club.id} status={myStatus} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
