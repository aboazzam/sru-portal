"use client";
import Link from "next/link";
import { useState } from "react";
import { alumniEvents, type AlumniEvent, type EventType } from "@/lib/mock/alumni";

const eventTypeConfig: Record<EventType, { label: string; color: string; bg: string }> = {
  networking: { label: "تواصل",       color: "#875E9E", bg: "#F3EEF7" },
  career:     { label: "توظيف",       color: "#6CAEBD", bg: "#E8F6F8" },
  workshop:   { label: "ورشة",        color: "#16A34A", bg: "#DCFCE7" },
  ceremony:   { label: "احتفالية",    color: "#D97706", bg: "#FEF3C7" },
  social:     { label: "اجتماعية",    color: "#4A8FA0", bg: "#E8F4F7" },
};

const EVENT_TYPES: EventType[] = ["networking", "career", "workshop", "ceremony", "social"];

type ManagedEvent = AlumniEvent & { archived?: boolean };

type NewEventForm = {
  title: string; type: EventType; date: string; time: string;
  location: string; online: boolean; description: string;
  seats: string;
};

const EMPTY_FORM: NewEventForm = {
  title: "", type: "networking", date: "", time: "17:00",
  location: "", online: false, description: "", seats: "100",
};

export default function EventsManagePage() {
  const [events, setEvents] = useState<ManagedEvent[]>(alumniEvents);
  const [showForm, setShowForm]   = useState(false);
  const [form, setForm]           = useState<NewEventForm>(EMPTY_FORM);
  const [toast, setToast]         = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
  const [errors, setErrors]       = useState<Partial<Record<keyof NewEventForm, string>>>({});

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  }

  function setField<K extends keyof NewEventForm>(key: K, val: NewEventForm[K]) {
    setForm((p) => ({ ...p, [key]: val }));
    setErrors((p) => ({ ...p, [key]: "" }));
  }

  function validate(): boolean {
    const e: Partial<Record<keyof NewEventForm, string>> = {};
    if (!form.title.trim())       e.title       = "مطلوب";
    if (!form.date)               e.date        = "مطلوب";
    if (!form.location.trim())    e.location    = "مطلوب";
    if (!form.description.trim()) e.description = "مطلوب";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleAddEvent(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    const seats = parseInt(form.seats) || 100;
    const newEvent: ManagedEvent = {
      id:          Date.now(),
      title:       form.title,
      type:        form.type,
      date:        form.date,
      time:        form.time,
      location:    form.location,
      online:      form.online,
      description: form.description,
      seats,
      seatsLeft:   seats,
      registered:  false,
      color:       eventTypeConfig[form.type].color,
    };
    setEvents((p) => [newEvent, ...p]);
    setForm(EMPTY_FORM);
    setShowForm(false);
    showToast("✅ تم إضافة الفعالية بنجاح");
  }

  function handleDelete(id: number) {
    setEvents((p) => p.filter((ev) => ev.id !== id));
    setConfirmDelete(null);
    showToast("🗑️ تم حذف الفعالية");
  }

  function handleArchive(id: number) {
    setEvents((p) => p.map((ev) => ev.id === id ? { ...ev, archived: true } : ev));
    showToast("📦 تم أرشفة الفعالية");
  }

  function handleRestore(id: number) {
    setEvents((p) => p.map((ev) => ev.id === id ? { ...ev, archived: false } : ev));
    showToast("♻️ تم استعادة الفعالية");
  }

  const active   = events.filter((e) => !e.archived);
  const archived = events.filter((e) => e.archived);

  const inputCls = "w-full px-3 py-2.5 border border-[#D1D5DB] rounded-xl text-sm focus:outline-none focus:border-[#4A8FA0] bg-white";

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-[#8FA4AB]">
        <Link href="/alumni/admin" className="hover:text-[#4A8FA0] transition-colors">لوحة الإدارة</Link>
        <span>/</span>
        <span className="text-[#1A2A30] font-medium">إدارة الفعاليات</span>
      </div>

      {toast && (
        <div
          className="fixed top-6 start-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-xl text-sm font-semibold text-white shadow-lg"
          style={{ background: "#4A8FA0" }}
        >
          {toast}
        </div>
      )}

      {/* Confirm delete modal */}
      {confirmDelete !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.5)" }}
          onClick={() => setConfirmDelete(null)}
        >
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full" onClick={(e) => e.stopPropagation()}>
            <div className="text-3xl mb-3 text-center">⚠️</div>
            <p className="font-bold text-[#1A2A30] text-center mb-2">حذف الفعالية؟</p>
            <p className="text-sm text-[#6B7280] text-center mb-5">هذا الإجراء لا يمكن التراجع عنه.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="flex-1 py-2.5 rounded-xl text-sm font-bold border border-[#E8EDEF] text-[#506570] hover:bg-[#F4F7F8]"
              >
                إلغاء
              </button>
              <button
                onClick={() => handleDelete(confirmDelete)}
                className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white"
                style={{ background: "#DC2626" }}
              >
                حذف نهائياً
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hero */}
      <div
        className="rounded-2xl p-5 text-white shadow-sm"
        style={{ background: "linear-gradient(135deg, #4A8FA0 0%, #2D6B7A 100%)" }}
      >
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-xl font-bold">إدارة الفعاليات 📅</h1>
            <p className="text-white/80 text-sm mt-0.5">
              {active.length} فعالية نشطة · {archived.length} مؤرشفة
            </p>
          </div>
          <button
            onClick={() => setShowForm((p) => !p)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-opacity hover:opacity-90"
            style={{ background: showForm ? "rgba(255,255,255,0.35)" : "rgba(255,255,255,0.2)", color: "#fff" }}
          >
            {showForm ? "✕ إغلاق النموذج" : "+ إضافة فعالية جديدة"}
          </button>
        </div>
      </div>

      {/* Add event form */}
      {showForm && (
        <div className="bg-white rounded-2xl border border-[#E8EDEF] shadow-sm overflow-hidden">
          <div className="px-5 py-3 border-b border-[#E8EDEF] flex items-center gap-2" style={{ background: "#F4F7F8" }}>
            <span>📝</span>
            <h2 className="font-bold text-[#1A2A30] text-sm">إضافة فعالية جديدة</h2>
          </div>
          <form onSubmit={handleAddEvent} className="p-5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-[#374151] block mb-1">عنوان الفعالية <span className="text-red-500">*</span></label>
                <input value={form.title} onChange={(e) => setField("title", e.target.value)} placeholder="مثال: ملتقى الخريجين السنوي 2027" className={inputCls} />
                {errors.title && <p className="text-xs text-red-500 mt-0.5">{errors.title}</p>}
              </div>
              <div>
                <label className="text-xs font-bold text-[#374151] block mb-1">نوع الفعالية</label>
                <select value={form.type} onChange={(e) => setField("type", e.target.value as EventType)} className={inputCls}>
                  {EVENT_TYPES.map((t) => (
                    <option key={t} value={t}>{eventTypeConfig[t].label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-[#374151] block mb-1">التاريخ <span className="text-red-500">*</span></label>
                <input type="date" value={form.date} onChange={(e) => setField("date", e.target.value)} className={inputCls} />
                {errors.date && <p className="text-xs text-red-500 mt-0.5">{errors.date}</p>}
              </div>
              <div>
                <label className="text-xs font-bold text-[#374151] block mb-1">الوقت</label>
                <input type="time" value={form.time} onChange={(e) => setField("time", e.target.value)} className={inputCls} />
              </div>
              <div>
                <label className="text-xs font-bold text-[#374151] block mb-1">المكان <span className="text-red-500">*</span></label>
                <input value={form.location} onChange={(e) => setField("location", e.target.value)} placeholder="قاعة / رابط Zoom..." className={inputCls} />
                {errors.location && <p className="text-xs text-red-500 mt-0.5">{errors.location}</p>}
              </div>
              <div>
                <label className="text-xs font-bold text-[#374151] block mb-1">عدد المقاعد</label>
                <input type="number" min="1" value={form.seats} onChange={(e) => setField("seats", e.target.value)} className={inputCls} />
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-[#374151] block mb-1">وصف الفعالية <span className="text-red-500">*</span></label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => setField("description", e.target.value)}
                  placeholder="اكتب وصفاً مختصراً للفعالية..."
                  className={inputCls + " resize-none"}
                />
                {errors.description && <p className="text-xs text-red-500 mt-0.5">{errors.description}</p>}
              </div>
              <div className="sm:col-span-2">
                <label className="flex items-center gap-2 cursor-pointer w-fit">
                  <input
                    type="checkbox"
                    checked={form.online}
                    onChange={(e) => setField("online", e.target.checked)}
                  />
                  <span className="text-xs font-semibold text-[#374151]">فعالية أونلاين (عبر Zoom / Teams)</span>
                </label>
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => { setShowForm(false); setForm(EMPTY_FORM); setErrors({}); }}
                className="px-5 py-2.5 rounded-xl text-sm font-bold border border-[#E8EDEF] text-[#506570] hover:bg-[#F4F7F8]"
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="px-7 py-2.5 rounded-xl text-sm font-bold text-white transition-opacity hover:opacity-90"
                style={{ background: "linear-gradient(to left, #4A8FA0, #2D6B7A)" }}
              >
                إضافة الفعالية ✓
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Active events */}
      <div className="space-y-3">
        <h2 className="font-bold text-[#1A2A30] text-sm flex items-center gap-2">
          <span>📋</span> الفعاليات النشطة ({active.length})
        </h2>
        {active.length === 0 && (
          <div className="bg-white rounded-2xl border border-[#E8EDEF] p-8 text-center">
            <p className="text-3xl mb-2">📭</p>
            <p className="text-sm text-[#8FA4AB]">لا توجد فعاليات نشطة — أضف فعالية جديدة</p>
          </div>
        )}
        {active.map((ev) => {
          const tc = eventTypeConfig[ev.type];
          const isPast = new Date(ev.date) < new Date();
          const registrationPct = Math.round(((ev.seats - ev.seatsLeft) / ev.seats) * 100);
          return (
            <div key={ev.id} className="bg-white rounded-2xl border border-[#E8EDEF] shadow-sm overflow-hidden">
              <div className="h-1" style={{ background: tc.color }} />
              <div className="p-5">
                <div className="flex items-start gap-4 flex-wrap">
                  {/* Date block */}
                  <div
                    className="w-14 h-14 rounded-xl flex flex-col items-center justify-center shrink-0 text-white"
                    style={{ background: `linear-gradient(135deg, ${tc.color}, ${tc.color}BB)` }}
                  >
                    <span className="text-xl font-bold leading-none">
                      {new Date(ev.date).getDate()}
                    </span>
                    <span className="text-xs opacity-80">
                      {new Date(ev.date).toLocaleDateString("ar-SA", { month: "short" })}
                    </span>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h3 className="font-bold text-[#1F2937] text-base">{ev.title}</h3>
                      <span
                        className="text-xs font-semibold px-2 py-0.5 rounded-full"
                        style={{ background: tc.bg, color: tc.color }}
                      >
                        {tc.label}
                      </span>
                      {isPast && (
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: "#F3F4F6", color: "#6B7280" }}>
                          انتهت
                        </span>
                      )}
                      {ev.online && (
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: "#E8F4F7", color: "#4A8FA0" }}>
                          🌐 أونلاين
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#6B7280]">
                      📅 {new Date(ev.date).toLocaleDateString("ar-SA", { weekday: "long", day: "numeric", month: "long" })} · {ev.time}
                    </p>
                    <p className="text-xs text-[#6B7280] mt-0.5">📍 {ev.location}</p>
                    <p className="text-xs text-[#9CA3AF] mt-1 line-clamp-1">{ev.description}</p>

                    {/* Registration bar */}
                    <div className="mt-2 flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-[#F4F7F8] rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${registrationPct}%`,
                            background: registrationPct >= 90 ? "#DC2626" : registrationPct >= 70 ? "#D97706" : "#16A34A",
                          }}
                        />
                      </div>
                      <span className="text-xs text-[#8FA4AB] whitespace-nowrap">
                        {ev.seats - ev.seatsLeft}/{ev.seats} مسجَّل
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 flex-wrap shrink-0">
                    <button
                      onClick={() => showToast("✏️ نموذج التعديل قريباً")}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold border border-[#E8EDEF] text-[#506570] hover:bg-[#F4F7F8] transition-colors"
                    >
                      تعديل
                    </button>
                    <button
                      onClick={() => handleArchive(ev.id)}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold border border-[#E8EDEF] text-[#506570] hover:bg-[#F4F7F8] transition-colors"
                    >
                      أرشفة
                    </button>
                    <button
                      onClick={() => setConfirmDelete(ev.id)}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold border text-red-600 hover:bg-red-50 transition-colors"
                      style={{ borderColor: "#FECACA" }}
                    >
                      حذف
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Archived events */}
      {archived.length > 0 && (
        <div className="space-y-3">
          <h2 className="font-bold text-[#8FA4AB] text-sm flex items-center gap-2">
            <span>📦</span> الفعاليات المؤرشفة ({archived.length})
          </h2>
          {archived.map((ev) => {
            const tc = eventTypeConfig[ev.type];
            return (
              <div key={ev.id} className="bg-[#F9FAFB] rounded-2xl border border-[#E8EDEF] p-4 opacity-70">
                <div className="flex items-center gap-3 flex-wrap">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold text-white shrink-0"
                    style={{ background: tc.color + "80" }}
                  >
                    {new Date(ev.date).getDate()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-[#6B7280] truncate">{ev.title}</p>
                    <p className="text-xs text-[#9CA3AF]">{new Date(ev.date).toLocaleDateString("ar-SA", { day: "numeric", month: "long", year: "numeric" })}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleRestore(ev.id)}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold border border-[#E8EDEF] text-[#4A8FA0] hover:bg-[#E8F4F7] transition-colors"
                    >
                      استعادة
                    </button>
                    <button
                      onClick={() => setConfirmDelete(ev.id)}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold text-red-600 hover:bg-red-50 transition-colors border border-[#FECACA]"
                    >
                      حذف
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
