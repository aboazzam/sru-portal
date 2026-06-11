"use client";
import Link from "next/link";
import { useState } from "react";
import { officialDocuments, type OfficialDocument } from "@/lib/mock/alumni";

const statusConfig = {
  ready:      { label: "جاهزة للتحميل", color: "#16A34A", bg: "#DCFCE7", border: "#16A34A" },
  processing: { label: "جارٍ الإعداد",  color: "#D97706", bg: "#FEF3C7", border: "#D97706" },
  pending:    { label: "يتطلب طلباً",   color: "#6B7280", bg: "#F3F4F6", border: "#E8EDEF" },
};

const categoryLabel: Record<string, string> = {
  academic:  "أكاديمية",
  conduct:   "سلوكية",
  financial: "مالية",
  other:     "أخرى",
};

const requestTypes = [
  "شهادة حسن سير وسلوك",
  "خطاب توصية رسمي",
  "كشف حساب الرسوم",
  "خطاب إثبات التخرج للجهات الحكومية",
  "شهادة معادلة للخارج",
  "نموذج مخصص / أخرى",
];

export default function AlumniDocumentsPage() {
  const [verifyCode, setVerifyCode]   = useState("");
  const [verifyResult, setVerifyResult] = useState<"valid" | "invalid" | null>(null);
  const [reqType, setReqType]         = useState("");
  const [reqNote, setReqNote]         = useState("");
  const [submitted, setSubmitted]     = useState(false);
  const [downloading, setDownloading] = useState<number | null>(null);

  const ready      = officialDocuments.filter((d) => d.status === "ready");
  const processing = officialDocuments.filter((d) => d.status === "processing");
  const pending    = officialDocuments.filter((d) => d.status === "pending");

  function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    const match = officialDocuments.some((d) => d.verificationCode === verifyCode.trim());
    setVerifyResult(match ? "valid" : "invalid");
  }

  function handleDownload(doc: OfficialDocument) {
    setDownloading(doc.id);
    setTimeout(() => setDownloading(null), 1800);
  }

  function handleRequest(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  const DocCard = ({ doc }: { doc: OfficialDocument }) => {
    const st  = statusConfig[doc.status];
    const isLoading = downloading === doc.id;
    return (
      <div
        className="bg-white rounded-2xl border shadow-sm overflow-hidden flex flex-col"
        style={{ borderColor: doc.status === "ready" ? "#D1FAE5" : "#E8EDEF" }}
      >
        {/* Top stripe */}
        <div className="h-1" style={{ background: st.color }} />
        <div className="p-5 flex flex-col flex-1">
          {/* Header */}
          <div className="flex items-start justify-between gap-3 mb-3">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl shrink-0"
              style={{ background: st.bg }}
            >
              {doc.icon}
            </div>
            <span
              className="text-xs font-semibold px-2.5 py-1 rounded-full shrink-0"
              style={{ background: st.bg, color: st.color }}
            >
              {st.label}
            </span>
          </div>

          {/* Title */}
          <h3 className="font-bold text-[#1F2937] text-sm leading-snug mb-0.5">{doc.title}</h3>
          <p className="text-xs text-[#9CA3AF] mb-1">{doc.titleEn}</p>
          <p className="text-xs text-[#6B7280] leading-relaxed mb-3">{doc.description}</p>

          {/* Meta */}
          <div className="mt-auto space-y-1.5">
            {doc.issuedDate && (
              <p className="text-xs text-[#8FA4AB]">
                📅 صدرت: {new Date(doc.issuedDate).toLocaleDateString("ar-SA", { day: "numeric", month: "long", year: "numeric" })}
              </p>
            )}
            {doc.fee > 0 && (
              <p className="text-xs text-[#8FA4AB]">💰 رسوم: {doc.fee} ريال</p>
            )}
            {doc.fee === 0 && (
              <p className="text-xs" style={{ color: "#16A34A" }}>✓ مجانية</p>
            )}
            {doc.estimatedDays && (
              <p className="text-xs text-[#D97706]">⏱ مدة الإعداد: {doc.estimatedDays} أيام عمل</p>
            )}
            {doc.verificationCode && (
              <p className="text-xs font-mono text-[#8FA4AB]" dir="ltr">🔐 {doc.verificationCode}</p>
            )}
            <p className="text-xs text-[#9CA3AF]">📂 {categoryLabel[doc.category]}</p>
          </div>

          {/* CTA */}
          <div className="mt-4">
            {doc.status === "ready" && (
              <button
                onClick={() => handleDownload(doc)}
                disabled={isLoading}
                className="w-full py-2.5 rounded-xl text-sm font-bold text-white transition-opacity disabled:opacity-70"
                style={{ background: isLoading ? "#8FA4AB" : "linear-gradient(to left, #16A34A, #15803D)" }}
              >
                {isLoading ? "⏳ جارٍ التحميل..." : "⬇ تحميل الوثيقة"}
              </button>
            )}
            {doc.status === "processing" && (
              <div
                className="w-full py-2.5 rounded-xl text-sm font-semibold text-center"
                style={{ background: "#FEF3C7", color: "#D97706" }}
              >
                ⏳ جارٍ الإعداد — {doc.estimatedDays} أيام
              </div>
            )}
            {doc.status === "pending" && (
              <button
                onClick={() => {
                  setReqType(doc.title);
                  document.getElementById("request-form")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="w-full py-2.5 rounded-xl text-sm font-bold border transition-colors hover:bg-[#F3EEF7]"
                style={{ borderColor: "#D8C8E8", color: "#875E9E" }}
              >
                📝 تقديم طلب
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-[#8FA4AB]">
        <Link href="/alumni" className="hover:text-[#875E9E] transition-colors">بوابة الخريجين</Link>
        <span>/</span>
        <span className="text-[#1A2A30] font-medium">وثائقي</span>
      </div>

      {/* Hero */}
      <div
        className="rounded-2xl p-6 text-white shadow-sm"
        style={{ background: "linear-gradient(135deg, #875E9E 0%, #6CAEBD 100%)" }}
      >
        <div className="flex items-center gap-3">
          <span className="text-4xl">📄</span>
          <div>
            <h1 className="text-xl font-bold">الوثائق الرسمية</h1>
            <p className="text-white/80 text-sm mt-0.5">تحميل وثائقك الجامعية أو تقديم طلب للحصول على وثيقة جديدة</p>
          </div>
        </div>
        <div className="mt-4 flex gap-4 text-sm">
          <span className="flex items-center gap-1.5 text-white/80">
            <span className="w-2 h-2 rounded-full bg-green-300 inline-block" />
            {ready.length} جاهزة
          </span>
          <span className="flex items-center gap-1.5 text-white/80">
            <span className="w-2 h-2 rounded-full bg-yellow-300 inline-block" />
            {processing.length} قيد الإعداد
          </span>
          <span className="flex items-center gap-1.5 text-white/80">
            <span className="w-2 h-2 rounded-full bg-white/40 inline-block" />
            {pending.length} تتطلب طلباً
          </span>
        </div>
      </div>

      {/* ── 1. شبكة الوثائق ── */}

      {/* Ready */}
      {ready.length > 0 && (
        <div>
          <h2 className="font-bold text-[#1A2A30] text-sm flex items-center gap-2 mb-3">
            <span className="w-2.5 h-2.5 rounded-full bg-green-500 inline-block" />
            جاهزة للتحميل
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {ready.map((d) => <DocCard key={d.id} doc={d} />)}
          </div>
        </div>
      )}

      {/* Processing */}
      {processing.length > 0 && (
        <div>
          <h2 className="font-bold text-[#1A2A30] text-sm flex items-center gap-2 mb-3">
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 inline-block" />
            قيد الإعداد
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {processing.map((d) => <DocCard key={d.id} doc={d} />)}
          </div>
        </div>
      )}

      {/* Pending */}
      {pending.length > 0 && (
        <div>
          <h2 className="font-bold text-[#1A2A30] text-sm flex items-center gap-2 mb-3">
            <span className="w-2.5 h-2.5 rounded-full bg-gray-400 inline-block" />
            تتطلب تقديم طلب
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {pending.map((d) => <DocCard key={d.id} doc={d} />)}
          </div>
        </div>
      )}

      {/* ── 2. التحقق من الشهادة ── */}
      <div className="bg-white rounded-2xl border border-[#E8EDEF] shadow-sm overflow-hidden">
        <div
          className="px-5 py-3 flex items-center gap-2"
          style={{ background: "#F4F7F8", borderBottom: "1px solid #E8EDEF" }}
        >
          <span>🔐</span>
          <h2 className="font-bold text-[#1A2A30] text-sm">التحقق من صحة الوثيقة</h2>
        </div>
        <div className="p-5">
          <p className="text-xs text-[#6B7280] mb-4 leading-relaxed">
            يمكن لأي جهة خارجية التحقق من صحة الوثيقة بإدخال رمز التحقق الموجود أسفل الوثيقة.
          </p>
          <form onSubmit={handleVerify} className="flex items-center gap-3 flex-wrap">
            <input
              type="text"
              value={verifyCode}
              onChange={(e) => { setVerifyCode(e.target.value); setVerifyResult(null); }}
              placeholder="SRU-2024-GR-XXXX-XXX"
              className="flex-1 min-w-48 px-4 py-2.5 border border-[#D1D5DB] rounded-xl text-sm font-mono focus:outline-none focus:border-[#875E9E]"
              dir="ltr"
              required
            />
            <button
              type="submit"
              className="shrink-0 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-opacity hover:opacity-90"
              style={{ background: "linear-gradient(to left, #875E9E, #6A4A7E)" }}
            >
              تحقق الآن
            </button>
          </form>

          {verifyResult === "valid" && (() => {
            const doc = officialDocuments.find((d) => d.verificationCode === verifyCode.trim())!;
            return (
              <div
                className="mt-4 p-4 rounded-xl flex items-start gap-3"
                style={{ background: "#DCFCE7", border: "1px solid #86EFAC" }}
              >
                <span className="text-2xl shrink-0">✅</span>
                <div>
                  <p className="font-bold text-sm text-[#14532D]">وثيقة موثَّقة وصحيحة</p>
                  <p className="text-xs text-[#15803D] mt-0.5">
                    <strong>{doc.title}</strong> — صادرة عن جامعة سليمان الراجحي
                    {doc.issuedDate && ` بتاريخ ${new Date(doc.issuedDate).toLocaleDateString("ar-SA")}`}
                  </p>
                  <p className="text-xs text-[#16A34A] mt-0.5">الخريجة: سارة محمد العتيبي | {doc.titleEn}</p>
                </div>
              </div>
            );
          })()}

          {verifyResult === "invalid" && (
            <div
              className="mt-4 p-4 rounded-xl flex items-start gap-3"
              style={{ background: "#FEE2E2", border: "1px solid #FCA5A5" }}
            >
              <span className="text-2xl shrink-0">❌</span>
              <div>
                <p className="font-bold text-sm text-[#7F1D1D]">رمز التحقق غير صحيح</p>
                <p className="text-xs text-[#991B1B] mt-0.5">
                  لا توجد وثيقة مسجّلة بهذا الرمز. تأكد من إدخال الرمز كما هو مكتوب على الوثيقة.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── 3. نموذج طلب وثيقة جديدة ── */}
      <div id="request-form" className="bg-white rounded-2xl border border-[#E8EDEF] shadow-sm overflow-hidden">
        <div
          className="px-5 py-3 flex items-center gap-2"
          style={{ background: "linear-gradient(to left, #875E9E08, #6CAEBD08)", borderBottom: "1px solid #E8EDEF" }}
        >
          <span>📝</span>
          <h2 className="font-bold text-[#1A2A30] text-sm">طلب وثيقة جديدة</h2>
        </div>
        <div className="p-5">
          {submitted ? (
            <div className="py-8 flex flex-col items-center gap-4 text-center">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center text-3xl"
                style={{ background: "linear-gradient(135deg, #875E9E, #6CAEBD)" }}
              >
                ✅
              </div>
              <div>
                <p className="font-bold text-[#1A2A30]">تم إرسال طلبك بنجاح</p>
                <p className="text-sm text-[#6B7280] mt-1">سيتم معالجة طلبك خلال 2–7 أيام عمل وإشعارك عبر البريد.</p>
              </div>
              <button
                onClick={() => { setSubmitted(false); setReqType(""); setReqNote(""); }}
                className="text-sm font-semibold underline"
                style={{ color: "#875E9E" }}
              >
                تقديم طلب جديد
              </button>
            </div>
          ) : (
            <form onSubmit={handleRequest} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#374151] mb-1.5">نوع الوثيقة المطلوبة</label>
                <select
                  required
                  value={reqType}
                  onChange={(e) => setReqType(e.target.value)}
                  className="w-full px-4 py-2.5 border border-[#D1D5DB] rounded-xl text-sm focus:outline-none focus:border-[#875E9E] bg-white"
                >
                  <option value="">اختر نوع الوثيقة</option>
                  {requestTypes.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#374151] mb-1.5">جهة الاستخدام</label>
                  <select
                    className="w-full px-4 py-2.5 border border-[#D1D5DB] rounded-xl text-sm focus:outline-none focus:border-[#875E9E] bg-white"
                  >
                    <option>جهة حكومية</option>
                    <option>شركة أو صاحب عمل</option>
                    <option>جهة أكاديمية</option>
                    <option>سفارة أو قنصلية</option>
                    <option>استخدام شخصي</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#374151] mb-1.5">عدد النسخ</label>
                  <select
                    className="w-full px-4 py-2.5 border border-[#D1D5DB] rounded-xl text-sm focus:outline-none focus:border-[#875E9E] bg-white"
                  >
                    <option>1 نسخة</option>
                    <option>2 نسخة</option>
                    <option>3 نسخ</option>
                    <option>أكثر من 3</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#374151] mb-1.5">ملاحظات إضافية (اختياري)</label>
                <textarea
                  rows={3}
                  value={reqNote}
                  onChange={(e) => setReqNote(e.target.value)}
                  placeholder="أي تفاصيل أو متطلبات خاصة بالوثيقة..."
                  className="w-full px-4 py-2.5 border border-[#D1D5DB] rounded-xl text-sm focus:outline-none focus:border-[#875E9E] resize-none leading-relaxed"
                />
              </div>

              <div
                className="px-4 py-3 rounded-xl flex items-start gap-3 text-xs"
                style={{ background: "#E8F6F8", border: "1px solid #C8E6EC" }}
              >
                <span className="text-base shrink-0">ℹ️</span>
                <p className="text-[#374151] leading-relaxed">
                  تُعالَج الطلبات خلال <strong>2–7 أيام عمل</strong>. قد تستلزم بعض الوثائق رسوماً إدارية
                  تُسدَّد عبر نظام الدفع الإلكتروني بعد الموافقة.
                </p>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl text-sm font-bold text-white transition-opacity hover:opacity-90"
                style={{ background: "linear-gradient(to left, #875E9E, #6A4A7E)" }}
              >
                إرسال الطلب ←
              </button>
            </form>
          )}
        </div>
      </div>

    </div>
  );
}
