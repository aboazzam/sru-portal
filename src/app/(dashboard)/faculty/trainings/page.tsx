import Link from "next/link";
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

const FILTERS = [
  { value: "",          label: "الكل"     },
  { value: "mine",      label: "برامجي"   },
  { value: "UPCOMING",  label: "قادمة"    },
  { value: "ONGOING",   label: "جارية"    },
  { value: "COMPLETED", label: "منتهية"   },
];

export default async function FacultyTrainingsPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>;
}) {
  const user = await getCurrentUser();
  if (!user || user.role !== "FACULTY") redirect("/dashboard");

  const { filter } = await searchParams;

  const allTrainings = await prisma.training.findMany({
    orderBy: [{ status: "asc" }, { startDate: "asc" }],
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

  const filtered = (() => {
    if (filter === "mine") return allTrainings.filter((t) => t.instructor === user.name);
    if (["UPCOMING", "ONGOING", "COMPLETED", "CANCELLED"].includes(filter ?? ""))
      return allTrainings.filter((t) => t.status === filter);
    return allTrainings;
  })();

  const mine = allTrainings.filter((t) => t.instructor === user.name);

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">البرامج التدريبية</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            {allTrainings.length} برنامج إجمالاً
            {mine.length > 0 && ` · أنت مدرّب في ${mine.length}`}
          </p>
        </div>
        {mine.length > 0 && (
          <span className="px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold">
            ⭐ أنت مدرّب في {mine.length} برنامج
          </span>
        )}
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {FILTERS.map((f) => {
          const href = f.value ? `/faculty/trainings?filter=${f.value}` : "/faculty/trainings";
          const isActive = (f.value === "" && !filter) || f.value === filter;
          return (
            <Link
              key={f.value}
              href={href}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-amber-600 text-white shadow-sm"
                  : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
              }`}
            >
              {f.label}
              {f.value === "mine" && (
                <span className={`ms-1.5 text-xs ${isActive ? "opacity-80" : "text-gray-400"}`}>
                  ({mine.length})
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 py-16 text-center">
          <p className="text-3xl mb-2">📋</p>
          <p className="text-gray-400">لا توجد برامج في هذا الفلتر</p>
          <Link href="/faculty/trainings" className="mt-2 inline-block text-xs text-amber-600 hover:underline">
            عرض الكل
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((t) => {
            const isOwn = t.instructor === user.name;
            const pct = t.capacity && t.capacity > 0
              ? Math.min(100, Math.round((t._count.enrollments / t.capacity) * 100))
              : null;

            return (
              <div
                key={t.id}
                className={`bg-white rounded-xl border p-5 hover:shadow-sm transition-shadow ${
                  isOwn ? "border-amber-300 ring-1 ring-amber-100" : "border-gray-200"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-gray-800">{t.title}</h3>
                      {isOwn && (
                        <span className="text-[10px] font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                          ⭐ أنا المدرّب
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
                      {t.instructor && <span>👤 {t.instructor}</span>}
                      {t.category && <span>· 🏷️ {t.category}</span>}
                      {t.startDate && <span>· 📅 البدء: {t.startDate.toLocaleDateString("ar-SA")}</span>}
                      {t.endDate && <span>· الانتهاء: {t.endDate.toLocaleDateString("ar-SA")}</span>}
                    </div>

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
                    <p className="text-3xl font-bold text-gray-700 tabular-nums">{t._count.enrollments}</p>
                    <p className="text-xs text-gray-400">تسجيل</p>
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
