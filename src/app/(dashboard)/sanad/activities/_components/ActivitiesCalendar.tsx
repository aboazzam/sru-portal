"use client";
import { useState, useTransition } from "react";
import { applyForActivity } from "../../_actions";

type Activity = {
  id: string;
  title: string;
  description: string | null;
  date: Date | null;
  _count: { applications: number };
};

interface Props {
  activities: Activity[];
  appliedIds: Set<string>;
}

const PURPLE = "#3D1F6E";
const CYAN   = "#00B4C8";

const DAYS_HEADER = ["أحد", "اثنين", "ثلاثاء", "أربعاء", "خميس", "جمعة", "سبت"];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}
function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

export default function ActivitiesCalendar({ activities, appliedIds }: Props) {
  const today = new Date();
  const [year]  = useState(today.getFullYear());
  const [month] = useState(today.getMonth());
  const [selected, setSelected] = useState<Activity | null>(null);

  const [applied, setApplied] = useState<Set<string>>(new Set(appliedIds));
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay    = getFirstDayOfMonth(year, month);
  const totalCells  = Math.ceil((firstDay + daysInMonth) / 7) * 7;

  const monthName = new Date(year, month, 1).toLocaleDateString("ar-SA", { month: "long", year: "numeric" });

  function getActivitiesForDay(day: number): Activity[] {
    return activities.filter((a) => {
      if (!a.date) return false;
      const d = new Date(a.date);
      return d.getFullYear() === year && d.getMonth() === month && d.getDate() === day;
    });
  }

  function handleApply(id: string, title: string) {
    setError(null);
    startTransition(async () => {
      const res = await applyForActivity(id);
      if (res.error) {
        setError(res.error);
      } else {
        setApplied((prev) => new Set([...prev, id]));
        setSuccess(`تم التسجيل في "${title}" بنجاح!`);
        setTimeout(() => setSuccess(null), 4000);
      }
    });
  }

  return (
    <div className="space-y-4">
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg px-4 py-2.5 text-sm font-medium">
          ✅ {success}
        </div>
      )}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg px-4 py-2.5 text-sm">
          {error}
        </div>
      )}

      <div className="text-center font-bold text-[#3D1F6E]">{monthName}</div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1 text-xs">
        {DAYS_HEADER.map((d) => (
          <div key={d} className="text-center font-bold text-[#6B46C1] py-1">{d}</div>
        ))}
        {Array.from({ length: totalCells }, (_, i) => {
          const day = i - firstDay + 1;
          const valid = day >= 1 && day <= daysInMonth;
          const dayActivities = valid ? getActivitiesForDay(day) : [];
          const isToday = valid && day === today.getDate();
          return (
            <div
              key={i}
              className={`min-h-[52px] rounded-lg p-1 border transition-colors ${
                valid ? "border-purple-100 hover:border-[#3D1F6E]/30 bg-white cursor-pointer" : "border-transparent bg-transparent"
              } ${isToday ? "ring-2 ring-[#00B4C8]" : ""}`}
              onClick={() => dayActivities.length > 0 && setSelected(dayActivities[0])}
            >
              {valid && (
                <>
                  <span className={`text-xs font-medium ${isToday ? "text-[#00B4C8] font-bold" : "text-gray-500"}`}>
                    {day}
                  </span>
                  <div className="mt-0.5 space-y-0.5">
                    {dayActivities.map((a) => (
                      <div key={a.id} className="h-1.5 rounded-full" style={{ background: PURPLE }} title={a.title} />
                    ))}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* Event detail popup */}
      {selected && (
        <div className="bg-[#F5F3FF] rounded-xl p-4 border border-purple-100 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h4 className="font-bold text-[#3D1F6E] text-sm">{selected.title}</h4>
              {selected.description && (
                <p className="text-gray-500 text-xs mt-0.5">{selected.description}</p>
              )}
              {selected.date && (
                <p className="text-gray-400 text-xs mt-1">
                  📅 {new Date(selected.date).toLocaleDateString("ar-SA")}
                </p>
              )}
              <p className="text-gray-400 text-xs">{selected._count.applications} مسجّل</p>
            </div>
            <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600 shrink-0">✕</button>
          </div>
          <button
            onClick={() => !applied.has(selected.id) && !isPending && handleApply(selected.id, selected.title)}
            disabled={applied.has(selected.id) || isPending}
            className={`w-full py-2 rounded-lg text-xs font-semibold transition-colors ${
              applied.has(selected.id)
                ? "bg-green-100 text-green-700 cursor-default"
                : "bg-[#3D1F6E] text-white hover:bg-[#2C1650] disabled:opacity-60"
            }`}
          >
            {applied.has(selected.id) ? "✓ مسجّل" : isPending ? "جارٍ..." : "التسجيل في النشاط"}
          </button>
        </div>
      )}

      {/* List of all activities */}
      {activities.length > 0 ? (
        <div>
          <h4 className="font-bold text-[#3D1F6E] text-sm mb-2">جميع الأنشطة</h4>
          <div className="space-y-2">
            {activities.map((act) => {
              const done = applied.has(act.id);
              return (
                <div
                  key={act.id}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 border transition-colors cursor-pointer ${
                    done ? "border-green-200 bg-green-50" : "border-gray-100 bg-white hover:border-purple-200"
                  }`}
                  onClick={() => setSelected(act)}
                >
                  <div className="w-2 h-8 rounded-full shrink-0" style={{ background: PURPLE }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#1F2937] truncate">{act.title}</p>
                    <p className="text-xs text-gray-400">
                      {act.date ? new Date(act.date).toLocaleDateString("ar-SA") : "بدون تاريخ"}
                      {" · "}
                      {act._count.applications} مسجّل
                    </p>
                  </div>
                  {done && (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full shrink-0">✓ مسجّل</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-400 text-sm py-4">لا توجد أنشطة مسجّلة حالياً</p>
      )}
    </div>
  );
}
