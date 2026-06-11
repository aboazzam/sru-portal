"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { alumniEvents, alumniProfile, type AlumniEvent, type EventType } from "@/lib/mock/alumni";

type Tab = "all" | "mine";

const eventTypeConfig: Record<EventType, { label: string; color: string; bg: string; icon: string }> = {
  networking: { label: "تواصل",   color: "#875E9E", bg: "#F3EEF7", icon: "🤝" },
  career:     { label: "مهني",    color: "#6CAEBD", bg: "#E8F6F8", icon: "💼" },
  workshop:   { label: "ورشة",    color: "#4A8FA0", bg: "#EEF6F8", icon: "🛠️" },
  ceremony:   { label: "احتفالية",color: "#D97706", bg: "#FEF3C7", icon: "🏆" },
  social:     { label: "اجتماعي", color: "#16A34A", bg: "#DCFCE7", icon: "🎉" },
};

function useCountdown(targetDate: string) {
  const [diff, setDiff] = useState(0);
  useEffect(() => {
    const calc = () => setDiff(Math.max(0, new Date(targetDate).getTime() - Date.now()));
    calc();
    const t = setInterval(calc, 1000);
    return () => clearInterval(t);
  }, [targetDate]);
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  return { d, h, m, s, passed: diff === 0 };
}

function CountdownUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold text-white"
        style={{ background: "rgba(255,255,255,0.2)" }}
      >
        {String(value).padStart(2, "0")}
      </div>
      <span className="text-white/60 text-xs mt-1">{label}</span>
    </div>
  );
}

function FeaturedEventCard({ event }: { event: AlumniEvent }) {
  const tc = eventTypeConfig[event.type];
  const cd = useCountdown(event.date);
  const [registered, setRegistered] = useState(event.registered);
  const [showCard, setShowCard] = useState(false);

  return (
    <div
      className="relative rounded-2xl overflow-hidden shadow-lg text-white"
      style={{ background: `linear-gradient(135deg, ${tc.color} 0%, #1A2A30 100%)` }}
    >
      <div
        className="absolute inset-0 opacity-10"
        style={{ backgroundImage: "radial-gradient(circle at 70% 30%, #fff 1px, transparent 1px)", backgroundSize: "30px 30px" }}
      />
      <div className="relative z-10 p-6">
        <div className="flex items-start justify-between gap-3 flex-wrap mb-4">
          <div>
            <span
              className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full mb-2"
              style={{ background: "rgba(255,255,255,0.2)" }}
            >
              {tc.icon} {tc.label} · مميزة
            </span>
            <h2 className="text-xl font-bold leading-snug">{event.title}</h2>
            <p className="text-white/70 text-sm mt-1">{event.description}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm text-white/80 mb-5 flex-wrap">
          <span>📅 {new Date(event.date).toLocaleDateString("ar-SA", { weekday: "long", day: "numeric", month: "long" })}</span>
          <span>⏰ {event.time}</span>
          <span>{event.online ? "🌐" : "📍"} {event.location}</span>
        </div>

        {/* Countdown */}
        {!cd.passed && (
          <div className="mb-5">
            <p className="text-white/60 text-xs mb-2">تبدأ خلال</p>
            <div className="flex gap-3">
              <CountdownUnit value={cd.d} label="يوم" />
              <CountdownUnit value={cd.h} label="ساعة" />
              <CountdownUnit value={cd.m} label="دقيقة" />
              <CountdownUnit value={cd.s} label="ثانية" />
            </div>
          </div>
        )}

        <div className="flex items-center gap-3 flex-wrap">
          {registered ? (
            <>
              <span
                className="flex items-center gap-1.5 text-sm font-bold px-4 py-2 rounded-xl"
                style={{ background: "rgba(255,255,255,0.2)" }}
              >
                ✅ مسجّل في الفعالية
              </span>
              <button
                onClick={() => setShowCard(true)}
                className="text-sm font-semibold underline text-white/80 hover:text-white"
              >
                عرض بطاقة الحضور ←
              </button>
            </>
          ) : (
            <button
              onClick={() => setRegistered(true)}
              className="flex items-center gap-2 text-sm font-bold px-5 py-2.5 rounded-xl transition-opacity hover:opacity-90"
              style={{ background: "#fff", color: tc.color }}
            >
              سجّل الآن — {event.seatsLeft} مقعد متبقٍ
            </button>
          )}
        </div>
      </div>

      {/* Attendance Card Modal */}
      {showCard && (
        <AttendanceModal event={event} onClose={() => setShowCard(false)} />
      )}
    </div>
  );
}

