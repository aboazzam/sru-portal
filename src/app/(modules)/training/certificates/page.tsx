import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getCurrentUser } from "@/lib/dal";
import { prisma } from "@/lib/db";

const categoryIcons: Record<string, string> = {
  technical:    "💻",
  soft:         "🤝",
  language:     "🌐",
  leadership:   "🎯",
  professional: "📋",
};

function genSerial(enrollmentId: string, date: Date): string {
  const d      = date.toISOString().replace(/-/g, "").slice(0, 8);
  const suffix = enrollmentId.slice(-4).toUpperCase();
  return `SRU-TRN-${d}-${suffix}`;
}

export default async function CertificatesPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const t = await getTranslations("Training");

  const completedEnrollments = await prisma.trainingEnrollment.findMany({
    where: { userId: user.id, status: "COMPLETED" },
    include: {
      training: {
        select: {
          id: true,
          title: true,
          instructor: true,
          category: true,
          endDate: true,
        },
      },
    },
    orderBy: { updatedAt: "desc" },
  });

  const now = new Date();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#1A2A30]">{t("certificates.title")}</h1>
        <p className="text-[#8FA4AB] text-sm mt-0.5">
          {t("certificates.count", { count: completedEnrollments.length })}
        </p>
      </div>

      {completedEnrollments.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#E8EDEF] py-20 text-center">
          <p className="text-4xl mb-3">🏆</p>
          <h3 className="font-bold text-[#1A2A30] text-base">{t("certificates.empty")}</h3>
          <p className="text-[#8FA4AB] text-sm mt-1">
            {t("certificates.emptyDesc")}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {completedEnrollments.map((enr) => {
            const issueDate = enr.updatedAt ?? now;
            const serial    = genSerial(enr.id, issueDate);
            const catKey    = enr.training.category?.toLowerCase() ?? "";
            const icon      = categoryIcons[catKey] ?? "📋";

            return (
              <div
                key={enr.id}
                className="bg-white rounded-2xl border border-[#E8EDEF] overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Certificate header band */}
                <div
                  className="px-5 py-4 flex items-center gap-3"
                  style={{ background: "linear-gradient(to left, #6CAEBD22, #4A8FA011)" }}
                >
                  <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center text-2xl shrink-0">
                    {icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-[#1F2937] text-sm leading-snug line-clamp-2">
                      {enr.training.title}
                    </p>
                    {enr.training.instructor && (
                      <p className="text-xs text-[#8FA4AB] mt-0.5">
                        {enr.training.instructor}
                      </p>
                    )}
                  </div>
                  <div className="shrink-0">
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#DCFCE7] text-[#16A34A]">
                      {t("certificates.issuedBadge")}
                    </span>
                  </div>
                </div>

                {/* Certificate body */}
                <div className="px-5 py-4 space-y-3">
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <p className="text-[#9CA3AF]">{t("certificates.issueDate")}</p>
                      <p className="font-semibold text-[#374151] mt-0.5">
                        {issueDate.toLocaleDateString("ar-SA", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-[#9CA3AF]">{t("certificates.category")}</p>
                      <p className="font-semibold text-[#374151] mt-0.5">
                        {enr.training.category ?? "—"}
                      </p>
                    </div>
                  </div>

                  {/* Serial */}
                  <div className="bg-[#F4F7F8] rounded-xl px-3 py-2.5 flex items-center justify-between gap-2">
                    <div>
                      <p className="text-[10px] text-[#9CA3AF]">{t("certificates.serialLabel")}</p>
                      <p className="text-xs font-mono font-bold text-[#4A8FA0] mt-0.5">{serial}</p>
                    </div>
                    <span className="text-lg">🎓</span>
                  </div>

                  <p className="text-[10px] text-[#B0BEC5] text-center leading-relaxed">
                    {t("certificates.issuer")}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
