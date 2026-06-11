"use client";
import { useState } from "react";
import { availableCourses } from "@/lib/sanad-mock";

export default function CourseRegistration() {
  const [selected, setSelected]   = useState<string | null>(null);
  const [registered, setRegistered] = useState<Set<string>>(new Set());
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage]      = useState("");

  async function handleRegister() {
    if (!selected) return;
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1000));
    setRegistered((prev) => new Set([...prev, selected]));
    setMessage(`تم التسجيل في ${availableCourses.find((c) => c.id === selected)?.name} بنجاح!`);
    setSelected(null);
    setSubmitting(false);
    setTimeout(() => setMessage(""), 4000);
  }

  return (
    <div className="space-y-3">
      {message && (
        <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg px-4 py-2.5 text-sm font-medium">
          ✅ {message}
        </div>
      )}

      <div className="overflow-x-auto rounded-xl border border-gray-100">
        <table className="w-full text-sm">
          <thead className="bg-[#F5F3FF]">
            <tr>
              <th className="px-4 py-3 text-start text-xs font-bold text-[#3D1F6E]">اختر</th>
              <th className="px-4 py-3 text-start text-xs font-bold text-[#3D1F6E]">المقرر</th>
              <th className="px-4 py-3 text-start text-xs font-bold text-[#3D1F6E] hidden sm:table-cell">المدرّس</th>
              <th className="px-4 py-3 text-start text-xs font-bold text-[#3D1F6E] hidden md:table-cell">الوقت</th>
              <th className="px-4 py-3 text-start text-xs font-bold text-[#3D1F6E]">المقاعد</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {availableCourses.map((course) => {
              const full = course.seats === 0;
              const done = registered.has(course.id);
              return (
                <tr
                  key={course.id}
                  className={`transition-colors ${done ? "bg-green-50" : full ? "opacity-50" : "hover:bg-[#F5F3FF]"}`}
                >
                  <td className="px-4 py-3">
                    {done ? (
                      <span className="text-green-500 font-bold">✓</span>
                    ) : (
                      <input
                        type="radio"
                        name="course"
                        value={course.id}
                        disabled={full}
                        checked={selected === course.id}
                        onChange={() => setSelected(course.id)}
                        className="accent-[#3D1F6E]"
                      />
                    )}
                  </td>
                  <td className="px-4 py-3 font-medium text-[#1F2937]">
                    <span className="text-[#3D1F6E] font-bold text-xs me-1">{course.id}</span>
                    {course.name}
                  </td>
                  <td className="px-4 py-3 text-gray-500 hidden sm:table-cell">{course.instructor}</td>
                  <td className="px-4 py-3 text-gray-500 hidden md:table-cell">{course.time}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        full ? "bg-red-100 text-red-600" : "bg-green-100 text-green-700"
                      }`}
                    >
                      {full ? "ممتلئ" : `${course.seats}/${course.total}`}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <button
        onClick={handleRegister}
        disabled={!selected || submitting}
        className="px-6 py-2.5 bg-[#00B4C8] text-white rounded-lg text-sm font-semibold hover:bg-[#0097AA] disabled:opacity-40 transition-colors"
      >
        {submitting ? "جارٍ التسجيل..." : "تسجيل في المقرر المختار"}
      </button>
    </div>
  );
}
