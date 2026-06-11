import Link from "next/link";
import {
  universityStats,
  employmentByYear,
  employmentByMajor,
  topEmployers,
} from "@/lib/mock/alumni";

const MAX_BAR_H = 88; // px — height of tallest bar in column chart

export default function AdminDashboardPage() {
  const maxRate    = Math.max(...employmentByYear.map((d) => d.rate));
  const maxHired   = Math.max(...topEmployers.map((e) => e.hired));
  const top5Majors = [...employmentByMajor].sort((a, b) => b.rate - a.rate).slice(0, 6);

  return (
    <div className="space-y-6">

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-[#8FA4AB]">
        <Link href="/alumni" className="hover:text-[#4A8FA0] transition-colors">بوابة الخريجين</Link>
        <span>/</span>
        <span className="text-[#1A2A30] font-medium">لوحة الإدارة</span>
      </div>

      {/* Hero */}
      <div
        className="rounded-2xl p-6 text-white shadow-sm"
        style={{ background: "linear-gradient(135deg, #4A8FA0 0%, #2D6B7A 100%)" }}
      >
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <p className="text-white/70 text-xs mb-1">إدارة بوابة الخريجين</p>
            <h1 className="text-2xl font-bold">لوحة تحكم الإدارة ⚙️</h1>
            <p className="text-white/80 text-sm mt-1">
              نظرة شاملة على إحصائيات الخريجين وأداء برامج التوظيف
            </p>
          </div>
          <div className="flex gap-2 flex-wrap">
            {[
              { href: "/alumni/admin/alumni-list",   label: "قائمة الخريجين",  icon: "👥" },
              { href: "/alumni/admin/statistics",    label: "الإحصائيات",      icon: "📊" },
              { href: "/alumni/admin/events-manage", label: "الفعاليات",       icon: "📅" },
            ].map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-opacity hover:opacity-90"
                style={{ background: "rgba(255,255,255,0.2)", color: "#fff" }}
              >
                <span>{l.icon}</span> {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* 8 Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {universityStats.map((s) => (
          <div
            key={s.id}
            className="bg-white rounded-xl border border-[#E8EDEF] p-4 hover:shadow-sm transition-shadow"
          >
            <div className="flex items-start gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
                style={{ background: s.color + "15" }}
              >
                {s.icon}
              </div>
              <div className="min-w-0">
                <p className="text-lg font-bold text-[#1F2937] leading-none">{s.value}</p>
                <p className="text-xs text-[#506570] mt-0.5 leading-snug">{s.label}</p>
                <p className="text-xs mt-1 font-medium" style={{ color: s.color }}>{s.trend}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* ── معدل التوظيف حسب السنة (column chart) ── */}
        <div className="bg-white rounded-2xl border border-[#E8EDEF] shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-[#E8EDEF]">
            <h2 className="font-bold text-[#1A2A30] text-sm flex items-center gap-2">
              <span>📈</span> معدل التوظيف حسب السنة
            </h2>
          </div>
          <div className="p-5">
            {/* Y-axis labels + bars */}
            <div className="flex items-end gap-2 px-2" style={{ height: `${MAX_BAR_H + 40}px` }}>
              {employmentByYear.map((d) => {
                const barH = Math.round((d.rate / maxRate) * MAX_BAR_H);
                return (
                  <div key={d.year} className="flex-1 flex flex-col items-center gap-0">
                    <span className="text-xs font-bold mb-1" style={{ color: "#6CAEBD" }}>{d.rate}%</span>
                    <div
                      className="w-full rounded-t-lg"
                      style={{
                        height: `${barH}px`,
                        background: "linear-gradient(to top, #6CAEBD, #8FC8D4)",
                        minHeight: "6px",
                      }}
                    />
                    <span className="text-xs text-[#9CA3AF] mt-1.5">{String(d.year).slice(2)}</span>
                  </div>
                );
              })}
            </div>
            {/* Legend */}
            <div className="mt-4 flex items-center gap-4 text-xs text-[#8FA4AB] border-t border-[#F4F7F8] pt-3">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-sm" style={{ background: "#6CAEBD" }} />
                معدل التوظيف السنوي
              </div>
              <span className="ms-auto">مجموع الخريجين: {employmentByYear.reduce((s, d) => s + d.total, 0).toLocaleString("ar-SA")}</span>
            </div>
          </div>
        </div>

        {/* ── معدل التوظيف حسب التخصص (horizontal bars) ── */}
        <div className="bg-white rounded-2xl border border-[#E8EDEF] shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-[#E8EDEF]">
            <h2 className="font-bold text-[#1A2A30] text-sm flex items-center gap-2">
              <span>🎓</span> معدل التوظيف حسب التخصص
            </h2>
          </div>
          <div className="p-5 space-y-3">
            {top5Majors.map((m, i) => (
              <div key={m.major}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white"
                      style={{ background: i < 3 ? "#4A8FA0" : "#8FA4AB", fontSize: "10px" }}
                    >
                      {i + 1}
                    </span>
                    <span className="text-xs font-semibold text-[#374151]">{m.major}</span>
                  </div>
                  <span className="text-xs font-bold" style={{ color: m.rate >= 90 ? "#16A34A" : "#4A8FA0" }}>
                    {m.rate}%
                  </span>
                </div>
                <div className="h-2 bg-[#F4F7F8] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${m.rate}%`,
                      background: m.rate >= 95 ? "#16A34A" : m.rate >= 90 ? "#4A8FA0" : "#6CAEBD",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* أكثر 5 شركات توظيفاً */}
      <div className="bg-white rounded-2xl border border-[#E8EDEF] shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-[#E8EDEF] flex items-center justify-between">
          <h2 className="font-bold text-[#1A2A30] text-sm flex items-center gap-2">
            <span>🏆</span> أكثر 5 شركات توظيفاً لخريجي الجامعة
          </h2>
          <span className="text-xs text-[#8FA4AB]">إجمالي {topEmployers.reduce((s, e) => s + e.hired, 0).toLocaleString("ar-SA")} موظَّف</span>
        </div>
        <div className="p-5 space-y-4">
          {topEmployers.map((emp, i) => (
            <div key={emp.company} className="flex items-center gap-4">
              {/* Rank */}
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white shrink-0"
                style={{ background: i === 0 ? "#D97706" : i === 1 ? "#6B7280" : i === 2 ? "#92400E" : "#E5E7EB", color: i < 3 ? "#fff" : "#374151" }}
              >
                {i + 1}
              </div>
              {/* Logo + name */}
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
                style={{ background: emp.color + "18" }}
              >
                {emp.logo}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <div>
                    <span className="font-bold text-sm text-[#1F2937]">{emp.company}</span>
                    <span
                      className="ms-2 text-xs font-medium px-2 py-0.5 rounded-full"
                      style={{ background: emp.color + "15", color: emp.color }}
                    >
                      {emp.sector}
                    </span>
                  </div>
                  <span className="text-sm font-bold" style={{ color: emp.color }}>{emp.hired.toLocaleString("ar-SA")} خريج</span>
                </div>
                <div className="h-2 bg-[#F4F7F8] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${(emp.hired / maxHired) * 100}%`, background: emp.color }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
