"use client";
import Link from "next/link";
import { useState } from "react";

const JOB_TYPES   = ["دوام كامل", "دوام جزئي", "عن بُعد", "هجين", "تدريب"] as const;
const EXPERIENCES = ["أقل من سنة", "1–2 سنة", "3–5 سنوات", "5–10 سنوات", "أكثر من 10 سنوات"] as const;
const EDUCATIONS  = ["بكالوريوس", "ماجستير", "دكتوراه", "دبلوم"] as const;
const MAJORS      = ["محاسبة", "إدارة أعمال", "تمويل", "موارد بشرية", "تسويق", "هندسة حاسوبية", "تقنية المعلومات", "الطب", "التمريض", "أخرى"] as const;
const CITIES      = ["الرياض", "جدة", "مكة المكرمة", "المدينة المنورة", "الظهران", "الدمام", "الخبر", "أبها"] as const;

type FormState = {
  title: string; company: string; department: string;
  type: string; city: string; salaryMin: string; salaryMax: string;
  education: string; major: string; experience: string;
  description: string; requirements: string; benefits: string;
  deadline: string; seats: string; email: string;
};

const EMPTY: FormState = {
  title: "", company: "", department: "", type: "دوام كامل",
  city: "الرياض", salaryMin: "", salaryMax: "", education: "بكالوريوس",
  major: "محاسبة", experience: "1–2 سنة", description: "",
  requirements: "", benefits: "", deadline: "", seats: "1", email: "",
};

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-bold text-[#374151]">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
    </div>
  );
}

const inputCls = "w-full px-3 py-2.5 border border-[#D1D5DB] rounded-xl text-sm focus:outline-none focus:border-[#6CAEBD] bg-white";