function AttendanceModal({ event, onClose }: { event: AlumniEvent; onClose: () => void }) {
  const tc = eventTypeConfig[event.type];
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.6)" }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Card header */}
        <div
          className="p-5 text-white text-center"
          style={{ background: `linear-gradient(135deg, ${tc.color}, #1A2A30)` }}
        >
          <p className="text-white/70 text-xs mb-1">بطاقة حضور — جامعة سليمان الراجحي</p>
          <h3 className="font-bold text-base leading-snug">{event.title}</h3>
        </div>

        <div className="p-5 space-y-3">
          {[
            { label: "الاسم",      value: alumniProfile.name },
            { label: "رقم الخريج", value: alumniProfile.id },
            { label: "التاريخ",   value: new Date(event.date).toLocaleDateString("ar-SA", { day: "numeric", month: "long", year: "numeric" }) },
            { label: "الوقت",     value: event.time },
            { label: "المكان",    value: event.location },
          ].map((r) => (
            <div key={r.label} className="flex items-center gap-3 text-sm">
              <span className="text-[#8FA4AB] w-24 shrink-0 text-xs">{r.label}</span>
              <span className="font-semibold text-[#1F2937]">{r.value}</span>
            </div>
          ))}

          {/* Fake QR */}
          <div className="flex justify-center py-2">
            <div className="bg-[#F4F7F8] p-3 rounded-xl">
              <div className="grid gap-0.5" style={{ gridTemplateColumns: "repeat(7,1fr)" }}>
                {[1,1,1,0,1,1,1,1,0,1,0,1,0,1,1,0,1,1,0,0,1,1,1,1,0,1,1,1,0,1,0,1,0,1,0,0,0,0,0,1,0,1,1,1,1,0,0,1,1].map((c, i) => (
                  <div key={i} className="w-4 h-4 rounded-[1px]" style={{ background: c ? "#1A2A30" : "#fff" }} />
                ))}
              </div>
              <p className="text-center text-[9px] text-[#8FA4AB] mt-1 font-mono">{alumniProfile.id}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl text-sm font-bold text-white"
            style={{ background: tc.color }}
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
}

