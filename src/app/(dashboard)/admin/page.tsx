import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/dal";
import { prisma } from "@/lib/db";

export default async function AdminOverview() {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") redirect("/dashboard");

  const [
    totalUsers, students, faculty, admins,
    pendingScholarships, totalScholarships,
    pendingTraining, totalTraining,
    pendingServices, totalServices,
    pendingVolunteers, totalVolunteers,
    pendingActivities, totalActivities,
    pendingClubs, totalClubs,
    pendingCouncil,
    recentUsers,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { role: "STUDENT" } }),
    prisma.user.count({ where: { role: "FACULTY" } }),
    prisma.user.count({ where: { role: "ADMIN" } }),

    prisma.scholarshipApplication.count({ where: { status: "PENDING" } }),
    prisma.scholarshipApplication.count(),

    prisma.trainingEnrollment.count({ where: { status: "PENDING" } }),
    prisma.trainingEnrollment.count(),

    prisma.serviceApplications.count({ where: { status: "PENDING" } }),
    prisma.serviceApplications.count(),

    prisma.volunteerApplication.count({ where: { status: "PENDING" } }),
    prisma.volunteerApplication.count(),

    prisma.activityApplication.count({ where: { status: "PENDING" } }),
    prisma.activityApplication.count(),

    prisma.clubMembership.count({ where: { status: "PENDING" } }),
    prisma.clubMembership.count(),

    prisma.councilApplication.count({ where: { status: "PENDING" } }),

    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      take: 6,
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    }),
  ]);

  const totalPending = pendingScholarships + pendingTraining + pendingServices + pendingVolunteers + pendingActivities + pendingClubs + pendingCouncil;

  const pendingItems = [
    { label: "طلبات المنح",    count: pendingScholarships, href: "/admin/scholarships?filter=PENDING", icon: "🎓", color: "#875E9E" },
    { label: "تسجيلات التدريب", count: pendingTraining,     href: "/admin/trainings?filter=PENDING",    icon: "🏢", color: "#4A8FA0" },
    { label: "طلبات الخدمات",  count: pendingServices,     href: "/admin/services?filter=PENDING",     icon: "🛎️", color: "#059669" },
    { label: "طلبات التطوع",   count: pendingVolunteers,   href: "/admin/volunteers?filter=PENDING",   icon: "🌱", color: "#EA580C" },
    { label: "طلبات الأنشطة",  count: pendingActivities,   href: "/admin/activities?filter=PENDING",   icon: "🎯", color: "#2563EB" },
    { label: "طلبات الأندية",  count: pendingClubs + pendingCouncil, href: "/admin/clubs?tab=memberships", icon: "⚽", color: "#DC2626" },
  ].filter((item) => item.count > 0);

  const roleLabel: Record<string, string> = { STUDENT: "طالب", FACULTY: "هيئة التدريس", ADMIN: "مدير", ORGANIZER: "منظم", SUBADMIN: "مشرف" };
  const roleBadge: Record<string, string> = {
    STUDENT:   "bg-blue-100 text-blue-700",
    FACULTY:   "bg-green-100 text-green-700",
    ADMIN:     "bg-purple-100 text-purple-700",
    ORGANIZER: "bg-orange-100 text-orange-700",
    SUBADMIN:  "bg-gray-100 text-gray-700",
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">نظرة عامة</h1>
          <p className="text-gray-500 text-sm mt-1">
            مرحباً {user.name.split(" ")[0]} — إحصائيات النظام في الوقت الفعلي
          </p>
        </div>
        {totalPending > 0 && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-50 border border-orange-200">
            <span className="text-orange-500 text-lg">⚠️</span>
            <div>
              <p className="text-orange-700 font-bold text-sm">{totalPending} طلب يحتاج مراجعة</p>
              <p className="text-orange-500 text-xs">تحقق من قسم الطلبات المعلّقة</p>
            </div>
          </div>
        )}
      </div>

      {/* Pending items alert */}
      {pendingItems.length > 0 && (
        <div className="bg-white rounded-xl border border-orange-200 overflow-hidden">
          <div className="px-5 py-3 bg-orange-50 border-b border-orange-100 flex items-center gap-2">
            <span>⏳</span>
            <h2 className="font-semibold text-orange-700 text-sm">الطلبات المعلّقة — تحتاج إجراء</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 divide-x divide-x-reverse divide-gray-100">
            {pendingItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="flex flex-col items-center gap-1 px-4 py-4 hover:bg-gray-50 transition-colors text-center"
              >
                <span className="text-2xl">{item.icon}</span>
                <p className="text-2xl font-bold" style={{ color: item.color }}>{item.count}</p>
                <p className="text-[10px] text-gray-500 leading-tight">{item.label}</p>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Users + modules stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">

        {/* Users */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xl">👥</span>
            <h2 className="font-semibold text-gray-700 text-sm">المستخدمون</h2>
          </div>
          <div className="space-y-2">
            {[
              { label: "إجمالي المستخدمين", value: totalUsers, color: "text-gray-800" },
              { label: "الطلاب",            value: students,   color: "text-blue-600" },
              { label: "هيئة التدريس",      value: faculty,    color: "text-green-600" },
              { label: "المدراء",           value: admins,     color: "text-purple-600" },
            ].map((s) => (
              <div key={s.label} className="flex items-center justify-between">
                <p className="text-xs text-gray-500">{s.label}</p>
                <p className={`font-bold text-sm tabular-nums ${s.color}`}>{s.value}</p>
              </div>
            ))}
          </div>
          <Link href="/admin/users" className="block mt-4 text-center text-xs font-semibold text-green-600 hover:underline">إدارة المستخدمين ←</Link>
        </div>

        {/* Academic */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xl">📚</span>
            <h2 className="font-semibold text-gray-700 text-sm">الأكاديمي</h2>
          </div>
          <div className="space-y-2">
            {[
              { label: "طلبات المنح (معلّق)",       value: pendingScholarships, color: pendingScholarships > 0 ? "text-orange-600" : "text-gray-800" },
              { label: "طلبات المنح (إجمالي)",      value: totalScholarships,   color: "text-gray-800" },
              { label: "تسجيلات التدريب (معلّق)",   value: pendingTraining,     color: pendingTraining > 0 ? "text-orange-600" : "text-gray-800" },
              { label: "تسجيلات التدريب (إجمالي)",  value: totalTraining,       color: "text-gray-800" },
            ].map((s) => (
              <div key={s.label} className="flex items-center justify-between">
                <p className="text-xs text-gray-500">{s.label}</p>
                <p className={`font-bold text-sm tabular-nums ${s.color}`}>{s.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Student services */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xl">🎓</span>
            <h2 className="font-semibold text-gray-700 text-sm">خدمات الطلاب</h2>
          </div>
          <div className="space-y-2">
            {[
              { label: "طلبات الخدمات (معلّق)",  value: pendingServices,   color: pendingServices > 0 ? "text-orange-600" : "text-gray-800" },
              { label: "طلبات الخدمات (إجمالي)", value: totalServices,     color: "text-gray-800" },
              { label: "طلبات التطوع (معلّق)",   value: pendingVolunteers, color: pendingVolunteers > 0 ? "text-orange-600" : "text-gray-800" },
              { label: "طلبات التطوع (إجمالي)",  value: totalVolunteers,   color: "text-gray-800" },
            ].map((s) => (
              <div key={s.label} className="flex items-center justify-between">
                <p className="text-xs text-gray-500">{s.label}</p>
                <p className={`font-bold text-sm tabular-nums ${s.color}`}>{s.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Activities & clubs */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xl">🏆</span>
            <h2 className="font-semibold text-gray-700 text-sm">الأنشطة والأندية</h2>
          </div>
          <div className="space-y-2">
            {[
              { label: "طلبات الأنشطة (معلّق)",  value: pendingActivities, color: pendingActivities > 0 ? "text-orange-600" : "text-gray-800" },
              { label: "طلبات الأنشطة (إجمالي)", value: totalActivities,   color: "text-gray-800" },
              { label: "طلبات الأندية (معلّق)",  value: pendingClubs + pendingCouncil, color: (pendingClubs + pendingCouncil) > 0 ? "text-orange-600" : "text-gray-800" },
              { label: "طلبات الأندية (إجمالي)", value: totalClubs,        color: "text-gray-800" },
            ].map((s) => (
              <div key={s.label} className="flex items-center justify-between">
                <p className="text-xs text-gray-500">{s.label}</p>
                <p className={`font-bold text-sm tabular-nums ${s.color}`}>{s.value}</p>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Recent users */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span>🆕</span>
            <h2 className="font-semibold text-gray-800 text-sm">آخر المستخدمين المسجّلين</h2>
          </div>
          <Link href="/admin/users" className="text-xs text-green-600 hover:underline">عرض الكل</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-400 text-xs uppercase">
              <tr>
                <th className="px-5 py-3 text-start">الاسم</th>
                <th className="px-5 py-3 text-start">البريد الإلكتروني</th>
                <th className="px-5 py-3 text-start">الدور</th>
                <th className="px-5 py-3 text-start">تاريخ التسجيل</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentUsers.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3 font-medium text-gray-900">{u.name}</td>
                  <td className="px-5 py-3 text-gray-500 text-xs">{u.email}</td>
                  <td className="px-5 py-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${roleBadge[u.role] ?? "bg-gray-100 text-gray-600"}`}>
                      {roleLabel[u.role] ?? u.role}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-gray-400 text-xs">
                    {u.createdAt.toLocaleDateString("ar-SA")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
