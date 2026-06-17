export const dynamic = 'force-dynamic';

import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getCurrentUser } from "@/lib/dal";
import { prisma } from "@/lib/db";
import ApplyButton from "./_components/ApplyButton";

const serviceIcons = ["📋", "📄", "🎓", "📝", "🏠", "🚌", "🏥", "📚", "💼", "🎯", "🔑", "🖨️"];

export default async function ServiceCatalogPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const t = await getTranslations("Services");

  const [services, myApplications] = await Promise.all([
    prisma.studentService.findMany({
      orderBy: { createdAt: "asc" },
      select: { id: true, title: true, description: true },
    }),
    prisma.serviceApplications.findMany({
      where: { userId: user.id },
      select: { serviceId: true, status: true },
    }),
  ]);

  const appliedMap = new Map(myApplications.map((a) => [a.serviceId, a.status]));

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#1A2A30]">{t("catalog.title")}</h1>
        <p className="text-[#8FA4AB] text-sm mt-0.5">
          {t("catalog.subtitle", { count: services.length })}
        </p>
      </div>

      {services.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#E8EDEF] py-20 text-center">
          <p className="text-4xl mb-3">🛎️</p>
          <h3 className="font-bold text-[#1A2A30] text-base">{t("catalog.empty")}</h3>
          <p className="text-[#8FA4AB] text-sm mt-1">{t("catalog.emptyDesc")}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {services.map((svc, i) => {
            const appStatus = appliedMap.get(svc.id);
            const applied   = appStatus !== undefined;

            return (
              <div
                key={svc.id}
                className="bg-white rounded-2xl border border-[#E8EDEF] p-5 flex items-start gap-4 hover:shadow-sm transition-shadow"
              >
                {/* Icon */}
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0"
                  style={{ background: applied ? "#ECFDF5" : "#F4F7F8" }}
                >
                  {serviceIcons[i % serviceIcons.length]}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-[#1F2937] text-sm leading-snug">{svc.title}</p>
                  {svc.description && (
                    <p className="text-xs text-[#6B7280] mt-1 leading-relaxed line-clamp-3">
                      {svc.description}
                    </p>
                  )}
                  <div className="mt-3">
                    <ApplyButton
                      serviceId={svc.id}
                      alreadyApplied={applied}
                      existingStatus={appStatus}
                    />
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
