import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/dal";
import { prisma } from "@/lib/db";
import ClubActions from "./_components/ClubActions";

const clubIcons = ["⚽", "🏀", "🏐", "🏊", "🎾", "🥋", "🏃", "🏋️", "🏸", "⛳", "🤼", "🥊"];

export default async function ClubDetailPage({
  params,
}: {
  params: Promise<{ clubId: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const { clubId } = await params;

  const now = new Date();

  const [club, membership, councilApp] = await Promise.all([
    prisma.sportsClub.findUnique({
      where: { id: clubId },
      include: {
        activities: {
          orderBy: { date: "asc" },
          select: { id: true, title: true, description: true, date: true, points: true },
        },
        _count: { select: { memberships: true } },
      },
    }),
    prisma.clubMembership.findUnique({
      where: { userId_clubId: { userId: user.id, clubId } },
      select: { status: true },
    }),
    prisma.councilApplication.findUnique({
      where: { userId_clubId: { userId: user.id, clubId } },
      select: { status: true },
    }),
  ]);

  if (!club) notFound();

  const upcoming = club.activities.filter((a) => !a.date || a.date >= now);
  const past     = club.activities.filter((a) => a.date && a.date < now);

  const clubIndex = Math.abs(clubId.charCodeAt(0)) % clubIcons.length;

  return (
    <div className="space-y-6 max-w-4xl">

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-[#8FA4AB]">
        <Link href="/clubs" className="hover:text-[#DC2626] transition-colors">الأندية</Link>
        <span>/</span>
        <Link href="/clubs/browse" className="hover:text-[#DC2626] transition-colors">تصفّح الأندية</Link>
        <span>/</span>
        <span className="text-[#1A2A30] font-medium">{club.name}</span>
      </div>

      {/* Club header card */}
      <div className="bg-white rounded-2xl border border-[#E8EDEF] shadow-sm overflow-hidden">
        <div className="h-2" style={{ background: "linear-gradient(to left, #DC2626, #991B1B)" }} />
        <div className="p-6 sm:p-8">
          <div className="flex items-start gap-5 flex-wrap">
            <div className="w-20 h-20 rounded-2xl bg-[#FEF2F2] flex items-center justify-center text-4xl shrink-0">
              {clubIcons[clubIndex]}
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-bold text-[#1F2937]">{club.name}</h1>
              {club.description && (
                <p className="text-sm text-[#6B7280] mt-2 leading-relaxed">{club.description}</p>
              )}
              <div className="flex items-center gap-4 mt-3 text-xs text-[#8FA4AB]">
                <span>👥 {club._count.memberships} عضو</span>
                <span>📅 {club.activities.length} فعالية</span>
              </div>
            </div>
            <div className="shrink-0 w-44">
              <ClubActions
                clubId={clubId}
                membershipStatus={membership?.status ?? null}
                councilAppStatus={councilApp?.status ?? null}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Activities */}
      <div className="space-y-5">

        {upcoming.length > 0 && (
          <section>
            <h2 className="font-bold text-[#1A2A30] text-sm mb-3 flex items-center gap-2">
              <span>📅</span> الفعاليات القادمة
            </h2>
            <div className="bg-white rounded-2xl border border-[#E8EDEF] shadow-sm overflow-hidden">
              <div className="divide-y divide-[#F4F7F8]">
                {upcoming.map((act) => (
                  <div key={act.id} className="px-5 py-4 hover:bg-[#FEF2F2] transition-colors">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-sm text-[#1F2937]">{act.title}</p>
                        {act.description && (
                          <p className="text-xs text-[#6B7280] mt-0.5 leading-relaxed">{act.description}</p>
                        )}
                        {act.date && (
                          <p className="text-xs text-[#DC2626] mt-1 font-medium">
                            📅 {act.date.toLocaleDateString("ar-SA", { day: "numeric", month: "long", year: "numeric" })}
                          </p>
                        )}
                        {!act.date && (
                          <p className="text-xs text-[#16A34A] mt-1">📆 يحدد لاحقاً</p>
                        )}
                      </div>
                      {act.points > 0 && (
                        <span className="shrink-0 text-xs font-bold px-2.5 py-1 rounded-full bg-[#FEF3C7] text-[#D97706]">
                          +{act.points} نقطة
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {past.length > 0 && (
          <section>
            <h2 className="font-bold text-[#6B7280] text-sm mb-3 flex items-center gap-2">
              <span>🕐</span> الفعاليات السابقة
            </h2>
            <div className="bg-white rounded-2xl border border-[#E8EDEF] shadow-sm overflow-hidden opacity-80">
              <div className="divide-y divide-[#F4F7F8]">
                {past.map((act) => (
                  <div key={act.id} className="px-5 py-4 hover:bg-[#F9FAFB] transition-colors">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-sm text-[#6B7280]">{act.title}</p>
                        {act.date && (
                          <p className="text-xs text-[#9CA3AF] mt-1">
                            📅 {act.date.toLocaleDateString("ar-SA", { day: "numeric", month: "long", year: "numeric" })} · انتهت
                          </p>
                        )}
                      </div>
                      {act.points > 0 && (
                        <span className="shrink-0 text-xs font-bold px-2.5 py-1 rounded-full bg-[#F3F4F6] text-[#9CA3AF]">
                          {act.points} نقطة
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {club.activities.length === 0 && (
          <div className="bg-white rounded-2xl border border-[#E8EDEF] px-6 py-10 text-center">
            <p className="text-3xl mb-2">📭</p>
            <p className="text-sm text-[#8FA4AB]">لا توجد فعاليات مسجّلة لهذا النادي بعد</p>
          </div>
        )}

      </div>

      {/* Back */}
      <div>
        <Link
          href="/clubs/browse"
          className="inline-flex items-center gap-2 text-xs font-bold px-5 py-2.5 rounded-xl text-white transition-opacity hover:opacity-90"
          style={{ background: "linear-gradient(to left, #DC2626, #991B1B)" }}
        >
          ← العودة إلى الأندية
        </Link>
      </div>

    </div>
  );
}
