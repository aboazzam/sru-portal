"use client";
import Link from "next/link";
import { useState } from "react";
import {
  alumniProfile,
  profileCompletionItems,
  alumniAchievements,
  type BadgeLevel,
} from "@/lib/mock/alumni";

const badgeConfig: Record<BadgeLevel, { border: string; bg: string; label: string; star: string }> = {
  gold:   { border: "#D97706", bg: "#FEF3C7", label: "ذهبية",  star: "⭐" },
  silver: { border: "#6B7280", bg: "#F3F4F6", label: "فضية",   star: "🥈" },
  bronze: { border: "#92400E", bg: "#FEF3C7", label: "برونزية", star: "🥉" },
};

const categoryLabel: Record<string, { label: string; color: string }> = {
  academic:   { label: "أكاديمي",  color: "#875E9E" },
  career:     { label: "مهني",     color: "#6CAEBD" },
  community:  { label: "مجتمعي",  color: "#16A34A" },
  engagement: { label: "مشاركة",  color: "#D97706" },
};

export default function AlumniProfilePage() {
  const p = alumniProfile;

  const [form, setForm] = useState({
    phone:      p.phone,
    city:       p.city,
    linkedin:   p.linkedin,
    currentJob: p.currentJob ?? "",
    bio:        "",
    skills:     "",
    contactPref: "email",
  });
  const [saved, setSaved] = useState(false);

  const completedCount = profileCompletionItems.filter((i) => i.done).length;
  const totalCount     = profileCompletionItems.length;
  const pct            = Math.round((completedCount / totalCount) * 100);
  const missing        = profileCompletionItems.filter((i) => !i.done);

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <div className="space-y-6">

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-[#8FA4AB]">
        <Link href="/alumni" className="hover:text-[#875E9E] transition-colors">بوابة الخريجين</Link>
        <span>/</span>
        <span className="text-[#1A2A30] font-medium">ملفي الشخصي</span>
      </div>

      {/* ── 1. شريط اكتمال الملف ── */}
      <div className="bg-white rounded-2xl border border-[#E8EDEF] shadow-sm p-5">
        <div className="flex items-center justify-between gap-3 flex-wrap mb-4">
          <div className="flex items-center gap-2">
            <span>📊</span>
            <h2 className="font-bold text-[#1A2A30] text-sm">اكتمال الملف الشخصي</h2>
          </div>
          <span
            className="text-sm font-bold px-3 py-1 rounded-full"
            style={{ background: "#F3EEF7", color: "#875E9E" }}
          >
            {pct}%
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-[#E8EDEF] rounded-full h-3 mb-4">
          <div
            className="h-3 rounded-full transition-all"
            style={{ width: `${pct}%`, background: "linear-gradient(to left, #875E9E, #6CAEBD)" }}
          />
        </div>

        {/* Items grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {profileCompletionItems.map((item) => (
            <div key={item.id} className="flex items-center gap-3 p-2.5 rounded-xl" style={{ background: "#F4F7F8" }}>
              <span className={`text-base shrink-0 ${item.done ? "" : "opacity-40"}`}>
                {item.done ? "✅" : "⭕"}
              </span>
              <span className={`text-xs font-medium flex-1 ${item.done ? "text-[#1F2937]" : "text-[#9CA3AF]"}`}>
                {item.label}
              </span>
              <span
                className="text-xs font-bold shrink-0"
                style={{ color: item.done ? "#16A34A" : "#D97706" }}
              >
                +{item.points}%
              </span>
            </div>
          ))}
        </div>

        {missing.length > 0 && (
          <div
            className="mt-4 px-4 py-3 rounded-xl flex items-start gap-3"
            style={{ background: "#FEF3C7", border: "1px solid #FCD34D" }}
          >
            <span className="text-lg shrink-0">💡</span>
            <p className="text-xs text-[#92400E] leading-relaxed">
              أكمل <strong>{missing.map((m) => m.label).join(" و ")}</strong> لرفع اكتمال ملفك إلى 100% والحصول على توصيات وظيفية أدق.
            </p>
          </div>
        )}
      </div>

      {/* ── 2. بيانات التخرج (مقفلة 🔒) ── */}
      <div className="bg-white rounded-2xl border border-[#E8EDEF] shadow-sm overflow-hidden">
        <div
          className="px-5 py-3 flex items-center justify-between gap-2"
          style={{ background: "#F4F7F8", borderBottom: "1px solid #E8EDEF" }}
        >
          <div className="flex items-center gap-2">
            <span>🎓</span>
            <h2 className="font-bold text-[#1A2A30] text-sm">بيانات التخرج</h2>
          </div>
          <span
            className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full"
            style={{ background: "#E8EDEF", color: "#6B7280" }}
          >
            🔒 غير قابلة للتعديل
          </span>
        </div>
        <div className="divide-y divide-[#F4F7F8]">
          {[
            { label: "الاسم الكامل (عربي)",    value: p.name },
            { label: "الاسم الكامل (إنجليزي)", value: p.nameEn },
            { label: "رقم الخريج",             value: p.id },
            { label: "التخصص",                 value: p.major },
            { label: "الكلية",                  value: p.college },
            { label: "سنة التخرج",             value: String(p.graduationYear) },
            { label: "الفصل الدراسي",          value: p.graduationSemester },
            { label: "المعدل التراكمي",         value: `${p.gpa} / 5.00` },
            { label: "مرتبة التخرج",            value: `${p.honor} — ${p.honorEn}` },
          ].map((row) => (
            <div key={row.label} className="px-5 py-3 flex items-center gap-4">
              <p className="text-xs text-[#8FA4AB] w-36 shrink-0">{row.label}</p>
              <p className="text-sm font-medium text-[#1F2937]">{row.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── 3. نموذج تحديث البيانات الشخصية ── */}
      <div className="bg-white rounded-2xl border border-[#E8EDEF] shadow-sm overflow-hidden">
        <div
          className="px-5 py-3 flex items-center gap-2"
          style={{ background: "linear-gradient(to left, #875E9E08, #6CAEBD08)", borderBottom: "1px solid #E8EDEF" }}
        >
          <span>✏️</span>
          <h2 className="font-bold text-[#1A2A30] text-sm">تحديث البيانات الشخصية</h2>
        </div>
        <form onSubmit={handleSave} className="p-5 space-y-5">

          {/* Row 1 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#374151] mb-1.5">
                البريد الإلكتروني
                <span className="text-[#8FA4AB] font-normal ms-1">(للعرض فقط)</span>
              </label>
              <input
                type="email"
                value={p.email}
                disabled
                className="w-full px-4 py-2.5 border border-[#E8EDEF] rounded-xl text-sm bg-[#F4F7F8] text-[#9CA3AF] cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#374151] mb-1.5">رقم الجوال</label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="05xxxxxxxx"
                className="w-full px-4 py-2.5 border border-[#D1D5DB] rounded-xl text-sm focus:outline-none focus:border-[#875E9E]"
                dir="ltr"
              />
            </div>
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#374151] mb-1.5">مدينة الإقامة</label>
              <select
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                className="w-full px-4 py-2.5 border border-[#D1D5DB] rounded-xl text-sm focus:outline-none bg-white focus:border-[#875E9E]"
              >
                {["الرياض", "جدة", "مكة المكرمة", "المدينة المنورة", "الدمام", "القصيم", "أبها", "تبوك", "حائل", "أخرى"].map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#374151] mb-1.5">رابط LinkedIn</label>
              <input
                type="url"
                value={form.linkedin}
                onChange={(e) => setForm({ ...form, linkedin: e.target.value })}
                placeholder="linkedin.com/in/username"
                className="w-full px-4 py-2.5 border border-[#D1D5DB] rounded-xl text-sm focus:outline-none focus:border-[#875E9E]"
                dir="ltr"
              />
            </div>
          </div>

          {/* Current job */}
          <div>
            <label className="block text-xs font-semibold text-[#374151] mb-1.5">الوظيفة الحالية</label>
            <input
              type="text"
              value={form.currentJob}
              onChange={(e) => setForm({ ...form, currentJob: e.target.value })}
              placeholder="مثال: مهندس برمجيات — شركة..."
              className="w-full px-4 py-2.5 border border-[#D1D5DB] rounded-xl text-sm focus:outline-none focus:border-[#875E9E]"
            />
          </div>

          {/* Bio */}
          <div>
            <label className="block text-xs font-semibold text-[#374151] mb-1.5">
              نبذة شخصية (Bio)
              <span className="text-[#D97706] font-bold ms-1">★ يرفع الملف 15%</span>
            </label>
            <textarea
              rows={3}
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              placeholder="اكتب نبذة مختصرة عن نفسك وطموحاتك المهنية..."
              className="w-full px-4 py-2.5 border border-[#D1D5DB] rounded-xl text-sm focus:outline-none focus:border-[#875E9E] resize-none leading-relaxed"
            />
            <p className="text-xs text-[#9CA3AF] mt-1">{form.bio.length} / 300 حرف</p>
          </div>

          {/* Skills */}
          <div>
            <label className="block text-xs font-semibold text-[#374151] mb-1.5">
              المهارات المهنية
              <span className="text-[#D97706] font-bold ms-1">★ يرفع الملف 15%</span>
            </label>
            <input
              type="text"
              value={form.skills}
              onChange={(e) => setForm({ ...form, skills: e.target.value })}
              placeholder="مثال: Excel، Power BI، إدارة المشاريع، التفاوض..."
              className="w-full px-4 py-2.5 border border-[#D1D5DB] rounded-xl text-sm focus:outline-none focus:border-[#875E9E]"
            />
            <p className="text-xs text-[#9CA3AF] mt-1">افصل بين المهارات بفاصلة</p>
          </div>

          {/* Contact preference */}
          <div>
            <label className="block text-xs font-semibold text-[#374151] mb-2">
              تفضيل التواصل
              <span className="text-[#D97706] font-bold ms-1">★ يرفع الملف 5%</span>
            </label>
            <div className="flex gap-3 flex-wrap">
              {[
                { value: "email", label: "البريد الإلكتروني" },
                { value: "phone", label: "الجوال" },
                { value: "both",  label: "كلاهما" },
              ].map((opt) => (
                <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="contactPref"
                    value={opt.value}
                    checked={form.contactPref === opt.value}
                    onChange={() => setForm({ ...form, contactPref: opt.value })}
                    className="shrink-0"
                  />
                  <span className="text-sm text-[#374151]">{opt.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Submit */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl text-sm font-bold text-white transition-opacity hover:opacity-90"
              style={{ background: "linear-gradient(to left, #875E9E, #6A4A7E)" }}
            >
              حفظ التغييرات ✓
            </button>
            {saved && (
              <span
                className="text-xs font-semibold px-3 py-1.5 rounded-full animate-pulse"
                style={{ background: "#DCFCE7", color: "#16A34A" }}
              >
                ✅ تم الحفظ بنجاح
              </span>
            )}
          </div>
        </form>
      </div>

      {/* ── 4. الإنجازات والشارات ── */}
      <div className="bg-white rounded-2xl border border-[#E8EDEF] shadow-sm overflow-hidden">
        <div
          className="px-5 py-3 flex items-center gap-2"
          style={{ borderBottom: "1px solid #E8EDEF" }}
        >
          <span>🏆</span>
          <h2 className="font-bold text-[#1A2A30] text-sm">الإنجازات والشارات</h2>
          <span
            className="ms-auto text-xs font-semibold px-2.5 py-1 rounded-full"
            style={{ background: "#F3EEF7", color: "#875E9E" }}
          >
            {alumniAchievements.length} شارة
          </span>
        </div>
        <div className="p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {alumniAchievements.map((ach) => {
            const bc  = badgeConfig[ach.level];
            const cat = categoryLabel[ach.category];
            return (
              <div
                key={ach.id}
                className="rounded-xl p-4 flex items-start gap-3"
                style={{ border: `1px solid ${bc.border}30`, background: bc.bg }}
              >
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0"
                  style={{ background: "#fff", border: `2px solid ${bc.border}40` }}
                >
                  {ach.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <p className="font-bold text-sm text-[#1F2937] leading-snug">{ach.title}</p>
                    <span className="text-sm">{bc.star}</span>
                  </div>
                  <p className="text-xs text-[#6B7280] leading-relaxed">{ach.description}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span
                      className="text-xs font-semibold px-2 py-0.5 rounded-full"
                      style={{ background: "#fff", color: cat.color }}
                    >
                      {cat.label}
                    </span>
                    <span className="text-xs text-[#9CA3AF]">
                      {new Date(ach.earnedDate).toLocaleDateString("ar-SA", { month: "long", year: "numeric" })}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
