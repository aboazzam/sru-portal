import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/dal";
import { prisma } from "@/lib/db";

const statusConfig: Record<string, { label: string; bg: string; color: string }> = {
  PENDING:   { label: "قيد المراجعة", bg: "#FEF3C7", color: "#D97706" },
  APPROVED:  { label: "مقبول",        bg: "#DCFCE7", color: "#16A34A" },
  REJECTED:  { label: "مرفوض",        bg: "#FEE2E2", color: "#DC2626" },
  COMPLETED: { label: "مكتمل",        bg: "#DBEAFE", color: "#2563EB" },
};

type AppItem = { id: string; title: string; status: string; date: Date; type: string; icon: string; href: string };

const typeFilters = ["الكل", "المنح", "التدريب", "الخدمات", "التطوع", "الأنشطة", "الأندية"] as const;
const statusFilters = ["الكل الحالات", "قيد المراجعة", "مقبول", "مرفوض", "مكتمل"] as const;

const statusKeyMap: Record<string, string> = {
  "قيد المراجعة": "PENDING",
  "مقبول":        "APPROVED",
  "مرفوض":        "REJECTED",
  "مكتمل":        "COMPLETED",
};

export default async function MyApplicationsPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; status?: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.role !== "STUDENT") redirect("/dashboard");

  const { type, status } = await searchParams;

  const [
    scholarshipApps,
    trainingEnrollments,
    serviceApps,
    volunteerApps,
    activityApps,
    clubMemberships,
  ] = await Promise.all([
    prisma.scholarshipApplication.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      select: { id: true, status: true, createdAt: true, scholarship: { select: { title: true } } },
    }),
    prisma.trainingEnrollment.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      select: { id: true, status: true, createdAt: true, training: { select: { title: true } } },
    }),
    prisma.serviceApplications.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      select: { id: true, status: true, createdAt: true, service: { select: { title: true } } },
    }),
    prisma.volunteerApplication.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      select: { id: true, status: true, createdAt: true, opportunity: { select: { title: true } } },
    }),
    prisma.activityApplication.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      select: { id: true, status: true, createdAt: true, activity: { select: { title: true } } },
    }),
    prisma.clubMembership.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      select: { id: true, status: true, createdAt: true, club: { select: { name: true } } },
    }),
  ]);

  const allItems: AppItem[] = [
    ...scholarshipApps.map((a)    => ({ id: a.id, title: a.scholarship.title,  status: a.status, date: a.createdAt, type: "المنح",   icon: "🎓", href: "/student/scholarships" })),
    ...trainingEnrollments.map((a) => ({ id: a.id, title: a.training.title,     status: a.status, date: a.createdAt, type: "التدريب", icon: "🏢", href: "/student/trainings"    })),
    ...serviceApps.map((a)         => ({ id: a.id, title: a.service.title,      status: a.status, date: a.createdAt, type: "الخدمات", icon: "🛎️", href: "/services"             })),
    ...volunteerApps.map((a)       => ({ id: a.id, title: a.opportunity.title,  status: a.status, date: a.createdAt, type: "التطوع",  icon: "🌱", href: "/volunteers"           })),
    ...activityApps.map((a)        => ({ id: a.id, title: a.activity.title,     status: a.status, date: a.createdAt, type: "الأنشطة", icon: "🎯", href: "/activities"           })),
    ...clubMemberships.map((a)     => ({ id: a.id, title: a.club.name,          status: a.status, date: a.createdAt, type: "الأندية", icon: "⚽", href: "/clubs"                })),
  ].sort((a, b) => b.date.getTime() - a.date.getTime());

  const filteredItems = allItems.filter((item) => {
    const typeMatch   = !type || type === "الكل"          || item.type === type;
    const statusMatch = !status || status === "الكل الحالات" || item.status === statusKeyMap[status];
    return typeMatch && statusMatch;
  });

  const pendingCount  = allItems.filter((i) => i.status === "PENDING").length;
  const approvedCount = allItems.filter((i) => i.status === "APPROVED").length;
  const totalCount    = allItems.length;

  return (
    <div className="space-y-5">

      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Link href="/student" className="hover:text-cyan-600 transition-colors">لوحة الطالب</Link>
        <span>/</span>
        <span className="text-gray-800 font-medium">جميع طلباتي</span>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-gray-900">جميع طلباتي</h1>
        <p className="text-gray-500 text-sm mt-0.5">{totalCount} طلب إجمالاً</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "إجمالي الطلبات", value: totalCount,    bg: "bg-gray-50   border-gray-200",   color: "text-gray-700"   },
          { label: "قيد المراجعة",  value: pendingCount,  bg: "bg-amber-50  border-amber-200",  color: "text-amber-700"  },
          { label: "مقبولة",        value: approvedCount, bg: "bg-green-50  border-green-200",  color: "text-green-700"  },
        ].map((s) => (
          <div key={s.label} className={`rounded-xl border p-4 text-center ${s.bg}`}>
            <p className={`text-2xl font-bold tabular-nums ${s.color}`}>{s.value}</p>
            <p className={`text-xs mt-0.5 ${s.color} opacity-80`}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Type filters */}
      <div className="space-y-2">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">نوع الطلب</p>
        <div className="flex gap-2 flex-wrap">
          {typeFilters.map((f) => {
            const isActive = (!type && f === "الكل") || type === f;
            const params = new URLSearchParams();
            if (f !== "الكل") params.set("type", f);
            if (status && status !== "الكل الحالات") params.set("status", status);
            const href = `/student/my-applications${params.toString() ? `?${params}` : ""}`;
            return (
              <Link
                key={f}
                href={href}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  isActive ? "bg-cyan-600 text-white shadow-sm" : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
                }`}
              >
                {f}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Status filters */}
      <div className="space-y-2">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">الحالة</p>
        <div className="flex gap-2 flex-wrap">
          {statusFilters.map((f) => {
            const isActive = (!status && f === "الكل الحالات") || status === f;
            const params = new URLSearchParams();
            if (type && type !== "الكل") params.set("type", type);
            if (f !== "الكل الحالات") params.set("status", f);
            const href = `/student/my-applications${params.toString() ? `?${params}` : ""}`;
            return (
              <Link
                key={f}
                href={href}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  isActive ? "bg-gray-800 text-white shadow-sm" : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
                }`}
              >
                {f}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Applications table */}
      {filteredItems.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 py-14 text-center">
          <p className="text-3xl mb-2">📭</p>
          <p className="text-gray-400 text-sm">لا توجد طلبات تطابق هذا التصنيف</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-100 bg-gray-50">
            <p className="text-xs text-gray-500">{filteredItems.length} نتيجة</p>
          </div>
          <div className="divide-y divide-gray-50">
            {filteredItems.map((item) => {
              const cfg = statusConfig[item.status] ?? statusConfig.PENDING;
              return (
                <Link
                  key={item.id + item.type}
                  href={item.href}
                  className="flex items-start justify-between gap-4 px-5 py-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <span className="text-xl shrink-0 mt-0.5">{item.icon}</span>
                    <div className="min-w-0">
                      <p className="font-medium text-gray-800 text-sm truncate">{item.title}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-gray-400">{item.type}</span>
                        <span className="text-gray-300">·</span>
                        <span className="text-xs text-gray-400">
                          {item.date.toLocaleDateString("ar-SA", { day: "numeric", month: "long", year: "numeric" })}
                        </span>
                      </div>
                    </div>
                  </div>
                  <span
                    className="shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full"
                    style={{ background: cfg.bg, color: cfg.color }}
                  >
                    {cfg.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
}
