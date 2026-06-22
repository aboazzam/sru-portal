"use client";
import { useEffect, useState, useTransition } from "react";
import { reviewServiceApplication } from "../../_actions";

interface Application {
  id: string;
  status: string;
  notes: string | null;
  formData: string | null;
  createdAt: string;
  user: { id: string; name: string; email: string };
  service: { id: string; title: string };
}

interface Props {
  application: Application;
  onClose: () => void;
  onDone: (id: string, decision: "APPROVED" | "REJECTED") => void;
}

// Human-readable labels for form field keys
const FIELD_LABELS: Record<string, string> = {
  semester_from:     "من الفصل الدراسي",
  semester_to:       "إلى الفصل الدراسي",
  purpose:           "الغرض",
  copies:            "عدد النسخ",
  language:          "اللغة",
  recipient:         "الجهة المستلمة",
  course_name:       "اسم المقرر",
  course_code:       "رمز المقرر",
  appeal_reason:     "سبب التظلم",
  expected_grade:    "الدرجة المتوقعة",
  withdrawal_reason: "سبب الانسحاب",
  effective_date:    "التاريخ المطلوب",
  details:           "تفاصيل إضافية",
  room_type:         "نوع الغرفة",
  duration:          "مدة الإقامة",
  special_needs:     "احتياجات خاصة",
  area:              "المنطقة",
  schedule:          "الجدول",
  medical_reason:    "السبب الطبي",
  doctor_name:       "اسم الطبيب",
  urgency:           "مستوى الأولوية",
};

const PURPOSE_LABELS: Record<string, string> = {
  employment:       "التقديم للتوظيف",
  higher_education: "الدراسة العليا",
  travel:           "السفر للخارج",
  government:       "جهة حكومية",
  bank:             "جهة بنكية",
  other:            "أخرى",
};

const SEMESTER_LABELS: Record<string, string> = {
  "1": "الفصل الأول", "2": "الفصل الثاني", "3": "الفصل الثالث",
  "4": "الفصل الرابع", "5": "الفصل الخامس", "6": "الفصل السادس",
  "7": "الفصل السابع", "8": "الفصل الثامن",
};

const LANG_LABELS: Record<string, string> = {
  ar: "العربية", en: "الإنجليزية", both: "كلاهما",
};

const WITHDRAWAL_LABELS: Record<string, string> = {
  medical: "أسباب صحية", family: "ظروف أسرية", financial: "أسباب مالية",
  transfer: "الانتقال لجامعة أخرى", military: "الخدمة العسكرية", other: "أخرى",
};

const URGENCY_LABELS: Record<string, string> = { normal: "عادي", urgent: "عاجل" };

const ROOM_LABELS: Record<string, string> = { single: "غرفة فردية", double: "غرفة مشتركة" };
const SCHEDULE_LABELS: Record<string, string> = { morning: "صباحي فقط", evening: "مسائي فقط", both: "صباحي ومسائي" };

function resolveValue(key: string, raw: string): string {
  const maps: Record<string, Record<string, string>> = {
    purpose:           PURPOSE_LABELS,
    semester_from:     SEMESTER_LABELS,
    semester_to:       SEMESTER_LABELS,
    language:          LANG_LABELS,
    withdrawal_reason: WITHDRAWAL_LABELS,
    urgency:           URGENCY_LABELS,
    room_type:         ROOM_LABELS,
    schedule:          SCHEDULE_LABELS,
  };
  return maps[key]?.[raw] ?? raw;
}

