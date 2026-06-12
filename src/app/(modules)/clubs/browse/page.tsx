import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/dal";
import { prisma } from "@/lib/db";
import JoinButton from "./_components/JoinButton";

const clubIcons = ["⚽", "🏀", "🏐", "🏊", "🎾", "🥋", "🏃", "🏋️", "🏸", "⛳", "🤼", "🥊"];

export default async function BrowseClubsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const [clubs, myMemberships] = await Promise.all([
    prisma.sportsClub.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: { select: { memberships: true, activities: true } },
      },
    }),
    prisma.clubMembership.findMany({
      where: { userId: user.id },
      select: { clubId: true, status: true },
    }),
  ]);

  const membershipMap = new Map(myMemberships.map((m) => [m.clubId, m.status]));

  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-2xl font-bold text-[#1A2A30]">تصفّح الأندية</h1>
        <p className="text-sm text-[#8FA4AB] mt-1">{clubs.length} نادٍ رياضي متاح</p>
      </div>

      {clubs.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#E8EDEF] px-6 py-16 text-center">
          <p className="text-4xl mb-2">🏟️</p>
          <p className="text-sm text-[#8FA4AB]">لا توجد أندية مسجّلة حالياً</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {clubs.map((club, i) => {
            const alreadyJoined  = membershipMap.has(club.id);
            const existingStatus = membershipMap.get(club.id);

            return (
              <div key={club.id} className="bg-white rounded-2xl border border-[#E8EDEF] shadow-sm hover:shadow-md transition-shadow flex flex-col overflow-hidden">
                <div className="h-2" style={{ background: "linear-gradient(to left, #DC2626, #991B1B)" }} />
                <div className="p-5 flex flex-col flex-1 gap-4">

                  {/* Club header */}
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-[#FEF2F2] flex items-center justify-center text-2xl shrink-0">
                      {clubIcons[i % clubIcons.length]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-sm text-[#1F2937] leading-snug">{club.name}</h3>
                      {club.description && (
                        <p className="text-xs text-[#6B7280] mt-1 line-clamp-2">{club.description}</p>
                      )}
                    </div>
                  </div>

                  {/* Stats row */}
                  <div className="flex items-center gap-4 text-xs text-[#8FA4AB]">
                    <span>👥 {club._count.memberships} عضو</span>
                    <span>📅 {club._count.activities} فعالية</span>
                  </div>

                  {/* Actions */}
                  <div className="mt-auto flex items-center justify-between gap-2">
                    <Link
                      href={`/clubs/${club.id}`}
                      className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-[#F4F7F8] text-[#506570] hover:bg-[#FEF2F2] hover:text-[#DC2626] transition-colors"
                    >
                      عرض التفاصيل
                    </Link>
                    <JoinButton
                      clubId={club.id}
                      alreadyJoined={alreadyJoined}
                      existingStatus={existingStatus}
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
