import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/dal";
import { prisma } from "@/lib/db";
import ApplyButton from "./_components/ApplyButton";

const statusConfig: Record<string, { label: string; bg: string; color: string }> = {
  PENDING:  { label: "قيد المراجعة", bg: "#FEF3C7", color: "#D97706" },
  APPROVED: { label: "مقبول",        bg: "#DCFCE7", color: "#16A34A" },
  REJECTED: { label: "مرفوض",        bg: "#FEE2E2", color: "#DC2626" },
};

const filters = ["الكل", "متاحة", "تقديماتي", "منتهية"] as const;

export default async function StudentScholarshipsPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.role !== "STUDENT") redirect("/dashboard");

  const { filter } = await searchParams;

  const [scholarships, myApplications] = await Promise.all([
    prisma.scholarship.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true, title: true, description: true, amount: true, deadline: true,
        _count: { select: { applications: true } },
      },
    }),
    prisma.scholarshipApplication.findMany({
      where: { userId: user.id },
      select: {
        scholarshipId: true, status: true, createdAt: true,
        scholarship: { select: { title: true, amount: true } },
      },
    }),
  ]);

  const appliedIds = new Set(myApplications.map((a) => a.scholarshipId));
  const now = new Date();

  const available = scholarships.filter((s) => !s.deadline || s.deadline >= now);
  const closed    = scholarships.filter((s) => s.deadline && s.deadline < now);

  const visibleScholarships = (() => {
    if (filter === "متاحة")     return available;
    if (filter === "منتهية")    return closed;
    if (filter === "تقديماتي") return scholarships.filter((s) => appliedIds.has(s.id));
    return scholarships;
  })();

  return (
    <div className="space-y-5">

      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Link href="/student" className="hover:text-cyan-600 transition-colors">لوحة الطالب</Link>
        <span>/</span>
        <span className="text-gray-800 font-medium">المنح الدراسية</span>
      </div>

      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">المنح الدراسية</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            {available.length} متاحة — تقدّمت لـ {myApplications.length}
          </p>
        </div>
        <Link href="/scholarships" className="text-xs font-medium text-cyan-600 hover:underline bg-cyan-50 px-3 py-1.5 rounded-lg border border-cyan-200">
          استعراض كل المنح ←
        </Link>
      </div>

      {/* My applications summary */}
      {myApplications.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-800 text-sm">تقديماتي</h2>
          </div>
          <ul className="divide-y divide-gray-50">
            {myApplications.map((app) => {
              const cfg = statusConfig[app.status] ?? statusConfig.PENDING;
              return (
                <li key={app.scholarshipId} className="px-5 py-4 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="font-medium text-gray-800 text-sm">{app.scholarship.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      تقدّمت {app.createdAt.toLocaleDateString("ar-SA", { day: "numeric", month: "long", year: "numeric" })}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    {app.scholarship.amount != null && (
                      <span className="text-xs text-gray-500 hidden sm:block">
                        {app.scholarship.amount.toLocaleString("ar-SA")} ر.س
                      </span>
                    )}
                    <span
                      className="text-xs font-semibold px-2.5 py-0.5 rounded-full"
                      style={{ background: cfg.bg, color: cfg.color }}
                    >
                      {cfg.label}
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {filters.map((f) => {
          const isActive = (!filter && f === "الكل") || filter === f;
          const href = f === "الكل" ? "/student/scholarships" : `/student/scholarships?filter=${f}`;
          return (
            <Link
              key={f}
              href={href}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                isActive ? "bg-cyan-600 text-white shadow-sm" : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
              }`}
            >
              {f}
            </Link>
          );
        })}
      </div>

      {/* Scholarships list */}
      {visibleScholarships.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 py-12 text-center">
          <p className="text-2xl mb-2">🔍</p>
          <p className="text-gray-400 text-sm">لا توجد منح في هذا التصنيف</p>
        </div>
      ) : (
        <div className="space-y-3">
          {visibleScholarships.map((s) => {
            const isExpired = s.deadline && s.deadline < now;
            const applied   = appliedIds.has(s.id);
            const daysLeft  = s.deadline
              ? Math.max(0, Math.ceil((s.deadline.getTime() - now.getTime()) / 86400000))
              : null;

            return (
              <div
                key={s.id}
                className={`bg-white rounded-xl border p-5 hover:shadow-sm transition-shadow ${
                  isExpired ? "border-gray-100 opacity-70" : "border-gray-200"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-gray-800">{s.title}</h3>
                      {s.amount != null && (
                        <span className="text-xs font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full">
                          {s.amount.toLocaleString("ar-SA")} ر.س
                        </span>
                      )}
                      {isExpired && (
                        <span className="text-xs font-medium text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">منتهية</span>
                      )}
                    </div>
                    {s.description && (
                      <p className="text-sm text-gray-500 mt-1.5 line-clamp-2 leading-relaxed">{s.description}</p>
                    )}
                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-400 flex-wrap">
                      <span>👥 {s._count.applications} متقدّم</span>
                      {s.deadline && !isExpired && daysLeft !== null && (
                        <span className={`font-medium ${daysLeft <= 7 ? "text-red-500" : "text-gray-400"}`}>
                          ⏳ {daysLeft} يوم متبقٍ
                        </span>
                      )}
                      {s.deadline && isExpired && (
                        <span>انتهى: {s.deadline.toLocaleDateString("ar-SA")}</span>
                      )}
                    </div>
                  </div>
                  {!isExpired && (
                    <div className="shrink-0">
                      <ApplyButton scholarshipId={s.id} applied={applied} />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
