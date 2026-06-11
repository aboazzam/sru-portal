"use client";
import { useState } from "react";
import { skillsPrograms } from "@/lib/sanad-mock";

const levelColors: Record<string, string> = {
  مبتدئ: "#00B4C8",
  متوسط: "#3D1F6E",
  متقدم: "#6B46C1",
};

export default function SkillsPrograms() {
  const [enrolled, setEnrolled] = useState<Set<number>>(
    new Set(skillsPrograms.filter((p) => p.enrolled).map((p) => p.id))
  );

  function toggle(id: number) {
    setEnrolled((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  return (
    <div className="space-y-3">
      {skillsPrograms.map((prog) => {
        const isEnrolled = enrolled.has(prog.id);
        const color = levelColors[prog.level] ?? "#3D1F6E";
        return (
          <div
            key={prog.id}
            className={`flex items-center gap-4 rounded-xl p-4 border transition-all ${
              isEnrolled ? "border-[#00B4C8] bg-[#E0F7FA]" : "border-gray-100 bg-white hover:border-purple-200"
            }`}
          >
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-[#1F2937] text-sm">{prog.name}</p>
              <p className="text-gray-400 text-xs mt-0.5">المدة: {prog.duration}</p>
            </div>
            <span
              className="text-xs font-medium px-2 py-0.5 rounded-full shrink-0"
              style={{ background: color + "22", color }}
            >
              {prog.level}
            </span>
            <button
              onClick={() => toggle(prog.id)}
              className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                isEnrolled
                  ? "bg-gray-200 text-gray-600 hover:bg-gray-300"
                  : "bg-[#3D1F6E] text-white hover:bg-[#2C1650]"
              }`}
            >
              {isEnrolled ? "إلغاء التسجيل" : "التسجيل"}
            </button>
          </div>
        );
      })}
    </div>
  );
}
