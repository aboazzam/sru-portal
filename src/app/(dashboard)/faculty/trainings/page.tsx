import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/dal";
import { prisma } from "@/lib/db";

const statusLabel: Record<string, string> = {
  UPCOMING:  "قادم",
  ONGOING:   "جارٍ",
  COMPLETED: "منتهٍ",
  CANCELLED: "ملغى",
};

const statusStyle: Record<string, string> = {
  UPCOMING:  "bg-blue-100 text-blue-700",
  ONGOING:   "bg-green-100 text-green-700",
  COMPLETED: "bg-gray-100 text-gray-500",
  CANCELLED: "bg-red-100 text-red-500",
};

export default async function FacultyTrainingsPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "FACULTY") redirect("/dashboard");

  const trainings = await prisma.training.findMany({
    orderBy: [{ status: "asc" }, { createdAt: "desc" }],
    select: {
      id: true,
      title: true,
      description: true,
      instructor: true,
      category: true,
      capacity: true,
      startDate: true,
      endDate: true,
      status: true,
      _count: { select: { enrollments: true } },
    },
  });

  const mine = trainings.filter((t) => t.instructor === user.name);
  const others = trainings.filter((t) => t.instructor !== user.name);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">البرامج التدريبية</h1>
        <p className="text-gray-500 text-sm mt-0.5">
          {trainings.length} برنامج إجمالاً
          {mine.length > 0 && ` · أنت مدرّب في ${mine.length}`}
        </p>
      </div>

      {/* My programs */}
      {mine.length > 0 && (
        <div className="space-y-3">
          <h2 className="font-semibold text-gray-700 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500 inline-block"></span>
            برامجي
          </h2>
          <div className="grid grid-cols-1 gap-3">
            {mine.map((t) => (
              <TrainingCard key={t.id} training={t} isOwn />
            ))}
          </div>
        </div>
      )}

      {/* All other programs */}
      <div className="space-y-3">
        {mine.length > 0 && (
          <h2 className="font-semibold text-gray-700 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-gray-400 inline-block"></span>
            برامج أخرى
          </h2>
        )}
        {others.length === 0 && mine.length === 0 && (
          <div className="bg-white rounded-xl border border-gray-200 py-12 text-center">
            <p className="text-gray-400">لا توجد برامج تدريبية حالياً</p>
          </div>
        )}
        <div className="grid grid-cols-1 gap-3">
          {others.map((t) => (
            <TrainingCard key={t.id} training={t} isOwn={false} />
          ))}
        </div>
      </div>
    </div>
  );
}

function TrainingCard({
  training: t,
  isOwn,
}: {
  training: {
    id: string;
    title: string;
    description: string | null;
    instructor: string | null;
    category: string | null;
    capacity: number | null;
    startDate: Date | null;
    endDate: Date | null;
    status: string;
    _count: { enrollments: number };
  };
  isOwn: boolean;
}) {
  const pct =
    t.capacity && t.capacity > 0
      ? Math.min(100, Math.round((t._count.enrollments / t.capacity) * 100))
      : null;

  return (
    <div
      className={`bg-white rounded-xl border p-5 flex flex-col sm:flex-row sm:items-start gap-4 hover:shadow-sm transition-shadow ${
        isOwn ? "border-amber-300 ring-1 ring-amber-200" : "border-gray-200"
      }`}
    >
      <div className="flex-1 min-w-0 space-y-2">
        <div className="flex items-center gap-2 flex-wrap">
          <h3 className="font-semibold text-gray-800">{t.title}</h3>
          {isOwn && (
            <span className="text-[10px] font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
              أنا المدرّب
            </span>
          )}
          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusStyle[t.status]}`}>
            {statusLabel[t.status]}
          </span>
        </div>

        {t.description && (
          <p className="text-sm text-gray-500 line-clamp-2">{t.description}</p>
        )}

        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-400">
          {t.instructor && <span>المدرّب: {t.instructor}</span>}
          {t.category && <span>· {t.category}</span>}
          {t.startDate && <span>· البدء: {t.startDate.toLocaleDateString("ar-SA")}</span>}
          {t.endDate && <span>· الانتهاء: {t.endDate.toLocaleDateString("ar-SA")}</span>}
        </div>

        {/* Capacity bar */}
        {t.capacity !== null && (
          <div className="pt-1">
            <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
              <span>{t._count.enrollments} / {t.capacity} مسجّل</span>
              {pct !== null && <span>{pct}%</span>}
            </div>
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  pct !== null && pct >= 90 ? "bg-red-400" : pct !== null && pct >= 70 ? "bg-amber-400" : "bg-green-400"
                }`}
                style={{ width: `${pct ?? 0}%` }}
              />
            </div>
          </div>
        )}
      </div>

      <div className="shrink-0 text-end">
        <p className="text-2xl font-bold text-gray-700">{t._count.enrollments}</p>
        <p className="text-xs text-gray-400">تسجيل</p>
      </div>
    </div>
  );
}