export default function ReviewModal({ application, onClose, onDone }: Props) {
  const [adminNote, setAdminNote] = useState("");
  const [error, setError]         = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // Close on Escape
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  function decide(decision: "APPROVED" | "REJECTED") {
    setError(null);
    startTransition(async () => {
      const result = await reviewServiceApplication(
        application.id,
        decision,
        adminNote.trim() || undefined
      );
      if (result.error) {
        setError(result.error);
      } else {
        onDone(application.id, decision);
      }
    });
  }

  // Parse stored formData
  let parsedFields: [string, string][] = [];
  let attachments: { name: string; size: number; type: string }[] = [];
  if (application.formData) {
    try {
      const obj = JSON.parse(application.formData) as Record<string, unknown>;
      attachments = Array.isArray(obj.attachments)
        ? (obj.attachments as { name: string; size: number; type: string }[])
        : [];
      parsedFields = Object.entries(obj)
        .filter(([k]) => k !== "attachments")
        .map(([k, v]) => [k, resolveValue(k, String(v))]);
    } catch {
      // malformed JSON — skip
    }
  }

  function formatBytes(bytes: number) {
    if (bytes < 1024)        return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  const submittedAt = new Date(application.createdAt).toLocaleDateString("ar-SA", {
    day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit",
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        dir="rtl"
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="px-6 py-4 flex items-center justify-between shrink-0"
          style={{ background: "linear-gradient(135deg, #1E3A5F 0%, #2C6EAD 100%)" }}
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center text-lg shrink-0">
              🔍
            </div>
            <div>
              <p className="text-white/70 text-xs">مراجعة طلب</p>
              <p className="text-white font-bold text-sm leading-snug line-clamp-1">
                {application.service.title}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="إغلاق"
            className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/30 transition-colors flex items-center justify-center text-white text-sm font-bold"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">

          {/* Student info */}
          <section className="bg-[#F0F9FF] border border-[#BAE6FD] rounded-xl p-4">
            <p className="text-xs font-bold text-[#0369A1] mb-3 flex items-center gap-1.5">
              👤 معلومات الطالب
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-[#64748B] mb-0.5">الاسم</p>
                <p className="text-sm font-semibold text-[#0F172A]">{application.user.name}</p>
              </div>
              <div>
                <p className="text-xs text-[#64748B] mb-0.5">البريد الإلكتروني</p>
                <p className="text-sm font-semibold text-[#0F172A] truncate">{application.user.email}</p>
              </div>
              <div className="col-span-2">
                <p className="text-xs text-[#64748B] mb-0.5">تاريخ التقديم</p>
                <p className="text-sm text-[#0F172A]">{submittedAt}</p>
              </div>
            </div>
          </section>

          {/* Submitted form data */}
          {parsedFields.length > 0 && (
            <section>
              <p className="text-xs font-bold text-[#506570] mb-3 flex items-center gap-1.5">
                📋 بيانات الطلب المقدَّمة
              </p>
              <div className="divide-y divide-[#F1F5F9] rounded-xl border border-[#E8EDEF] overflow-hidden">
                {parsedFields.map(([key, val]) => (
                  <div key={key} className="px-4 py-3 flex items-start justify-between gap-3 bg-white">
                    <span className="text-xs text-[#64748B] shrink-0 mt-0.5">
                      {FIELD_LABELS[key] ?? key}
                    </span>
                    <span className="text-xs font-semibold text-[#1F2937] text-end">{val}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Notes from student */}
          {application.notes && (
            <section>
              <p className="text-xs font-bold text-[#506570] mb-2 flex items-center gap-1.5">
                💬 ملاحظات الطالب
              </p>
              <div className="bg-[#FAFAFA] border border-[#E8EDEF] rounded-xl px-4 py-3">
                <p className="text-sm text-[#374151] leading-relaxed">{application.notes}</p>
              </div>
            </section>
          )}

          {/* Attachments */}
          {attachments.length > 0 && (
            <section>
              <p className="text-xs font-bold text-[#506570] mb-2 flex items-center gap-1.5">
                📎 المرفقات ({attachments.length})
              </p>
              <ul className="space-y-2">
                {attachments.map((f, i) => (
                  <li key={i} className="flex items-center gap-3 bg-[#F9FAFB] border border-[#E8EDEF] rounded-xl px-3 py-2">
                    <span className="text-base shrink-0">
                      {f.type.startsWith("image/") ? "🖼️" : f.type === "application/pdf" ? "📄" : "📝"}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-[#374151] truncate">{f.name}</p>
                      <p className="text-xs text-[#9CA3AF]">{formatBytes(f.size)}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Admin note */}
          <section>
            <label className="block text-xs font-bold text-[#506570] mb-2">
              ملاحظة المشرف <span className="font-normal text-[#9CA3AF]">(اختياري — تظهر للطالب)</span>
            </label>
            <textarea
              value={adminNote}
              onChange={(e) => setAdminNote(e.target.value)}
              placeholder="أدخل سبب القبول أو الرفض، أو أي تعليق للطالب…"
              rows={3}
              className="w-full border border-[#D1D5DB] rounded-xl px-3 py-2.5 text-sm text-[#1F2937] resize-none focus:outline-none focus:ring-2 focus:ring-[#2C6EAD]/30"
            />
          </section>

          {error && (
            <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 flex items-center gap-2">
              <span className="text-red-500 shrink-0">⚠️</span>
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#E8EDEF] flex items-center justify-between gap-3 shrink-0 bg-[#FAFAFA]">
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="px-5 py-2.5 rounded-xl border border-[#D1D5DB] text-sm font-medium text-[#374151] hover:bg-[#F3F4F6] transition-colors disabled:opacity-50"
          >
            إلغاء
          </button>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => decide("REJECTED")}
              disabled={isPending}
              className="px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-50 flex items-center gap-2"
              style={{ background: "linear-gradient(to left, #DC2626, #B91C1C)" }}
            >
              {isPending ? (
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
              ) : "❌"}
              رفض
            </button>
            <button
              type="button"
              onClick={() => decide("APPROVED")}
              disabled={isPending}
              className="px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-50 flex items-center gap-2"
              style={{ background: "linear-gradient(to left, #059669, #047857)" }}
            >
              {isPending ? (
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
              ) : "✅"}
              قبول
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
