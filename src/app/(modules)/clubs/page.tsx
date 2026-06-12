import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/dal";
import { prisma } from "@/lib/db";

const membershipStatusConfig = {
  PENDING:  { label: "قيد المراجعة", bg: "#FEF3C7", color: "#D97706", icon: "⏳" },
  APPROVED: { label: "عضو فعّال",    bg: "#DCFCE7", color: "#16A34A", icon: "✅" },
  REJECTED: { label: "مرفوض",        bg: "#FEE2E2", color: "#DC2626", icon: "❌" },
} as const;

const clubIcons = ["⚽", "🏀", "🏐", "🏊", "🎾", "🥋", "🏃", "🏋️", "🏸", "⛳"];

export default async function ClubsDashboard() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const now = new Date();

  const [totalClubs, myMemberships, upcomingActivities] = await Promise.all([
    prisma.sportsClub.count(),

    prisma.clubMembership.findMany({
      where: { userId: user.id },
      include: { club: { select: { id: true, name: true, description: true } } },
      orderBy: { createdAt: "desc" },
    }),

    prisma.clubActivity.findMany({
      where: {
        OR: [{ date: null }, { date: { gte: now } }],
      },
      orderBy: { date: "asc" },
      take: 5,
      select: { id: true, title: true, date: true, points: true, club: { select: { name: true } } },
    }),
  ]);

  const approvedCount = myMemberships.filter((m) => m.status === "APPROVED").length;
  const pendingCount  = myMemberships.filter((m) => m.status === "PENDING").length;
  const activeClubs   = myMemberships.filter((m) => m.status === "APPROVED").slice(0, 4);
  const recentRequests = myMemberships.slice(0, 4);

  return (
    <div className="space-y-6">

      {/* Hero */}
      <div
        className="rounded-2xl p-6 text-white shadow-sm"
        style={{ background: "linear-gradient(135deg, #DC2626 0%, #991B1B 100%)" }}
      >
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <p className="text-white/70 text-xs mb-1">الأندية الرياضية — جامعة سليمان الراجحي</p>
            <h1 className="text-xl font-bold">مرحباً، {user.name.split(" ")[0]} 👋</h1>
            <p className="text-white/80 text-sm mt-0.5">{user.email}</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            {approvedCount > 0 && (
              <span
                className="text-xs font-bold px-3 py-1.5 rounded-full"
                style={{ background: "rgba(255,255,255,0.2)" }}
              >
                🏆 عضو نشط
              </span>
            )}
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-xl font-bold">
              {user.name.charAt(0)}
            </div>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between gap-4 flex-wrap">
          <p className="text-white/70 text-sm">
            {myMemberships.length === 0
              ? "لم تنضم لأي نادٍ بعد — استكشف الأندية المتاحة"
              : `${myMemberships.length} طلب عضوية · ${pendingCount} قيد المراجعة · ${approvedCount} مقبول`}
          </p>
          <Link
            href="/clubs/browse"
            className="text-xs font-bold px-4 py-2 rounded-xl text-white transition-all hover:bg-white/20"
            style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.3)" }}
          >
            تصفّح الأندية ←
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "أندية متاحة",     value: String(totalClubs),          icon: "🏟️", color: "#DC2626" },
          { label: "عضوياتي المقبولة", value: String(approvedCount),       icon: "✅", color: "#16A34A" },
          { label: "قيد المراجعة",    value: String(pendingCount),         icon: "⏳", color: "#D97706" },
          { label: "إجمالي الطلبات",  value: String(myMemberships.length), icon: "🪪", color: "#4A8FA0" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-[#E8EDEF] p-4 hover:shadow-sm transition-shadow">
            <div className="text-2xl mb-1">{s.icon}</div>
            <p className="text-lg font-bold" style={{ color: s.color }}>{s.value}</p>
            <p className="text-xs text-[#8FA4AB] mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Active memberships */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#E8EDEF] overflow-hidden">
          <div className="px-5 py-4 border-b border-[#E8EDEF] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span>🏆</span>
              <h2 className="font-bold text-[#1A2A30] text-sm">أنديتي الفعّالة</h2>
            </div>
            {myMemberships.length > 0 && (
              <Link href="/clubs/my-memberships" className="text-xs font-medium hover:underline" style={{ color: "#DC2626" }}>
                عرض الكل
              </Link>
            )}
          </div>

          {activeClubs.length === 0 ? (
            <div className="px-5 py-10 text-center">
              <p className="text-3xl mb-2">🏟️</p>
              <p className="text-sm text-[#8FA4AB]">لا توجد عضويات مقبولة بعد</p>
              <Link
                href="/clubs/browse"
                className="inline-block mt-3 text-xs font-semibold px-4 py-2 rounded-xl text-white"
                style={{ background: "#DC2626" }}
              >
                انضم الآن
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-[#F4F7F8]">
              {activeClubs.map((m, i) => (
                <Link key={m.id} href={`/clubs/${m.club.id}`} className="block px-5 py-4 hover:bg-[#FEF2F2] transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#FEF2F2] flex items-center justify-center text-lg shrink-0">
                      {clubIcons[i % clubIcons.length]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-[#1F2937]">{m.club.name}</p>
                      {m.club.description && (
                        <p className="text-xs text-[#9CA3AF] mt-0.5 truncate">{m.club.description}</p>
                      )}
                    </div>
                    <span className="shrink-0 text-xs font-bold px-2.5 py-1 rounded-full bg-[#DCFCE7] text-[#16A34A]">
                      ✅ عضو
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Upcoming activities */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#E8EDEF] overflow-hidden">
          <div className="px-5 py-4 border-b border-[#E8EDEF] flex items-center gap-2">
            <span>📅</span>
            <h2 className="font-bold text-[#1A2A30] text-sm">أقرب الفعاليات</h2>
          </div>

          {upcomingActivities.length === 0 ? (
            <div className="px-5 py-10 text-center">
              <p className="text-[#8FA4AB] text-sm">لا توجد فعاليات قادمة حالياً</p>
            </div>
          ) : (
            <div className="divide-y divide-[#F4F7F8]">
              {upcomingActivities.map((act) => (
                <div key={act.id} className="px-5 py-4 hover:bg-[#FEF2F2] transition-colors">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-sm text-[#1F2937]">{act.title}</p>
                      <p className="text-xs text-[#9CA3AF] mt-0.5">{act.club.name}</p>
                      {act.date && (
                        <p className="text-xs text-[#6B7280] mt-0.5">
                          📅 {act.date.toLocaleDateString("ar-SA", { day: "numeric", month: "long", year: "numeric" })}
                        </p>
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
          )}

          <div className="px-5 py-3 bg-[#F4F7F8] border-t border-[#E8EDEF]">
            <Link
              href="/clubs/browse"
              className="text-xs font-semibold flex items-center justify-center gap-1 hover:opacity-80 transition-opacity"
              style={{ color: "#DC2626" }}
            >
              تصفّح الأندية والفعاليات ←
            </Link>
          </div>
        </div>

      </div>

      {/* Recent membership requests */}
      {recentRequests.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-[#E8EDEF] overflow-hidden">
          <div className="px-5 py-4 border-b border-[#E8EDEF] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span>🪪</span>
              <h2 className="font-bold text-[#1A2A30] text-sm">آخر طلبات العضوية</h2>
            </div>
            <Link href="/clubs/my-memberships" className="text-xs font-medium hover:underline" style={{ color: "#DC2626" }}>
              عرض الكل
            </Link>
          </div>
          <div className="divide-y divide-[#F4F7F8]">
            {recentRequests.map((m) => {
              const sc = membershipStatusConfig[m.status];
              return (
                <div key={m.id} className="px-5 py-4 flex items-center justify-between gap-3 hover:bg-[#F9FAFB] transition-colors">
                  <div>
                    <p className="font-semibold text-sm text-[#1F2937]">{m.club.name}</p>
                    <p className="text-xs text-[#9CA3AF] mt-0.5">
                      {m.createdAt.toLocaleDateString("ar-SA", { day: "numeric", month: "long", year: "numeric" })}
                    </p>
                  </div>
                  <span className="shrink-0 text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: sc.bg, color: sc.color }}>
                    {sc.icon} {sc.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Info banner */}
      <div
        className="rounded-2xl px-6 py-5 flex items-start gap-4"
        style={{ background: "linear-gradient(to left, #FEF2F2, #FEE2E2)", border: "1px solid #FECACA" }}
      >
        <span className="text-2xl shrink-0">🏆</span>
        <div>
          <p className="font-bold text-[#991B1B] text-sm mb-1">الأندية الرياضية — رياضة وتميز</p>
          <p className="text-xs text-[#DC2626] leading-relaxed">
            انضم إلى الأندية الرياضية لتطوير مهاراتك الجسدية والقيادية · اكسب نقاطاً تُحتسب في ملفك الطلابي · شارك في البطولات الداخلية والخارجية · وابنِ صداقات تدوم مدى الحياة.
          </p>
        </div>
      </div>

    </div>
  );
}
