"use client";
import { useEffect, useRef, useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

type FieldType = "text" | "textarea" | "select" | "number";

interface SelectOption {
  value: string;
  label: string;
}

interface ServiceField {
  key: string;
  label: string;
  type: FieldType;
  options?: SelectOption[];
  required?: boolean;
  placeholder?: string;
  min?: number;
  max?: number;
}

interface AttachmentMeta {
  name: string;
  size: number;
  type: string;
}

interface Props {
  serviceId: string;
  serviceTitle: string;
  userName: string;
  userEmail: string;
  onClose: () => void;
  onSuccess: () => void;
}

// ─── Field config per service type ───────────────────────────────────────────

const PURPOSE_OPTIONS: SelectOption[] = [
  { value: "employment",        label: "التقديم للتوظيف" },
  { value: "higher_education",  label: "الدراسة العليا" },
  { value: "travel",            label: "السفر للخارج" },
  { value: "government",        label: "جهة حكومية" },
  { value: "bank",              label: "جهة بنكية" },
  { value: "other",             label: "أخرى" },
];

const SEMESTER_OPTIONS: SelectOption[] = Array.from({ length: 8 }, (_, i) => ({
  value: String(i + 1),
  label: `الفصل الدراسي ${["الأول","الثاني","الثالث","الرابع","الخامس","السادس","السابع","الثامن"][i]}`,
}));

const LANG_OPTIONS: SelectOption[] = [
  { value: "ar",   label: "العربية" },
  { value: "en",   label: "الإنجليزية" },
  { value: "both", label: "كلاهما (عربي وإنجليزي)" },
];

function detectServiceType(title: string): string {
  const t = title;
  if (/كشف.*(درجات|نقاط|مواد)|سجل أكاديمي/u.test(t))  return "transcript";
  if (/شهادة|وثيقة|إفادة|تحقق|تأكيد/u.test(t))         return "certificate";
  if (/إعادة.*(تقييم|فحص)|تظلم|استئناف/u.test(t))       return "appeal";
  if (/انسحاب|إلغاء.*(قيد|تسجيل)|تأجيل/u.test(t))      return "withdrawal";
  if (/سكن|مبنى|سكني|إيواء/u.test(t))                  return "housing";
  if (/مواصلات|نقل|حافلة|باص/u.test(t))                return "transport";
  if (/طبي|صحة|عيادة|مرض/u.test(t))                    return "medical";
  return "general";
}

function getServiceFields(title: string): ServiceField[] {
  const type = detectServiceType(title);
  switch (type) {
    case "transcript":
      return [
        { key: "semester_from", label: "من الفصل الدراسي", type: "select",  options: SEMESTER_OPTIONS, required: true },
        { key: "semester_to",   label: "إلى الفصل الدراسي", type: "select", options: SEMESTER_OPTIONS, required: true },
        { key: "purpose",       label: "الغرض من الطلب",    type: "select", options: PURPOSE_OPTIONS,  required: true },
        { key: "copies",        label: "عدد النسخ",          type: "number", required: true, min: 1, max: 10 },
        { key: "language",      label: "لغة الوثيقة",        type: "select", options: LANG_OPTIONS,    required: true },
      ];
    case "certificate":
      return [
        { key: "purpose",    label: "الغرض من الطلب",  type: "select", options: PURPOSE_OPTIONS, required: true },
        { key: "recipient",  label: "الجهة المستلمة",   type: "text",   placeholder: "اسم الجهة أو المؤسسة التي سيُقدَّم لها", required: true },
        { key: "copies",     label: "عدد النسخ",        type: "number", required: true, min: 1, max: 10 },
        { key: "language",   label: "لغة الوثيقة",      type: "select", options: LANG_OPTIONS },
      ];
    case "appeal":
      return [
        { key: "course_name",     label: "اسم المقرر الدراسي", type: "text",     placeholder: "مثال: مقدمة في البرمجة",    required: true },
        { key: "course_code",     label: "رمز المقرر",          type: "text",     placeholder: "مثال: CS101" },
        { key: "appeal_reason",   label: "سبب التظلم/الاستئناف", type: "textarea", placeholder: "اشرح سبب تظلمك بالتفصيل…", required: true },
        { key: "expected_grade",  label: "الدرجة المتوقعة",      type: "text",     placeholder: "الدرجة التي تعتقد أنك تستحقها" },
      ];
    case "withdrawal":
      return [
        { key: "withdrawal_reason", label: "سبب الطلب", type: "select", options: [
            { value: "medical",   label: "أسباب صحية" },
            { value: "family",    label: "ظروف أسرية" },
            { value: "financial", label: "أسباب مالية" },
            { value: "transfer",  label: "الانتقال لجامعة أخرى" },
            { value: "military",  label: "الخدمة العسكرية" },
            { value: "other",     label: "أخرى" },
          ], required: true },
        { key: "effective_date", label: "تاريخ الانسحاب المطلوب", type: "text", placeholder: "مثال: بداية الفصل القادم" },
        { key: "details",        label: "تفاصيل إضافية",           type: "textarea", placeholder: "أضف أي معلومات تدعم طلبك…" },
      ];
    case "housing":
      return [
        { key: "room_type", label: "نوع الغرفة المطلوبة", type: "select", options: [
            { value: "single", label: "غرفة فردية" },
            { value: "double", label: "غرفة مشتركة (شخصان)" },
          ], required: true },
        { key: "duration",       label: "مدة الإقامة المطلوبة", type: "text",     placeholder: "مثال: فصل دراسي كامل",   required: true },
        { key: "special_needs",  label: "احتياجات خاصة (اختياري)", type: "text",  placeholder: "قرب من المسجد، احتياجات إعاقة…" },
      ];
    case "transport":
      return [
        { key: "area",     label: "المنطقة / الحي",     type: "text",   placeholder: "المنطقة التي تسكن فيها", required: true },
        { key: "schedule", label: "الجدول المطلوب",     type: "select", options: [
            { value: "morning", label: "صباحي فقط" },
            { value: "evening", label: "مسائي فقط" },
            { value: "both",    label: "صباحي ومسائي" },
          ], required: true },
      ];
    case "medical":
      return [
        { key: "medical_reason", label: "سبب الطلب الطبي",  type: "textarea", placeholder: "صِف حالتك أو سبب طلبك الطبي…", required: true },
        { key: "doctor_name",    label: "اسم الطبيب المعالج (إن وُجد)", type: "text", placeholder: "اسم الطبيب" },
      ];
    default:
      return [
        { key: "purpose",  label: "سبب الطلب / الغرض منه", type: "textarea", placeholder: "اشرح سبب تقديم هذا الطلب…", required: true },
        { key: "urgency",  label: "مستوى الأولوية",         type: "select",   options: [
            { value: "normal", label: "عادي" },
            { value: "urgent", label: "عاجل" },
          ] },
      ];
  }
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ServiceApplicationModal({
  serviceId,
  serviceTitle,
  userName,
  userEmail,
  onClose,
  onSuccess,
}: Props) {
  const fields = getServiceFields(serviceTitle);
  const [values, setValues]         = useState<Record<string, string>>({});
  const [notes, setNotes]           = useState("");
  const [files, setFiles]           = useState<File[]>([]);
  const [errors, setErrors]         = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [loading, setLoading]       = useState(false);
  const fileInputRef                = useRef<HTMLInputElement>(null);
  const firstFieldRef               = useRef<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | null>(null);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  // Focus first interactive field on mount
  useEffect(() => {
    firstFieldRef.current?.focus();
  }, []);

  function validate(): boolean {
    const errs: Record<string, string> = {};
    for (const field of fields) {
      if (field.required && !values[field.key]?.trim()) {
        errs[field.key] = "هذا الحقل مطلوب";
      }
      if (field.type === "number" && values[field.key]) {
        const n = Number(values[field.key]);
        if (field.min !== undefined && n < field.min) errs[field.key] = `الحد الأدنى ${field.min}`;
        if (field.max !== undefined && n > field.max) errs[field.key] = `الحد الأقصى ${field.max}`;
      }
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files) return;
    const picked = Array.from(e.target.files).slice(0, 5);
    setFiles((prev) => {
      const combined = [...prev, ...picked];
      return combined.slice(0, 5);
    });
    e.target.value = "";
  }

  function removeFile(index: number) {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setSubmitError(null);
    setLoading(true);

    const attachments: AttachmentMeta[] = files.map((f) => ({
      name: f.name,
      size: f.size,
      type: f.type,
    }));

    const payload = {
      serviceId,
      formData: values,
      attachments,
      notes: notes.trim() || undefined,
      submittedAt: new Date().toISOString(),
    };

    try {
      const res = await fetch("/api/requests/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) {
        setSubmitError(json.error ?? "حدث خطأ أثناء التقديم. حاول مرة أخرى.");
      } else {
        onSuccess();
      }
    } catch {
      setSubmitError("تعذّر الاتصال بالخادم. تحقق من اتصالك وحاول مرة أخرى.");
    } finally {
      setLoading(false);
    }
  }

  function formatBytes(bytes: number) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)" }}
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
          style={{ background: "linear-gradient(135deg, #2C1650 0%, #6B46C1 100%)" }}
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center text-lg shrink-0">
              📋
            </div>
            <div>
              <p className="text-white/70 text-xs">تقديم طلب جديد</p>
              <p className="text-white font-bold text-sm leading-snug line-clamp-1">{serviceTitle}</p>
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

        {/* Scrollable body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">

            {/* Student info — read-only */}
            <section>
              <h3 className="text-xs font-bold text-[#506570] mb-3 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#6B46C1] text-white text-xs flex items-center justify-center font-bold">1</span>
                معلومات الطالب
              </h3>
              <div className="rounded-xl bg-[#F4F7F8] border border-[#E8EDEF] p-4 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-[#8FA4AB] mb-0.5">الاسم الكامل</p>
                  <p className="text-sm font-semibold text-[#1F2937]">{userName}</p>
                </div>
                <div>
                  <p className="text-xs text-[#8FA4AB] mb-0.5">البريد الإلكتروني</p>
                  <p className="text-sm font-semibold text-[#1F2937] truncate">{userEmail}</p>
                </div>
              </div>
            </section>

            {/* Service-specific fields */}
            <section>
              <h3 className="text-xs font-bold text-[#506570] mb-3 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#6B46C1] text-white text-xs flex items-center justify-center font-bold">2</span>
                بيانات الطلب
              </h3>
              <div className="space-y-4">
                {fields.map((field, idx) => (
                  <div key={field.key}>
                    <label className="block text-sm font-medium text-[#374151] mb-1.5">
                      {field.label}
                      {field.required && <span className="text-red-500 ms-1">*</span>}
                    </label>

                    {field.type === "select" ? (
                      <select
                        ref={idx === 0 ? (el) => { firstFieldRef.current = el; } : undefined}
                        value={values[field.key] ?? ""}
                        onChange={(e) => setValues((p) => ({ ...p, [field.key]: e.target.value }))}
                        className="w-full border rounded-xl px-3 py-2.5 text-sm text-[#1F2937] bg-white focus:outline-none focus:ring-2 focus:ring-[#6B46C1]/30 transition-shadow"
                        style={{ borderColor: errors[field.key] ? "#EF4444" : "#D1D5DB" }}
                      >
                        <option value="">— اختر —</option>
                        {field.options?.map((opt) => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    ) : field.type === "textarea" ? (
                      <textarea
                        ref={idx === 0 ? (el) => { firstFieldRef.current = el as unknown as HTMLInputElement; } : undefined}
                        value={values[field.key] ?? ""}
                        onChange={(e) => setValues((p) => ({ ...p, [field.key]: e.target.value }))}
                        placeholder={field.placeholder}
                        rows={3}
                        className="w-full border rounded-xl px-3 py-2.5 text-sm text-[#1F2937] resize-none focus:outline-none focus:ring-2 focus:ring-[#6B46C1]/30 transition-shadow"
                        style={{ borderColor: errors[field.key] ? "#EF4444" : "#D1D5DB" }}
                      />
                    ) : (
                      <input
                        ref={idx === 0 ? (el) => { firstFieldRef.current = el; } : undefined}
                        type={field.type}
                        value={values[field.key] ?? ""}
                        onChange={(e) => setValues((p) => ({ ...p, [field.key]: e.target.value }))}
                        placeholder={field.placeholder}
                        min={field.min}
                        max={field.max}
                        className="w-full border rounded-xl px-3 py-2.5 text-sm text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#6B46C1]/30 transition-shadow"
                        style={{ borderColor: errors[field.key] ? "#EF4444" : "#D1D5DB" }}
                      />
                    )}

                    {errors[field.key] && (
                      <p className="text-xs text-red-500 mt-1">{errors[field.key]}</p>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Notes */}
            <section>
              <h3 className="text-xs font-bold text-[#506570] mb-3 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#6B46C1] text-white text-xs flex items-center justify-center font-bold">3</span>
                ملاحظات إضافية
                <span className="text-[#9CA3AF] font-normal">(اختياري)</span>
              </h3>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="أي معلومات أو تفاصيل إضافية تودّ إضافتها…"
                rows={3}
                className="w-full border border-[#D1D5DB] rounded-xl px-3 py-2.5 text-sm text-[#1F2937] resize-none focus:outline-none focus:ring-2 focus:ring-[#6B46C1]/30 transition-shadow"
              />
            </section>

            {/* File upload */}
            <section>
              <h3 className="text-xs font-bold text-[#506570] mb-3 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#6B46C1] text-white text-xs flex items-center justify-center font-bold">4</span>
                المرفقات
                <span className="text-[#9CA3AF] font-normal">(اختياري · حتى 5 ملفات)</span>
              </h3>

              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                onChange={handleFileChange}
                className="sr-only"
                aria-label="رفع ملفات"
              />

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={files.length >= 5}
                className="w-full border-2 border-dashed rounded-xl py-4 text-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ borderColor: "#D1D5DB" }}
              >
                <p className="text-2xl mb-1">📎</p>
                <p className="text-sm font-medium text-[#6B7280]">
                  {files.length >= 5 ? "وصلت للحد الأقصى من الملفات" : "انقر لاختيار ملفات"}
                </p>
                <p className="text-xs text-[#9CA3AF] mt-0.5">PDF، صور، Word — حتى 10 ميغابايت للملف</p>
              </button>

              {files.length > 0 && (
                <ul className="mt-3 space-y-2">
                  {files.map((file, idx) => (
                    <li
                      key={idx}
                      className="flex items-center gap-3 bg-[#F9FAFB] border border-[#E8EDEF] rounded-xl px-3 py-2"
                    >
                      <span className="text-base shrink-0">
                        {file.type.startsWith("image/") ? "🖼️" : file.type === "application/pdf" ? "📄" : "📝"}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-[#374151] truncate">{file.name}</p>
                        <p className="text-xs text-[#9CA3AF]">{formatBytes(file.size)}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile(idx)}
                        className="text-[#9CA3AF] hover:text-red-500 transition-colors text-sm font-bold shrink-0"
                        aria-label="حذف الملف"
                      >
                        ✕
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            {/* Submit error */}
            {submitError && (
              <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 flex items-center gap-2">
                <span className="text-red-500 shrink-0">⚠️</span>
                <p className="text-sm text-red-600">{submitError}</p>
              </div>
            )}

          </div>
        </form>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#E8EDEF] flex items-center justify-between gap-3 shrink-0 bg-[#FAFAFA]">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-5 py-2.5 rounded-xl border border-[#D1D5DB] text-sm font-medium text-[#374151] hover:bg-[#F3F4F6] transition-colors disabled:opacity-50"
          >
            إلغاء
          </button>
          <button
            type="submit"
            form=""
            onClick={handleSubmit}
            disabled={loading}
            className="px-6 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 disabled:opacity-60 flex items-center gap-2"
            style={{ background: "linear-gradient(to left, #059669, #047857)" }}
          >
            {loading ? (
              <>
                <svg className="animate-spin w-4 h-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                جارٍ التقديم…
              </>
            ) : (
              <>✅ تقديم الطلب</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
