import Link from "next/link";
import { mockStudent } from "@/lib/mock/financial";
import {
  trainingSummary,
  trainingAlerts,
  upcomingSessions,
  enrolledCourses,
  type AlertType,
} from "@/lib/mock/training";

const alertConfig: Record<AlertType, { icon: string; border: string; bg: string; text: string }> = {
  urgent:  { icon: "🔴", border: "#DC2626", bg: "#FEE2E2", text: "#DC2626" },
  warning: { icon: "🟡", border: "#D97706", bg: "#FEF3C7", text: "#D97706" },
  success: { icon: "✅", border: "#16A34A", bg: "#DCFCE7", text: "#16A34A" },
  info:    { icon: "ℹ️",  border: "#6CAEBD", bg: "#E8F6F8", text: "#4A8FA0" },
};

const modeLabel: Record<string, string> = {
  online:  "عن بُعد",
  onsite:  "حضوري",
  hybrid:  "هجين",
};

const quickLinks = [
  { href: "/training/catalog",      label: "كتالوج البرامج",  icon: "📚", color: "#6CAEBD" },
  { href: "/training/my-courses",   label: "دوراتي",          icon: "🎓", color: "#875E9E" },
  { href: "/training/certificates", label: "الشهادات",        icon: "🏆", color: "#4A8FA0" },
  { href: "/training/requests",     label: "طلب تدريبي",      icon: "📝", color: "#6CAEBD" },
];

