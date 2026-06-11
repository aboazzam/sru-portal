import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/dal";
import { subadminStats, organizersList, requestsByMonth } from "@/lib/sanad-mock";

const ALLOWED = ["SUBADMIN", "ADMIN"];

export default async function SubadminPage() {
  const user = await getCurrentUser();
  if (!user || !ALLOWED.includes(user.role)) redirect("/sanad");

  const maxCount = Math.max(...requestsByMonth.map((m) => m.count));

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Link href="/sanad" className="hover:text-[#3D1F6E] transition-colors">سند</Link>
        <span>/</span>
        <span className="text-[#3D1F6E] font-medium">لوحة الإدارة</span>
      </div>

      {/* Welcome */}
      <div className="bg-gradient-to-l from-[#2C1650] to-[#3D1F6E] rounded-2xl p-6 text-white">
        <p className="text-purple-300 text-sm">لوحة إدارة سند</p>
        <h1 className="text-xl font-bold mt-1">مرحباً، {user.name}</h1>
        <p className="text-purple-300 text-sm mt-1">نظرة عامة على الطلبات والمنظمين وأداء المنصة</p>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "إجمالي الطلبات",     value: subadminStats.totalRequests,       color: "#3D1F6E" },
          { label: "قيد المراجعة",       value: subadminStats.pendingRequests,      color: "#d97706" },
          { label: "مكتملة هذا الشهر",   value: subadminStats.completedThisMonth,  color: "#16a34a" },
          { label: "المنظمون النشطون",    value: subadminStats.activeOrganizers,    color: "#00B4C8" },
        ].map((kpi) => (
          <div key={kpi.label} className="bg-white rounded-xl border border-purple-100 p-4 text-center">
            <p className="text-2xl font-bold" style={{ color: kpi.color }}>{kpi.value}</p>
            <p className="text-xs text-gray-500 mt-1">{kpi.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly requests chart */}
        <div className="bg-white rounded-2xl shadow-sm border border-purple-100 p-6">
          <h2 className="font-bold text-[#3D1F6E] mb-5">الطلبات الشهرية</h2>
          <div className="flex items-end gap-2 h-36">
            {requestsByMonth.map((m) => {
              const height = Math.round((m.count / maxCount) * 100);
              return (
                <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-[10px] text-gray-500 font-medium">{m.count}</span>
                  <div
                    className="w-full rounded-t-md transition-all"
                    style={{ height: `${height}%`, background: "linear-gradient(180deg,#3D1F6E,#6B46C1)" }}
                  />
                  <span className="text-[10px] text-gray-400 text-center leading-tight">{m.month}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Organizers management */}
        <div className="bg-white rounded-2xl shadow-sm border border-purple-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-purple-50 flex items-center justify-between">
            <h2 className="font-bold text-[#3D1F6E]">المنظمون</h2>
            <button className="px-3 py-1.5 bg-[#00B4C8] text-white rounded-lg text-xs font-semibold hover:bg-[#0097AA]">
              + إضافة منظم
            </button>
          </div>
          <div className="divide-y divide-gray-50">
            {organizersList.map((org) => (
              <div key={org.id} className="px-5 py-3 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#F5F3FF] flex items-center justify-center text-sm font-bold text-[#3D1F6E] shrink-0">
                  {org.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#1F2937] truncate">{org.name}</p>
                  <p className="text-xs text-gray-400">{org.eventsManaged} فعاليات</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    org.status === "نشط" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-600"
                  }`}>
                    {org.status}
                  </span>
                  <button className="text-xs text-gray-400 hover:text-[#3D1F6E] transition-colors">
                    ⚙️
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
