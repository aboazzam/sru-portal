"use client";
import Link from "next/link";
import {
  facultyScheduleToday,
  facultyNotifications,
  facultyStats,
  facultyPendingRequests,
  announcements,
} from "@/lib/mock/hala";

const statusConfig = {
  ended:    { label: "انتهت",       bg: "#EEF2F3", border: "#C8D4D8", text: "#6B838C" },
  current:  { label: "جارية الآن", bg: "#E8F6F8", border: "#6CAEBD", text: "#4A8FA0" },
  upcoming: { label: "قادمة",       bg: "#FFFFFF", border: "#E5E7EB", text: "#6B7280" },
};

const notifConfig = {
  urgent:  { icon: "🔴", border: "#DC2626", text: "#DC2626" },
  warning: { icon: "🟡", border: "#D97706", text: "#D97706" },
  info:    { icon: "ℹ️",  border: "#6CAEBD", text: "#4A8FA0" },
  success: { icon: "✅", border: "#16A34A", text: "#16A34A" },
};

const reqStatusConfig = {
  pending:     { label: "معلق",         color: "#D97706", bg: "#FEF3C7" },
  in_progress: { label: "جاري",         color: "#2563EB", bg: "#DBEAFE" },
  completed:   { label: "مكتمل",        color: "#16A34A", bg: "#DCFCE7" },
};

const quickLinks = [
  { label: "رفع الدرجات",  icon: "📊", href: "/faculty-services", color: "#6CAEBD" },
  { label: "الحضور",       icon: "👥", href: "/faculty-services", color: "#875E9E" },
  { label: "مقرراتي",     icon: "📚", href: "/faculty-services", color: "#8FA4AB" },
  { label: "الطلبات",      icon: "📝", href: "/faculty-services", color: "#6CAEBD" },
  { label: "جدولي",        icon: "📅", href: "/faculty-services", color: "#875E9E" },
  { label: "الإرشاد",      icon: "🤝", href: "/faculty-services", color: "#8FA4AB" },
  { label: "التقارير",     icon: "📋", href: "/faculty-services", color: "#6CAEBD" },
  { label: "إعداداتي",    icon: "⚙️", href: "/faculty-services", color: "#875E9E" },
];

