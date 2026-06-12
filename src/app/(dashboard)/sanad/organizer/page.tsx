import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/dal";
import { prisma } from "@/lib/db";

const ALLOWED = ["ORGANIZER", "SUBADMIN", "ADMIN"];

export default async function OrganizerPage() {
  const user = await getCurrentUser();
  if (!user || !ALLOWED.includes(user.role)) redirect("/sanad");

  const [activities, recentApps, totalVolunteers, pendingApps] = await Promise.all([
    prisma.studentActivity.findMany({
      orderBy: { date: "asc" },
      select: {
        id: true, title: true, date: true,
        _count: { select: { applications: true } },
      },
    }),
    prisma.activityApplication.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true, status: true, createdAt: true,
        user: { select: { name: true } },
        activity: { select: { title: true } },
      },
    }),
    prisma.volunteerApplication.count(),
    prisma.activityApplication.count({ where: { status: "PENDING" } }),
  ]);

  const stats = [
    { label: "الأنشطة المسجّلة",   value: activities.length,                                   color: "#3D1F6E" },
    { label: "إجمالي التسجيلات",   value: activities.reduce((s, a) => s + a._count.applications, 0), color: "#00B4C8" },
    { label: "طلبات التطوع",       value: totalVolunteers,                                     color: "#6B46C1" },
    { label: "طلبات قيد المراجعة", value: pendingApps,                                          color: "#d97706" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Link href="/sanad" className="hover:text-[#3D1F6E] transition-colors">سند</Link>
        <span>/</span>
        <span className="text-[#3D1F6E] font-medium">لوحة المنظم</span>
      </div>

      {/* Welcome */}
      <div className="bg-gradient-to-l from-[#3D1F6E] to-[#6B46C1] rounded-2xl p-6 text-white">
        <p className="text-purple-200 text-sm">لوحة المنظم</p>
        <h1 className="text-xl font-bold mt-1">مرحباً، {user.name}</h1>
        <p className="text-purple-200 text-sm mt-1">تمكّن من إدارة الفعاليات والأنشطة الطلابية</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-purple-100 p-4 text-center">
            <p className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</p>
            <p className="text-xs text-gray-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Activities table */}
        <div className="bg-white rounded-2xl shadow-sm border border-purple-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-purple-50 flex items-center justify-between">
            <h2 className="font-bold text-[#3D1F6E]">الأنشطة الطلابية</h2>
            <span className="text-xs text-gray-400">{activities.length} نشاط</span>
          </div>

          {activities.length === 0 ? (
            <div className="py-10 text-center">
              <p className="text-gray-400 text-sm">لا توجد أنشطة مسجّلة</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-[#F5F3FF]">
                  <tr>
                    <th className="px-4 py-3 text-start text-xs font-bold text-[#3D1F6E]">النشاط</th>
                    <th className="px-4 py-3 text-start text-xs font-bold text-[#3D1F6E]">التاريخ</th>
                    <th className="px-4 py-3 text-start text-xs font-bold text-[#3D1F6E]">المسجّلون</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {activities.map((act) => (
                    <tr key={act.id} className="hover:bg-[#F5F3FF]/50">
                      <td className="px-4 py-3 font-medium text-[#1F2937] max-w-[160px] truncate">{act.title}</td>
                      <td className="px-4 py-3 text-gray-400 text-xs">
                        {act.date ? act.date.toLocaleDateString("ar-SA") : "—"}
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-[#3D1F6E] font-bold">{act._count.applications}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Recent applications */}
        <div className="bg-white rounded-2xl shadow-sm border border-purple-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-purple-50">
            <h2 className="font-bold text-[#3D1F6E]">آخر التسجيلات</h2>
          </div>
          {recentApps.length === 0 ? (
            <div className="py-10 text-center">
              <p className="text-gray-400 text-sm">لا توجد تسجيلات بعد</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {recentApps.map((app) => (
                <div key={app.id} className="px-5 py-3 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#F5F3FF] flex items-center justify-center text-sm font-bold text-[#3D1F6E] shrink-0">
                    {app.user.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#1F2937] truncate">{app.user.name}</p>
                    <p className="text-xs text-gray-400 truncate">{app.activity.title}</p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${
                    app.status === "APPROVED" ? "bg-green-100 text-green-700"
                    : app.status === "REJECTED" ? "bg-red-100 text-red-600"
                    : "bg-amber-100 text-amber-600"
                  }`}>
                    {app.status === "PENDING" ? "قيد المراجعة" : app.status === "APPROVED" ? "مقبول" : "مرفوض"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
