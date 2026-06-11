import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/dal";
import { organizerEvents } from "@/lib/sanad-mock";

const ALLOWED = ["ORGANIZER", "SUBADMIN", "ADMIN"];

export default async function OrganizerPage() {
  const user = await getCurrentUser();
  if (!user || !ALLOWED.includes(user.role)) redirect("/sanad");

  const upcoming = organizerEvents.filter((e) => e.status === "قادم");
  const completed = organizerEvents.filter((e) => e.status === "مكتمل");

  const stats = [
    { label: "الفعاليات القادمة",    value: upcoming.length,                     color: "#3D1F6E" },
    { label: "إجمالي المسجّلين",    value: upcoming.reduce((s, e) => s + e.registered, 0), color: "#00B4C8" },
    { label: "الفعاليات المكتملة",  value: completed.length,                     color: "#6B46C1" },
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
      <div className="grid grid-cols-3 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-purple-100 p-4 text-center">
            <p className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</p>
            <p className="text-xs text-gray-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Events table */}
      <div className="bg-white rounded-2xl shadow-sm border border-purple-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-purple-50 flex items-center justify-between">
          <h2 className="font-bold text-[#3D1F6E]">الفعاليات</h2>
          <button className="px-4 py-1.5 bg-[#00B4C8] text-white rounded-lg text-xs font-semibold hover:bg-[#0097AA] transition-colors">
            + إضافة فعالية
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[#F5F3FF]">
              <tr>
                <th className="px-4 py-3 text-start text-xs font-bold text-[#3D1F6E]">الفعالية</th>
                <th className="px-4 py-3 text-start text-xs font-bold text-[#3D1F6E]">التاريخ</th>
                <th className="px-4 py-3 text-start text-xs font-bold text-[#3D1F6E]">المسجّلون</th>
                <th className="px-4 py-3 text-start text-xs font-bold text-[#3D1F6E]">الحالة</th>
                <th className="px-4 py-3 text-start text-xs font-bold text-[#3D1F6E]">إجراء</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {organizerEvents.map((ev) => {
                const pct = Math.round((ev.registered / ev.capacity) * 100);
                return (
                  <tr key={ev.id} className="hover:bg-[#F5F3FF]/50">
                    <td className="px-4 py-3 font-medium text-[#1F2937]">{ev.title}</td>
                    <td className="px-4 py-3 text-gray-400 text-xs">
                      {new Date(ev.date).toLocaleDateString("ar-SA")}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-100 rounded-full h-1.5 min-w-[60px]">
                          <div
                            className="h-1.5 rounded-full"
                            style={{ width: `${pct}%`, background: pct >= 90 ? "#ef4444" : "#3D1F6E" }}
                          />
                        </div>
                        <span className="text-xs text-gray-500 shrink-0">{ev.registered}/{ev.capacity}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        ev.status === "قادم" ? "bg-[#E0F7FA] text-[#0097AA]" : "bg-green-100 text-green-700"
                      }`}>
                        {ev.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button className="text-xs text-[#3D1F6E] hover:underline font-medium">تعديل</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
