"use client";
import Link from "next/link";
import { useState } from "react";
import { employmentByYear, employmentByMajor } from "@/lib/mock/alumni";

type Tab = "year" | "major";

const MAX_BAR_H = 100;

function YearChart() {
  const maxRate = Math.max(...employmentByYear.map((d) => d.rate));
  return (
    <div className="bg-white rounded-2xl border border-[#E8EDEF] shadow-sm overflow-hidden">
      <div className="px-5 py-3 border-b border-[#E8EDEF]" style={{ background: "#F4F7F8" }}>
        <h3 className="font-bold text-[#1A2A30] text-sm flex items-center gap-2">
          <span>📊</span> معدل التوظيف السنوي
        </h3>
      </div>
      <div className="p-5">
        <div className="flex items-end gap-3" style={{ height: `${MAX_BAR_H + 48}px` }}>
          {employmentByYear.map((d) => {
            const barH = Math.round((d.rate / maxRate) * MAX_BAR_H);
            const isMax = d.rate === maxRate;
            return (
              <div key={d.year} className="flex-1 flex flex-col items-center">
                <span className="text-xs font-bold mb-1" style={{ color: isMax ? "#16A34A" : "#6CAEBD" }}>
                  {d.rate}%
                </span>
                <div
                  className="w-full rounded-t-xl transition-all"
                  style={{
                    height: `${barH}px`,
                    background: isMax
                      ? "linear-gradient(to top, #16A34A, #4ADE80)"
                      : "linear-gradient(to top, #6CAEBD, #8FC8D4)",
                    minHeight: "6px",
                  }}
                />
                <span className="text-xs text-[#9CA3AF] mt-1.5 font-medium">{d.year}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function MajorChart() {
  const sorted = [...employmentByMajor].sort((a, b) => b.rate - a.rate);
  return (
    <div className="bg-white rounded-2xl border border-[#E8EDEF] shadow-sm overflow-hidden">
      <div className="px-5 py-3 border-b border-[#E8EDEF]" style={{ background: "#F4F7F8" }}>
        <h3 className="font-bold text-[#1A2A30] text-sm flex items-center gap-2">
          <span>📊</span> معدل التوظيف حسب التخصص (تنازلياً)
        </h3>
      </div>
      <div className="p-5 space-y-3">
        {sorted.map((m) => (
          <div key={m.major}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold text-[#374151]">{m.major}</span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#9CA3AF]">{m.employed.toLocaleString("ar-SA")}/{m.total.toLocaleString("ar-SA")}</span>
                <span
                  className="text-xs font-bold px-2 py-0.5 rounded-full"
                  style={{
                    background: m.rate >= 95 ? "#DCFCE7" : m.rate >= 90 ? "#E8F6F8" : "#F4F7F8",
                    color:      m.rate >= 95 ? "#16A34A" : m.rate >= 90 ? "#4A8FA0" : "#6B7280",
                  }}
                >
                  {m.rate}%
                </span>
              </div>
            </div>
            <div className="h-2 bg-[#F4F7F8] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full"
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
  );
}

export default function AdminStatisticsPage() {
  const [tab, setTab] = useState<Tab>("year");

  const totalAlumni   = employmentByYear.reduce((s, d) => s + d.total, 0);
  const totalEmployed = employmentByYear.reduce((s, d) => s + d.employed, 0);
  const overallRate   = Math.round((totalEmployed / totalAlumni) * 100);
  const totalHonors   = employmentByYear.reduce((s, d) => s + d.honors, 0);
  const avgGpa        = (employmentByYear.reduce((s, d) => s + d.avgGpa, 0) / employmentByYear.length).toFixed(2);

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-[#8FA4AB]">
        <Link href="/alumni/admin" className="hover:text-[#4A8FA0] transition-colors">لوحة الإدارة</Link>
        <span>/</span>
        <span className="text-[#1A2A30] font-medium">الإحصائيات التفصيلية</span>
      </div>

      {/* Hero */}
      <div
        className="rounded-2xl p-5 text-white shadow-sm"
        style={{ background: "linear-gradient(135deg, #4A8FA0 0%, #2D6B7A 100%)" }}
      >
        <h1 className="text-xl font-bold">الإحصائيات التفصيلية 📊</h1>
        <p className="text-white/80 text-sm mt-0.5">تحليل شامل لأداء التوظيف عبر السنوات والتخصصات</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "إجمالي الخريجين",   value: totalAlumni.toLocaleString("ar-SA"),    color: "#4A8FA0", icon: "🎓" },
          { label: "الموظَّفون",          value: totalEmployed.toLocaleString("ar-SA"), color: "#16A34A", icon: "💼" },
          { label: "معدل التوظيف الكلي", value: `${overallRate}%`,                     color: "#6CAEBD", icon: "📈" },
          { label: "خريجو مرتبة الشرف",  value: totalHonors.toLocaleString("ar-SA"),   color: "#D97706", icon: "🏅" },
          { label: "متوسط المعدل",       value: avgGpa,                                color: "#875E9E", icon: "📋" },
          { label: "أعلى نسبة توظيف",   value: `${Math.max(...employmentByMajor.map(m => m.rate))}%`, color: "#16A34A", icon: "⭐" },
        ].map((c) => (
          <div key={c.label} className="bg-white rounded-xl border border-[#E8EDEF] p-4">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-base">{c.icon}</span>
              <span className="text-xs text-[#8FA4AB]">{c.label}</span>
            </div>
            <p className="text-xl font-bold" style={{ color: c.color }}>{c.value}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl border border-[#E8EDEF] shadow-sm overflow-hidden">
        <div className="flex border-b border-[#E8EDEF]">
          {([
            { id: "year",  label: "حسب السنة",     icon: "📅" },
            { id: "major", label: "حسب التخصص",    icon: "🎓" },
          ] as { id: Tab; label: string; icon: string }[]).map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className="flex-1 px-4 py-3.5 text-sm font-bold flex items-center justify-center gap-2 transition-colors"
              style={
                tab === t.id
                  ? { borderBottom: "2px solid #4A8FA0", color: "#4A8FA0", background: "#F0F9FB" }
                  : { color: "#8FA4AB" }
              }
            >
              <span>{t.icon}</span> {t.label}
            </button>
          ))}
        </div>

        {/* Year tab */}
        {tab === "year" && (
          <div className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ background: "#F4F7F8" }}>
                    {["السنة", "الإجمالي", "الموظَّفون", "معدل التوظيف", "متوسط المعدل", "مرتبة الشرف"].map((h) => (
                      <th key={h} className="px-4 py-3 text-start text-xs font-bold text-[#506570] whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F4F7F8]">
                  {[...employmentByYear].reverse().map((d) => (
                    <tr key={d.year} className="hover:bg-[#F9FAFB] transition-colors">
                      <td className="px-4 py-3 font-bold text-[#1F2937]">{d.year}</td>
                      <td className="px-4 py-3 text-[#374151]">{d.total.toLocaleString("ar-SA")}</td>
                      <td className="px-4 py-3 text-[#374151]">{d.employed.toLocaleString("ar-SA")}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-[#F4F7F8] rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full"
                              style={{ width: `${d.rate}%`, background: d.rate >= 88 ? "#16A34A" : "#6CAEBD" }}
                            />
                          </div>
                          <span className="font-bold text-xs" style={{ color: d.rate >= 88 ? "#16A34A" : "#4A8FA0" }}>
                            {d.rate}%
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-[#374151]">{d.avgGpa}</td>
                      <td className="px-4 py-3 text-[#374151]">{d.honors}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Major tab */}
        {tab === "major" && (
          <div className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ background: "#F4F7F8" }}>
                    {["التخصص", "الكلية", "الإجمالي", "الموظَّفون", "معدل التوظيف", "متوسط المعدل", "أكبر موظِّف"].map((h) => (
                      <th key={h} className="px-4 py-3 text-start text-xs font-bold text-[#506570] whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F4F7F8]">
                  {[...employmentByMajor].sort((a, b) => b.rate - a.rate).map((m) => (
                    <tr key={m.major} className="hover:bg-[#F9FAFB] transition-colors">
                      <td className="px-4 py-3 font-bold text-[#1F2937] whitespace-nowrap">{m.major}</td>
                      <td className="px-4 py-3 text-xs text-[#6B7280] whitespace-nowrap">{m.college}</td>
                      <td className="px-4 py-3 text-[#374151]">{m.total.toLocaleString("ar-SA")}</td>
                      <td className="px-4 py-3 text-[#374151]">{m.employed.toLocaleString("ar-SA")}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-[#F4F7F8] rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full"
                              style={{
                                width: `${m.rate}%`,
                                background: m.rate >= 95 ? "#16A34A" : m.rate >= 90 ? "#4A8FA0" : "#6CAEBD",
                              }}
                            />
                          </div>
                          <span
                            className="font-bold text-xs"
                            style={{ color: m.rate >= 95 ? "#16A34A" : m.rate >= 90 ? "#4A8FA0" : "#6B7280" }}
                          >
                            {m.rate}%
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-[#374151]">{m.avgGpa}</td>
                      <td className="px-4 py-3 text-xs text-[#6B7280] whitespace-nowrap">{m.topEmployer}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {tab === "year"  && <YearChart />}
        {tab === "major" && <MajorChart />}
        <div className="bg-white rounded-2xl border border-[#E8EDEF] shadow-sm p-5">
          <h3 className="font-bold text-[#1A2A30] text-sm flex items-center gap-2 mb-4">
            <span>💡</span> ملاحظات إحصائية
          </h3>
          <div className="space-y-3 text-xs text-[#374151] leading-relaxed">
            {tab === "year" ? [
              "ارتفع معدل التوظيف من 81% عام 2020 إلى 89% عام 2025 بنمو 8 نقاط.",
              "دفعة 2025 هي الأكبر عدداً بـ 875 خريجاً مع أعلى معدل توظيف.",
              "شهدت خريجات مرتبة الشرف نمواً من 92 إلى 162 خريجة خلال 5 سنوات.",
              "يُنتظر أن تتجاوز دفعة 2026 معدل التوظيف 90% بناءً على الاتجاهات الحالية.",
            ] : [
              "تخصصات الطب وعلوم الحاسب والتمريض تحقق أعلى معدلات توظيف (90%+).",
              "كلية الأعمال تُصدر أكبر عدد من الخريجين بإجمالي يتجاوز 3,200 خريج.",
              "متوسط المعدل التراكمي في تخصص الطب الأعلى على مستوى الجامعة.",
              "التسويق والاقتصاد والموارد البشرية فرص لرفع معدلات التوظيف بشراكات إضافية.",
            ].map((note, i) => (
              <div key={i} className="flex items-start gap-2">
                <span style={{ color: "#4A8FA0" }} className="shrink-0 mt-0.5">•</span>
                {note}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
