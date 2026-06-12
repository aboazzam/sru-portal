import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/dal";
import { prisma } from "@/lib/db";

const trainingStatusLabel: Record<string, string> = {
  UPCOMING:  "قادم",
  ONGOING:   "جارٍ",
  COMPLETED: "منتهٍ",
  CANCELLED: "ملغى",
};
const trainingStatusStyle: Record<string, string> = {
  UPCOMING:  "bg-blue-100 text-blue-700",
  ONGOING:   "bg-green-100 text-green-700",
  COMPLETED: "bg-gray-100 text-gray-500",
  CANCELLED: "bg-red-100 text-red-500",
};

export default async function FacultyOverview() {
  const user = await getCurrentUser();
  if (!user || user.role !== "FACULTY") redirect("/dashboard");

  const [
    totalStudents,
    studentsThisMonth,
    totalTrainings,
    activeTrainings,
    totalScholarships,
    pendingScholarships,
    myTrainings,
    recentStudents,
  ] = await Promise.all([
    prisma.user.count({ where: { role: "STUDENT" } }),
    prisma.user.count({
      where: {
        role: "STUDENT",
        createdAt: { gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) },
      },
    }),
    prisma.training.count(),
    prisma.training.count({ where: { status: { in: ["UPCOMING", "ONGOING"] } } }),
    prisma.scholarship.count(),
    prisma.scholarshipApplication.count({ where: { status: "PENDING" } }),
    prisma.training.findMany({
      where: { instructor: user.name },
      orderBy: [{ status: "asc" }, { startDate: "asc" }],
      select: {
        id: true,
        title: true,
        category: true,
        status: true,
        startDate: true,
        capacity: true,
        _count: { select: { enrollments: true } },
      },
    }),
    prisma.user.findMany({
      where: { role: "STUDENT" },
      orderBy: { createdAt: "desc" },
      take: 6,
      include: { college: { select: { name: true } } },
    }),
  ]);

  const stats = [
    { label: "إجمالي الطلاب",    value: totalStudents,       sub: `+${studentsThisMonth} هذا الشهر`, icon: "👥", color: "border-blue-200   bg-blue-50   text-blue-700"   },
    { label: "برامج تدريبية",    value: totalTrainings,      sub: `${activeTrainings} نشط`,          icon: "🏢", color: "border-purple-200 bg-purple-50 text-purple-700" },
    { label: "برامجي",           value: myTrainings.length,  sub: "أنا المدرّب",                    icon: "⭐", color: "border-amber-200  bg-amber-50  text-amber-700"  },
    { label: "فرص المنح",        value: totalScholarships,   sub: `${pendingScholarships} معلّق`,   icon: "🎓", color: "border-green-200  bg-green-50  text-green-700"  },
  ];

  return (
    <div className="space-y-6">

      {/* Hero */}
      <div
        className="rounded-2xl p-6 text-white"
        style={{ background: "linear-gradient(135deg, #92400e 0%, #b45309 60%, #d97706 100%)" }}
      >
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <p className="text-amber-200 text-sm mb-1">بوابة هيئة التدريس</p>
            <h1 className="text-2xl font-bold">مرحباً، {user.name.split(" ")[0]} 👋</h1>
            <p className="text-amber-100 text-sm mt-1">
              {myTrainings.length > 0
                ? `أنت مدرّب في ${myTrainings.length} برنامج تدريبي`
                : "لم يتم تعيينك مدرباً في أي برنامج بعد"}
            </p>
          </div>
          <div className="text-end">
            <div className="w-14 h-14 rounded-full bg-white/20 border-2 border-white/40 flex items-center justify-center text-2xl font-bold">
              {user.name.charAt(0)}
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((s) => (
          <div key={s.label} className={`rounded-xl border p-4 ${s.color}`}>
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-2xl font-bold tabular-nums">{s.value}</p>
                <p className="text-xs font-medium mt-0.5">{s.label}</p>
                <p className="text-[10px] opacity-70 mt-0.5">{s.sub}</p>
              </div>
              <span className="text-xl">{s.icon}</span>
            </div>
          </div>
        ))}
      </div>

      {/* My trainings + recent students */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* My training programs */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span>⭐</span>
              <h2 className="font-semibold text-gray-800 text-sm">برامجي التدريبية</h2>
            </div>
            <Link href="/faculty/trainings" className="text-xs text-amber-600 hover:underline">عرض الكل</Link>
          </div>
          {myTrainings.length === 0 ? (
            <div className="px-5 py-10 text-center">
              <p className="text-3xl mb-2">📋</p>
              <p className="text-gray-400 text-sm">لم يتم تعيينك مدرباً في أي برنامج</p>
              <Link href="/faculty/trainings" className="mt-2 inline-block text-xs text-amber-600 hover:underline">استعرض جميع البرامج</Link>
            </div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {myTrainings.slice(0, 5).map((t) => {
                const pct = t.capacity && t.capacity > 0
                  ? Math.min(100, Math.round((t._count.enrollments / t.capacity) * 100))
                  : null;
                return (
                  <li key={t.id} className="px-5 py-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate">{t.title}</p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {t.category ?? "—"}
                          {t.startDate && ` · ${t.startDate.toLocaleDateString("ar-SA")}`}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-xs text-gray-400">{t._count.enrollments} مسجّل</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${trainingStatusStyle[t.status]}`}>
                          {trainingStatusLabel[t.status]}
                        </span>
                      </div>
                    </div>
                    {pct !== null && (
                      <div className="mt-2">
                        <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${pct >= 90 ? "bg-red-400" : pct >= 70 ? "bg-amber-400" : "bg-green-400"}`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Recent students */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span>🆕</span>
              <h2 className="font-semibold text-gray-800 text-sm">أحدث الطلاب المسجّلين</h2>
            </div>
            <Link href="/faculty/students" className="text-xs text-amber-600 hover:underline">عرض الكل</Link>
          </div>
          <ul className="divide-y divide-gray-100">
            {recentStudents.map((s) => (
              <li key={s.id} className="px-5 py-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold shrink-0">
                    {s.name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{s.name}</p>
                    <p className="text-xs text-gray-400 truncate">{s.college?.name ?? s.email}</p>
                  </div>
                </div>
                <span className="text-xs text-gray-400 shrink-0">{s.createdAt.toLocaleDateString("ar-SA")}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Quick links */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="font-semibold text-gray-800 text-sm mb-4">وصول سريع</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[
            { href: "/faculty/trainings",   label: "البرامج التدريبية", icon: "🏢", color: "bg-purple-50 text-purple-700 border-purple-200" },
            { href: "/faculty/scholarships", label: "المنح الدراسية",   icon: "🎓", color: "bg-green-50  text-green-700  border-green-200"  },
            { href: "/faculty/students",    label: "قائمة الطلاب",     icon: "👥", color: "bg-blue-50   text-blue-700   border-blue-200"   },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl border font-medium text-sm transition-all hover:shadow-sm hover:-translate-y-0.5 ${link.color}`}
            >
              <span className="text-lg">{link.icon}</span>
              {link.label}
            </Link>
          ))}
        </div>
      </div>

    </div>
  );
}
