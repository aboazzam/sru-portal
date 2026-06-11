"use client";
import Link from "next/link";
import { useState } from "react";
import { contributionOptions, myContributions, alumniNetworkStats, type ContributionOption } from "@/lib/mock/alumni";

const statusConfig = {
  active:    { label: "نشط",     color: "#16A34A", bg: "#DCFCE7", icon: "✅" },
  paused:    { label: "متوقف",   color: "#D97706", bg: "#FEF3C7", icon: "⏸️" },
  completed: { label: "مكتمل",  color: "#6CAEBD", bg: "#E8F6F8", icon: "🏁" },
};

function JoinModal({ option, onConfirm, onClose }: { option: ContributionOption; onConfirm: () => void; onClose: () => void }) {
  const [agreed, setAgreed] = useState(false);
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.55)" }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="p-5 text-white"
          style={{ background: `linear-gradient(135deg, ${option.color}, ${option.color}AA)` }}
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center text-2xl shrink-0">
              {option.icon}
            </div>
            <div>
              <h3 className="font-bold text-base">{option.title}</h3>
              <p className="text-white/80 text-sm">{option.subtitle}</p>
            </div>
          </div>
        </div>

        <div className="p-5 space-y-4">
          <p className="text-sm text-[#374151] leading-relaxed">{option.description}</p>

          <div className="space-y-2">
            <p className="text-xs font-bold text-[#506570]">ما ستحصل عليه</p>
            {option.benefits.map((b) => (
              <div key={b} className="flex items-start gap-2 text-xs text-[#374151]">
                <span className="shrink-0 mt-0.5" style={{ color: option.color }}>✓</span>
                {b}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl p-3 text-center" style={{ background: option.color + "12" }}>
              <p className="text-xs text-[#8FA4AB]">الوقت المطلوب</p>
              <p className="text-xs font-bold text-[#1F2937] mt-0.5">{option.timeCommit}</p>
            </div>
            <div className="rounded-xl p-3 text-center" style={{ background: option.color + "12" }}>
              <p className="text-xs text-[#8FA4AB]">الأثر</p>
              <p className="text-xs font-bold text-[#1F2937] mt-0.5">{option.impact}</p>
            </div>
          </div>

          <label className="flex items-start gap-2 cursor-pointer">
            <input type="checkbox" className="mt-0.5 shrink-0" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
            <p className="text-xs text-[#374151] leading-relaxed">
              أوافق على الانضمام وفهمت الالتزامات المطلوبة لهذا الخيار.
            </p>
          </label>

          <div className="flex gap-3">
            <button onClick={onClose} className="flex-1 py-2.5 rounded-xl text-sm font-bold border border-[#E8EDEF] text-[#506570] hover:bg-[#F4F7F8]">
              إلغاء
            </button>
            <button
              onClick={onConfirm}
              disabled={!agreed}
              className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white transition-opacity disabled:opacity-40"
              style={{ background: option.color }}
            >
              انضم الآن
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ContributePage() {
  const [modalOption, setModalOption] = useState<ContributionOption | null>(null);
  const [joined, setJoined]           = useState<number[]>([]);
  const [toast, setToast]             = useState<string | null>(null);

  function confirmJoin() {
    if (!modalOption) return;
    setJoined((p) => [...p, modalOption.id]);
    setToast(`🎉 تم انضمامك إلى "${modalOption.title}" بنجاح!`);
    setModalOption(null);
    setTimeout(() => setToast(null), 3500);
  }

  const isJoined = (id: number) =>
    joined.includes(id) || myContributions.some((c) => c.optionId === id);

  const totalContributors = contributionOptions.reduce((s, o) => s + o.joined, 0);

  return (
    <div className="space-y-6">

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-[#8FA4AB]">
        <Link href="/alumni" className="hover:text-[#875E9E] transition-colors">بوابة الخريجين</Link>
        <span>/</span>
        <span className="text-[#1A2A30] font-medium">المساهمة والعطاء</span>
      </div>

      {toast && (
        <div
          className="fixed top-6 start-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-xl text-sm font-semibold text-white shadow-lg"
          style={{ background: "#875E9E" }}
        >
          {toast}
        </div>
      )}

      {/* ── Hero تحفيزي ── */}
      <div
        className="rounded-2xl p-6 text-white shadow-sm relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #875E9E 0%, #6CAEBD 100%)" }}
      >
        <div
          className="absolute -top-8 -end-8 w-32 h-32 rounded-full opacity-10"
          style={{ background: "#fff" }}
        />
        <div className="relative z-10">
          <p className="text-white/70 text-sm mb-1">أثرك لا ينتهي بالتخرج</p>
          <h1 className="text-2xl font-bold">ساهم في بناء الجيل القادم 🌱</h1>
          <p className="text-white/80 text-sm mt-2 leading-relaxed max-w-xl">
            كل خريج يملك خبرة وشبكة وقصة نجاح — شاركها مع الطلاب القادمين وكن جزءاً من مجتمع العطاء في جامعة سليمان الراجحي.
          </p>

          {/* Stats */}
          <div className="mt-5 grid grid-cols-3 gap-3">
            {[
              { label: "خريج مساهم",      value: totalContributors.toLocaleString("ar-SA") },
              { label: "طالب استفاد",      value: "1,200+" },
              { label: "خيار للمشاركة",   value: String(contributionOptions.length) },
            ].map((s) => (
              <div
                key={s.label}
                className="text-center p-3 rounded-xl"
                style={{ background: "rgba(255,255,255,0.18)" }}
              >
                <p className="text-xl font-bold">{s.value}</p>
                <p className="text-white/70 text-xs mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── مساهماتي الحالية ── */}
      {myContributions.length > 0 && (
        <div className="bg-white rounded-2xl border border-[#E8EDEF] shadow-sm overflow-hidden">
          <div className="px-5 py-3 border-b border-[#E8EDEF] flex items-center gap-2" style={{ background: "#F4F7F8" }}>
            <span>❤️</span>
            <h2 className="font-bold text-[#1A2A30] text-sm">مساهماتي الحالية</h2>
            <span
              className="ms-auto text-xs font-semibold px-2 py-0.5 rounded-full"
              style={{ background: "#DCFCE7", color: "#16A34A" }}
            >
              {myContributions.length} نشطة
            </span>
          </div>
          <div className="divide-y divide-[#F4F7F8]">
            {myContributions.map((c) => {
              const sc = statusConfig[c.status];
              return (
                <div key={c.id} className="px-5 py-4 flex items-start gap-3 hover:bg-[#F9FAFB] transition-colors">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
                    style={{ background: c.color + "18" }}
                  >
                    {c.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-sm text-[#1F2937]">{c.title}</p>
                      <span
                        className="text-xs font-semibold px-2 py-0.5 rounded-full flex items-center gap-1"
                        style={{ background: sc.bg, color: sc.color }}
                      >
                        {sc.icon} {sc.label}
                      </span>
                    </div>
                    <p className="text-xs text-[#6B7280] mt-0.5 leading-relaxed">{c.detail}</p>
                    <p className="text-xs text-[#9CA3AF] mt-0.5">
                      انضممت: {new Date(c.joinedDate).toLocaleDateString("ar-SA", { day: "numeric", month: "long", year: "numeric" })}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── خيارات المساهمة ── */}
      <div>
        <h2 className="font-bold text-[#1A2A30] text-sm flex items-center gap-2 mb-4">
          <span>🌟</span> خيارات المساهمة
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {contributionOptions.map((opt) => {
            const joined_ = isJoined(opt.id);
            return (
              <div
                key={opt.id}
                className="bg-white rounded-2xl border shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow"
                style={{ borderColor: joined_ ? opt.color + "50" : "#E8EDEF" }}
              >
                <div className="h-1" style={{ background: opt.color }} />
                <div className="p-5 flex flex-col flex-1">
                  {/* Header */}
                  <div className="flex items-start gap-3 mb-3">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0"
                      style={{ background: opt.color + "18" }}
                    >
                      {opt.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-[#1F2937] text-base">{opt.title}</h3>
                        {joined_ && (
                          <span
                            className="text-xs font-bold px-2 py-0.5 rounded-full"
                            style={{ background: "#DCFCE7", color: "#16A34A" }}
                          >
                            ✓ منضم
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#8FA4AB] mt-0.5">{opt.subtitle}</p>
                    </div>
                  </div>

                  <p className="text-sm text-[#374151] leading-relaxed mb-3">{opt.description}</p>

                  {/* Meta chips */}
                  <div className="flex gap-2 flex-wrap mb-3">
                    <span
                      className="text-xs font-medium px-2.5 py-1 rounded-full"
                      style={{ background: opt.color + "15", color: opt.color }}
                    >
                      ⏱ {opt.timeCommit}
                    </span>
                    <span
                      className="text-xs font-medium px-2.5 py-1 rounded-full"
                      style={{ background: opt.color + "15", color: opt.color }}
                    >
                      🎯 {opt.impact}
                    </span>
                  </div>

                  {/* Benefits */}
                  <div className="space-y-1.5 mb-4">
                    {opt.benefits.map((b) => (
                      <div key={b} className="flex items-start gap-2 text-xs text-[#374151]">
                        <span className="shrink-0 mt-0.5" style={{ color: opt.color }}>✓</span>
                        {b}
                      </div>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between mt-auto">
                    <p className="text-xs text-[#8FA4AB]">
                      👥 {opt.joined.toLocaleString("ar-SA")} خريج منضم
                    </p>
                    <button
                      onClick={() => !joined_ && setModalOption(opt)}
                      disabled={joined_}
                      className="px-5 py-2 rounded-xl text-sm font-bold text-white transition-opacity disabled:opacity-60 disabled:cursor-default"
                      style={{ background: joined_ ? "#8FA4AB" : `linear-gradient(to left, ${opt.color}, ${opt.color}CC)` }}
                    >
                      {joined_ ? "✓ منضم" : "انضم الآن"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Network note */}
      <div
        className="rounded-2xl p-5 flex items-start gap-4"
        style={{ background: "linear-gradient(to left, #875E9E08, #6CAEBD08)", border: "1px solid #D8C8E8" }}
      >
        <span className="text-2xl shrink-0">💬</span>
        <div>
          <p className="font-bold text-sm text-[#1A2A30]">شارك التجربة مع شبكتك</p>
          <p className="text-xs text-[#6B7280] mt-0.5 leading-relaxed">
            ادعُ زملاءك الخريجين للانضمام — كل مساهم يوسّع أثر مجتمع الخريجين في الجامعة.
          </p>
          <Link href="/alumni/network" className="text-xs font-semibold underline mt-1 inline-block" style={{ color: "#875E9E" }}>
            تصفح شبكة الخريجين ←
          </Link>
        </div>
      </div>

      {modalOption && (
        <JoinModal option={modalOption} onConfirm={confirmJoin} onClose={() => setModalOption(null)} />
      )}
    </div>
  );
}
