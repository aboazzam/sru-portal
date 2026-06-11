"use client";
import Link from "next/link";
import { useState } from "react";
import { financialRequests, requestTypes, type ReqStatus } from "@/lib/mock/financial";

const statusConfig: Record<ReqStatus, { label: string; color: string; bg: string; icon: string }> = {
  approved:  { label: "مقبول",   color: "#16A34A", bg: "#DCFCE7", icon: "✅" },
  completed: { label: "مكتمل",   color: "#2563EB", bg: "#DBEAFE", icon: "🏁" },
  rejected:  { label: "مرفوض",   color: "#DC2626", bg: "#FEE2E2", icon: "❌" },
  pending:   { label: "قيد المراجعة", color: "#D97706", bg: "#FEF3C7", icon: "⏳" },
};

function fmt(n: number) {
  return n.toLocaleString("ar-SA");
}

export default function RequestsPage() {
  const [selectedType, setSelectedType] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    setSelectedType(null);
    setTimeout(() => setSubmitted(false), 4000);
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-[#8FA4AB]">
        <Link href="/financial" className="hover:text-[#6CAEBD] transition-colors">الخدمات المالية</Link>
        <span>/</span>
        <span className="text-[#1A2A30] font-medium">الطلبات المالية</span>
      </div>

      {/* Success toast */}
      {submitted && (
        <div
          className="flex items-center gap-3 px-5 py-4 rounded-xl shadow-sm"
          style={{ background: "#DCFCE7", color: "#16A34A", border: "1px solid #86EFAC" }}
        >
          <span className="text-xl">✅</span>
          <p className="font-semibold text-sm">تم تقديم طلبك بنجاح — سيتم مراجعته خلال 3-5 أيام عمل</p>
        </div>
      )}

      {/* New request form */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#E8EDEF] overflow-hidden">
        <div
          className="px-5 py-4 border-b border-[#E8EDEF] flex items-center gap-3"
        >
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-lg"
            style={{ background: "#E8F6F8" }}
          >
            📝
          </div>
          <h2 className="font-bold text-[#1A2A30]">تقديم طلب مالي جديد</h2>
        </div>

        <div className="p-5">
          {/* Request type grid */}
          <p className="text-xs font-semibold text-[#8FA4AB] mb-3 uppercase tracking-wide">
            اختر نوع الطلب
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-5">
            {requestTypes.map((rt) => (
              <button
                key={rt.id}
                onClick={() => setSelectedType(selectedType === rt.id ? null : rt.id)}
                className={`flex flex-col items-start gap-1.5 p-4 rounded-xl border text-start transition-all ${
                  selectedType === rt.id
                    ? "shadow-sm"
                    : "border-[#E8EDEF] hover:border-[#6CAEBD] hover:bg-[#E8F6F8]/30"
                }`}
                style={
                  selectedType === rt.id
                    ? { borderColor: "#6CAEBD", background: "#E8F6F8" }
                    : undefined
                }
              >
                <span className="text-xl">{rt.icon}</span>
                <span className="text-xs font-semibold text-[#1A2A30] leading-snug">{rt.label}</span>
                <span className="text-xs text-[#8FA4AB] leading-relaxed">{rt.description}</span>
              </button>
            ))}
          </div>

          {/* Form fields */}
          {selectedType !== null && (
            <form onSubmit={handleSubmit} className="space-y-4 border-t border-[#E8EDEF] pt-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#374151] mb-1.5">
                    المبلغ المطلوب (ريال)
                  </label>
                  <input
                    type="number"
                    min={1}
                    required
                    placeholder="0"
                    className="w-full px-4 py-2.5 border border-[#D1D5DB] rounded-xl text-sm focus:outline-none focus:ring-2 focus:border-transparent"
                    style={{ "--tw-ring-color": "#6CAEBD" } as React.CSSProperties}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#374151] mb-1.5">
                    الفصل الدراسي
                  </label>
                  <select
                    required
                    className="w-full px-4 py-2.5 border border-[#D1D5DB] rounded-xl text-sm focus:outline-none bg-white"
                  >
                    <option value="">اختر الفصل</option>
                    <option>الفصل الثاني 1446-1447</option>
                    <option>الفصل الأول 1446-1447</option>
                    <option>الفصل الثاني 1445-1446</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#374151] mb-1.5">
                  سبب الطلب
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="اكتب تفاصيل طلبك هنا..."
                  className="w-full px-4 py-2.5 border border-[#D1D5DB] rounded-xl text-sm focus:outline-none resize-none leading-relaxed"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#374151] mb-1.5">
                  المستندات الداعمة (اختياري)
                </label>
                <div className="border-2 border-dashed border-[#C8D4D8] rounded-xl p-5 text-center">
                  <p className="text-2xl mb-2">📎</p>
                  <p className="text-xs text-[#8FA4AB]">اسحب الملفات هنا أو انقر للاختيار</p>
                  <p className="text-xs text-[#C8D4D8] mt-1">PDF, JPG, PNG – بحد أقصى 5MB</p>
                </div>
              </div>
              <button
                type="submit"
                className="w-full py-3 rounded-xl text-sm font-bold text-white transition-opacity hover:opacity-90"
                style={{ background: "linear-gradient(to left, #6CAEBD, #4A8FA0)" }}
              >
                تقديم الطلب →
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Previous requests */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#E8EDEF] overflow-hidden">
        <div className="px-5 py-4 border-b border-[#E8EDEF] flex items-center gap-2">
          <span>📋</span>
          <h2 className="font-bold text-[#1A2A30] text-sm">الطلبات السابقة</h2>
        </div>
        <div className="divide-y divide-[#F4F7F8]">
          {financialRequests.map((req) => {
            const cfg = statusConfig[req.status];
            return (
              <div
                key={req.id}
                className="px-5 py-4 flex items-start gap-4 hover:bg-[#F9FAFB] transition-colors"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0"
                  style={{ background: cfg.bg }}
                >
                  {cfg.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="font-semibold text-sm text-[#1F2937]">{req.type}</span>
                    <span className="font-mono text-xs text-[#9CA3AF]">{req.id}</span>
                  </div>
                  <p className="text-xs text-[#6B7280]">{req.note}</p>
                  <p className="text-xs text-[#9CA3AF] mt-1">
                    {new Date(req.date).toLocaleDateString("ar-SA", {
                      day: "numeric", month: "long", year: "numeric",
                    })}
                  </p>
                </div>
                <div className="shrink-0 text-end">
                  <p className="font-bold text-sm text-[#1A2A30]">{fmt(req.amount)} ر</p>
                  <span
                    className="inline-block mt-1 text-xs font-semibold px-2.5 py-0.5 rounded-full"
                    style={{ color: cfg.color, background: cfg.bg }}
                  >
                    {cfg.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
