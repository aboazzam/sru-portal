"use client";
import { useState } from "react";
import { clearanceSteps } from "@/lib/sanad-mock";

export default function ClearanceStepper() {
  const [current, setCurrent] = useState(0);
  const [completed, setCompleted] = useState<Set<number>>(new Set());
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleNext() {
    if (current < clearanceSteps.length - 1) {
      setCompleted((prev) => new Set([...prev, current]));
      setCurrent((c) => c + 1);
    } else {
      setSubmitting(true);
      await new Promise((r) => setTimeout(r, 1500));
      setCompleted((prev) => new Set([...prev, current]));
      setSubmitted(true);
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="text-center py-8 space-y-3">
        <div className="text-5xl">🎉</div>
        <h3 className="font-bold text-[#3D1F6E] text-lg">تم تقديم طلب إخلاء الطرف</h3>
        <p className="text-gray-500 text-sm">
          سيتم مراجعة طلبك وإشعارك خلال 3–5 أيام عمل.
        </p>
        <p className="text-xs text-gray-400">رقم الطلب: CLR-{Date.now().toString().slice(-5)}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Step indicator */}
      <div className="flex items-center justify-center gap-2 flex-wrap">
        {clearanceSteps.map((step, i) => {
          const done = completed.has(i);
          const active = i === current;
          return (
            <div key={i} className="flex items-center gap-2">
              <div className="flex flex-col items-center gap-1">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                    done
                      ? "bg-green-500 text-white"
                      : active
                      ? "bg-[#3D1F6E] text-white ring-4 ring-[#3D1F6E]/20"
                      : "bg-gray-200 text-gray-400"
                  }`}
                >
                  {done ? "✓" : i + 1}
                </div>
                <span className={`text-xs font-medium text-center max-w-[80px] leading-tight ${active ? "text-[#3D1F6E]" : done ? "text-green-600" : "text-gray-400"}`}>
                  {step.label.split(" ").slice(0, 2).join(" ")}
                </span>
              </div>
              {i < clearanceSteps.length - 1 && (
                <div className={`h-0.5 w-8 rounded-full mb-4 ${done ? "bg-green-400" : "bg-gray-200"}`} />
              )}
            </div>
          );
        })}
      </div>

      {/* Current step card */}
      <div className="bg-[#F5F3FF] rounded-xl p-5 border border-purple-100">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-3xl">{clearanceSteps[current].icon}</span>
          <div>
            <p className="text-xs text-[#6B46C1] font-medium">الخطوة {current + 1} من {clearanceSteps.length}</p>
            <h3 className="font-bold text-[#3D1F6E]">{clearanceSteps[current].label}</h3>
          </div>
        </div>
        <p className="text-gray-600 text-sm leading-relaxed">{clearanceSteps[current].desc}</p>
      </div>

      {/* Navigation */}
      <div className="flex gap-3">
        <button
          onClick={() => {
            if (current > 0) {
              setCompleted((prev) => { const s = new Set(prev); s.delete(current - 1); return s; });
              setCurrent((c) => c - 1);
            }
          }}
          disabled={current === 0}
          className="px-5 py-2.5 border border-gray-300 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-40 transition-colors"
        >
          السابق
        </button>
        <button
          onClick={handleNext}
          disabled={submitting}
          className="flex-1 py-2.5 bg-[#3D1F6E] text-white rounded-lg text-sm font-semibold hover:bg-[#2C1650] disabled:opacity-60 transition-colors"
        >
          {submitting
            ? "جارٍ الإرسال..."
            : current < clearanceSteps.length - 1
            ? "التالي"
            : "تقديم الطلب"}
        </button>
      </div>
    </div>
  );
}
