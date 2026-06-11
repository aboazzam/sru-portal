"use client";
import Link from "next/link";
import { useState, useMemo } from "react";
import { alumniNetwork, alumniNetworkStats } from "@/lib/mock/alumni";

const collegeFilters = ["الكل", "كلية الأعمال", "كلية العلوم التطبيقية", "كلية الطب", "كلية التمريض"];
const yearFilters   = ["الكل", "2024", "2023", "2022", "2021 وما قبل"];
const cityFilters   = ["الكل", "الرياض", "جدة", "الظهران", "مكة"];

export default function NetworkPage() {
  const [search, setSearch]         = useState("");
  const [collegeF, setCollegeF]     = useState("الكل");
  const [yearF, setYearF]           = useState("الكل");
  const [cityF, setCityF]           = useState("الكل");
  const [showConnected, setShowConnected] = useState(false);
  const [connected, setConnected]   = useState<number[]>([]);
  const [toast, setToast]           = useState<string | null>(null);

  function handleConnect(id: number, name: string) {
    setConnected((p) => [...p, id]);
    setToast(`🤝 تم إرسال طلب التواصل إلى ${name.split(" ")[0]}`);
    setTimeout(() => setToast(null), 3000);
  }

  const isConnected = (id: number) =>
    connected.includes(id) || alumniNetwork.find((a) => a.id === id)?.connected;

  const filtered = useMemo(() => {
    return alumniNetwork.filter((a) => {
      const matchSearch  = !search || a.name.includes(search) || a.company.includes(search) || a.major.includes(search) || a.jobTitle.includes(search);
      const matchCollege = collegeF === "الكل" || a.college === collegeF;
      const matchCity    = cityF === "الكل" || a.city === cityF;
      const matchYear    = yearF === "الكل" ||
        (yearF === "2021 وما قبل" ? a.graduationYear <= 2021 : a.graduationYear === parseInt(yearF));
      const matchConn    = !showConnected || isConnected(a.id);
      return matchSearch && matchCollege && matchCity && matchYear && matchConn;
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, collegeF, cityF, yearF, showConnected, connected]);

  const totalConnected = alumniNetwork.filter((a) => a.connected).length + connected.length;

  return (
    <div className="space-y-6">

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-[#8FA4AB]">
        <Link href="/alumni" className="hover:text-[#875E9E] transition-colors">بوابة الخريجين</Link>
        <span>/</span>
        <span className="text-[#1A2A30] font-medium">شبكة الخريجين</span>
      </div>

      {toast && (
        <div
          className="fixed top-6 start-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-xl text-sm font-semibold text-white shadow-lg"
          style={{ background: "#875E9E" }}
        >
          {toast}
        </div>
      )}

      {/* Hero */}
      <div
        className="rounded-2xl p-6 text-white shadow-sm"
        style={{ background: "linear-gradient(135deg, #875E9E 0%, #6CAEBD 100%)" }}
      >
        <div className="flex items-center gap-3 mb-4">
          <span className="text-4xl">🤝</span>
          <div>
            <h1 className="text-xl font-bold">شبكة الخريجين</h1>
            <p className="text-white/80 text-sm mt-0.5">تواصل مع خريجي جامعة سليمان الراجحي حول العالم</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "إجمالي الخريجين",  value: alumniNetworkStats.totalAlumni.toLocaleString("ar-SA"), icon: "👥" },
            { label: "متواصلون معك",     value: String(totalConnected),                                  icon: "🤝" },
            { label: "طلبات معلّقة",     value: String(alumniNetworkStats.pendingRequests),              icon: "⏳" },
          ].map((s) => (
            <div
              key={s.label}
              className="text-center p-3 rounded-xl"
              style={{ background: "rgba(255,255,255,0.15)" }}
            >
              <p className="text-xl font-bold text-white">{s.value}</p>
              <p className="text-white/70 text-xs mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Filters ── */}
      <div className="bg-white rounded-2xl border border-[#E8EDEF] p-4 space-y-3">

        {/* Search */}
        <div className="relative">
          <span className="absolute start-3 top-1/2 -translate-y-1/2 text-[#8FA4AB] text-sm">🔍</span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ابحث بالاسم أو الشركة أو التخصص..."
            className="w-full ps-9 pe-4 py-2.5 border border-[#D1D5DB] rounded-xl text-sm focus:outline-none focus:border-[#875E9E]"
          />
        </div>

        {/* Filter rows */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="text-xs font-semibold text-[#374151] block mb-1.5">الكلية</label>
            <select
              value={collegeF}
              onChange={(e) => setCollegeF(e.target.value)}
              className="w-full px-3 py-2 border border-[#D1D5DB] rounded-xl text-sm focus:outline-none focus:border-[#875E9E] bg-white"
            >
              {collegeFilters.map((f) => <option key={f}>{f}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-[#374151] block mb-1.5">دفعة التخرج</label>
            <select
              value={yearF}
              onChange={(e) => setYearF(e.target.value)}
              className="w-full px-3 py-2 border border-[#D1D5DB] rounded-xl text-sm focus:outline-none focus:border-[#875E9E] bg-white"
            >
              {yearFilters.map((f) => <option key={f}>{f}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-[#374151] block mb-1.5">المدينة</label>
            <select
              value={cityF}
              onChange={(e) => setCityF(e.target.value)}
              className="w-full px-3 py-2 border border-[#D1D5DB] rounded-xl text-sm focus:outline-none focus:border-[#875E9E] bg-white"
            >
              {cityFilters.map((f) => <option key={f}>{f}</option>)}
            </select>
          </div>
        </div>

        {/* Connected toggle + count */}
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer">
            <div
              className="w-9 h-5 rounded-full relative transition-colors"
              style={{ background: showConnected ? "#875E9E" : "#D1D5DB" }}
              onClick={() => setShowConnected(!showConnected)}
            >
              <div
                className="w-4 h-4 bg-white rounded-full absolute top-0.5 shadow-sm transition-all"
                style={{ [showConnected ? "right" : "left"]: "2px" }}
              />
            </div>
            <span className="text-xs font-semibold text-[#506570]">المتواصلون فقط</span>
          </label>
          <p className="text-xs text-[#8FA4AB]">{filtered.length} خريج</p>
        </div>
      </div>

      {/* ── Alumni cards ── */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#E8EDEF] p-12 text-center">
          <p className="text-4xl mb-3">🔍</p>
          <p className="font-bold text-[#1A2A30]">لا توجد نتائج</p>
          <p className="text-sm text-[#8FA4AB] mt-1">جرّب تغيير معايير البحث</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((alumnus) => {
            const conn = isConnected(alumnus.id);
            return (
              <div
                key={alumnus.id}
                className="bg-white rounded-2xl border border-[#E8EDEF] shadow-sm hover:shadow-md transition-shadow p-5 flex flex-col"
              >
                {/* Avatar + Name */}
                <div className="flex items-start gap-3 mb-3">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-bold text-white shrink-0"
                    style={{ background: `linear-gradient(135deg, ${alumnus.color}, ${alumnus.color}99)` }}
                  >
                    {alumnus.initial}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-[#1F2937] text-sm leading-snug truncate">{alumnus.name}</h3>
                    <p className="text-xs text-[#6B7280] mt-0.5 truncate">{alumnus.jobTitle}</p>
                    <p className="text-xs text-[#9CA3AF] truncate">{alumnus.company}</p>
                  </div>
                  {conn && (
                    <span
                      className="shrink-0 text-xs font-bold px-2 py-0.5 rounded-full"
                      style={{ background: "#DCFCE7", color: "#16A34A" }}
                    >
                      ✓
                    </span>
                  )}
                </div>

                {/* Details */}
                <div className="space-y-1.5 mb-4">
                  <div className="flex items-center gap-2">
                    <span
                      className="text-xs font-medium px-2 py-0.5 rounded-full"
                      style={{ background: alumnus.color + "18", color: alumnus.color }}
                    >
                      {alumnus.major}
                    </span>
                    <span className="text-xs text-[#9CA3AF]">دفعة {alumnus.graduationYear}</span>
                  </div>
                  <p className="text-xs text-[#8FA4AB] flex items-center gap-1">
                    <span>📍</span> {alumnus.city}
                  </p>
                  {alumnus.mutualCount > 0 && (
                    <p className="text-xs text-[#8FA4AB] flex items-center gap-1">
                      <span>👥</span> {alumnus.mutualCount} خريج مشترك
                    </p>
                  )}
                </div>

                {/* CTA */}
                <button
                  onClick={() => !conn && handleConnect(alumnus.id, alumnus.name)}
                  disabled={!!conn}
                  className="mt-auto w-full py-2 rounded-xl text-sm font-bold transition-all disabled:cursor-default"
                  style={conn
                    ? { background: "#F4F7F8", color: "#16A34A" }
                    : { background: "linear-gradient(to left, #875E9E, #6A4A7E)", color: "#fff" }
                  }
                >
                  {conn ? "✓ متواصل" : "تواصل"}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
