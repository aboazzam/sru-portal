"use client";
import Link from "next/link";
import { useState, useMemo } from "react";
import { jobOpportunities, jobApplications, alumniProfile } from "@/lib/mock/alumni";

type Tab = "browse" | "mine";

const jobTypeConfig: Record<string, { label: string; color: string; bg: string }> = {
  fulltime: { label: "دوام كامل", color: "#16A34A", bg: "#DCFCE7" },
  parttime: { label: "دوام جزئي", color: "#D97706", bg: "#FEF3C7" },
  remote:   { label: "عن بُعد",   color: "#6CAEBD", bg: "#E8F6F8" },
  contract: { label: "عقد مؤقت", color: "#875E9E", bg: "#F3EEF7" },
};

const appStatusConfig: Record<string, { label: string; color: string; bg: string; icon: string }> = {
  applied:   { label: "تم التقديم",     color: "#4A8FA0", bg: "#E8F6F8", icon: "📋" },
  interview: { label: "مقابلة",         color: "#D97706", bg: "#FEF3C7", icon: "🎙️" },
  offered:   { label: "عرض وظيفي",     color: "#16A34A", bg: "#DCFCE7", icon: "🎉" },
  rejected:  { label: "مرفوض",          color: "#DC2626", bg: "#FEE2E2", icon: "❌" },
  withdrawn: { label: "منسحب",          color: "#6B7280", bg: "#F3F4F6", icon: "↩️" },
};

const typeFilters = [
  { value: "all",      label: "الكل" },
  { value: "fulltime", label: "دوام كامل" },
  { value: "parttime", label: "دوام جزئي" },
  { value: "remote",   label: "عن بُعد" },
  { value: "contract", label: "عقد مؤقت" },
];

