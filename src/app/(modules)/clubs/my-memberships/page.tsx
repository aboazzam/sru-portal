import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/dal";
import { prisma } from "@/lib/db";

const statusConfig = {
  PENDING:  { label: "قيد المراجعة", bg: "#FEF3C7", color: "#D97706", icon: "⏳" },
  APPROVED: { label: "عضو فعّال",    bg: "#DCFCE7", color: "#16A34A", icon: "✅" },
  REJECTED: { label: "مرفوض",        bg: "#FEE2E2", color: "#DC2626", icon: "❌" },
} as const;

const clubIcons = ["⚽", "🏀", "🏐", "🏊", "🎾", "🥋", "🏃", "🏋️", "🏸", "⛳", "🤼", "🥊"];

type Status = keyof typeof statusConfig;

function Section({
  title,
  icon,
  memberships,
}: {
  title: string;
  icon: string;
  memberships: Awaited<ReturnType<typeof loadMemberships>>;
}) {
  if (memberships.length === 0) return null;

  return (
    <section>
      <h2 className="font-bold text-[#1A2A30] text-sm mb-3 flex items-center gap-2">
        <span>{icon}</span> {title}
        <span className="text-xs font-normal text-[#8FA4AB]">({memberships.length})</span>
      </h2>
      <div className="bg-white rounded-2xl border border-[#E8EDEF] shadow-sm overflow-hidden">
        <div className="divide-y divide-[#F4F7F8]">
          {memberships.map((m, i) => {
            const sc = statusConfig[m.status as Status];
            return (
              <div key={m.id} className="px-5 py-4 hover:bg-[#F9FAFB] transition-colors">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-[#FEF2F2] flex items-center justify-center text-xl shrink-0">
                      {clubIcons[i % clubIcons.length]}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-sm text-[#1F2937]">{m.club.name}</p>
                      {m.club.description && (
                        <p className="text-xs text-[#9CA3AF] mt-0.5 truncate max-w-xs">{m.club.description}</p>
                      )}
                      <p className="text-xs text-[#9CA3AF] mt-0.5">
                        تاريخ الطلب: {m.createdAt.toLocaleDateString("ar-SA", { day: "numeric", month: "long", year: "numeric" })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className="text-xs font-bold px-3 py-1.5 rounded-full"
                      style={{ background: sc.bg, color: sc.color }}
                    >
                      {sc.icon} {sc.label}
                    </span>
                    <Link
                      href={`/clubs/${m.club.id}`}
                      className="text-xs font-medium px-3 py-1.5 rounded-xl bg-[#F4F7F8] text-[#506570] hover:bg-[#FEF2F2] hover:text-[#DC2626] transition-colors"
                    >
                      التفاصيل
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

async function loadMemberships(userId: string) {
  return prisma.clubMembership.findMany({
    where: { userId },
    include: { club: { select: { id: true, name: true, description: true } } },
    orderBy: { createdAt: "desc" },
  });
}

export default async function MyMembershipsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const memberships = await loadMemberships(user.id);

  const pending  = memberships.filter((m) => m.status === "PENDING");
  const approved = memberships.filter((m) => m.status === "APPROVED");
  const rejected = memberships.filter((m) => m.status === "REJECTED");

  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-2xl font-bold text-[#1A2A30]">عضوياتي</h1>
        <p className="text-sm text-[#8FA4AB] mt-1">
          {memberships.length === 0
            ? "لم تنضم لأي نادٍ بعد"
            : `${memberships.length} طلب عضوية · ${approved.length} مقبول · ${pending.length} قيد المراجعة · ${rejected.length} مرفوض`}
        </p>
      </div>

      {memberships.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#E8EDEF] px-6 py-16 text-center">
          <p className="text-5xl mb-3">🏟️</p>
          <p className="font-semibold text-[#1A2A30] text-sm">لا توجد عضويات بعد</p>
          <p className="text-xs text-[#8FA4AB] mt-1 mb-4">انضم إلى نادٍ من صفحة تصفّح الأندية</p>
          <Link
            href="/clubs/browse"
            className="inline-block text-xs font-bold px-5 py-2.5 rounded-xl text-white"
            style={{ background: "linear-gradient(to left, #DC2626, #991B1B)" }}
          >
            تصفّح الأندية ←
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          <Section title="عضوياتي المقبولة" icon="✅" memberships={approved} />
          <Section title="قيد المراجعة"      icon="⏳" memberships={pending}  />
          <Section title="مرفوضة"            icon="❌" memberships={rejected} />
        </div>
      )}
    </div>
  );
}
