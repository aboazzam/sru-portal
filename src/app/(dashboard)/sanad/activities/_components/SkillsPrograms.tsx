"use client";
import Link from "next/link";

type Training = {
  id: string;
  title: string;
  category: string | null;
  startDate: Date | null;
  capacity: number | null;
  status: string;
  _count: { enrollments: number };
};

interface Props {
  trainings: Training[];
  enrolledIds: Set<string>;
}

const statusLabel: Record<string, string> = {
  UPCOMING: "قادم",
  ONGOING:  "جارٍ",
};

const statusStyle: Record<string, string> = {
  UPCOMING: "bg-blue-100 text-blue-600",
  ONGOING:  "bg-green-100 text-green-700",
};

export default function SkillsPrograms({ trainings, enrolledIds }: Props) {
  if (trainings.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-400 text-sm">لا توجد برامج تدريب متاحة حالياً</p>
        <Link href="/student/trainings" className="text-xs text-[#3D1F6E] hover:underline mt-2 block">
          عرض جميع البرامج ←
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {trainings.map((t) => {
        const enrolled = enrolledIds.has(t.id);
        const full = t.capacity !== null && t._count.enrollments >= t.capacity;
        return (
          <div
            key={t.id}
            className={`flex items-center gap-4 rounded-xl p-4 border transition-all ${
              enrolled ? "border-[#00B4C8] bg-[#E0F7FA]" : "border-gray-100 bg-white hover:border-purple-200"
            }`}
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="font-semibold text-[#1F2937] text-sm">{t.title}</p>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusStyle[t.status] ?? "bg-gray-100 text-gray-500"}`}>
                  {statusLabel[t.status] ?? t.status}
                </span>
              </div>
              <p className="text-gray-400 text-xs mt-0.5">
                {t.category && `${t.category} · `}
                {t.startDate && `البدء: ${t.startDate.toLocaleDateString("ar-SA")} · `}
                {t._count.enrollments}{t.capacity ? `/${t.capacity}` : ""} مسجّل
              </p>
            </div>

            {enrolled ? (
              <span className="shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#00B4C8] text-white">
                ✓ مسجّل
              </span>
            ) : full ? (
              <span className="shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gray-100 text-gray-500">
                مكتمل
              </span>
            ) : (
              <Link
                href="/student/trainings"
                className="shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#3D1F6E] text-white hover:bg-[#2C1650] transition-colors"
              >
                التسجيل
              </Link>
            )}
          </div>
        );
      })}

      <div className="text-center pt-1">
        <Link href="/student/trainings" className="text-xs text-[#3D1F6E] hover:underline">
          عرض جميع برامج التدريب ←
        </Link>
      </div>
    </div>
  );
}