export default function FacultyView({ name }: { name: string }) {
  const today = new Date();
  const hijri = today.toLocaleDateString("ar-SA-u-ca-islamic", { day: "numeric", month: "long", year: "numeric" });
  const miladi = today.toLocaleDateString("ar-SA", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  return (
    <div className="space-y-6">
      {/* Welcome card */}
      <div
        className="rounded-2xl p-6 text-white shadow-sm"
        style={{ background: "linear-gradient(135deg, #875E9E 0%, #6A4A7E 100%)" }}
      >
        <p className="text-white/80 text-sm">{miladi}</p>
        <h1 className="text-2xl font-bold mt-1">أهلاً، {name} 👋</h1>
        <p className="text-white/70 text-xs mt-0.5">{hijri}</p>
        <div className="mt-4 flex items-center gap-6 flex-wrap">
          <div>
            <p className="text-white/70 text-xs">الرتبة الأكاديمية</p>
            <p className="font-bold text-sm">أستاذ مشارك</p>
          </div>
          <div>
            <p className="text-white/70 text-xs">الكلية</p>
            <p className="font-bold text-sm">الحاسب والمعلومات</p>
          </div>
          <span
            className="text-xs font-bold px-3 py-1 rounded-full"
            style={{ background: "#8FA4AB", color: "#fff" }}
          >
            3 مقررات هذا الفصل
          </span>
        </div>
      </div>

      {/* Faculty stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {facultyStats.map((s) => (
          <div
            key={s.label}
            className="bg-white rounded-xl border border-[#E8EDEF] p-4 text-center hover:shadow-sm transition-shadow"
          >
            <div className="text-2xl mb-1">{s.icon}</div>
            <p className="text-xl font-bold" style={{ color: s.color }}>{s.value}</p>
            <p className="text-xs text-[#8FA4AB] mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Today's lectures */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#E8EDEF] overflow-hidden">
        <div className="px-5 py-4 border-b border-[#E8EDEF] flex items-center gap-2">
          <span className="text-lg">📅</span>
          <h2 className="font-bold text-[#1A2A30] text-sm">محاضرات اليوم</h2>
        </div>
        <div className="divide-y divide-[#F4F7F8]">
          {facultyScheduleToday.map((c) => {
            const cfg = statusConfig[c.status];
            return (
              <div
                key={c.code}
                className="px-5 py-4 transition-colors"
                style={{ background: cfg.bg, borderRightWidth: "3px", borderRightColor: cfg.border, borderRightStyle: "solid" }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[#6CAEBD] text-xs font-bold">{c.code}</span>
                      <span className="font-semibold text-[#1A2A30] text-sm">{c.name}</span>
                      {c.status === "current" && (
                        <span
                          className="text-xs font-bold px-2 py-0.5 rounded-full animate-pulse-dot"
                          style={{ background: "#E8F6F8", color: "#4A8FA0" }}
                        >
                          🟢 جارية الآن
                        </span>
                      )}
                    </div>
                    <div className="flex gap-4 mt-1.5 text-xs text-[#8FA4AB] flex-wrap">
                      <span>⏰ {c.time}</span>
                      <span>📍 {c.room}</span>
                      <span>👥 {c.students} طالب</span>
                    </div>
                    {/* Attendance bar */}
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-xs text-[#8FA4AB]">الحضور</span>
                      <div className="flex-1 bg-[#E8EDEF] rounded-full h-1.5 max-w-[120px]">
                        <div
                          className="h-1.5 rounded-full"
                          style={{ width: `${c.attendance}%`, background: "#6CAEBD" }}
                        />
                      </div>
                      <span className="text-xs font-semibold text-[#4A8FA0]">{c.attendance}%</span>
                    </div>
                  </div>
                  <div className="shrink-0 flex flex-col items-end gap-2">
                    <span className="text-xs font-medium" style={{ color: cfg.text }}>{cfg.label}</span>
                    {c.status !== "ended" && (
                      <button
                        className="text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
                        style={{ background: "#E8F6F8", color: "#4A8FA0" }}
                      >
                        تسجيل الحضور
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Notifications */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#E8EDEF] overflow-hidden">
          <div className="px-5 py-4 border-b border-[#E8EDEF] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span>🔔</span>
              <h2 className="font-bold text-[#1A2A30] text-sm">التنبيهات الإدارية</h2>
            </div>
            <Link href="/hala/notifications" className="text-xs text-[#6CAEBD] hover:underline font-medium">عرض الكل</Link>
          </div>
          <div className="divide-y divide-[#F4F7F8]">
            {facultyNotifications.map((n) => {
              const cfg = notifConfig[n.type];
              return (
                <div
                  key={n.id}
                  className="px-5 py-3 flex items-center gap-3 hover:bg-[#F4F7F8] transition-colors"
                  style={{ borderRightWidth: "3px", borderRightColor: cfg.border, borderRightStyle: "solid" }}
                >
                  <span className="shrink-0">{cfg.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#1F2937] truncate">{n.title}</p>
                    <p className="text-xs text-[#9CA3AF] mt-0.5">
                      {new Date(n.date).toLocaleDateString("ar-SA")}
                      {n.daysLeft != null && (
                        <span className="ms-2 font-semibold" style={{ color: cfg.text }}>
                          قبل {n.daysLeft} {n.daysLeft === 1 ? "يوم" : "أيام"}
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Pending requests */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#E8EDEF] overflow-hidden">
          <div className="px-5 py-4 border-b border-[#E8EDEF] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span>📝</span>
              <h2 className="font-bold text-[#1A2A30] text-sm">آخر الطلبات الواردة</h2>
            </div>
            <span className="text-xs text-[#8FA4AB]">{facultyPendingRequests.length} طلب</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#F4F7F8]">
                <tr>
                  <th className="px-4 py-3 text-start text-xs font-bold text-[#506570]">الطالب</th>
                  <th className="px-4 py-3 text-start text-xs font-bold text-[#506570]">نوع الطلب</th>
                  <th className="px-4 py-3 text-start text-xs font-bold text-[#506570]">الحالة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F4F7F8]">
                {facultyPendingRequests.map((r) => {
                  const cfg = reqStatusConfig[r.status];
                  return (
                    <tr key={r.id} className="hover:bg-[#F4F7F8] transition-colors">
                      <td className="px-4 py-3 font-medium text-[#1F2937] text-sm">{r.student}</td>
                      <td className="px-4 py-3 text-[#506570] text-xs">{r.type}</td>
                      <td className="px-4 py-3">
                        <span
                          className="inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full"
                          style={{ color: cfg.color, background: cfg.bg }}
                        >
                          {cfg.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Quick links */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#E8EDEF] p-5">
        <h2 className="font-bold text-[#1A2A30] text-sm mb-4 flex items-center gap-2">
          <span>⚡</span> روابط سريعة
        </h2>
        <div className="grid grid-cols-4 gap-3">
          {quickLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="flex flex-col items-center gap-2 p-3 rounded-xl border border-[#E8EDEF] hover:border-[#875E9E] hover:bg-[#F3EEF7] transition-all group text-center"
            >
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center text-lg"
                style={{ background: link.color + "15" }}
              >
                {link.icon}
              </div>
              <span className="text-xs font-medium text-[#506570] group-hover:text-[#6A4A7E] transition-colors leading-tight">
                {link.label}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Announcements */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#E8EDEF] overflow-hidden">
        <div className="px-5 py-4 border-b border-[#E8EDEF] flex items-center justify-between">
          <div className="flex items-center gap-2"><span>📢</span>
            <h2 className="font-bold text-[#1A2A30] text-sm">إعلانات الجامعة</h2>
          </div>
          <Link href="/hala/announcements" className="text-xs text-[#6CAEBD] hover:underline font-medium">عرض الكل</Link>
        </div>
        <div className="divide-y divide-[#F4F7F8]">
          {announcements.slice(0, 3).map((a) => (
            <div key={a.id} className="px-5 py-4 flex items-start justify-between gap-3 hover:bg-[#F4F7F8] transition-colors">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full"
                    style={{ background: a.categoryColor + "20", color: a.categoryColor }}>
                    {a.category}
                  </span>
                  <span className="text-xs text-[#9CA3AF]">{new Date(a.date).toLocaleDateString("ar-SA")}</span>
                </div>
                <p className="font-semibold text-[#1F2937] text-sm">{a.title}</p>
              </div>
              <button className="shrink-0 text-xs font-semibold px-3 py-1.5 rounded-lg"
                style={{ background: "#F3EEF7", color: "#6A4A7E" }}>
                اقرأ المزيد
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