export default function PostJobPage() {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});

  function set(key: keyof FormState, val: string) {
    setForm((p) => ({ ...p, [key]: val }));
    setErrors((p) => ({ ...p, [key]: "" }));
  }

  function validate(): boolean {
    const e: Partial<Record<keyof FormState, string>> = {};
    if (!form.title.trim())        e.title        = "مطلوب";
    if (!form.company.trim())      e.company      = "مطلوب";
    if (!form.description.trim())  e.description  = "مطلوب";
    if (!form.requirements.trim()) e.requirements = "مطلوب";
    if (!form.deadline)            e.deadline     = "مطلوب";
    if (!form.email.trim())        e.email        = "مطلوب";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setSuccess(true);
  }

  if (success) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm text-[#8FA4AB]">
          <Link href="/alumni/employer" className="hover:text-[#6CAEBD] transition-colors">لوحة الشركة</Link>
          <span>/</span>
          <span className="text-[#1A2A30] font-medium">نشر وظيفة</span>
        </div>
        <div className="bg-white rounded-2xl border border-[#E8EDEF] p-12 text-center shadow-sm max-w-md mx-auto">
          <div className="w-20 h-20 rounded-full flex items-center justify-center text-4xl mx-auto mb-4" style={{ background: "#DCFCE7" }}>
            ✅
          </div>
          <h2 className="text-lg font-bold text-[#1A2A30] mb-2">تم نشر الوظيفة بنجاح!</h2>
          <p className="text-sm text-[#6B7280] mb-1">
            <span className="font-semibold text-[#1F2937]">{form.title}</span> في <span className="font-semibold text-[#1F2937]">{form.company}</span>
          </p>
          <p className="text-xs text-[#9CA3AF] mb-6">ستظهر الوظيفة للخريجين المؤهلين خلال دقائق</p>
          <div className="flex gap-3 justify-center flex-wrap">
            <button
              onClick={() => { setForm(EMPTY); setSuccess(false); }}
              className="px-5 py-2.5 rounded-xl text-sm font-bold border border-[#E8EDEF] text-[#506570] hover:bg-[#F4F7F8]"
            >
              نشر وظيفة أخرى
            </button>
            <Link
              href="/alumni/employer/applicants"
              className="px-5 py-2.5 rounded-xl text-sm font-bold text-white"
              style={{ background: "linear-gradient(to left, #6CAEBD, #4A8FA0)" }}
            >
              إدارة المتقدمين ←
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-[#8FA4AB]">
        <Link href="/alumni/employer" className="hover:text-[#6CAEBD] transition-colors">لوحة الشركة</Link>
        <span>/</span>
        <span className="text-[#1A2A30] font-medium">نشر وظيفة جديدة</span>
      </div>

      {/* Hero */}
      <div
        className="rounded-2xl p-5 text-white shadow-sm"
        style={{ background: "linear-gradient(135deg, #6CAEBD 0%, #4A8FA0 100%)" }}
      >
        <h1 className="text-xl font-bold">نشر وظيفة جديدة 📝</h1>
        <p className="text-white/80 text-sm mt-0.5">وصّل فرصتك الوظيفية بأفضل الخريجين المؤهلين</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* Basic info */}
        <div className="bg-white rounded-2xl border border-[#E8EDEF] shadow-sm overflow-hidden">
          <div className="px-5 py-3 border-b border-[#E8EDEF]" style={{ background: "#F4F7F8" }}>
            <h2 className="font-bold text-[#1A2A30] text-sm flex items-center gap-2"><span>ℹ️</span> المعلومات الأساسية</h2>
          </div>
          <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="المسمى الوظيفي" required>
              <input value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="مثال: محلل مالي أول" className={inputCls} />
              {errors.title && <p className="text-xs text-red-500">{errors.title}</p>}
            </Field>
            <Field label="اسم الشركة" required>
              <input value={form.company} onChange={(e) => set("company", e.target.value)} placeholder="مثال: شركة الاستثمار" className={inputCls} />
              {errors.company && <p className="text-xs text-red-500">{errors.company}</p>}
            </Field>
            <Field label="القسم / الإدارة">
              <input value={form.department} onChange={(e) => set("department", e.target.value)} placeholder="مثال: إدارة المالية" className={inputCls} />
            </Field>
            <Field label="نوع الوظيفة">
              <select value={form.type} onChange={(e) => set("type", e.target.value)} className={inputCls}>
                {JOB_TYPES.map((t) => <option key={t}>{t}</option>)}
              </select>
            </Field>
            <Field label="المدينة">
              <select value={form.city} onChange={(e) => set("city", e.target.value)} className={inputCls}>
                {CITIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </Field>
            <Field label="الراتب الشهري (ريال)">
              <div className="flex gap-2">
                <input value={form.salaryMin} onChange={(e) => set("salaryMin", e.target.value)} placeholder="من" type="number" className={inputCls} />
                <input value={form.salaryMax} onChange={(e) => set("salaryMax", e.target.value)} placeholder="إلى" type="number" className={inputCls} />
              </div>
            </Field>
          </div>
        </div>

        {/* Requirements */}
        <div className="bg-white rounded-2xl border border-[#E8EDEF] shadow-sm overflow-hidden">
          <div className="px-5 py-3 border-b border-[#E8EDEF]" style={{ background: "#F4F7F8" }}>
            <h2 className="font-bold text-[#1A2A30] text-sm flex items-center gap-2"><span>🎓</span> متطلبات المرشح</h2>
          </div>
          <div className="p-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Field label="المؤهل العلمي">
              <select value={form.education} onChange={(e) => set("education", e.target.value)} className={inputCls}>
                {EDUCATIONS.map((d) => <option key={d}>{d}</option>)}
              </select>
            </Field>
            <Field label="التخصص المطلوب">
              <select value={form.major} onChange={(e) => set("major", e.target.value)} className={inputCls}>
                {MAJORS.map((m) => <option key={m}>{m}</option>)}
              </select>
            </Field>
            <Field label="سنوات الخبرة">
              <select value={form.experience} onChange={(e) => set("experience", e.target.value)} className={inputCls}>
                {EXPERIENCES.map((x) => <option key={x}>{x}</option>)}
              </select>
            </Field>
          </div>
        </div>

        {/* Description */}
        <div className="bg-white rounded-2xl border border-[#E8EDEF] shadow-sm overflow-hidden">
          <div className="px-5 py-3 border-b border-[#E8EDEF]" style={{ background: "#F4F7F8" }}>
            <h2 className="font-bold text-[#1A2A30] text-sm flex items-center gap-2"><span>📄</span> وصف الوظيفة والمتطلبات</h2>
          </div>
          <div className="p-5 space-y-4">
            <Field label="وصف الوظيفة" required>
              <textarea rows={4} value={form.description} onChange={(e) => set("description", e.target.value)} placeholder="اكتب وصفاً تفصيلياً للوظيفة ومهامها اليومية..." className={inputCls + " resize-none"} />
              {errors.description && <p className="text-xs text-red-500">{errors.description}</p>}
            </Field>
            <Field label="المتطلبات" required>
              <textarea rows={4} value={form.requirements} onChange={(e) => set("requirements", e.target.value)} placeholder="المهارات والخبرات المطلوبة (كل متطلب في سطر جديد)..." className={inputCls + " resize-none"} />
              {errors.requirements && <p className="text-xs text-red-500">{errors.requirements}</p>}
            </Field>
            <Field label="المزايا والحوافز">
              <textarea rows={3} value={form.benefits} onChange={(e) => set("benefits", e.target.value)} placeholder="مثال: تأمين صحي، تأمين على الحياة، سيارة..." className={inputCls + " resize-none"} />
            </Field>
          </div>
        </div>

        {/* Logistics */}
        <div className="bg-white rounded-2xl border border-[#E8EDEF] shadow-sm overflow-hidden">
          <div className="px-5 py-3 border-b border-[#E8EDEF]" style={{ background: "#F4F7F8" }}>
            <h2 className="font-bold text-[#1A2A30] text-sm flex items-center gap-2"><span>📅</span> تفاصيل الإعلان</h2>
          </div>
          <div className="p-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Field label="تاريخ انتهاء الإعلان" required>
              <input type="date" value={form.deadline} onChange={(e) => set("deadline", e.target.value)} className={inputCls} />
              {errors.deadline && <p className="text-xs text-red-500">{errors.deadline}</p>}
            </Field>
            <Field label="عدد الشواغر">
              <input type="number" min="1" value={form.seats} onChange={(e) => set("seats", e.target.value)} className={inputCls} />
            </Field>
            <Field label="البريد الإلكتروني للتواصل" required>
              <input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="hr@company.com" className={inputCls} />
              {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
            </Field>
          </div>
        </div>

        {/* Submit */}
        <div className="flex gap-3 justify-end">
          <Link href="/alumni/employer" className="px-6 py-2.5 rounded-xl text-sm font-bold border border-[#E8EDEF] text-[#506570] hover:bg-[#F4F7F8]">
            إلغاء
          </Link>
          <button
            type="submit"
            className="px-8 py-2.5 rounded-xl text-sm font-bold text-white transition-opacity hover:opacity-90"
            style={{ background: "linear-gradient(to left, #6CAEBD, #4A8FA0)" }}
          >
            نشر الوظيفة ✓
          </button>
        </div>
      </form>
    </div>
  );
}
