"use client";
import Link from "next/link";
import { studentScheduleToday, notifications, announcements } from "@/lib/mock/hala";

const statusConfig = {
  ended:    { label: "انتهت",       bg: "#EEF2F3", border: "#C8D4D8", text: "#6B838C", badge: "" },
  current:  { label: "جارية الآن", bg: "#E8F6F8", border: "#6CAEBD", text: "#4A8FA0", badge: "🟢" },
  upcoming: { label: "قادمة",       bg: "#FFFFFF", border: "#E5E7EB", text: "#6B7280", badge: "" },
};

const notifConfig = {
  urgent:  { icon: "🔴", border: "#DC2626", bg: "#FEE2E2", text: "#DC2626" },
  warning: { icon: "🟡", border: "#D97706", bg: "#FEF3C7", text: "#D97706" },
  info:    { icon: "ℹ️",  border: "#6CAEBD", bg: "#E8F6F8", text: "#4A8FA0" },
  success: { icon: "✅", border: "#16A34A", bg: "#DCFCE7", text: "#16A34A" },
};

const quickLinks = [
  { label: "سند",      icon: "📚", href: "/sanad",               color: "#875E9E" },
  { label: "جدولي",    icon: "📅", href: "/sanad/academic",       color: "#6CAEBD" },
  { label: "نتائجي",  icon: "📊", href: "/sanad/academic",       color: "#8FA4AB" },
  { label: "رسومي",   icon: "💰", href: "/financial",            color: "#6CAEBD" },
  { label: "المكتبة", icon: "📖", href: "#",                     color: "#875E9E" },
  { label: "التدريب", icon: "🤝", href: "/training",             color: "#8FA4AB" },
  { label: "المنح",   icon: "🎁", href: "/scholarships",         color: "#6CAEBD" },
  { label: "طلباتي",  icon: "📋", href: "/sanad/my-requests",    color: "#875E9E" },
];

