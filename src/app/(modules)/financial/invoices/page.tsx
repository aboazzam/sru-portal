"use client";
import Link from "next/link";
import { useState } from "react";
import { invoices, tuitionDetails, type InvStatus } from "@/lib/mock/financial";

const statusConfig: Record<InvStatus, { label: string; color: string; bg: string; icon: string }> = {
  paid:    { label: "مسدد",         color: "#16A34A", bg: "#DCFCE7", icon: "✅" },
  partial: { label: "جزئي",         color: "#D97706", bg: "#FEF3C7", icon: "🔸" },
  unpaid:  { label: "غير مسدد",     color: "#DC2626", bg: "#FEE2E2", icon: "❌" },
  overdue: { label: "متأخر",        color: "#991B1B", bg: "#FEE2E2", icon: "⚠️" },
};

const itemStatusCfg = {
  paid:    { label: "مسدد",         color: "#16A34A", bg: "#DCFCE7" },
  partial: { label: "جزئي",         color: "#D97706", bg: "#FEF3C7" },
  unpaid:  { label: "غير مسدد",     color: "#DC2626", bg: "#FEE2E2" },
  overdue: { label: "متأخر",        color: "#991B1B", bg: "#FEE2E2" },
  pending: { label: "معلق",         color: "#6B7280", bg: "#F3F4F6" },
};

function fmt(n: number) {
  return n.toLocaleString("ar-SA");
}

export default function InvoicesPage() {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-[#8FA4AB]">
        <Link href="/financial" className="hover:text-[#6CAEBD] transition-colors">الخدمات المالية</Link>
        <span>/</span>
        <span className="text-[#1A2A30] font-medium">الفواتير والإيصالات</span>
      </div>

      {/* Header */}
      <div className="bg-white rounded-2xl p-5 border border-[#E8EDEF] shadow-sm flex items-center gap-4">
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0"
          style={{ background: "#E8F6F8" }}
        >
          📄
        </div>
        <div>
          <h1 className="font-bold text-[#1A2A30] text-lg">الفواتير والإيصالات</h1>
          <p className="text-[#8FA4AB] text-sm">{invoices.length} فواتير</p>
        </div>
      </div>

      {/* Invoice list */}
      <div className="space-y-4">
        {invoices.map((inv) => {
          const cfg = statusConfig[inv.status];
          const isOpen = expanded === inv.id;
          const paidPct = Math.round((inv.paid / inv.amount) * 100);

          return (
            <div
              key={inv.id}
              className="bg-white rounded-2xl border border-[#E8EDEF] shadow-sm overflow-hidden"
            >
              {/* Color stripe */}
              <div className="h-1" style={{ background: cfg.color }} />

              <div className="p-5">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span
                        className="text-xs font-bold px-2.5 py-0.5 rounded-full"
                        style={{ background: cfg.bg, color: cfg.color }}
                      >
                        {cfg.icon} {cfg.label}
                      </span>
                      <span className="font-mono text-xs text-[#9CA3AF]">{inv.id}</span>
                    </div>
                    <h3 className="font-bold text-[#1F2937] text-base">{inv.title}</h3>
                    <div className="flex gap-4 mt-1.5 text-xs text-[#8FA4AB] flex-wrap">
                      <span>
                        تاريخ الإصدار: {new Date(inv.issueDate).toLocaleDateString("ar-SA")}
                      </span>
                      <span>
                        آخر موعد: {new Date(inv.dueDate).toLocaleDateString("ar-SA")}
                      </span>
                    </div>
                  </div>

                  <div className="text-end shrink-0">
                    <p className="font-bold text-lg text-[#1A2A30]">{fmt(inv.amount)} ر</p>
                    {inv.remaining > 0 && (
                      <p className="text-xs mt-0.5" style={{ color: "#D97706" }}>
                        متبقي {fmt(inv.remaining)} ر
                      </p>
                    )}
                  </div>
                </div>

                {/* Progress */}
                <div className="mt-4">
                  <div className="flex justify-between text-xs text-[#8FA4AB] mb-1">
                    <span>مدفوع: {fmt(inv.paid)} ر</span>
                    <span>{paidPct}%</span>
                  </div>
                  <div className="w-full bg-[#E8EDEF] rounded-full h-1.5">
                    <div
                      className="h-1.5 rounded-full transition-all"
                      style={{
                        width: `${paidPct}%`,
                        background: inv.status === "paid" ? "#16A34A" : "#6CAEBD",
                      }}
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-4 flex items-center gap-3 flex-wrap">
                  {inv.items.length > 0 && (
                    <button
                      onClick={() => setExpanded(isOpen ? null : inv.id)}
                      className="text-xs font-semibold px-4 py-2 rounded-xl transition-colors"
                      style={{ background: "#E8F6F8", color: "#4A8FA0" }}
                    >
                      {isOpen ? "إخفاء التفاصيل ↑" : "عرض التفاصيل ↓"}
                    </button>
                  )}
                  <button
                    className="text-xs font-semibold px-4 py-2 rounded-xl border border-[#C8D4D8] text-[#506570] hover:bg-[#F4F7F8] transition-colors"
                  >
                    ⬇ تنزيل PDF
                  </button>
                </div>

                {/* Expanded items */}
                {isOpen && inv.items.length > 0 && (
                  <div className="mt-4 rounded-xl overflow-hidden border border-[#E8EDEF]">
                    <table className="w-full text-xs">
                      <thead className="bg-[#F4F7F8]">
                        <tr>
                          <th className="px-4 py-2.5 text-start font-bold text-[#506570]">البند</th>
                          <th className="px-4 py-2.5 text-end font-bold text-[#506570]">المبلغ</th>
                          <th className="px-4 py-2.5 text-end font-bold text-[#506570]">المدفوع</th>
                          <th className="px-4 py-2.5 text-center font-bold text-[#506570]">الحالة</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#F4F7F8]">
                        {(inv.items as typeof tuitionDetails).map((item) => {
                          const ic = itemStatusCfg[item.status] ?? itemStatusCfg.pending;
                          return (
                            <tr key={item.id} className="hover:bg-[#FAFAFA]">
                              <td className="px-4 py-2.5 text-[#374151]">{item.item}</td>
                              <td className="px-4 py-2.5 text-end font-semibold text-[#374151]">{fmt(item.amount)}</td>
                              <td className="px-4 py-2.5 text-end font-semibold" style={{ color: "#16A34A" }}>
                                {fmt(item.paid)}
                              </td>
                              <td className="px-4 py-2.5 text-center">
                                <span
                                  className="inline-block px-2 py-0.5 rounded-full text-xs font-semibold"
                                  style={{ color: ic.color, background: ic.bg }}
                                >
                                  {ic.label}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
