"use client";
import { useState } from "react";
import { documentTypes } from "@/lib/sanad-mock";

type State = "idle" | "submitting" | "success" | "error";

export default function OfficialDocumentForm() {
  const [docType, setDocType]   = useState("");
  const [purpose, setPurpose]   = useState("");
  const [copies, setCopies]     = useState(1);
  const [state, setState]       = useState<State>("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!docType || !purpose) return;
    setState("submitting");
    await new Promise((r) => setTimeout(r, 1200));
    setState("success");
  }

  if (state === "success") {
    return (
      <div className="text-center py-8">
        <div className="text-5xl mb-4">✅</div>
        <h3 className="font-bold text-[#3D1F6E] text-lg mb-1">تم تقديم الطلب بنجاح</h3>
        <p className="text-gray-500 text-sm mb-4">
          سيتم مراجعة طلب <strong>{docType}</strong> وإشعارك خلال 2–3 أيام عمل.
        </p>
        <p className="text-xs text-gray-400">رقم الطلب: REQ-{Date.now().toString().slice(-5)}</p>
        <button
          onClick={() => { setDocType(""); setPurpose(""); setCopies(1); setState("idle"); }}
          className="mt-5 px-5 py-2 bg-[#3D1F6E] text-white rounded-lg text-sm font-medium hover:bg-[#2C1650] transition-colors"
        >
          تقديم طلب آخر
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-[#1F2937] mb-1">نوع الوثيقة *</label>
        <select
          value={docType}
          onChange={(e) => setDocType(e.target.value)}
          required
          className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3D1F6E] bg-white"
        >
          <option value="">-- اختر نوع الوثيقة --</option>
          {documentTypes.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-[#1F2937] mb-1">الغرض من الطلب *</label>
        <textarea
          value={purpose}
          onChange={(e) => setPurpose(e.target.value)}
          required
          rows={3}
          placeholder="اكتب الغرض من طلب الوثيقة..."
          className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3D1F6E] resize-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[#1F2937] mb-1">عدد النسخ</label>
        <input
          type="number"
          min={1}
          max={10}
          value={copies}
          onChange={(e) => setCopies(Number(e.target.value))}
          className="w-24 px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3D1F6E]"
        />
      </div>

      <button
        type="submit"
        disabled={state === "submitting"}
        className="w-full py-2.5 bg-[#3D1F6E] text-white rounded-lg text-sm font-semibold hover:bg-[#2C1650] disabled:opacity-60 transition-colors"
      >
        {state === "submitting" ? "جارٍ الإرسال..." : "تقديم الطلب"}
      </button>
    </form>
  );
}