export default function TrainingDashboard() {
  const { totalEnrolled, totalCompleted, totalHours, certificates, hoursRequired, hoursRemaining, currentSemester } = trainingSummary;
  const hoursPct = Math.round((totalHours / hoursRequired) * 100);

  const activeCourses = enrolledCourses.filter((c) => c.status === "inprogress" || c.status === "enrolled");

  return (
    <div className="space-y-6">
      {/* Hero */}
      <div
        className="rounded-2xl p-6 text-white shadow-sm"
        style={{ background: "linear-gradient(135deg, #6CAEBD 0%, #4A8FA0 100%)" }}
      >
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <p className="text-white/70 text-xs mb-1">الرقم الجامعي: {mockStudent.id}</p>
            <h1 className="text-xl font-bold">مرحباً، {mockStudent.name.split(" ")[0]} 👋</h1>
            <p className="text-white/80 text-sm mt-0.5">{mockStudent.major} — {currentSemester}</p>
          </div>
          <span
            className="text-xs font-bold px-3 py-1.5 rounded-full shrink-0"
            style={{ background: "rgba(255,255,255,0.2)" }}
          >
            🎯 {totalHours} ساعة مكتملة
          </span>
        </div>

        {/* Hours progress */}
        <div className="mt-5">
          <div className="flex justify-between text-xs text-white/80 mb-1.5">
            <span>المكتمل: {totalHours} ساعة</span>
            <span>المتبقي: {hoursRemaining} ساعة</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2.5">
            <div
              className="h-2.5 rounded-full bg-white transition-all"
              style={{ width: `${hoursPct}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-white/70 mt-1.5">
            <span>{hoursPct}% من المتطلب</span>
            <span>الإجمالي المطلوب: {hoursRequired} ساعة</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "الدورات الجارية",  value: String(totalEnrolled),  icon: "📖", color: "#6CAEBD" },
          { label: "الدورات المكتملة", value: String(totalCompleted), icon: "✅", color: "#16A34A" },
          { label: "ساعات التدريب",    value: `${totalHours} س`,     icon: "⏱️", color: "#4A8FA0" },
          { label: "الشهادات",         value: String(certificates),   icon: "🏆", color: "#875E9E" },
        ].map((s) => (
          <div
            key={s.label}
            className="bg-white rounded-xl border border-[#E8EDEF] p-4 hover:shadow-sm transition-shadow"
          >
            <div className="text-2xl mb-1">{s.icon}</div>
            <p className="text-lg font-bold" style={{ color: s.color }}>{s.value}</p>
            <p className="text-xs text-[#8FA4AB] mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Alerts */}
      {trainingAlerts.length > 0 && (
        <div className="space-y-3">
          <h2 className="font-bold text-[#1A2A30] text-sm flex items-center gap-2">
            <span>🔔</span> التنبيهات
          </h2>
          {trainingAlerts.map((alert) => {
            const ac = alertConfig[alert.type];
            return (
              <div
                key={alert.id}
                className="bg-white rounded-xl border overflow-hidden flex items-start gap-4 px-5 py-4 shadow-sm"
                style={{ borderColor: ac.border, borderRightWidth: "4px" }}
              >
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-lg shrink-0"
                  style={{ background: ac.bg }}
                >
                  {ac.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-[#1F2937]">{alert.title}</p>
                  <p className="text-xs text-[#6B7280] mt-0.5">{alert.detail}</p>
                </div>
                {alert.daysLeft != null && (
                  <span
                    className="shrink-0 text-xs font-bold px-2 py-1 rounded-full"
                    style={{ background: ac.bg, color: ac.text }}
                  >
                    بعد {alert.daysLeft} يوم
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Quick links + Upcoming sessions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick links */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#E8EDEF] p-5">
          <h2 className="font-bold text-[#1A2A30] text-sm mb-4 flex items-center gap-2">
            <span>⚡</span> روابط سريعة
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {quickLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex flex-col items-center gap-2 p-4 rounded-xl border border-[#E8EDEF] hover:shadow-sm transition-all group text-center"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                  style={{ background: link.color + "18" }}
                >
                  {link.icon}
                </div>
                <span className="text-xs font-medium text-[#506570] group-hover:text-[#4A8FA0] transition-colors">
                  {link.label}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Upcoming sessions */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#E8EDEF] overflow-hidden">
          <div className="px-5 py-4 border-b border-[#E8EDEF] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span>📅</span>
              <h2 className="font-bold text-[#1A2A30] text-sm">الجلسات القادمة</h2>
            </div>
            <Link href="/training/my-courses" className="text-xs font-medium hover:underline" style={{ color: "#6CAEBD" }}>
              عرض الكل
            </Link>
          </div>
          <div className="divide-y divide-[#F4F7F8]">
            {upcomingSessions.map((s) => (
              <div key={s.id} className="px-5 py-3.5 flex items-start gap-3 hover:bg-[#F4F7F8] transition-colors">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-sm shrink-0 mt-0.5"
                  style={{ background: s.color + "18" }}
                >
                  📅
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-[#1F2937] leading-snug line-clamp-2">{s.programTitle}</p>
                  <p className="text-xs text-[#9CA3AF] mt-0.5">
                    {new Date(s.date).toLocaleDateString("ar-SA", { day: "numeric", month: "long" })}
                    {" · "}{s.time}
                  </p>
                </div>
                <span
                  className="shrink-0 text-xs font-medium px-2 py-0.5 rounded-full"
                  style={{ background: s.color + "18", color: s.color }}
                >
                  {modeLabel[s.mode]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Active courses */}
      {activeCourses.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-[#E8EDEF] overflow-hidden">
          <div className="px-5 py-4 border-b border-[#E8EDEF] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span>🎓</span>
              <h2 className="font-bold text-[#1A2A30] text-sm">الدورات الجارية والمسجّلة</h2>
            </div>
            <Link href="/training/my-courses" className="text-xs font-medium hover:underline" style={{ color: "#6CAEBD" }}>
              إدارة دوراتي
            </Link>
          </div>
          <div className="divide-y divide-[#F4F7F8]">
            {activeCourses.map((course) => (
              <div key={course.id} className="px-5 py-4 hover:bg-[#F9FAFB] transition-colors">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div className="flex items-start gap-3 min-w-0">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center text-base shrink-0"
                      style={{ background: course.color + "18" }}
                    >
                      🎓
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-[#1F2937] leading-snug">{course.title}</p>
                      <p className="text-xs text-[#8FA4AB] mt-0.5">{course.provider} · {course.hours} ساعة</p>
                    </div>
                  </div>
                  <span
                    className="text-xs font-semibold px-2.5 py-1 rounded-full shrink-0"
                    style={
                      course.status === "inprogress"
                        ? { background: "#E8F6F8", color: "#4A8FA0" }
                        : { background: "#F3EEF7", color: "#875E9E" }
                    }
                  >
                    {course.status === "inprogress" ? "⏳ جارية" : "📋 مسجّل"}
                  </span>
                </div>

                {course.status === "inprogress" && (
                  <div className="mt-3 ms-12">
                    <div className="flex justify-between text-xs text-[#9CA3AF] mb-1">
                      <span>التقدم</span>
                      <span>{course.progress}%</span>
                    </div>
                    <div className="w-full bg-[#E8EDEF] rounded-full h-1.5">
                      <div
                        className="h-1.5 rounded-full transition-all"
                        style={{ width: `${course.progress}%`, background: course.color }}
                      />
                    </div>
                  </div>
                )}

                {course.status === "enrolled" && (
                  <p className="mt-1.5 ms-12 text-xs text-[#9CA3AF]">
                    تبدأ {new Date(course.startDate).toLocaleDateString("ar-SA", { day: "numeric", month: "long", year: "numeric" })}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