export default function AlumniJobsPage() {
  const [tab, setTab]         = useState<Tab>("browse");
  const [search, setSearch]   = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [recommended, setRecommended] = useState(false);
  const [applied, setApplied] = useState<number[]>([]);
  const [toast, setToast]     = useState<string | null>(null);

  function handleApply(id: number, title: string) {
    setApplied((prev) => [...prev, id]);
    setToast(`✅ تم التقديم على "${title}" بنجاح`);
    setTimeout(() => setToast(null), 3000);
  }

  const filtered = useMemo(() => {
    return jobOpportunities.filter((j) => {
      const matchSearch = !search ||
        j.title.includes(search) ||
        j.company.includes(search) ||
        j.location.includes(search);
      const matchType   = typeFilter === "all" || j.type === typeFilter;
      const matchRec    = !recommended || j.majors.includes(alumniProfile.major);
      return matchSearch && matchType && matchRec;
    });
  }, [search, typeFilter, recommended]);

  return (
    <div className="space-y-6">

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-[#8FA4AB]">
        <Link href="/alumni" className="hover:text-[#875E9E] transition-colors">بوابة الخريجين</Link>
        <span>/</span>
        <span className="text-[#1A2A30] font-medium">فرص العمل</span>
      </div>

      {/* Toast */}
      {toast && (
        <div
          className="fixed top-6 start-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-xl text-sm font-semibold text-white shadow-lg"
          style={{ background: "#16A34A" }}
        >
          {toast}
        </div>
      )}

      {/* Hero */}
      <div
        className="rounded-2xl p-6 text-white shadow-sm"
        style={{ background: "linear-gradient(135deg, #875E9E 0%, #6CAEBD 100%)" }}
      >
        <div className="flex items-center gap-3">
          <span className="text-4xl">💼</span>
          <div>
            <h1 className="text-xl font-bold">فرص العمل</h1>
            <p className="text-white/80 text-sm mt-0.5">{jobOpportunities.length} وظيفة متاحة — مُحدَّثة يومياً</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-[#F4F7F8] rounded-xl p-1 w-fit">
        {([
          { id: "browse", label: "تصفح الوظائف", icon: "🔍" },
          { id: "mine",   label: `طلباتي (${jobApplications.length})`, icon: "📋" },
        ] as { id: Tab; label: string; icon: string }[]).map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all"
            style={tab === t.id
              ? { background: "#875E9E", color: "#fff" }
              : { color: "#506570" }
            }
          >
            <span>{t.icon}</span>
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      {/* ── Tab: Browse ── */}
      {tab === "browse" && (
        <div className="space-y-5">

          {/* Filter bar */}
          <div className="bg-white rounded-2xl border border-[#E8EDEF] p-4 space-y-3">
            {/* Search */}
            <div className="relative">
              <span className="absolute start-3 top-1/2 -translate-y-1/2 text-[#8FA4AB] text-sm">🔍</span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="ابحث بالمسمى الوظيفي أو الشركة أو المدينة..."
                className="w-full ps-9 pe-4 py-2.5 border border-[#D1D5DB] rounded-xl text-sm focus:outline-none focus:border-[#875E9E]"
              />
            </div>

            {/* Type filters + Recommended toggle */}
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex gap-1 flex-wrap">
                {typeFilters.map((f) => (
                  <button
                    key={f.value}
                    onClick={() => setTypeFilter(f.value)}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                    style={typeFilter === f.value
                      ? { background: "#875E9E", color: "#fff" }
                      : { background: "#F4F7F8", color: "#506570" }
                    }
                  >
                    {f.label}
                  </button>
                ))}
              </div>
              <label className="flex items-center gap-2 cursor-pointer ms-auto">
                <div
                  className="w-9 h-5 rounded-full relative transition-colors"
                  style={{ background: recommended ? "#875E9E" : "#D1D5DB" }}
                  onClick={() => setRecommended(!recommended)}
                >
                  <div
                    className="w-4 h-4 bg-white rounded-full absolute top-0.5 transition-all shadow-sm"
                    style={{ [recommended ? "right" : "left"]: "2px" }}
                  />
                </div>
                <span className="text-xs font-semibold text-[#506570]">موصى بها لتخصصي</span>
              </label>
            </div>

            {/* Result count */}
            <p className="text-xs text-[#8FA4AB]">
              {filtered.length} وظيفة
              {search && ` · نتائج البحث عن "${search}"`}
              {recommended && ` · مناسبة لـ ${alumniProfile.major}`}
            </p>
          </div>

          {/* Job cards */}
          {filtered.length === 0 ? (
            <div className="bg-white rounded-2xl border border-[#E8EDEF] p-12 text-center">
              <p className="text-4xl mb-3">🔍</p>
              <p className="font-bold text-[#1A2A30]">لا توجد نتائج</p>
              <p className="text-sm text-[#8FA4AB] mt-1">جرّب تغيير معايير البحث</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filtered.map((job) => {
                const tc       = jobTypeConfig[job.type];
                const isApplied = applied.includes(job.id);
                const daysLeft  = Math.max(0, Math.ceil(
                  (new Date(job.deadline).getTime() - Date.now()) / 86400000
                ));
                return (
                  <div
                    key={job.id}
                    className="bg-white rounded-2xl border border-[#E8EDEF] shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                  >
                    {job.featured && (
                      <div
                        className="px-5 py-1.5 text-xs font-semibold flex items-center gap-1.5"
                        style={{ background: "#FEF3C7", color: "#D97706" }}
                      >
                        ⭐ وظيفة مميزة
                      </div>
                    )}
                    <div className="p-5">
                      <div className="flex items-start gap-4">
                        {/* Logo */}
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0"
                          style={{ background: "#F3EEF7" }}
                        >
                          {job.logo}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 flex-wrap">
                            <div>
                              <h3 className="font-bold text-[#1F2937] text-base leading-snug">{job.title}</h3>
                              <p className="text-sm text-[#6B7280] mt-0.5">{job.company} · {job.location}</p>
                            </div>
                            <span
                              className="shrink-0 text-xs font-bold px-2.5 py-1 rounded-full"
                              style={{ background: tc.bg, color: tc.color }}
                            >
                              {tc.label}
                            </span>
                          </div>

                          <p className="text-sm text-[#374151] mt-2 leading-relaxed">{job.description}</p>

                          {/* Skills */}
                          <div className="flex flex-wrap gap-1.5 mt-3">
                            {job.skills.map((sk) => (
                              <span
                                key={sk}
                                className="text-xs px-2.5 py-1 rounded-lg"
                                style={{ background: "#F4F7F8", color: "#506570" }}
                              >
                                {sk}
                              </span>
                            ))}
                          </div>

                          {/* Footer */}
                          <div className="flex items-center justify-between gap-3 mt-4 flex-wrap">
                            <div className="flex items-center gap-3 flex-wrap text-xs text-[#6B7280]">
                              <span>💰 {job.salary}</span>
                              <span className={daysLeft <= 7 ? "font-semibold text-[#DC2626]" : ""}>
                                ⏰ {daysLeft > 0 ? `${daysLeft} يوم متبقٍ` : "انتهى الموعد"}
                              </span>
                              {job.majors.includes(alumniProfile.major) && (
                                <span style={{ color: "#875E9E" }} className="font-semibold">✓ يناسب تخصصك</span>
                              )}
                            </div>
                            <button
                              onClick={() => !isApplied && handleApply(job.id, job.title)}
                              disabled={isApplied || daysLeft === 0}
                              className="shrink-0 px-5 py-2 rounded-xl text-sm font-bold text-white transition-opacity disabled:opacity-60"
                              style={{ background: isApplied ? "#8FA4AB" : "linear-gradient(to left, #875E9E, #6A4A7E)" }}
                            >
                              {isApplied ? "✓ تم التقديم" : "تقدّم الآن"}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ── Tab: My Applications ── */}
      {tab === "mine" && (
        <div className="space-y-4">
          {jobApplications.length === 0 ? (
            <div className="bg-white rounded-2xl border border-[#E8EDEF] p-12 text-center">
              <p className="text-4xl mb-3">📋</p>
              <p className="font-bold text-[#1A2A30]">لم تتقدم لأي وظيفة بعد</p>
              <button
                onClick={() => setTab("browse")}
                className="mt-4 text-sm font-semibold underline"
                style={{ color: "#875E9E" }}
              >
                تصفح الوظائف المتاحة ←
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-[#E8EDEF] shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-[#E8EDEF] bg-[#F4F7F8]">
                <h2 className="font-bold text-[#1A2A30] text-sm">{jobApplications.length} طلبات مقدَّمة</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-[#F4F7F8] border-b border-[#E8EDEF]">
                    <tr>
                      <th className="px-5 py-3 text-start text-xs font-bold text-[#506570]">المسمى الوظيفي</th>
                      <th className="px-5 py-3 text-start text-xs font-bold text-[#506570]">الشركة</th>
                      <th className="px-5 py-3 text-start text-xs font-bold text-[#506570]">تاريخ التقديم</th>
                      <th className="px-5 py-3 text-center text-xs font-bold text-[#506570]">الحالة</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F4F7F8]">
                    {jobApplications.map((app) => {
                      const sc = appStatusConfig[app.status];
                      return (
                        <tr key={app.id} className="hover:bg-[#F9FAFB] transition-colors">
                          <td className="px-5 py-3.5 font-semibold text-[#1F2937]">{app.jobTitle}</td>
                          <td className="px-5 py-3.5 text-[#6B7280]">{app.company}</td>
                          <td className="px-5 py-3.5 text-[#9CA3AF]">
                            {new Date(app.appliedDate).toLocaleDateString("ar-SA", {
                              day: "numeric", month: "long", year: "numeric",
                            })}
                          </td>
                          <td className="px-5 py-3.5 text-center">
                            <span
                              className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full"
                              style={{ background: sc.bg, color: sc.color }}
                            >
                              {sc.icon} {sc.label}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
