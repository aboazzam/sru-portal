"use client";
import Link from "next/link";
import { useState } from "react";
import { alumniProfile } from "@/lib/mock/alumni";

function FakeQR() {
  const pattern = [
    [1,1,1,0,1,0,1,1,1],
    [1,0,1,0,0,1,1,0,1],
    [1,0,1,1,0,0,1,0,1],
    [1,1,1,0,1,1,1,1,1],
    [0,1,0,1,0,1,0,0,0],
    [1,0,0,0,1,0,1,0,1],
    [1,1,1,1,0,1,0,1,0],
    [0,0,1,0,1,1,1,0,1],
    [1,1,1,0,0,0,1,1,1],
  ];
  return (
    <div className="inline-grid gap-0.5" style={{ gridTemplateColumns: "repeat(9, 1fr)" }}>
      {pattern.flat().map((cell, i) => (
        <div
          key={i}
          className="w-3 h-3 rounded-[1px]"
          style={{ background: cell ? "#1A2A30" : "#fff" }}
        />
      ))}
    </div>
  );
}

export default function AlumniCardPage() {
  const p = alumniProfile;
  const [lang, setLang]       = useState<"ar" | "en">("ar");
  const [toast, setToast]     = useState<string | null>(null);
  const [flipped, setFlipped] = useState(false);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  }

  const isAr = lang === "ar";

  return (
    <div className="space-y-6">

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-[#8FA4AB]">
        <Link href="/alumni" className="hover:text-[#875E9E] transition-colors">بوابة الخريجين</Link>
        <span>/</span>
        <span className="text-[#1A2A30] font-medium">بطاقة الخريج</span>
      </div>

      {/* Toast */}
      {toast && (
        <div
          className="fixed top-6 start-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-xl text-sm font-semibold text-white shadow-lg"
          style={{ background: "#875E9E" }}
        >
          {toast}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

        {/* ── البطاقة ── */}
        <div className="space-y-4">

          {/* Lang toggle */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-[#506570]">لغة البطاقة:</span>
            <div
              className="flex rounded-xl overflow-hidden border border-[#E8EDEF]"
            >
              {(["ar", "en"] as const).map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className="px-4 py-1.5 text-xs font-bold transition-all"
                  style={lang === l
                    ? { background: "#875E9E", color: "#fff" }
                    : { background: "#F4F7F8", color: "#506570" }
                  }
                >
                  {l === "ar" ? "العربية" : "English"}
                </button>
              ))}
            </div>
            <button
              onClick={() => setFlipped(!flipped)}
              className="ms-auto text-xs font-semibold px-3 py-1.5 rounded-xl border border-[#E8EDEF] hover:bg-[#F3EEF7] transition-colors"
              style={{ color: "#875E9E" }}
            >
              {flipped ? "◀ الوجه الأمامي" : "▶ الوجه الخلفي"}
            </button>
          </div>

          {/* Card face */}
          {!flipped ? (
            /* Front */
            <div
              className="relative rounded-3xl overflow-hidden shadow-2xl select-none"
              style={{
                background: "linear-gradient(135deg, #875E9E 0%, #5A3E7E 50%, #6CAEBD 100%)",
                aspectRatio: "1.586",
              }}
            >
              {/* Background pattern */}
              <div
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage: "radial-gradient(circle at 20% 80%, #fff 1px, transparent 1px), radial-gradient(circle at 80% 20%, #fff 1px, transparent 1px)",
                  backgroundSize: "40px 40px",
                }}
              />
              <div
                className="absolute -bottom-16 -end-16 w-48 h-48 rounded-full opacity-15"
                style={{ background: "#fff" }}
              />
              <div
                className="absolute -top-10 -start-10 w-36 h-36 rounded-full opacity-10"
                style={{ background: "#6CAEBD" }}
              />

              {/* Content */}
              <div className={`relative z-10 p-6 h-full flex flex-col ${isAr ? "text-right" : "text-left"}`} dir={isAr ? "rtl" : "ltr"}>

                {/* Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-white/60 text-[10px] font-medium uppercase tracking-widest">
                      {isAr ? "جامعة سليمان الراجحي" : "Sulaiman Al Rajhi University"}
                    </p>
                    <p className="text-white font-bold text-sm mt-0.5">
                      {isAr ? "بطاقة الخريج" : "Alumni Card"}
                    </p>
                  </div>
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-xl font-bold text-white"
                    style={{ background: "rgba(255,255,255,0.2)" }}
                  >
                    SRU
                  </div>
                </div>

                {/* Name */}
                <div className="mt-auto">
                  <div
                    className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold mb-2"
                    style={{ background: "rgba(255,215,0,0.3)", color: "#FFD700" }}
                  >
                    🏅 {isAr ? p.honor : p.honorEn}
                  </div>
                  <h2 className="text-white font-bold text-xl leading-tight">
                    {isAr ? p.name : p.nameEn}
                  </h2>
                  <p className="text-white/80 text-xs mt-0.5">
                    {isAr ? p.major : "Business Administration"} — {p.graduationYear}
                  </p>
                  <p className="text-white/60 text-[10px] mt-1">
                    {isAr ? p.college : "Sulaiman Al Rajhi College of Business"}
                  </p>
                </div>

                {/* Footer */}
                <div className="mt-3 flex items-end justify-between">
                  <div>
                    <p className="text-white/50 text-[9px] uppercase tracking-widest">
                      {isAr ? "رقم الخريج" : "Alumni ID"}
                    </p>
                    <p className="text-white font-mono text-sm font-bold tracking-widest">{p.id}</p>
                  </div>
                  <div className="text-[10px] text-white/50 text-end">
                    <p>{isAr ? "عضو منذ" : "Member since"}</p>
                    <p className="text-white/70 font-semibold">
                      {new Date(p.memberSince).toLocaleDateString(isAr ? "ar-SA" : "en-SA", { month: "long", year: "numeric" })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Back */
            <div
              className="relative rounded-3xl overflow-hidden shadow-2xl select-none"
              style={{
                background: "linear-gradient(135deg, #1A2A30 0%, #354850 100%)",
                aspectRatio: "1.586",
              }}
            >
              {/* Magnetic stripe */}
              <div className="absolute top-10 inset-x-0 h-10" style={{ background: "rgba(0,0,0,0.5)" }} />

              <div className="relative z-10 p-6 h-full flex flex-col justify-end" dir={isAr ? "rtl" : "ltr"}>
                <div className="flex items-end justify-between gap-4">
                  {/* QR */}
                  <div className="bg-white p-2 rounded-xl shadow-md">
                    <FakeQR />
                    <p className="text-[9px] text-[#506570] text-center mt-1 font-mono">
                      {p.id}
                    </p>
                  </div>
                  {/* Info */}
                  <div className={`flex-1 ${isAr ? "text-right" : "text-left"}`}>
                    <p className="text-white/50 text-[9px] uppercase tracking-widest mb-1">
                      {isAr ? "امسح للتحقق" : "Scan to verify"}
                    </p>
                    <p className="text-white text-xs font-semibold leading-snug">
                      {isAr ? "بطاقة موثَّقة من جامعة سليمان الراجحي" : "Verified by Sulaiman Al Rajhi University"}
                    </p>
                    <p className="text-white/50 text-[9px] mt-2">
                      alumni.sru.edu.sa/verify
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex gap-3">
            <button
              onClick={() => showToast("⬇ جارٍ تحميل البطاقة كـ PNG...")}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold text-white transition-opacity hover:opacity-90"
              style={{ background: "linear-gradient(to left, #875E9E, #6A4A7E)" }}
            >
              ⬇ تحميل PNG
            </button>
            <button
              onClick={() => showToast("🔗 تم نسخ رابط المشاركة للـ LinkedIn")}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold border transition-colors hover:bg-[#EEF6F9]"
              style={{ borderColor: "#C8E6EC", color: "#4A8FA0" }}
            >
              🔗 مشاركة LinkedIn
            </button>
          </div>
        </div>

        {/* ── تفاصيل البطاقة ── */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-[#E8EDEF] shadow-sm overflow-hidden">
            <div className="px-5 py-3 border-b border-[#E8EDEF]" style={{ background: "#F4F7F8" }}>
              <h2 className="font-bold text-[#1A2A30] text-sm flex items-center gap-2">
                <span>🪪</span> بيانات البطاقة
              </h2>
            </div>
            <div className="divide-y divide-[#F4F7F8]">
              {[
                { label: "الاسم (عربي)",    value: p.name },
                { label: "الاسم (إنجليزي)", value: p.nameEn },
                { label: "رقم الخريج",      value: p.id },
                { label: "التخصص",          value: p.major },
                { label: "الكلية",           value: p.college },
                { label: "سنة التخرج",      value: String(p.graduationYear) },
                { label: "المرتبة",          value: p.honor },
                { label: "المعدل",           value: `${p.gpa} / 5.00` },
              ].map((row) => (
                <div key={row.label} className="px-5 py-3 flex items-center gap-3">
                  <p className="text-xs text-[#8FA4AB] w-32 shrink-0">{row.label}</p>
                  <p className="text-sm text-[#1F2937] font-medium">{row.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Usage note */}
          <div
            className="px-5 py-4 rounded-2xl flex items-start gap-3"
            style={{ background: "#E8F6F8", border: "1px solid #C8E6EC" }}
          >
            <span className="text-xl shrink-0">ℹ️</span>
            <div className="text-xs text-[#374151] leading-relaxed space-y-1">
              <p className="font-bold text-[#1A2A30] text-sm">استخدامات البطاقة الرقمية</p>
              <p>• التعريف عند حضور فعاليات الخريجين</p>
              <p>• إرفاقها مع ملفات التوظيف والسيرة الذاتية</p>
              <p>• مشاركتها على LinkedIn لإبراز انتمائك الجامعي</p>
              <p>• التحقق منها عبر رمز QR من قِبَل الجهات الخارجية</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
