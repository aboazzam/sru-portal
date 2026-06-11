"use client";
import { useState } from "react";
import { events } from "@/lib/sanad-mock";

const DAYS_HEADER = ["أحد", "اثنين", "ثلاثاء", "أربعاء", "خميس", "جمعة", "سبت"];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}
function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

export default function ActivitiesCalendar() {
  const today = new Date();
  const [year]  = useState(today.getFullYear());
  const [month] = useState(today.getMonth());
  const [selected, setSelected] = useState<(typeof events)[0] | null>(null);
  const [registered, setRegistered] = useState<Set<number>>(new Set());

  const daysInMonth  = getDaysInMonth(year, month);
  const firstDay     = getFirstDayOfMonth(year, month);
  const totalCells   = Math.ceil((firstDay + daysInMonth) / 7) * 7;

  const monthName = new Date(year, month, 1).toLocaleDateString("ar-SA", { month: "long", year: "numeric" });

  function getEventsForDay(day: number) {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return events.filter((e) => e.date === dateStr);
  }

  function toggleRegister(id: number) {
    setRegistered((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  return (
    <div className="space-y-4">
      <div className="text-center font-bold text-[#3D1F6E]">{monthName}</div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1 text-xs">
        {DAYS_HEADER.map((d) => (
          <div key={d} className="text-center font-bold text-[#6B46C1] py-1">{d}</div>
        ))}
        {Array.from({ length: totalCells }, (_, i) => {
          const day = i - firstDay + 1;
          const valid = day >= 1 && day <= daysInMonth;
          const dayEvents = valid ? getEventsForDay(day) : [];
          const isToday = valid && day === today.getDate();
          return (
            <div
              key={i}
              className={`min-h-[52px] rounded-lg p-1 border transition-colors ${
                valid ? "border-purple-100 hover:border-[#3D1F6E]/30 bg-white cursor-pointer" : "border-transparent bg-transparent"
              } ${isToday ? "ring-2 ring-[#00B4C8]" : ""}`}
              onClick={() => dayEvents.length > 0 && setSelected(dayEvents[0])}
            >
              {valid && (
                <>
                  <span className={`text-xs font-medium ${isToday ? "text-[#00B4C8] font-bold" : "text-gray-500"}`}>
                    {day}
                  </span>
                  <div className="mt-0.5 space-y-0.5">
                    {dayEvents.map((ev) => (
                      <div
                        key={ev.id}
                        className="h-1.5 rounded-full"
                        style={{ background: ev.color }}
                        title={ev.title}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* Event detail */}
      {selected && (
        <div className="bg-[#F5F3FF] rounded-xl p-4 border border-purple-100 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h4 className="font-bold text-[#3D1F6E] text-sm">{selected.title}</h4>
              <p className="text-gray-500 text-xs mt-0.5">
                {new Date(selected.date).toLocaleDateString("ar-SA")} — {selected.time}
              </p>
              <p className="text-gray-500 text-xs">📍 {selected.location}</p>
            </div>
            <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600 shrink-0">✕</button>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">
              {selected.registered}/{selected.seats} مسجّل
            </span>
            <button
              onClick={() => toggleRegister(selected.id)}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                registered.has(selected.id)
                  ? "bg-gray-200 text-gray-600 hover:bg-gray-300"
                  : "bg-[#3D1F6E] text-white hover:bg-[#2C1650]"
              }`}
            >
              {registered.has(selected.id) ? "إلغاء التسجيل" : "التسجيل في الفعالية"}
            </button>
          </div>
        </div>
      )}

      {/* Upcoming events list */}
      <div>
        <h4 className="font-bold text-[#3D1F6E] text-sm mb-2">الفعاليات القادمة</h4>
        <div className="space-y-2">
          {events.map((ev) => (
            <div
              key={ev.id}
              className="flex items-center gap-3 bg-white rounded-lg px-3 py-2.5 border border-gray-100 hover:border-purple-200 cursor-pointer transition-colors"
              onClick={() => setSelected(ev)}
            >
              <div className="w-2 h-8 rounded-full shrink-0" style={{ background: ev.color }} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#1F2937] truncate">{ev.title}</p>
                <p className="text-xs text-gray-400">{new Date(ev.date).toLocaleDateString("ar-SA")} — {ev.location}</p>
              </div>
              <span
                className="text-xs px-2 py-0.5 rounded-full shrink-0"
                style={{ background: ev.color + "22", color: ev.color }}
              >
                {ev.category}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
