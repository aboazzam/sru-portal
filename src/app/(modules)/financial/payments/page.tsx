"use client";
import Link from "next/link";
import { useState } from "react";
import { paymentsHistory, financialSummary } from "@/lib/mock/financial";

const methodFilters = ["الكل", "تحويل بنكي", "نقطة البيع", "بطاقة ائتمان"];

function fmt(n: number) {
  return n.toLocaleString("ar-SA");
}

export default function PaymentsPage() {
  const [filter, setFilter] = useState("الكل");

  const filtered =
    filter === "الكل"
      ? paymentsHistory
      : paymentsHistory.filter((p) => p.method === filter);

  const total = filtered.reduce((s, p) => s + p.amount, 0);

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-[#8FA4AB]">
        <Link href="/financial" className="hover:text-[#6CAEBD] transition-colors">الخدمات المالية</Link>
        <span>/</span>
        <span className="text-[#1A2A30] font-medium">سجل المدفوعات</span>
      </div>

      {/* Header */}
      <div className="bg-white rounded-2xl p-5 border border-[#E8EDEF] shadow-sm flex items-center gap-4 flex-wrap">
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0"
          style={{ background: "linear-gradient(135deg, #6CAEBD18, #875E9E18)" }}
        >
          💳
        </div>
        <div className="flex-1">
          <h1 className="font-bold text-[#1A2A30] text-lg">سجل المدفوعات</h1>
          <p className="text-[#8FA4AB] text-sm">
            {filtered.length} دفعة — إجمالي {fmt(total)} {financialSummary.currency}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {methodFilters.map((m) => (
          <button
            key={m}
            onClick={() => setFilter(m)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
              filter === m
                ? "text-white shadow-sm"
                : "bg-white border border-[#E8EDEF] text-[#506570] hover:border-[#6CAEBD]"
            }`}
            style={filter === m ? { background: "#6CAEBD" } : undefined}
          >
            {m}
          </button>
        ))}
      </div>

      {/* Payments list */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#E8EDEF] overflow-hidden">
        {filtered.length === 0 && (
          <div className="p-12 text-center">
            <p className="text-3xl mb-3">📭</p>
            <p className="text-[#8FA4AB]">لا توجد مدفوعات في هذه الفئة</p>
          </div>
        )}
        {filtered.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#F4F7F8]">
                <tr>
                  <th className="px-5 py-3 text-start text-xs font-bold text-[#506570]">رقم العملية</th>
                  <th className="px-5 py-3 text-start text-xs font-bold text-[#506570]">التاريخ</th>
                  <th className="px-5 py-3 text-start text-xs font-bold text-[#506570]">طريقة الدفع</th>
                  <th className="px-5 py-3 text-start text-xs font-bold text-[#506570]">البنك</th>
                  <th className="px-5 py-3 text-start text-xs font-bold text-[#506570]">الرقم المرجعي</th>
                  <th className="px-5 py-3 text-end text-xs font-bold text-[#506570]">المبلغ</th>
                  <th className="px-5 py-3 text-center text-xs font-bold text-[#506570]">الحالة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F4F7F8]">
                {filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-[#F9FAFB] transition-colors">
                    <td className="px-5 py-3.5 font-mono text-xs text-[#6B7280]">{p.id}</td>
                    <td className="px-5 py-3.5 text-[#374151]">
                      {new Date(p.date).toLocaleDateString("ar-SA", {
                        day: "numeric", month: "short", year: "numeric",
                      })}
                    </td>
                    <td className="px-5 py-3.5 font-medium text-[#1F2937]">{p.method}</td>
                    <td className="px-5 py-3.5 text-[#506570]">{p.bank}</td>
                    <td className="px-5 py-3.5 font-mono text-xs text-[#8FA4AB]">{p.reference}</td>
                    <td className="px-5 py-3.5 text-end font-bold" style={{ color: "#16A34A" }}>
                      {fmt(p.amount)} ر
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <span
                        className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full"
                        style={{ color: "#16A34A", background: "#DCFCE7" }}
                      >
                        ✅ مؤكد
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
              {filtered.length > 1 && (
                <tfoot className="bg-[#F4F7F8]">
                  <tr>
                    <td colSpan={5} className="px-5 py-3.5 font-bold text-[#1A2A30] text-sm">
                      إجمالي
                    </td>
                    <td className="px-5 py-3.5 text-end font-bold" style={{ color: "#16A34A" }}>
                      {fmt(total)} ر
                    </td>
                    <td />
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
