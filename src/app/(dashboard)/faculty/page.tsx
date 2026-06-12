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
    totalTrainings,
    activeTrainings,
    totalScholarships,
    myTrainings,
    recentStudents,
  ] = await Promise.all([
    prisma.user.count({ where: { role: "STUDENT" } }),
    prisma.training.count(),
    prisma.training.count({ where: { status: { in: ["UPCOMING", "ONGOING"] } } }),
    prisma.scholarship.count(),
    prisma.training.findMany({
      where: { instructor: user.name },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        category: true,
        status: true,
        startDate: true,
        _count: { select: { enrollments: true } },
      },
    }),
    prisma.user.findMany({
      where: { role: "STUDENT" },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: { id: true, name: true, email: true, createdAt: true },
    }),
  ]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">مرحباً، {user.name}</h1>
          <p className="text-gray-500 text-sm mt-0.5">لوحة تحكم عضو هيئة التدريس</p>
        </div>
        <div className="shrink-0 w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 text-xl font-bold">
          {user.name.charAt(0)}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "إجمالي الطلاب",      value: totalStudents,    color: "border-blue-200   bg-blue-50   text-blue-700"   },
          { label: "برامج تدريبية",       value: totalTrainings,   color: "border-purple-200 bg-purple-50 text-purple-700" },
          { label: "برامج نشطة",          value: activeTrainings,  color: "border-green-200  bg-green-50  text-green-700"  },
          { label: "فرص المنح",           value: totalScholarships, color: "border-amber-200  bg-amber-50  text-amber-700"  },
        ].map((s) => (
          <div key={s.label} className={`rounded-xl border p-4 ${s.color}`}>
            <p className="text-2xl font-bold">{s.value}</p>
            <p className="text-xs opacity-80 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* My training programs */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-800">برامجي التدريبية</h2>
            <Link href="/faculty/trainings" className="text-xs text-amber-600 hover:underline">
              عرض الكل
            </Link>
          </div>
          {myTrainings.length === 0 ? (
            <div className="px-5 py-8 text-center">
              <p className="text-gray-400 text-sm">لم يتم تعيينك مدرباً في أي برنامج بعد</p>
              <Link
                href="/faculty/trainings"
                className="mt-3 inline-block text-xs text-amber-600 hover:underline"
              >
                استعرض جميع البرامج التدريبية
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {myTrainings.slice(0, 4).map((t) => (
                <li key={t.id} className="px-5 py-3 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{t.title}</p>
                    <p className="text-xs text-gray-400">
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
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Recent students */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-800">أحدث الطلاب</h2>
            <Link href="/faculty/students" className="text-xs text-amber-600 hover:underline">
              عرض الكل
            </Link>
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
                    <p className="text-xs text-gray-400 truncate">{s.email}</p>
                  </div>
                </div>
                <span className="text-xs text-gray-400 shrink-0">
                  {s.createdAt.toLocaleDateString("ar-SA")}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Quick links */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="font-semibold text-gray-800 mb-4">وصول سريع</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[
            { href: "/faculty/trainings", label: "البرامج التدريبية", icon: "◷", color: "bg-purple-50 text-purple-700 border-purple-200" },
            { href: "/faculty/students",  label: "قائمة الطلاب",      icon: "◉", color: "bg-blue-50   text-blue-700   border-blue-200"   },
            { href: "/sanad",             label: "خدمات سند",          icon: "◎", color: "bg-amber-50  text-amber-700  border-amber-200"  },
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
