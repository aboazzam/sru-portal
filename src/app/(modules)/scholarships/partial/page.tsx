"use client";
import Link from "next/link";
import { useState } from "react";
import { partialScholarships } from "@/lib/mock/scholarships";

function fmt(n: number) { return n.toLocaleString("ar-SA"); }

export default function PartialScholarshipsPage() {
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-[#8FA4AB]">
        <Link href="/scholarships" className="hover:text-[#875E9E] transition-colors">المنح والحلول المالية</Link>
        <span>/</span>
        <span className="text-[#1A2A30] font-medium">المنح الجزئية</span>
      </div>

      {/* Hero */}
      <div
        className="rounded-2xl p-6 text-white shadow-sm"
        style={{ background: "linear-gradient(135deg, #875E9E 0%, #8FA4AB 100%)" }}
      >
        <div className="flex items-center gap-3">
          <span className="text-4xl">📊</span>
          <div>
            <h1 className="text-xl font-bold">المنح الجزئية — 7 فئات</h1>
            <p className="text-white/80 text-sm mt-0.5">من 10% إلى 40% خصم على الرسوم الدراسية</p>
          </div>
        </div>
      </div>

      {/* Cards */}
      <div className="space-y-4">
        {partialScholarships.map((sch) => {
          const isOpen = expanded === sch.id;
          return (
            <div key={sch.id} className="bg-white rounded-2xl border border-[#E8EDEF] shadow-sm overflow-hidden">
              <div className="h-1" style={{ background: sch.color }} />
              <div className="p-5">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className="text-xs font-bold px-2.5 py-0.5 rounded-full"
                        style={{ background: sch.color + "18", color: sch.color }}
                      >
                        المنحة {sch.rank}
                      </span>
                    </div>
                    <h3 className="font-bold text-[#1F2937] text-base leading-snug">{sch.title}</h3>
                    <p className="text-[#374151] text-sm mt-2 leading-relaxed">{sch.description}</p>
                    {sch.note && (
                      <div className="mt-3 px-4 py-2.5 rounded-xl text-xs leading-relaxed" style={{ background: "#FEF3C7", color: "#92400E" }}>
                        {sch.note}
                      </div>
                    )}
                  </div>
                  <div
                    className="shrink-0 w-14 h-14 rounded-2xl flex flex-col items-center justify-center"
                    style={{ background: sch.color + "18" }}
                  >
                    <span className="font-bold text-base" style={{ color: sch.color }}>{sch.percentage}%</span>
                    <span className="text-xs" style={{ color: sch.color }}>خصم</span>
                  </div>
                </div>

                <button
                  onClick={() => setExpanded(isOpen ? null : sch.id)}
                  className="mt-4 text-xs font-semibold px-4 py-2 rounded-xl transition-colors"
                  style={{ background: "#F3EEF7", color: "#875E9E" }}
                >
                  {isOpen ? "إخفاء جدول الرسوم ↑" : "عرض جدول الرسوم ↓"}
                </button>

                {isOpen && sch.colleges.length > 0 && (
                  <div className="mt-4 rounded-xl overflow-hidden border border-[#E8EDEF]">
                    <table className="w-full text-xs">
                      <thead className="bg-[#F4F7F8]">
                        <tr>
                          <th className="px-4 py-2.5 text-start font-bold text-[#506570]">الكلية / البرنامج</th>
                          <th className="px-4 py-2.5 text-end font-bold text-[#506570]">الرسوم</th>
                          <th className="px-4 py-2.5 text-end font-bold text-[#506570]">نسبة الخصم</th>
                          <th className="px-4 py-2.5 text-end font-bold text-[#506570]">بعد المنحة</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#F4F7F8]">
                        {sch.colleges.map((col, i) => (
                          <tr key={i} className="hover:bg-[#FAFAFA]">
                            <td className="px-4 py-2.5 text-[#374151] font-medium">
                              {col.name ?? col.program}
                              {col.note && <span className="text-[#9CA3AF] ms-1">({col.note})</span>}
                            </td>
                            <td className="px-4 py-2.5 text-end text-[#374151]">{fmt(col.fees)}</td>
                            <td className="px-4 py-2.5 text-end font-semibold" style={{ color: sch.color }}>
                              {col.percentage != null ? `${col.percentage}%` : "—"}
                            </td>
                            <td className="px-4 py-2.5 text-end font-semibold" style={{ color: "#16A34A" }}>
                              {col.afterGrant != null ? fmt(col.afterGrant) : "—"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
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
          href="/scholarships/full"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold border border-[#C8E6EC] hover:bg-[#E8F6F8] transition-colors"
          style={{ color: "#4A8FA0" }}
        >
          🎓 المنح الكاملة
        </Link>
      </div>
    </div>
  );
}
