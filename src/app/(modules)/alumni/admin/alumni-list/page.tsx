"use client";
import Link from "next/link";
import { useState, useMemo } from "react";
import { adminAlumniList, type AdminAlumnus } from "@/lib/mock/alumni";

const COLLEGE_OPTS = ["الكل", "كلية الأعمال", "كلية العلوم التطبيقية", "كلية الطب", "كلية التمريض"];
const YEAR_OPTS    = ["الكل", "2025", "2024", "2023", "2022", "2021 وما قبل"];
const STATUS_OPTS  = ["الكل", "employed", "seeking", "studying", "other"] as const;

const statusConfig: Record<AdminAlumnus["status"], { label: string; color: string; bg: string }> = {
  employed: { label: "موظَّف",     color: "#16A34A", bg: "#DCFCE7" },
  seeking:  { label: "باحث",      color: "#D97706", bg: "#FEF3C7" },
  studying: { label: "دراسة عليا", color: "#875E9E", bg: "#F3EEF7" },
  other:    { label: "أخرى",      color: "#6B7280", bg: "#F3F4F6" },
};

export default function AlumniListPage() {
  const [search, setSearch]   = useState("");
  const [college, setCollege] = useState("الكل");
  const [year, setYear]       = useState("الكل");
  const [status, setStatus]   = useState<typeof STATUS_OPTS[number]>("الكل");
  const [toast, setToast]     = useState<string | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const filtered = useMemo(() => {
    return adminAlumniList.filter((a) => {
      const matchSearch  = !search || a.name.includes(search) || a.major.includes(search) || a.company.includes(search) || a.id.includes(search);
      const matchCollege = college === "الكل" || a.college === college;
      const matchStatus  = status  === "الكل" || a.status === status;
      const matchYear    =
        year === "الكل" ? true :
        year === "2021 وما قبل" ? a.gradYear <= 2021 :
        a.gradYear === parseInt(year);
      return matchSearch && matchCollege && matchStatus && matchYear;
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, college, year, status]);

  function handleExport() {
    setToast("📥 جارٍ تصدير القائمة إلى Excel... (قريباً)");
    setTimeout(() => setToast(null), 2500);
  }

  function toggleSelect(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  const inputCls = "w-full px-3 py-2 border border-[#D1D5DB] rounded-xl text-sm focus:outline-none focus:border-[#4A8FA0] bg-white";

  const statusCounts = adminAlumniList.reduce((acc, a) => {
    acc[a.status] = (acc[a.status] ?? 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-[#8FA4AB]">
        <Link href="/alumni/admin" className="hover:text-[#4A8FA0] transition-colors">لوحة الإدارة</Link>
        <span>/</span>
        <span className="text-[#1A2A30] font-medium">قائمة الخريجين</span>
      </div>

      {toast && (
        <div
          className="fixed top-6 start-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-xl text-sm font-semibold text-white shadow-lg"
          style={{ background: "#4A8FA0" }}
        >
          {toast}
        </div>
      )}

      {/* Hero */}
      <div
        className="rounded-2xl p-5 text-white shadow-sm"
        style={{ background: "linear-gradient(135deg, #4A8FA0 0%, #2D6B7A 100%)" }}
      >
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-xl font-bold">قائمة الخريجين 👥</h1>
            <p className="text-white/80 text-sm mt-0.5">
              {adminAlumniList.length} خريج مسجَّل · {statusCounts["employed"] ?? 0} موظَّف · {statusCounts["seeking"] ?? 0} باحث عن عمل
            </p>
          </div>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-opacity hover:opacity-90"
            style={{ background: "rgba(255,255,255,0.2)", color: "#fff" }}
          >
            📥 تصدير Excel
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-[#E8EDEF] shadow-sm p-4 space-y-3">
        <div className="relative">
          <span className="absolute start-3 top-1/2 -translate-y-1/2 text-[#8FA4AB] text-sm">🔍</span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ابحث بالاسم أو الرقم أو التخصص أو الشركة..."
            className="w-full ps-9 pe-4 py-2.5 border border-[#D1D5DB] rounded-xl text-sm focus:outline-none focus:border-[#4A8FA0]"
          />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div>
            <label className="text-xs font-bold text-[#374151] block mb-1">الكلية</label>
            <select value={college} onChange={(e) => setCollege(e.target.value)} className={inputCls}>
              {COLLEGE_OPTS.map((o) => <option key={o}>{o}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-bold text-[#374151] block mb-1">سنة التخرج</label>
            <select value={year} onChange={(e) => setYear(e.target.value)} className={inputCls}>
              {YEAR_OPTS.map((o) => <option key={o}>{o}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-bold text-[#374151] block mb-1">الحالة الوظيفية</label>
            <select value={status} onChange={(e) => setStatus(e.target.value as typeof STATUS_OPTS[number])} className={inputCls}>
              {STATUS_OPTS.map((o) => (
                <option key={o} value={o}>
                  {o === "الكل" ? "الكل" : statusConfig[o as AdminAlumnus["status"]]?.label ?? o}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={() => { setSearch(""); setCollege("الكل"); setYear("الكل"); setStatus("الكل"); }}
              className="w-full py-2 rounded-xl text-sm font-bold border border-[#E8EDEF] text-[#506570] hover:bg-[#F4F7F8]"
            >
              إعادة ضبط
            </button>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-[#8FA4AB]">
          <span>النتائج: <strong className="text-[#1F2937]">{filtered.length}</strong> خريج</span>
          {selected.size > 0 && (
            <>
              <span className="mx-1">·</span>
              <span className="text-[#4A8FA0] font-semibold">{selected.size} محدَّد</span>
              <button onClick={handleExport} className="ms-2 text-xs font-semibold underline" style={{ color: "#4A8FA0" }}>
                تصدير المحدَّدين
              </button>
            </>
          )}
        </div>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#E8EDEF] p-12 text-center shadow-sm">
          <p className="text-4xl mb-3">🔍</p>
          <p className="font-bold text-[#1A2A30]">لا توجد نتائج</p>
          <p className="text-sm text-[#8FA4AB] mt-1">جرّب تغيير معايير البحث</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[#E8EDEF] shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: "#F4F7F8" }}>
                  <th className="px-3 py-3 w-8">
                    <input
                      type="checkbox"
                      checked={selected.size === filtered.length && filtered.length > 0}
                      onChange={() => {
                        if (selected.size === filtered.length) setSelected(new Set());
                        else setSelected(new Set(filtered.map((a) => a.id)));
                      }}
                    />
                  </th>
                  {["الاسم", "التخصص", "السنة", "المعدل", "المدينة", "الشركة / الوظيفة", "الحالة", "التواصل"].map((h) => (
                    <th key={h} className="px-4 py-3 text-start text-xs font-bold text-[#506570] whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F4F7F8]">
                {filtered.map((a) => {
                  const sc = statusConfig[a.status];
                  const isSelected = selected.has(a.id);
                  return (
                    <tr
                      key={a.id}
                      className="hover:bg-[#F9FAFB] transition-colors"
                      style={isSelected ? { background: "#EBF5F7" } : {}}
                    >
                      <td className="px-3 py-3">
                        <input type="checkbox" checked={isSelected} onChange={() => toggleSelect(a.id)} />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white shrink-0"
                            style={{ background: `linear-gradient(135deg, ${a.color}, ${a.color}99)` }}
                          >
                            {a.initial}
                          </div>
                          <div>
                            <p className="font-semibold text-[#1F2937] text-xs whitespace-nowrap">{a.name}</p>
                            <p className="text-xs text-[#9CA3AF]">{a.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs text-[#374151] whitespace-nowrap">{a.major}</td>
                      <td className="px-4 py-3 text-xs font-medium text-[#374151]">{a.gradYear}</td>
                      <td className="px-4 py-3">
                        <span
                          className="text-xs font-bold px-1.5 py-0.5 rounded-md"
                          style={{ background: a.gpa >= 4.5 ? "#FEF3C7" : "#F4F7F8", color: a.gpa >= 4.5 ? "#D97706" : "#374151" }}
                        >
                          {a.gpa}
                        </span>
                        {a.honor && <span className="ms-1">🏅</span>}
                      </td>
                      <td className="px-4 py-3 text-xs text-[#6B7280] whitespace-nowrap">{a.city}</td>
                      <td className="px-4 py-3">
                        {a.company ? (
                          <div>
                            <p className="text-xs font-semibold text-[#1F2937] whitespace-nowrap">{a.company}</p>
                            <p className="text-xs text-[#9CA3AF]">{a.jobTitle}</p>
                          </div>
                        ) : (
                          <span className="text-xs text-[#9CA3AF]">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className="text-xs font-semibold px-2 py-0.5 rounded-full whitespace-nowrap"
                          style={{ background: sc.bg, color: sc.color }}
                        >
                          {sc.label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <a
                          href={`mailto:${a.email}`}
                          className="text-xs font-semibold hover:underline"
                          style={{ color: "#4A8FA0" }}
                        >
                          ✉️
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {/* Footer */}
          <div className="px-5 py-3 border-t border-[#F4F7F8] flex items-center justify-between" style={{ background: "#FAFBFC" }}>
            <span className="text-xs text-[#8FA4AB]">
              عرض {filtered.length} من {adminAlumniList.length} خريج
            </span>
            <button
              onClick={handleExport}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white transition-opacity hover:opacity-90"
              style={{ background: "#4A8FA0" }}
            >
              📥 تصدير Excel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
