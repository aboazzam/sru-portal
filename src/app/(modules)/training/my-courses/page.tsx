import Link from "next/link";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getCurrentUser } from "@/lib/dal";
import { prisma } from "@/lib/db";

export default async function MyCoursesPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const t  = await getTranslations("Training");
  const ts = await getTranslations("Status");

  const enrollmentStatusConfig: Record<string, { label: string; color: string; bg: string; icon: string }> = {
    PENDING:   { label: ts("pending"),   color: "#D97706", bg: "#FEF3C7", icon: "⏳" },
    APPROVED:  { label: ts("approved"),  color: "#16A34A", bg: "#DCFCE7", icon: "✅" },
    REJECTED:  { label: ts("rejected"),  color: "#DC2626", bg: "#FEE2E2", icon: "❌" },
    COMPLETED: { label: ts("completed"), color: "#2563EB", bg: "#DBEAFE", icon: "🏁" },
  };

  const trainingStatusConfig: Record<string, { label: string; color: string; bg: string }> = {
    UPCOMING:  { label: ts("upcoming"),  color: "#2563EB", bg: "#DBEAFE" },
    ONGOING:   { label: ts("ongoing"),   color: "#16A34A", bg: "#DCFCE7" },
    COMPLETED: { label: ts("ended"),     color: "#6B7280", bg: "#F3F4F6" },
    CANCELLED: { label: ts("cancelled"), color: "#DC2626", bg: "#FEE2E2" },
  };

  const enrollments = await prisma.trainingEnrollment.findMany({
    where: { userId: user.id },
    include: {
      training: {
        select: {
          id: true,
          title: true,
          description: true,
          instructor: true,
          category: true,
          startDate: true,
          endDate: true,
          status: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const active    = enrollments.filter((e) => e.status === "PENDING" || e.status === "APPROVED");
  const completed = enrollments.filter((e) => e.status === "COMPLETED");
  const other     = enrollments.filter((e) => e.status === "REJECTED");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-[#1A2A30]">{t("myCourses.title")}</h1>
          <p className="text-[#8FA4AB] text-sm mt-0.5">
            {t("myCourses.summary", { active: active.length, completed: completed.length, total: enrollments.length })}
          </p>
        </div>
        <Link
          href="/training/catalog"
          className="text-sm font-bold px-4 py-2 rounded-xl text-white transition-opacity hover:opacity-90"
          style={{ background: "linear-gradient(to left, #6CAEBD, #4A8FA0)" }}
        >
          {t("myCourses.newEnroll")}
        </Link>
      </div>

      {enrollments.length === 0 && (
        <div className="bg-white rounded-2xl border border-[#E8EDEF] py-16 text-center">
          <p className="text-4xl mb-3">📚</p>
          <h3 className="font-bold text-[#1A2A30] text-base">{t("myCourses.empty")}</h3>
          <p className="text-[#8FA4AB] text-sm mt-1 mb-4">{t("myCourses.emptyDesc")}</p>
          <Link
            href="/training/catalog"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
            style={{ background: "linear-gradient(to left, #6CAEBD, #4A8FA0)" }}
          >
            {t("myCourses.browseCatalog")}
          </Link>
        </div>
      )}

      {/* Active enrollments */}
      {active.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-[#E8EDEF] overflow-hidden">
          <div className="px-5 py-4 border-b border-[#E8EDEF] flex items-center gap-2">
            <span>📖</span>
            <h2 className="font-bold text-[#1A2A30] text-sm">{t("myCourses.activeSectionTitle")}</h2>
            <span className="ms-auto text-xs font-bold text-[#6CAEBD]">{active.length}</span>
          </div>
          <div className="divide-y divide-[#F4F7F8]">
            {active.map((enr) => {
              const esc = enrollmentStatusConfig[enr.status];
              const tsc = trainingStatusConfig[enr.training.status];
              return (
                <div key={enr.id} className="px-5 py-4 hover:bg-[#F9FAFB] transition-colors">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-[#E8F6F8] flex items-center justify-center text-lg shrink-0">🎓</div>
                      <div className="min-w-0">
                        <p className="font-semibold text-[#1F2937] text-sm">{enr.training.title}</p>
                        <div className="flex items-center gap-2 mt-0.5 flex-wrap text-xs text-[#8FA4AB]">
                          {enr.training.instructor && <span>{enr.training.instructor}</span>}
                          {enr.training.category   && <span>· {enr.training.category}</span>}
                        </div>
                        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: esc.bg, color: esc.color }}>
                            {esc.icon} {esc.label}
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: tsc.bg, color: tsc.color }}>
                            {tsc.label}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="shrink-0 text-end text-xs text-[#9CA3AF]">
                      {enr.training.startDate && (
                        <p>{t("myCourses.startDate")}: {new Date(enr.training.startDate).toLocaleDateString("ar-SA")}</p>
                      )}
                      {enr.training.endDate && (
                        <p>{t("myCourses.endDate")}: {new Date(enr.training.endDate).toLocaleDateString("ar-SA")}</p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Completed */}
      {completed.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-[#E8EDEF] overflow-hidden">
          <div className="px-5 py-4 border-b border-[#E8EDEF] flex items-center gap-2">
            <span>🏁</span>
            <h2 className="font-bold text-[#1A2A30] text-sm">{t("myCourses.completedSectionTitle")}</h2>
            <span className="ms-auto text-xs font-bold text-[#16A34A]">{completed.length}</span>
          </div>
          <div className="divide-y divide-[#F4F7F8]">
            {completed.map((enr) => (
              <div key={enr.id} className="px-5 py-4 hover:bg-[#F9FAFB] transition-colors">
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-[#DCFCE7] flex items-center justify-center text-lg shrink-0">🏆</div>
                    <div className="min-w-0">
                      <p className="font-semibold text-[#1F2937] text-sm">{enr.training.title}</p>
                      <div className="flex items-center gap-2 mt-0.5 text-xs text-[#8FA4AB] flex-wrap">
                        {enr.training.instructor && <span>{enr.training.instructor}</span>}
                        {enr.training.category   && <span>· {enr.training.category}</span>}
                      </div>
                    </div>
                  </div>
                  <div className="shrink-0 flex items-center gap-2">
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#DBEAFE] text-[#2563EB]">
                      {t("myCourses.completedBadge")}
                    </span>
                    <Link
                      href="/training/certificates"
                      className="text-xs font-semibold px-3 py-1 rounded-xl border border-[#C8D4D8] text-[#4A8FA0] hover:bg-[#E8F6F8] transition-colors"
                    >
                      {t("myCourses.certificateBtn")}
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Rejected */}
      {other.length > 0 && (
        <div className="space-y-2">
          <h2 className="font-bold text-[#8FA4AB] text-sm">{t("myCourses.rejectedSectionTitle")}</h2>
          {other.map((enr) => (
            <div key={enr.id} className="bg-[#F9FAFB] rounded-xl border border-[#E8EDEF] px-5 py-3.5 flex items-center justify-between gap-3 opacity-75">
              <p className="font-medium text-[#374151] text-sm">{enr.training.title}</p>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#FEE2E2] text-[#DC2626]">{t("myCourses.rejectedBadge")}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
