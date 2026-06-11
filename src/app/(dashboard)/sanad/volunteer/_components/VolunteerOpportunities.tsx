"use client";
import { useState } from "react";
import { volunteerOpportunities } from "@/lib/sanad-mock";

const categories = ["الكل", "تعليمي", "بيئي", "اجتماعي", "رياضي", "ثقافي"];

const categoryColors: Record<string, string> = {
  تعليمي: "#3D1F6E",
  بيئي: "#22c55e",
  اجتماعي: "#00B4C8",
  رياضي: "#f59e0b",
  ثقافي: "#6B46C1",
};

export default function VolunteerOpportunities() {
  const [filter, setFilter]       = useState("الكل");
  const [registered, setRegistered] = useState<Set<number>>(new Set());
  const [success, setSuccess]     = useState<string | null>(null);

  const filtered = filter === "الكل"
    ? volunteerOpportunities
    : volunteerOpportunities.filter((o) => o.category === filter);

  function register(id: number, title: string) {
    setRegistered((prev) => new Set([...prev, id]));
    setSuccess(`تم التسجيل في "${title}" بنجاح!`);
    setTimeout(() => setSuccess(null), 4000);
  }

  return (
    <div className="space-y-4">
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg px-4 py-2.5 text-sm font-medium">
          ✅ {success}
        </div>
      )}

      {/* Category filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
              filter === cat
                ? "bg-[#3D1F6E] text-white"
                : "bg-white border border-gray-200 text-gray-600 hover:border-[#3D1F6E]"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Opportunities */}
      <div className="space-y-3">
        {filtered.length === 0 && (
          <p className="text-center text-gray-400 text-sm py-8">لا توجد فرص في هذه الفئة</p>
        )}
        {filtered.map((opp) => {
          const done = registered.has(opp.id);
          const color = categoryColors[opp.category] ?? "#3D1F6E";
          return (
            <div
              key={opp.id}
              className={`rounded-xl border p-4 transition-all ${
                done ? "border-green-200 bg-green-50" : "border-gray-100 bg-white hover:border-purple-200"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-bold text-[#1F2937] text-sm">{opp.title}</h4>
                    <span
                      className="text-xs px-2 py-0.5 rounded-full font-medium"
                      style={{ background: color + "22", color }}
                    >
                      {opp.category}
                    </span>
                  </div>
                  <p className="text-gray-500 text-xs mt-1">🏢 {opp.org}</p>
                  <div className="flex gap-4 mt-2 text-xs text-gray-400">
                    <span>⏱️ {opp.hours} ساعات</span>
                    <span>👥 {opp.spots} مقعد</span>
                    <span>📅 آخر موعد: {new Date(opp.deadline).toLocaleDateString("ar-SA")}</span>
                  </div>
                </div>
                <button
                  onClick={() => !done && register(opp.id, opp.title)}
                  disabled={done}
                  className={`shrink-0 px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
                    done
                      ? "bg-green-100 text-green-700 cursor-default"
                      : "bg-[#3D1F6E] text-white hover:bg-[#2C1650]"
                  }`}
                >
                  {done ? "✓ مسجّل" : "التسجيل"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
