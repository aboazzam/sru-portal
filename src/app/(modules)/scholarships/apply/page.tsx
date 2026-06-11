"use client";
import Link from "next/link";
import { useState } from "react";
import { fullScholarships, partialScholarships, applicationJourney } from "@/lib/mock/scholarships";

type Step = "type" | "details" | "docs" | "confirm";

const allScholarships = [
  ...fullScholarships.map((s) => ({ id: `full-${s.id}`, label: s.title, type: "كاملة", color: s.color })),
  ...partialScholarships.map((s) => ({ id: `partial-${s.id}`, label: s.title, type: "جزئية", color: s.color })),
];

export default function ApplyPage() {
  const [step, setStep]              = useState<Step>("type");
  const [selected, setSelected]      = useState<string>("");
  const [reason, setReason]          = useState("");
  const [college, setCollege]        = useState("");
  const [submitted, setSubmitted]    = useState(false);

  const stepOrder: Step[] = ["type", "details", "docs", "confirm"];
  const currentIdx = stepOrder.indexOf(step);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center text-4xl shadow-md"
          style={{ background: "linear-gradient(135deg, #875E9E, #6CAEBD)" }}
        >
          ✅
        </div>
        <div>
          <h2 className="text-xl font-bold text-[#1A2A30]">تم تقديم طلبك بنجاح!</h2>
          <p className="text-[#6B7280] text-sm mt-1">سيتم مراجعة طلبك وإشعارك خلال 5–10 أيام عمل</p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/scholarships/track"
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
            style={{ background: "#875E9E" }}
          >
            🔍 تتبع طلبك
          </Link>
          <Link
            href="/scholarships"
            className="px-5 py-2.5 rounded-xl text-sm font-semibold border border-[#D8C8E8] hover:bg-[#F3EEF7] transition-colors"
            style={{ color: "#875E9E" }}
          >
            العودة للرئيسية
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-[#8FA4AB]">
        <Link href="/scholarships" className="hover:text-[#875E9E] transition-colors">المنح والحلول المالية</Link>
        <span>/</span>
        <span className="text-[#1A2A30] font-medium">تقديم طلب منحة</span>
      </div>

      {/* Stepper */}
      <div className="bg-white rounded-2xl border border-[#E8EDEF] p-5">
        <div className="flex items-center gap-0">
          {[
            { id: "type",    label: "نوع المنحة" },
            { id: "details", label: "التفاصيل" },
            { id: "docs",    label: "المستندات" },
            { id: "confirm", label: "المراجعة" },
          ].map((s, i) => {
            const done    = stepOrder.indexOf(s.id as Step) < currentIdx;
            const active  = s.id === step;
            return (
              <div key={s.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center gap-1">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                    style={{
                      background: done ? "#875E9E" : active ? "linear-gradient(135deg, #875E9E, #6CAEBD)" : "#E8EDEF",
                      color: done || active ? "#fff" : "#8FA4AB",
                    }}
                  >
                    {done ? "✓" : i + 1}
                  </div>
                  <span className={`text-xs font-medium hidden sm:block ${active ? "text-[#875E9E]" : "text-[#9CA3AF]"}`}>
                    {s.label}
                  </span>
                </div>
                {i < 3 && (
                  <div
                    className="flex-1 h-0.5 mx-2"
                    style={{ background: done ? "#875E9E" : "#E8EDEF" }}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Step content */}
      <form onSubmit={submit} className="space-y-4">
        {/* Step 1: Select scholarship type */}
        {step === "type" && (
          <div className="bg-white rounded-2xl border border-[#E8EDEF] p-5 space-y-4">
            <h2 className="font-bold text-[#1A2A30]">اختر نوع المنحة</h2>
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {allScholarships.map((s) => (
                <label
                  key={s.id}
                  className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${
                    selected === s.id ? "shadow-sm" : "border-[#E8EDEF] hover:border-[#875E9E]/40"
                  }`}
                  style={selected === s.id ? { borderColor: s.color, background: s.color + "0A" } : undefined}
                >
                  <input
                    type="radio"
                    name="scholarship"
                    value={s.id}
                    checked={selected === s.id}
                    onChange={() => setSelected(s.id)}
                    className="shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-[#1F2937] leading-snug">{s.label}</p>
                    <span
                      className="inline-block mt-1 text-xs px-2 py-0.5 rounded-full font-medium"
                      style={{ background: s.color + "18", color: s.color }}
                    >
                      منحة {s.type}
                    </span>
                  </div>
                </label>
              ))}
            </div>
            <button
              type="button"
              disabled={!selected}
              onClick={() => setStep("details")}
              className="w-full py-3 rounded-xl text-sm font-bold text-white transition-opacity disabled:opacity-40"
              style={{ background: "linear-gradient(to left, #875E9E, #6A4A7E)" }}
            >
              التالي ←
            </button>
          </div>
        )}

        {/* Step 2: Details */}
        {step === "details" && (
          <div className="bg-white rounded-2xl border border-[#E8EDEF] p-5 space-y-4">
            <h2 className="font-bold text-[#1A2A30]">التفاصيل الأكاديمية</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#374151] mb-1.5">الكلية</label>
                <select
                  required
                  value={college}
                  onChange={(e) => setCollege(e.target.value)}
                  className="w-full px-4 py-2.5 border border-[#D1D5DB] rounded-xl text-sm focus:outline-none bg-white"
                >
                  <option value="">اختر الكلية</option>
                  <option>كلية الطب</option>
                  <option>كلية التمريض</option>
                  <option>كلية العلوم التطبيقية</option>
                  <option>كلية سليمان الراجحي للأعمال</option>
                  <option>السنة التأسيسية</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#374151] mb-1.5">العام الدراسي</label>
                <select
                  required
                  className="w-full px-4 py-2.5 border border-[#D1D5DB] rounded-xl text-sm focus:outline-none bg-white"
                >
                  <option>1447هـ</option>
                  <option>1448هـ</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#374151] mb-1.5">المعدل التراكمي الأخير</label>
              <input
                type="number"
                min={0}
                max={5}
                step={0.01}
                required
                placeholder="مثال: 4.50"
                className="w-full px-4 py-2.5 border border-[#D1D5DB] rounded-xl text-sm focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#374151] mb-1.5">سبب التقديم على المنحة</label>
              <textarea
                required
                rows={3}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="اكتب سبب تقديمك للحصول على المنحة..."
                className="w-full px-4 py-2.5 border border-[#D1D5DB] rounded-xl text-sm focus:outline-none resize-none leading-relaxed"
              />
            </div>
            <div className="flex gap-3">
              <button type="button" onClick={() => setStep("type")}
                className="flex-1 py-3 rounded-xl text-sm font-bold border border-[#D8C8E8] hover:bg-[#F3EEF7] transition-colors"
                style={{ color: "#875E9E" }}>
                ← رجوع
              </button>
              <button type="button" disabled={!college || !reason} onClick={() => setStep("docs")}
                className="flex-1 py-3 rounded-xl text-sm font-bold text-white transition-opacity disabled:opacity-40"
                style={{ background: "linear-gradient(to left, #875E9E, #6A4A7E)" }}>
                التالي ←
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Documents */}
        {step === "docs" && (
          <div className="bg-white rounded-2xl border border-[#E8EDEF] p-5 space-y-4">
            <h2 className="font-bold text-[#1A2A30]">رفع المستندات</h2>
            <p className="text-xs text-[#6B7280]">يرجى رفع المستندات المطلوبة لإتمام التقديم. كل المستندات اختيارية في هذه المرحلة التجريبية.</p>
            {[
              { label: "شهادة نسبة الثانوية العامة", required: true },
              { label: "كشف درجات الجامعة",          required: true },
              { label: "إثبات الهوية (الهوية الوطنية أو الإقامة)", required: true },
              { label: "خطاب الدعم (إن وجد)",          required: false },
            ].map((doc) => (
              <div key={doc.label} className="border-2 border-dashed border-[#C8D4D8] rounded-xl p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0" style={{ background: "#F3EEF7" }}>
                  📎
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#1F2937]">
                    {doc.label}
                    {doc.required && <span className="text-red-500 ms-1">*</span>}
                  </p>
                  <p className="text-xs text-[#9CA3AF]">PDF, JPG, PNG – بحد أقصى 5MB</p>
                </div>
                <button
                  type="button"
                  className="shrink-0 text-xs font-semibold px-3 py-1.5 rounded-lg border border-[#D8C8E8] hover:bg-[#F3EEF7] transition-colors"
                  style={{ color: "#875E9E" }}
                >
                  رفع الملف
                </button>
              </div>
            ))}
            <div className="flex gap-3">
              <button type="button" onClick={() => setStep("details")}
                className="flex-1 py-3 rounded-xl text-sm font-bold border border-[#D8C8E8] hover:bg-[#F3EEF7] transition-colors"
                style={{ color: "#875E9E" }}>
                ← رجوع
              </button>
              <button type="button" onClick={() => setStep("confirm")}
                className="flex-1 py-3 rounded-xl text-sm font-bold text-white transition-opacity"
                style={{ background: "linear-gradient(to left, #875E9E, #6A4A7E)" }}>
                التالي ←
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Confirm */}
        {step === "confirm" && (
          <div className="bg-white rounded-2xl border border-[#E8EDEF] p-5 space-y-4">
            <h2 className="font-bold text-[#1A2A30]">مراجعة وتأكيد الطلب</h2>
            <div className="rounded-xl border border-[#E8EDEF] divide-y divide-[#F4F7F8]">
              {[
                { label: "نوع المنحة",   value: allScholarships.find((s) => s.id === selected)?.label ?? "—" },
                { label: "الكلية",       value: college },
                { label: "سبب التقديم", value: reason },
              ].map((row) => (
                <div key={row.label} className="px-5 py-3.5 flex items-start gap-3">
                  <p className="text-xs text-[#8FA4AB] w-28 shrink-0 pt-0.5">{row.label}</p>
                  <p className="text-sm text-[#1F2937] font-medium leading-relaxed">{row.value}</p>
                </div>
              ))}
            </div>
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" required className="mt-0.5 shrink-0" />
              <p className="text-xs text-[#374151] leading-relaxed">
                أقر بصحة المعلومات المقدمة وأوافق على شروط وأحكام سياسة المنح لجامعة سليمان الراجحي.
              </p>
            </label>
            <div className="flex gap-3">
              <button type="button" onClick={() => setStep("docs")}
                className="flex-1 py-3 rounded-xl text-sm font-bold border border-[#D8C8E8] hover:bg-[#F3EEF7] transition-colors"
                style={{ color: "#875E9E" }}>
                ← رجوع
              </button>
              <button type="submit"
                className="flex-1 py-3 rounded-xl text-sm font-bold text-white transition-opacity hover:opacity-90"
                style={{ background: "linear-gradient(to left, #875E9E, #6A4A7E)" }}>
                تقديم الطلب ✓
              </button>
            </div>
          </div>
        )}
      </form>

      {/* Journey mini */}
      <div className="bg-white rounded-2xl border border-[#E8EDEF] p-5">
        <h3 className="font-bold text-[#1A2A30] text-sm mb-4 flex items-center gap-2">
          <span>🗺️</span> خطوات التقديم
        </h3>
        <ol className="space-y-3">
          {applicationJourney.map((j) => (
            <li key={j.step} className="flex items-start gap-3">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                style={{
                  background: j.actor === "الطالب"
                    ? "linear-gradient(135deg, #875E9E, #6CAEBD)"
                    : "linear-gradient(135deg, #6CAEBD, #8FA4AB)",
                }}
              >
                {j.step}
              </div>
              <div>
                <p className="text-xs font-semibold text-[#1F2937]">{j.title}</p>
                <p className="text-xs text-[#9CA3AF] mt-0.5">{j.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