function RegisterModal({ event, onConfirm, onClose }: { event: AlumniEvent; onConfirm: () => void; onClose: () => void }) {
  const tc = eventTypeConfig[event.type];
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.5)" }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-3"
            style={{ background: tc.bg }}
          >
            {tc.icon}
          </div>
          <h3 className="font-bold text-[#1A2A30] text-base">تأكيد التسجيل</h3>
          <p className="text-sm text-[#6B7280] mt-1 leading-relaxed">{event.title}</p>
        </div>
        <div className="space-y-2 bg-[#F4F7F8] rounded-xl p-4 text-sm">
          <div className="flex justify-between">
            <span className="text-[#8FA4AB]">التاريخ</span>
            <span className="font-semibold text-[#1F2937]">
              {new Date(event.date).toLocaleDateString("ar-SA", { day: "numeric", month: "long" })}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#8FA4AB]">الوقت</span>
            <span className="font-semibold text-[#1F2937]">{event.time}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#8FA4AB]">المكان</span>
            <span className="font-semibold text-[#1F2937] text-end max-w-[60%] leading-tight">{event.location}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#8FA4AB]">المقاعد المتبقية</span>
            <span className="font-semibold" style={{ color: tc.color }}>{event.seatsLeft}</span>
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl text-sm font-bold border border-[#E8EDEF] text-[#506570] hover:bg-[#F4F7F8]">
            إلغاء
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white"
            style={{ background: tc.color }}
          >
            تأكيد التسجيل
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AlumniEventsPage() {
  const [tab, setTab]             = useState<Tab>("all");
  const [registered, setRegistered] = useState<number[]>([]);
  const [modalEvent, setModalEvent] = useState<AlumniEvent | null>(null);
  const [cardEvent, setCardEvent]   = useState<AlumniEvent | null>(null);

  const isRegistered = (id: number) => registered.includes(id) || alumniEvents.find(e => e.id === id)?.registered;

  function confirmRegister() {
    if (!modalEvent) return;
    setRegistered((p) => [...p, modalEvent.id]);
    setModalEvent(null);
  }

  const featured = alumniEvents.filter((_, i) => i === 0);
  const upcoming = alumniEvents.filter((e) => new Date(e.date) >= new Date()).sort((a, b) => a.date.localeCompare(b.date));
  const myEvents  = alumniEvents.filter((e) => isRegistered(e.id));

  return (
    <div className="space-y-6">

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-[#8FA4AB]">
        <Link href="/alumni" className="hover:text-[#875E9E] transition-colors">بوابة الخريجين</Link>
        <span>/</span>
        <span className="text-[#1A2A30] font-medium">الفعاليات</span>
      </div>

      {/* Featured */}
      <div className="space-y-3">
        <h2 className="font-bold text-[#1A2A30] text-sm flex items-center gap-2">
          <span>⭐</span> الفعاليات المميزة
        </h2>
        {featured.map((e) => <FeaturedEventCard key={e.id} event={e} />)}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-[#F4F7F8] rounded-xl p-1 w-fit">
        {([
          { id: "all",  label: `جميع الفعاليات (${upcoming.length})`, icon: "📅" },
          { id: "mine", label: `فعالياتي (${myEvents.length})`,        icon: "✅" },
        ] as { id: Tab; label: string; icon: string }[]).map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all"
            style={tab === t.id ? { background: "#875E9E", color: "#fff" } : { color: "#506570" }}
          >
            <span>{t.icon}</span><span>{t.label}</span>
          </button>
        ))}
      </div>

      {/* All events */}
      {tab === "all" && (
        <div className="space-y-3">
          {upcoming.map((event) => {
            const tc   = eventTypeConfig[event.type];
            const reg  = isRegistered(event.id);
            return (
              <div
                key={event.id}
                className="bg-white rounded-2xl border border-[#E8EDEF] shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="h-1" style={{ background: tc.color }} />
                <div className="p-5 flex items-start gap-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0"
                    style={{ background: tc.bg }}
                  >
                    {tc.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 flex-wrap">
                      <div>
                        <span
                          className="text-xs font-bold px-2 py-0.5 rounded-full me-2"
                          style={{ background: tc.bg, color: tc.color }}
                        >
                          {tc.label}
                        </span>
                        <h3 className="font-bold text-[#1F2937] text-sm mt-1 leading-snug">{event.title}</h3>
                      </div>
                      {reg && (
                        <span
                          className="shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full"
                          style={{ background: "#DCFCE7", color: "#16A34A" }}
                        >
                          ✅ مسجّل
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#6B7280] mt-1 leading-relaxed">{event.description}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-[#8FA4AB] flex-wrap">
                      <span>📅 {new Date(event.date).toLocaleDateString("ar-SA", { day: "numeric", month: "long" })}</span>
                      <span>⏰ {event.time}</span>
                      <span>{event.online ? "🌐" : "📍"} {event.location}</span>
                      <span>{event.seatsLeft} مقعد</span>
                    </div>
                    <div className="flex items-center gap-3 mt-3 flex-wrap">
                      {reg ? (
                        <button
                          onClick={() => setCardEvent(event)}
                          className="text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors hover:opacity-80"
                          style={{ background: tc.bg, color: tc.color }}
                        >
                          🎫 بطاقة الحضور
                        </button>
                      ) : (
                        <button
                          onClick={() => setModalEvent(event)}
                          className="text-xs font-semibold px-4 py-1.5 rounded-lg text-white transition-opacity hover:opacity-90"
                          style={{ background: tc.color }}
                        >
                          سجّل الآن
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* My events */}
      {tab === "mine" && (
        <div>
          {myEvents.length === 0 ? (
            <div className="bg-white rounded-2xl border border-[#E8EDEF] p-12 text-center">
              <p className="text-4xl mb-3">📅</p>
              <p className="font-bold text-[#1A2A30]">لم تسجّل في أي فعالية بعد</p>
              <button onClick={() => setTab("all")} className="mt-3 text-sm font-semibold underline" style={{ color: "#875E9E" }}>
                تصفح الفعاليات ←
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {myEvents.map((event) => {
                const tc = eventTypeConfig[event.type];
                return (
                  <div key={event.id} className="bg-white rounded-2xl border border-[#E8EDEF] p-5 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0" style={{ background: tc.bg }}>
                      {tc.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-[#1F2937] leading-snug">{event.title}</p>
                      <p className="text-xs text-[#9CA3AF] mt-0.5">
                        {new Date(event.date).toLocaleDateString("ar-SA", { day: "numeric", month: "long", year: "numeric" })} · {event.time}
                      </p>
                    </div>
                    <button
                      onClick={() => setCardEvent(event)}
                      className="shrink-0 text-xs font-semibold px-3 py-1.5 rounded-lg"
                      style={{ background: tc.bg, color: tc.color }}
                    >
                      🎫 بطاقة الحضور
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Modals */}
      {modalEvent && (
        <RegisterModal event={modalEvent} onConfirm={confirmRegister} onClose={() => setModalEvent(null)} />
      )}
      {cardEvent && (
        <AttendanceModal event={cardEvent} onClose={() => setCardEvent(null)} />
      )}
    </div>
  );
}
