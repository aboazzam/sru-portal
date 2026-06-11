"use client";
import { useState } from "react";
import StudentView from "./_components/StudentView";
import FacultyView from "./_components/FacultyView";
import { mockStudent, mockFaculty } from "@/lib/mock/hala";

export default function HalaPage() {
  const [mode, setMode] = useState<"student" | "faculty">("student");

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#E8EDEF] flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-4">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shrink-0"
            style={{ background: "linear-gradient(135deg, #6CAEBD, #875E9E)" }}
          >
            💬
          </div>
          <div>
            <h1 className="text-xl font-bold text-[#1A2A30]">هلا بك</h1>
            <p className="text-[#8FA4AB] text-sm mt-0.5">لوحة التحكم الشخصية – جامعة سليمان الراجحي</p>
          </div>
        </div>

        {/* Role toggle – demo only */}
        <div className="flex items-center gap-1 bg-[#F4F7F8] rounded-xl p-1 border border-[#E8EDEF]">
          <button
            onClick={() => setMode("student")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              mode === "student"
                ? "bg-white shadow-sm text-[#4A8FA0] border border-[#C8E6EC]"
                : "text-[#8FA4AB] hover:text-[#506570]"
            }`}
          >
            🎓 طالب
          </button>
          <button
            onClick={() => setMode("faculty")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              mode === "faculty"
                ? "bg-white shadow-sm text-[#7A5490] border border-[#D8C8E8]"
                : "text-[#8FA4AB] hover:text-[#506570]"
            }`}
          >
            👨‍🏫 عضو هيئة التدريس
          </button>
        </div>
      </div>

      {/* Role-specific content */}
      {mode === "student" ? (
        <StudentView name={mockStudent.name} />
      ) : (
        <FacultyView name={mockFaculty.name} />
      )}
    </div>
  );
}
