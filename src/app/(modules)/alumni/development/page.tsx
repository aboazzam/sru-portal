"use client";
import Link from "next/link";
import { useState, useMemo } from "react";
import {
  developmentPrograms,
  myDevelopmentPrograms,
  type DevCategory,
} from "@/lib/mock/alumni";

type MainTab = "browse" | "mine";

const catFilters: { value: DevCategory | "all"; label: string; icon: string }[] = [
  { value: "all",         label: "الكل",      icon: "📋" },
  { value: "certificate", label: "شهادات",    icon: "🏆" },
  { value: "workshop",    label: "ورش",       icon: "🛠️" },
  { value: "seminar",     label: "ندوات",     icon: "🎙️" },
  { value: "course",      label: "دورات",     icon: "📚" },
];

const modeLabel: Record<string, string> = {
  online:  "عن بُعد",
  onsite:  "حضوري",
  hybrid:  "هجين",
};

const devStatusConfig = {
  enrolled:  { label: "مسجّل",    color: "#875E9E", bg: "#F3EEF7", icon: "📋" },
  completed: { label: "مكتمل",   color: "#16A34A", bg: "#DCFCE7", icon: "✅" },
  available: { label: "متاح",    color: "#6CAEBD", bg: "#E8F6F8", icon: "🔓" },
};

