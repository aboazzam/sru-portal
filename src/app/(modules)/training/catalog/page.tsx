import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/dal";
import { prisma } from "@/lib/db";
import CatalogEnrollButton from "./_components/CatalogEnrollButton";

const statusLabel: Record<string, string> = {
  UPCOMING:  "قادم",
  ONGOING:   "جارٍ",
  COMPLETED: "منتهٍ",
  CANCELLED: "ملغى",
};
const statusStyle: Record<string, { bg: string; color: string }> = {
  UPCOMING:  { bg: "#DBEAFE", color: "#2563EB" },
  ONGOING:   { bg: "#DCFCE7", color: "#16A34A" },
  COMPLETED: { bg: "#F3F4F6", color: "#6B7280" },
  CANCELLED: { bg: "#FEE2E2", color: "#DC2626" },
};

export default async function TrainingCatalogPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const [trainings, myEnrollments] = await Promise.all([
    prisma.training.findMany({
      orderBy: [{ status: "asc" }, { startDate: "asc" }, { createdAt: "desc" }],
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
    }),
    prisma.trainingEnrollment.findMany({
      where: { userId: user.id },
      select: { trainingId: true, status: true },
    }),
  ]);

  const enrolledMap = new Map(myEnrollments.map((e) => [e.trainingId, e.status]));

  const available = trainings.filter((t) => t.status === "UPCOMING" || t.status === "ONGOING");
  const past      = trainings.filter((t) => t.status === "COMPLETED" || t.status === "CANCELLED");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-[#1A2A30]">كتالوج البرامج</h1>
          <p className="text-[#8FA4AB] text-sm mt-0.5">
            {available.length} برنامج متاح للتسجيل
          </p>
        </div>
        <Link
          href="/training/my-courses"
          className="text-sm font-semibold hover:underline"
          style={{ color: "#6CAEBD" }}
        >
          دوراتي ←
        </Link>
      </div>

      {/* Available */}
      {available.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#E8EDEF] py-16 text-center">
          <p className="text-[#8FA4AB]">لا توجد برامج متاحة للتسجيل حالياً</p>
        </div>
      ) : (
        <div className="space-y-3">
          {available.map((t) => {
            const isFull      = t.capacity !== null && t._count.enrollments >= t.capacity;
            const unavailable = t.status === "CANCELLED" || t.status === "COMPLETED";
            const myStatus    = enrolledMap.get(t.id);
            const st          = statusStyle[t.status] ?? { bg: "#F3F4F6", color: "#6B7280" };

            return (
              <div
                key={t.id}
                className="bg-white rounded-2xl border border-[#E8EDEF] p-5 flex flex-col sm:flex-row sm:items-start gap-4 hover:shadow-sm transition-shadow"
              >
                {/* Date badge */}
                <div className="shrink-0 w-14 h-14 rounded-xl bg-[#E8F6F8] flex flex-col items-center justify-center text-center">
                  {t.startDate ? (
                    <>
                      <span className="text-lg font-bold text-[#4A8FA0] leading-none">
                        {new Date(t.startDate).toLocaleDateString("ar-SA", { day: "numeric" })}
                      </span>
                      <span className="text-[10px] text-[#8FA4AB] leading-none mt-0.5">
                        {new Date(t.startDate).toLocaleDateString("ar-SA", { month: "short" })}
                      </span>
                    </>
                  ) : (
                    <span className="text-xl">📚</span>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 space-y-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-[#1F2937] text-sm">{t.title}</h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: st.bg, color: st.color }}>
                      {statusLabel[t.status]}
                    </span>
                  </div>
                  {t.description && (
                    <p className="text-xs text-[#6B7280] line-clamp-2">{t.description}</p>
                  )}
                  <div className="flex items-center gap-3 text-xs text-[#9CA3AF] flex-wrap">
                    {t.instructor && <span>المدرب: {t.instructor}</span>}
                    {t.category   && <span>· {t.category}</span>}
                    {t.startDate  && (
                      <span>
                        · البدء: {new Date(t.startDate).toLocaleDateString("ar-SA")}
                      </span>
                    )}
                    {t.capacity !== null && (
                      <span>
                        · {t._count.enrollments}/{t.capacity} مسجّل
                        {isFull && " (مكتمل)"}
                      </span>
                    )}
                  </div>
                </div>

                {/* Action */}
                <div className="shrink-0 self-start">
                  <CatalogEnrollButton
                    trainingId={t.id}
                    myStatus={myStatus ?? null}
                    isFull={isFull}
                    unavailable={unavailable}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Past */}
      {past.length > 0 && (
        <div className="space-y-3">
          <h2 className="font-bold text-[#8FA4AB] text-sm">برامج منتهية</h2>
          <div className="space-y-2">
            {past.map((t) => {
              const myStatus = enrolledMap.get(t.id);
              const st       = statusStyle[t.status] ?? { bg: "#F3F4F6", color: "#6B7280" };
              return (
                <div
                  key={t.id}
                  className="bg-[#F9FAFB] rounded-xl border border-[#E8EDEF] p-4 flex items-center justify-between gap-4 opacity-75"
                >
                  <div className="min-w-0">
                    <p className="font-semibold text-[#374151] text-sm">{t.title}</p>
                    <p className="text-xs text-[#9CA3AF] mt-0.5">
                      {t.category && `${t.category} · `}
                      {t.instructor ?? ""}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {myStatus && (
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#DCFCE7] text-[#16A34A]">
                        مسجّل
                      </span>
                    )}
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full" style={{ background: st.bg, color: st.color }}>
                      {statusLabel[t.status]}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