export default function StudentView({ name }: { name: string }) {
  const today = new Date();
  const hijri = today.toLocaleDateString("ar-SA-u-ca-islamic", { day: "numeric", month: "long", year: "numeric" });
  const miladi = today.toLocaleDateString("ar-SA", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  return (
    <div className="space-y-6">
      {/* Welcome card */}
      <div
        className="rounded-2xl p-6 text-white shadow-sm"
        style={{ background: "linear-gradient(135deg, #6CAEBD 0%, #875E9E 100%)" }}
      >
        <p className="text-white/80 text-sm">{miladi}</p>
        <h1 className="text-2xl font-bold mt-1">أهلاً، {name.split(" ")[0]} 👋</h1>
        <p className="text-white/70 text-xs mt-0.5">{hijri}</p>
        <div className="mt-4 flex items-center gap-6 flex-wrap">
          <div>
            <p className="text-white/70 text-xs">السنة الدراسية</p>
            <p className="font-bold text-sm">السنة الثالثة – علوم الحاسب</p>
          </div>
          <div>
            <p className="text-white/70 text-xs">المعدل التراكمي</p>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg">3.70</span>
              <div className="flex-1 bg-white/20 rounded-full h-1.5 min-w-[80px]">
                <div className="bg-white rounded-full h-1.5" style={{ width: "74%" }} />
              </div>
              <span
                className="text-xs font-bold px-2 py-0.5 rounded-full"
                style={{ background: "#8FA4AB", color: "#fff" }}
              >
                ممتاز
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Today's schedule */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#E8EDEF] overflow-hidden">
        <div className="px-5 py-4 border-b border-[#E8EDEF] flex items-center gap-2">
          <span className="text-lg">📅</span>
          <h2 className="font-bold text-[#1A2A30] text-sm">محاضرات اليوم</h2>
        </div>
        <div className="divide-y divide-[#F4F7F8]">
          {studentScheduleToday.length === 0 ? (
            <div className="py-10 text-center">
              <p className="text-3xl mb-2">🎉</p>
              <p className="text-[#506570] text-sm">يوم خالٍ – استمتع بيومك!</p>
            </div>
          ) : (
            studentScheduleToday.map((c) => {
              const cfg = statusConfig[c.status];
              return (
                <div
                  key={c.code}
                  className="px-5 py-3.5 flex items-start gap-4 transition-colors"
                  style={{ background: cfg.bg, borderRightWidth: "3px", borderRightColor: cfg.border, borderRightStyle: "solid" }}
                >
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
                    <div className="flex gap-4 mt-1 text-xs text-[#8FA4AB]">
                      <span>⏰ {c.time}</span>
                      <span>📍 {c.room}</span>
                      <span className="hidden sm:inline">👨‍🏫 {c.instructor}</span>
                    </div>
                  </div>
                  <span className="text-xs shrink-0 font-medium" style={{ color: cfg.text }}>
                    {cfg.label}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#E8EDEF] overflow-hidden">
        <div className="px-5 py-4 border-b border-[#E8EDEF] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">🔔</span>
            <h2 className="font-bold text-[#1A2A30] text-sm">التنبيهات</h2>
          </div>
          <Link href="/hala/notifications" className="text-xs text-[#6CAEBD] hover:underline font-medium">
            عرض الكل
          </Link>
        </div>
        <div className="divide-y divide-[#F4F7F8]">
          {notifications.slice(0, 4).map((n) => {
            const cfg = notifConfig[n.type];
            return (
              <div
                key={n.id}
                className="px-5 py-3 flex items-center gap-3 hover:bg-[#F4F7F8] transition-colors"
                style={{ borderRightWidth: "3px", borderRightColor: cfg.border, borderRightStyle: "solid" }}
              >
                <span className="text-base shrink-0">{cfg.icon}</span>
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

      {/* Quick links */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#E8EDEF] p-5">
        <h2 className="font-bold text-[#1A2A30] text-sm mb-4 flex items-center gap-2">
          <span>⚡</span> روابط سريعة
        </h2>
        <div className="grid grid-cols-4 gap-3">
          {quickLinks.map((link) => (
            <Link
              key={link.href + link.label}
              href={link.href}
              className="flex flex-col items-center gap-2 p-3 rounded-xl border border-[#E8EDEF] hover:border-[#6CAEBD] hover:bg-[#E8F6F8] transition-all group text-center"
            >
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center text-lg"
                style={{ background: link.color + "15" }}
              >
                {link.icon}
              </div>
              <span className="text-xs font-medium text-[#506570] group-hover:text-[#4A8FA0] transition-colors leading-tight">
                {link.label}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Announcements */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#E8EDEF] overflow-hidden">
        <div className="px-5 py-4 border-b border-[#E8EDEF] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">📢</span>
            <h2 className="font-bold text-[#1A2A30] text-sm">إعلانات الجامعة</h2>
          </div>
          <Link href="/hala/announcements" className="text-xs text-[#6CAEBD] hover:underline font-medium">
            عرض الكل
          </Link>
        </div>
        <div className="divide-y divide-[#F4F7F8]">
          {announcements.slice(0, 3).map((a) => (
            <div key={a.id} className="px-5 py-4 hover:bg-[#F4F7F8] transition-colors">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span
                      className="text-xs font-bold px-2 py-0.5 rounded-full"
                      style={{ background: a.categoryColor + "20", color: a.categoryColor }}
                    >
                      {a.category}
                    </span>
                    <span className="text-xs text-[#9CA3AF]">
                      {new Date(a.date).toLocaleDateString("ar-SA")}
                    </span>
                  </div>
                  <p className="font-semibold text-[#1F2937] text-sm">{a.title}</p>
                  <p className="text-[#6B7280] text-xs mt-1 leading-relaxed line-clamp-2">{a.body}</p>
                </div>
                <button
                  className="shrink-0 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
                  style={{ background: "#E8F6F8", color: "#4A8FA0" }}
                >
                  اقرأ المزيد
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
