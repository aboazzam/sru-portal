export const dynamic = 'force-dynamic';

import Link from "next/link";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getCurrentUser } from "@/lib/dal";
import { prisma } from "@/lib/db";
import CatalogEnrollButton from "./_components/CatalogEnrollButton";

const statusStyle: Record<string, { bg: string; color: string }> = {
  UPCOMING:  { bg: "#DBEAFE", color: "#2563EB" },
  ONGOING:   { bg: "#DCFCE7", color: "#16A34A" },
  COMPLETED: { bg: "#F3F4F6", color: "#6B7280" },
  CANCELLED: { bg: "#FEE2E2", color: "#DC2626" },
};

export default async function TrainingCatalogPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const t = await getTranslations("Training");

  const statusLabel: Record<string, string> = {
    UPCOMING:  t("catalog.status.UPCOMING"),
    ONGOING:   t("catalog.status.ONGOING"),
    COMPLETED: t("catalog.status.COMPLETED"),
    CANCELLED: t("catalog.status.CANCELLED"),
  };

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

  const available = trainings.filter((tr) => tr.status === "UPCOMING" || tr.status === "ONGOING");
  const past      = trainings.filter((tr) => tr.status === "COMPLETED" || tr.status === "CANCELLED");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-[#1A2A30]">{t("catalog.title")}</h1>
          <p className="text-[#8FA4AB] text-sm mt-0.5">
            {t("catalog.available", { count: available.length })}
          </p>
        </div>
        <Link
          href="/training/my-courses"
          className="text-sm font-semibold hover:underline"
          style={{ color: "#6CAEBD" }}
        >
          {t("catalog.myCourses")}
        </Link>
      </div>

      {/* Available */}
      {available.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#E8EDEF] py-16 text-center">
          <p className="text-[#8FA4AB]">{t("catalog.empty")}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {available.map((tr) => {
            const isFull      = tr.capacity !== null && tr._count.enrollments >= tr.capacity;
            const unavailable = tr.status === "CANCELLED" || tr.status === "COMPLETED";
            const myStatus    = enrolledMap.get(tr.id);
            const st          = statusStyle[tr.status] ?? { bg: "#F3F4F6", color: "#6B7280" };

            return (
              <div
                key={tr.id}
                className="bg-white rounded-2xl border border-[#E8EDEF] p-5 flex flex-col sm:flex-row sm:items-start gap-4 hover:shadow-sm transition-shadow"
              >
                {/* Date badge */}
                <div className="shrink-0 w-14 h-14 rounded-xl bg-[#E8F6F8] flex flex-col items-center justify-center text-center">
                  {tr.startDate ? (
                    <>
                      <span className="text-lg font-bold text-[#4A8FA0] leading-none">
                        {new Date(tr.startDate).toLocaleDateString("ar-SA", { day: "numeric" })}
                      </span>
                      <span className="text-[10px] text-[#8FA4AB] leading-none mt-0.5">
                        {new Date(tr.startDate).toLocaleDateString("ar-SA", { month: "short" })}
                      </span>
                    </>
                  ) : (
                    <span className="text-xl">📚</span>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 space-y-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-[#1F2937] text-sm">{tr.title}</h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: st.bg, color: st.color }}>
                      {statusLabel[tr.status]}
                    </span>
                  </div>
                  {tr.description && (
                    <p className="text-xs text-[#6B7280] line-clamp-2">{tr.description}</p>
                  )}
                  <div className="flex items-center gap-3 text-xs text-[#9CA3AF] flex-wrap">
                    {tr.instructor && <span>{t("catalog.instructor")}: {tr.instructor}</span>}
                    {tr.category   && <span>· {tr.category}</span>}
                    {tr.startDate  && (
                      <span>
                        · {t("catalog.startDate")}: {new Date(tr.startDate).toLocaleDateString("ar-SA")}
                      </span>
                    )}
                    {tr.capacity !== null && (
                      <span>
                        · {tr._count.enrollments}/{tr.capacity} {t("catalog.enrolled")}
                        {isFull && ` (${t("catalog.capacityFull")})`}
                      </span>
                    )}
                  </div>
                </div>

                {/* Action */}
                <div className="shrink-0 self-start">
                  <CatalogEnrollButton
                    trainingId={tr.id}
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
          <h2 className="font-bold text-[#8FA4AB] text-sm">{t("catalog.past")}</h2>
          <div className="space-y-2">
            {past.map((tr) => {
              const myStatus = enrolledMap.get(tr.id);
              const st       = statusStyle[tr.status] ?? { bg: "#F3F4F6", color: "#6B7280" };
              return (
                <div
                  key={tr.id}
                  className="bg-[#F9FAFB] rounded-xl border border-[#E8EDEF] p-4 flex items-center justify-between gap-4 opacity-75"
                >
                  <div className="min-w-0">
                    <p className="font-semibold text-[#374151] text-sm">{tr.title}</p>
                    <p className="text-xs text-[#9CA3AF] mt-0.5">
                      {tr.category && `${tr.category} · `}
                      {tr.instructor ?? ""}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {myStatus && (
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#DCFCE7] text-[#16A34A]">
                        {t("catalog.enrolled")}
                      </span>
                    )}
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full" style={{ background: st.bg, color: st.color }}>
                      {statusLabel[tr.status]}
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
