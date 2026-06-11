"use client";
import Link from "next/link";
import { useState } from "react";
import { fullScholarships } from "@/lib/mock/scholarships";

export default function FullScholarshipsPage() {
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-[#8FA4AB]">
        <Link href="/scholarships" className="hover:text-[#875E9E] transition-colors">المنح والحلول المالية</Link>
        <span>/</span>
        <span className="text-[#1A2A30] font-medium">المنح الكاملة</span>
      </div>

      {/* Hero */}
      <div
        className="rounded-2xl p-6 text-white shadow-sm"
        style={{ background: "linear-gradient(135deg, #6CAEBD 0%, #875E9E 100%)" }}
      >
        <div className="flex items-center gap-3">
          <span className="text-4xl">🎓</span>
          <div>
            <h1 className="text-xl font-bold">المنح الكاملة — 8 فئات</h1>
            <p className="text-white/80 text-sm mt-0.5">تغطية 100% للرسوم الدراسية</p>
          </div>
        </div>
        <p className="text-white/70 text-xs mt-4 leading-relaxed">
          تُقدِّم الجامعة 8 فئات من المنح الدراسية الكاملة التي تغطي الرسوم الدراسية بالكامل.
          المنحة لا تشمل رسوم السكن أو الوجبات أو المستلزمات الدراسية.
        </p>
      </div>

      {/* Cards */}
      <div className="space-y-4">
        {fullScholarships.map((sch) => {
          const isOpen = expanded === sch.id;
          return (
            <div
              key={sch.id}
              className="bg-white rounded-2xl border border-[#E8EDEF] shadow-sm overflow-hidden"
            >
              <div className="h-1" style={{ background: sch.color }} />
              <div className="p-5">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span
                        className="text-xs font-bold px-2.5 py-0.5 rounded-full"
                        style={{ background: sch.color + "18", color: sch.color }}
                      >
                        المنحة {sch.rank}
                      </span>
                      {sch.partner && (
                        <span className="text-xs text-[#9CA3AF] font-medium">🤝 {sch.partner}</span>
                      )}
                    </div>
                    <h3 className="font-bold text-[#1F2937] text-base leading-snug">{sch.title}</h3>
                    <p className="text-[#6B7280] text-xs mt-0.5">{sch.subtitle}</p>
                  </div>
                  <div
                    className="shrink-0 w-14 h-14 rounded-2xl flex flex-col items-center justify-center"
                    style={{ background: sch.color + "18" }}
                  >
                    <span className="font-bold text-base" style={{ color: sch.color }}>100%</span>
                    <span className="text-xs" style={{ color: sch.color }}>تغطية</span>
                  </div>
                </div>

                <p className="text-[#374151] text-sm mt-3 leading-relaxed">{sch.description}</p>

                {sch.note && (
                  <div className="mt-3 px-4 py-3 rounded-xl text-xs leading-relaxed" style={{ background: "#FEF3C7", color: "#92400E" }}>
                    {sch.note}
                  </div>
                )}

                {(sch.requirements.items.length > 0 || sch.maintenance.items.length > 0) && (
                  <button
                    onClick={() => setExpanded(isOpen ? null : sch.id)}
                    className="mt-4 text-xs font-semibold px-4 py-2 rounded-xl transition-colors"
                    style={{ background: "#E8F6F8", color: "#4A8FA0" }}
                  >
                    {isOpen ? "إخفاء التفاصيل ↑" : "عرض الشروط ↓"}
                  </button>
                )}

                {isOpen && (
                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {sch.requirements.items.length > 0 && (
                      <div className="rounded-xl border border-[#E8EDEF] p-4">
                        <p className="font-bold text-xs text-[#506570] mb-3">{sch.requirements.title}</p>
                        <ul className="space-y-2">
                          {sch.requirements.items.map((item, i) => (
                            <li key={i} className="flex items-start gap-2 text-xs text-[#374151] leading-relaxed">
                              <span className="text-[#6CAEBD] shrink-0 mt-0.5">•</span>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {sch.maintenance.items.length > 0 && (
                      <div className="rounded-xl border border-[#E8EDEF] p-4">
                        <p className="font-bold text-xs text-[#506570] mb-3">{sch.maintenance.title}</p>
                        <ul className="space-y-2">
                          {sch.maintenance.items.map((item, i) => (
                            <li key={i} className="flex items-start gap-2 text-xs text-[#374151] leading-relaxed">
                              <span className="text-[#875E9E] shrink-0 mt-0.5">•</span>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* CTA */}
      <div className="flex flex-wrap gap-3">
        <Link
          href="/scholarships/apply"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
          style={{ background: "linear-gradient(to left, #875E9E, #6A4A7E)" }}
        >
          📝 تقديم طلب منحة
        </Link>
        <Link
          href="/scholarships/partial"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold border border-[#D8C8E8] transition-colors hover:bg-[#F3EEF7]"
          style={{ color: "#875E9E" }}
        >
          📊 المنح الجزئية
        </Link>
      </div>
    </div>
  );
}
