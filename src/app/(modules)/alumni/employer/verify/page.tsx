"use client";
import Link from "next/link";
import { useState } from "react";
import { officialDocuments } from "@/lib/mock/alumni";

type VerifyResult =
  | { found: true;  name: string; major: string; college: string; graduationYear: number; honor: string; gpa: number; id: string; verifiedAt: string }
  | { found: false; code: string };

function findByCode(code: string): VerifyResult {
  const doc = officialDocuments.find(
    (d) => d.verificationCode?.toLowerCase() === code.trim().toLowerCase()
  );
  if (doc) {
    return {
      found: true,
      name:           "عبدالرحمن محمد الأحمد",
      major:          "المحاسبة والتمويل",
      college:        "كلية الأعمال",
      graduationYear: 2023,
      honor:          "مرتبة الشرف الأولى",
      gpa:            4.72,
      id:             "SRU-2023-0047",
      verifiedAt:     new Date().toLocaleDateString("ar-SA", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" }),
    };
  }
  return { found: false, code };
}

const SAMPLE_CODES = officialDocuments
  .filter((d) => d.verificationCode)
  .slice(0, 3)
  .map((d) => d.verificationCode as string);

export default function VerifyAlumniPage() {
  const [input, setInput]     = useState("");
  const [result, setResult]   = useState<VerifyResult | null>(null);
  const [loading, setLoading] = useState(false);

  function handleVerify() {
    if (!input.trim()) return;
    setLoading(true);
    setResult(null);
    setTimeout(() => {
      setResult(findByCode(input));
      setLoading(false);
    }, 800);
  }

  function handleReset() {
    setInput("");
    setResult(null);
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-[#8FA4AB]">
        <Link href="/alumni/employer" className="hover:text-[#6CAEBD] transition-colors">لوحة الشركة</Link>
        <span>/</span>
        <span className="text-[#1A2A30] font-medium">التحقق من الخريج</span>
      </div>

      {/* Hero */}
      <div
        className="rounded-2xl p-6 text-white shadow-sm"
        style={{ background: "linear-gradient(135deg, #4A8FA0 0%, #375F6D 100%)" }}
      >
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center text-3xl shrink-0">🔐</div>
          <div>
            <h1 className="text-xl font-bold">التحقق من شهادة الخريج</h1>
            <p className="text-white/80 text-sm mt-1 leading-relaxed">
              أدخل رمز التحقق الموجود على شهادة الخريج أو في ملفاته الرسمية للتأكد من صحتها وصدور من جامعة سليمان الراجحي.
            </p>
          </div>
        </div>
      </div>

      {/* Search box */}
      <div className="bg-white rounded-2xl border border-[#E8EDEF] shadow-sm p-6">
        <label className="text-sm font-bold text-[#374151] block mb-3">
          رمز التحقق
        </label>
        <div className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => { setInput(e.target.value); setResult(null); }}
            onKeyDown={(e) => e.key === "Enter" && handleVerify()}
            placeholder="مثال: SRU-VER-2023-XXXX"
            className="flex-1 px-4 py-3 border border-[#D1D5DB] rounded-xl text-sm focus:outline-none focus:border-[#4A8FA0] font-mono tracking-wide"
          />
          <button
            onClick={handleVerify}
            disabled={!input.trim() || loading}
            className="px-6 py-3 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-50"
            style={{ background: "linear-gradient(to left, #4A8FA0, #375F6D)" }}
          >
            {loading ? "جارٍ التحقق..." : "تحقق"}
          </button>
        </div>

        {/* Sample codes hint */}
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <p className="text-xs text-[#9CA3AF]">رموز للتجربة:</p>
          {SAMPLE_CODES.map((code) => (
            <button
              key={code}
              onClick={() => { setInput(code); setResult(null); }}
              className="text-xs font-mono px-2 py-0.5 rounded-lg transition-colors hover:bg-[#D8EDF1]"
              style={{ background: "#E8F4F7", color: "#4A8FA0" }}
            >
              {code}
            </button>
          ))}
        </div>
      </div>

      {/* Loading indicator */}
      {loading && (
        <div className="bg-white rounded-2xl border border-[#E8EDEF] p-8 text-center shadow-sm">
          <div
            className="w-12 h-12 rounded-full border-4 border-t-transparent mx-auto mb-3 animate-spin"
            style={{ borderColor: "#E8EDEF", borderTopColor: "#4A8FA0" }}
          />
          <p className="text-sm text-[#8FA4AB]">جارٍ التحقق من الرمز...</p>
        </div>
      )}

      {/* Result: FOUND */}
      {result && result.found && (
        <div className="space-y-4">
          {/* Success banner */}
          <div
            className="rounded-2xl p-5 flex items-center gap-4 shadow-sm"
            style={{ background: "linear-gradient(to left, #DCFCE7, #D1FAE5)", border: "1.5px solid #86EFAC" }}
          >
            <div className="w-14 h-14 rounded-2xl bg-white/80 flex items-center justify-center text-3xl shrink-0 shadow-sm">
              ✅
            </div>
            <div>
              <p className="font-bold text-[#14532D] text-base">تم التحقق بنجاح</p>
              <p className="text-sm text-[#166534] mt-0.5">
                الوثيقة صادرة من جامعة سليمان الراجحي وتم التحقق منها في {result.verifiedAt}
              </p>
            </div>
          </div>

          {/* Details card */}
          <div className="bg-white rounded-2xl border border-[#E8EDEF] shadow-sm overflow-hidden">
            <div
              className="px-5 py-4 flex items-center gap-4"
              style={{ background: "linear-gradient(to left, #F0F9FB, #E8F4F7)" }}
            >
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold text-white shrink-0"
                style={{ background: "linear-gradient(135deg, #4A8FA0, #375F6D)" }}
              >
                {result.name.charAt(0)}
              </div>
              <div>
                <h2 className="font-bold text-[#1A2A30] text-lg">{result.name}</h2>
                <p className="text-sm text-[#506570]">{result.major}</p>
                <p className="text-xs text-[#8FA4AB] mt-0.5">{result.college}</p>
              </div>
              <div className="ms-auto text-start">
                <span
                  className="text-xs font-bold px-3 py-1.5 rounded-full block"
                  style={{ background: "#FEF3C7", color: "#D97706" }}
                >
                  🏅 {result.honor}
                </span>
              </div>
            </div>

            <div className="p-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-0 rounded-xl overflow-hidden border border-[#E8EDEF]">
                {[
                  { label: "الرقم الجامعي",       value: result.id },
                  { label: "سنة التخرج",           value: String(result.graduationYear) },
                  { label: "المعدل التراكمي",       value: `${result.gpa} / 5.0` },
                  { label: "الكلية",               value: result.college },
                  { label: "التخصص",              value: result.major },
                  { label: "رمز التحقق",           value: input.trim().toUpperCase() },
                ].map((row, i) => (
                  <div
                    key={row.label}
                    className="flex items-center gap-3 px-4 py-3 text-sm"
                    style={{ background: i % 2 === 0 ? "#F9FAFB" : "#fff" }}
                  >
                    <span className="text-xs text-[#8FA4AB] w-28 shrink-0">{row.label}</span>
                    <span className="font-semibold text-[#1F2937] font-mono text-xs">{row.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Disclaimer */}
          <div
            className="rounded-xl p-4 flex items-start gap-3 text-xs text-[#374151] leading-relaxed"
            style={{ background: "#F0F9FB", border: "1px solid #B8DDE6" }}
          >
            <span className="text-base shrink-0 mt-0.5">ℹ️</span>
            هذه الوثيقة صادرة رسمياً عن إدارة شؤون الخريجين في جامعة سليمان الراجحي. للتحقق الرسمي أو للاستفسار، تواصل مع مركز خدمات الخريجين على alumni@sru.edu.sa
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleReset}
              className="px-5 py-2.5 rounded-xl text-sm font-bold border border-[#E8EDEF] text-[#506570] hover:bg-[#F4F7F8]"
            >
              التحقق من رمز آخر
            </button>
          </div>
        </div>
      )}

      {/* Result: NOT FOUND */}
      {result && !result.found && (
        <div className="space-y-4">
          <div
            className="rounded-2xl p-5 flex items-center gap-4 shadow-sm"
            style={{ background: "linear-gradient(to left, #FEF2F2, #FEE2E2)", border: "1.5px solid #FCA5A5" }}
          >
            <div className="w-14 h-14 rounded-2xl bg-white/80 flex items-center justify-center text-3xl shrink-0 shadow-sm">
              ❌
            </div>
            <div>
              <p className="font-bold text-[#7F1D1D] text-base">لم يتم التحقق</p>
              <p className="text-sm text-[#991B1B] mt-0.5">
                الرمز <span className="font-mono font-bold">{result.code}</span> غير موجود في سجلات الجامعة
              </p>
            </div>
          </div>

          <div
            className="rounded-xl p-4 space-y-1.5 text-xs text-[#374151] leading-relaxed"
            style={{ background: "#FFF7ED", border: "1px solid #FDE68A" }}
          >
            <p className="font-bold text-[#92400E] mb-1">⚠️ تحقق مما يلي:</p>
            <p>• تأكد من إدخال الرمز كاملاً دون مسافات زائدة</p>
            <p>• الرمز حساس لحالة الأحرف — يُفضّل الكتابة بالأحرف الكبيرة</p>
            <p>• إذا كانت الوثيقة حديثة، قد تستغرق التسجيل حتى 24 ساعة</p>
            <p>• للاستفسار: alumni@sru.edu.sa أو 920 XXX XXX</p>
          </div>

          <button
            onClick={handleReset}
            className="px-5 py-2.5 rounded-xl text-sm font-bold border border-[#E8EDEF] text-[#506570] hover:bg-[#F4F7F8]"
          >
            حاول مرة أخرى
          </button>
        </div>
      )}

      {/* Info box when idle */}
      {!result && !loading && (
        <div className="bg-white rounded-2xl border border-[#E8EDEF] shadow-sm p-6">
          <h3 className="font-bold text-[#1A2A30] text-sm mb-4 flex items-center gap-2">
            <span>📋</span> كيف يعمل التحقق؟
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { step: "1", title: "احصل على الرمز", desc: "اطلب من المتقدم تزويدك برمز التحقق من وثيقته الرسمية" },
              { step: "2", title: "أدخل الرمز",     desc: "الصق الرمز في الحقل أعلاه واضغط تحقق" },
              { step: "3", title: "راجع النتيجة",   desc: "ستظهر تفاصيل المسيرة الأكاديمية كاملةً خلال ثوانٍ" },
            ].map((s) => (
              <div key={s.step} className="flex gap-3">
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold text-white shrink-0"
                  style={{ background: "#4A8FA0" }}
                >
                  {s.step}
                </div>
                <div>
                  <p className="font-bold text-sm text-[#1F2937]">{s.title}</p>
                  <p className="text-xs text-[#6B7280] mt-0.5 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