export default function DevelopmentPage() {
  const [tab, setTab]         = useState<MainTab>("browse");
  const [catFilter, setCatFilter] = useState<DevCategory | "all">("all");
  const [enrolled, setEnrolled]   = useState<number[]>([]);
  const [toast, setToast]         = useState<string | null>(null);

  function handleEnroll(id: number, title: string) {
    setEnrolled((p) => [...p, id]);
    setToast(`✅ تم تسجيلك في "${title}"`);
    setTimeout(() => setToast(null), 3000);
  }

  const filtered = useMemo(() =>
    developmentPrograms.filter((p) => catFilter === "all" || p.category === catFilter),
    [catFilter],
  );

  return (
    <div className="space-y-6">

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-[#8FA4AB]">
        <Link href="/alumni" className="hover:text-[#875E9E] transition-colors">بوابة الخريجين</Link>
        <span>/</span>
        <span className="text-[#1A2A30] font-medium">التطوير المهني</span>
      </div>

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
        style={{ background: "linear-gradient(135deg, #875E9E 0%, #4A8FA0 100%)" }}
      >
        <div className="flex items-center gap-3">
          <span className="text-4xl">📈</span>
          <div>
            <h1 className="text-xl font-bold">التطوير المهني</h1>
            <p className="text-white/80 text-sm mt-0.5">
              برامج حصرية لخريجي الجامعة — خصم 30% على أغلب البرامج
            </p>
          </div>
        </div>
        <div className="mt-4 flex gap-4 text-sm flex-wrap">
          <span className="text-white/80 flex items-center gap-1.5">🏆 {developmentPrograms.filter(p=>p.category==="certificate").length} شهادات</span>
          <span className="text-white/80 flex items-center gap-1.5">🛠️ {developmentPrograms.filter(p=>p.category==="workshop").length} ورش</span>
          <span className="text-white/80 flex items-center gap-1.5">🎙️ {developmentPrograms.filter(p=>p.category==="seminar").length} ندوات</span>
          <span className="text-white/80 flex items-center gap-1.5">📚 {developmentPrograms.filter(p=>p.category==="course").length} دورات</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-[#F4F7F8] rounded-xl p-1 w-fit">
        {([
          { id: "browse", label: "تصفح البرامج", icon: "🔍" },
          { id: "mine",   label: `برامجي (${myDevelopmentPrograms.length})`, icon: "🎓" },
        ] as { id: MainTab; label: string; icon: string }[]).map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all"
            style={tab === t.id ? { background: "#875E9E", color: "#fff" } : { color: "#506570" }}
          >
            <span>{t.icon}</span><span>{t.label}</span>
          </button>
        ))}
      </div>

      {/* ── Browse ── */}
      {tab === "browse" && (
        <div className="space-y-5">
          {/* Category filter */}
          <div className="flex gap-2 flex-wrap">
            {catFilters.map((f) => (
              <button
                key={f.value}
                onClick={() => setCatFilter(f.value)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all"
                style={catFilter === f.value
                  ? { background: "#875E9E", color: "#fff" }
                  : { background: "#F4F7F8", color: "#506570" }
                }
              >
                <span>{f.icon}</span><span>{f.label}</span>
                {f.value !== "all" && (
                  <span
                    className="text-xs px-1.5 py-0.5 rounded-full"
                    style={catFilter === f.value
                      ? { background: "rgba(255,255,255,0.3)", color: "#fff" }
                      : { background: "#E8EDEF", color: "#8FA4AB" }
                    }
                  >
                    {developmentPrograms.filter(p => p.category === f.value).length}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Cards */}
          {filtered.length === 0 && (
            <div className="bg-white rounded-2xl border border-[#E8EDEF] p-12 text-center shadow-sm">
              <p className="text-4xl mb-3">📚</p>
              <p className="font-bold text-[#1A2A30]">لا توجد برامج في هذه الفئة حالياً</p>
              <p className="text-sm text-[#8FA4AB] mt-1">جرّب اختيار فئة أخرى</p>
            </div>
          )}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filtered.map((prog) => {
              const isEnrolled = enrolled.includes(prog.id) ||
                myDevelopmentPrograms.some(m => m.programId === prog.id);
              const isFree = prog.alumniPrice === 0;
              const daysLeft = Math.max(0, Math.ceil(
                (new Date(prog.startDate).getTime() - Date.now()) / 86400000
              ));

              return (
                <div
                  key={prog.id}
                  className="bg-white rounded-2xl border border-[#E8EDEF] shadow-sm overflow-hidden flex flex-col"
                >
                  <div className="h-1" style={{ background: prog.color }} />
                  <div className="p-5 flex flex-col flex-1">
                    {/* Header */}
                    <div className="flex items-start gap-3 mb-3">
                      <div
                        className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl shrink-0"
                        style={{ background: prog.color + "18" }}
                      >
                        {prog.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-[#1F2937] text-sm leading-snug">{prog.title}</h3>
                        <p className="text-xs text-[#8FA4AB] mt-0.5">{prog.provider}</p>
                      </div>
                      <div className="shrink-0 text-end">
                        {isFree ? (
                          <span
                            className="text-xs font-bold px-2.5 py-1 rounded-full"
                            style={{ background: "#DCFCE7", color: "#16A34A" }}
                          >
                            مجانية
                          </span>
                        ) : (
                          <div>
                            <p className="text-xs line-through text-[#9CA3AF]">{prog.price.toLocaleString("ar-SA")} ريال</p>
                            <p className="text-sm font-bold" style={{ color: prog.color }}>
                              {prog.alumniPrice.toLocaleString("ar-SA")} ريال
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    <p className="text-xs text-[#374151] leading-relaxed mb-3">{prog.description}</p>

                    {/* Skills */}
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {prog.skills.map((sk) => (
                        <span
                          key={sk}
                          className="text-xs px-2 py-0.5 rounded-lg"
                          style={{ background: "#F4F7F8", color: "#506570" }}
                        >
                          {sk}
                        </span>
                      ))}
                    </div>

                    {/* Meta */}
                    <div className="flex items-center gap-3 text-xs text-[#6B7280] flex-wrap mb-4 mt-auto">
                      <span>⏱ {prog.duration}</span>
                      <span>📍 {modeLabel[prog.mode]}</span>
                      <span>⭐ {prog.rating}</span>
                      {daysLeft > 0
                        ? <span className={daysLeft <= 7 ? "font-semibold text-[#DC2626]" : ""}>
                            📅 بعد {daysLeft} يوم
                          </span>
                        : <span className="text-[#DC2626] font-semibold">انتهى التسجيل</span>
                      }
                      {!isFree && (
                        <span
                          className="font-bold px-2 py-0.5 rounded-full"
                          style={{ background: prog.color + "18", color: prog.color }}
                        >
                          خصم {prog.discount}%
                        </span>
                      )}
                    </div>

                    {/* Seats bar */}
                    <div className="mb-4">
                      <div className="flex justify-between text-xs text-[#9CA3AF] mb-1">
                        <span>المقاعد المتبقية</span>
                        <span>{prog.seatsLeft} / {prog.seats}</span>
                      </div>
                      <div className="w-full bg-[#E8EDEF] rounded-full h-1.5">
                        <div
                          className="h-1.5 rounded-full"
                          style={{
                            width: `${((prog.seats - prog.seatsLeft) / prog.seats) * 100}%`,
                            background: prog.color,
                          }}
                        />
                      </div>
                    </div>

                    <button
                      onClick={() => !isEnrolled && handleEnroll(prog.id, prog.title)}
                      disabled={isEnrolled || daysLeft === 0}
                      className="w-full py-2.5 rounded-xl text-sm font-bold text-white transition-opacity disabled:opacity-60"
                      style={{ background: isEnrolled ? "#8FA4AB" : `linear-gradient(to left, ${prog.color}, ${prog.color}CC)` }}
                    >
                      {isEnrolled ? "✓ مسجّل" : isFree ? "سجّل مجاناً" : "سجّل الآن"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── My Programs ── */}
      {tab === "mine" && (
        <div className="space-y-4">
          {myDevelopmentPrograms.map((prog) => {
            const sc = devStatusConfig[prog.status];
            return (
              <div
                key={prog.id}
                className="bg-white rounded-2xl border border-[#E8EDEF] shadow-sm overflow-hidden"
              >
                <div className="h-1" style={{ background: prog.color }} />
                <div className="p-5">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div className="flex items-start gap-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
                        style={{ background: prog.color + "18" }}
                      >
                        {prog.icon}
                      </div>
                      <div>
                        <h3 className="font-bold text-[#1F2937] text-sm">{prog.title}</h3>
                        <p className="text-xs text-[#8FA4AB] mt-0.5">{prog.provider}</p>
                        <p className="text-xs text-[#9CA3AF] mt-0.5">
                          {new Date(prog.startDate).toLocaleDateString("ar-SA", { day: "numeric", month: "long", year: "numeric" })}
                          {prog.endDate && ` — ${new Date(prog.endDate).toLocaleDateString("ar-SA", { day: "numeric", month: "long" })}`}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {prog.grade && (
                        <span
                          className="text-xs font-bold px-2.5 py-1 rounded-full"
                          style={{ background: "#DCFCE7", color: "#16A34A" }}
                        >
                          {prog.grade}
                        </span>
                      )}
                      <span
                        className="text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1"
                        style={{ background: sc.bg, color: sc.color }}
                      >
                        {sc.icon} {sc.label}
                      </span>
                    </div>
                  </div>

                  {prog.status === "enrolled" && (
                    <div className="mt-3 ms-13">
                      <div className="flex justify-between text-xs text-[#9CA3AF] mb-1">
                        <span>التقدم</span><span>{prog.progress}%</span>
                      </div>
                      <div className="w-full bg-[#E8EDEF] rounded-full h-1.5">
                        <div
                          className="h-1.5 rounded-full"
                          style={{ width: `${prog.progress}%`, background: prog.color }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
