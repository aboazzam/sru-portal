import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/dal";
import { prisma } from "@/lib/db";

const statusConfig: Record<string, { label: string; bg: string; color: string; icon: string }> = {
  PENDING:  { label: "قيد المراجعة", bg: "#DBEAFE", color: "#2563EB", icon: "⏳" },
  APPROVED: { label: "مقبول",        bg: "#DCFCE7", color: "#16A34A", icon: "✅" },
  REJECTED: { label: "مرفوض",        bg: "#FEE2E2", color: "#DC2626", icon: "❌" },
};

const actIcons = ["🎭", "⚽", "🎨", "🏆", "🎤", "🌍", "🎓", "🎪", "🏅", "🎶"];

function Section({
  title,
  icon,
  apps,
  offset,
}: {
  title: string;
  icon: string;
  apps: Awaited<ReturnType<typeof loadApps>>;
  offset: number;
}) {
  if (apps.length === 0) return null;

  return (
    <section>
      <h2 className="font-bold text-[#1A2A30] text-sm mb-3 flex items-center gap-2">
        <span>{icon}</span> {title}
        <span className="text-xs font-normal text-[#8FA4AB]">({apps.length})</span>
      </h2>
      <div className="bg-white rounded-2xl border border-[#E8EDEF] shadow-sm overflow-hidden">
        <div className="divide-y divide-[#F4F7F8]">
          {apps.map((app, i) => {
            const sc  = statusConfig[app.status] ?? statusConfig.PENDING;
            const now = new Date();
            const isPast = app.activity.date && app.activity.date < now;

            return (
              <div key={app.id} className="px-5 py-4 hover:bg-[#F9FAFB] transition-colors">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] flex items-center justify-center text-xl shrink-0">
                      {actIcons[(offset + i) % actIcons.length]}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-sm text-[#1F2937]">{app.activity.title}</p>
                      {app.activity.date && (
                        <p className="text-xs mt-0.5" style={{ color: isPast ? "#9CA3AF" : "#2563EB" }}>
                          📅 {app.activity.date.toLocaleDateString("ar-SA", { day: "numeric", month: "long", year: "numeric" })}
                          {isPast && " · انتهى"}
                        </p>
                      )}
                      <p className="text-xs text-[#9CA3AF] mt-0.5">
                        تاريخ التسجيل: {app.createdAt.toLocaleDateString("ar-SA", { day: "numeric", month: "long", year: "numeric" })}
                      </p>
                    </div>
                  </div>
                  <span
                    className="shrink-0 self-start text-xs font-bold px-3 py-1.5 rounded-full"
                    style={{ background: sc.bg, color: sc.color }}
                  >
                    {sc.icon} {sc.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

async function loadApps(userId: string) {
  return prisma.activityApplication.findMany({
    where: { userId },
    include: { activity: { select: { id: true, title: true, date: true } } },
    orderBy: { createdAt: "desc" },
  });
}

export default async function MyActivitiesPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const apps = await loadApps(user.id);

  const pending  = apps.filter((a) => a.status === "PENDING");
  const approved = apps.filter((a) => a.status === "APPROVED");
  const rejected = apps.filter((a) => a.status === "REJECTED");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#1A2A30]">طلباتي</h1>
        <p className="text-sm text-[#8FA4AB] mt-1">
          {apps.length === 0
            ? "لم تسجّل في أي نشاط بعد"
            : `${apps.length} طلب · ${pending.length} قيد المراجعة · ${approved.length} مقبول · ${rejected.length} مرفوض`}
        </p>
      </div>

      {apps.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#E8EDEF] px-6 py-16 text-center">
          <p className="text-5xl mb-3">📭</p>
          <p className="font-semibold text-[#1A2A30] text-sm">لا توجد طلبات بعد</p>
          <p className="text-xs text-[#8FA4AB] mt-1 mb-4">سجّل في نشاط من صفحة الأنشطة المتاحة</p>
          <Link
            href="/activities/catalog"
            className="inline-block text-xs font-bold px-5 py-2.5 rounded-xl text-white"
            style={{ background: "linear-gradient(to left, #2563EB, #1D4ED8)" }}
          >
            تصفّح الأنشطة ←
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          <Section title="قيد المراجعة" icon="⏳" apps={pending}  offset={0} />
          <Section title="مقبولة"        icon="✅" apps={approved} offset={pending.length} />
          <Section title="مرفوضة"        icon="❌" apps={rejected} offset={pending.length + approved.length} />
        </div>
      )}
    </div>
  );
}
