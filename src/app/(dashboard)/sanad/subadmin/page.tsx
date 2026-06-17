export const dynamic = 'force-dynamic';

import { redirect } from "next/navigation";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { getCurrentUser } from "@/lib/dal";
import { prisma } from "@/lib/db";

const ALLOWED = ["SUBADMIN", "ADMIN"];

export default async function SubadminPage() {
  const user = await getCurrentUser();
  if (!user || !ALLOWED.includes(user.role)) redirect("/sanad");

  const t  = await getTranslations("Sanad");
  const ts = await getTranslations("Status");

  const [
    totalActivityApps,
    pendingActivityApps,
    totalVolunteerApps,
    pendingVolunteerApps,
    totalServiceApps,
    pendingServiceApps,
    organizers,
    recentVolunteerApps,
  ] = await Promise.all([
    prisma.activityApplication.count(),
    prisma.activityApplication.count({ where: { status: "PENDING" } }),
    prisma.volunteerApplication.count(),
    prisma.volunteerApplication.count({ where: { status: "PENDING" } }),
    prisma.serviceApplications.count(),
    prisma.serviceApplications.count({ where: { status: "PENDING" } }),
    prisma.user.findMany({
      where: { role: "ORGANIZER" },
      select: { id: true, name: true, email: true, createdAt: true, _count: { select: { activityApplications: true } } },
      take: 6,
    }),
    prisma.volunteerApplication.findMany({
      orderBy: { createdAt: "desc" },
      take: 6,
      select: {
        id: true, status: true, createdAt: true,
        user: { select: { name: true } },
        opportunity: { select: { title: true } },
      },
    }),
  ]);

  const totalRequests = totalActivityApps + totalVolunteerApps + totalServiceApps;
  const pendingAll    = pendingActivityApps + pendingVolunteerApps + pendingServiceApps;

  const kpis = [
    { label: t("subadmin.kpis.total"),      value: totalRequests,     color: "#3D1F6E" },
    { label: t("subadmin.kpis.pending"),     value: pendingAll,        color: "#d97706" },
    { label: t("subadmin.kpis.activities"),  value: totalActivityApps, color: "#6B46C1" },
    { label: t("subadmin.kpis.volunteer"),   value: totalVolunteerApps,color: "#00B4C8" },
  ];

  const statusLabel = (s: string) =>
    s === "PENDING" ? ts("pending") : s === "APPROVED" ? ts("approved") : ts("rejected");

  const statusClass = (s: string) =>
    s === "APPROVED" ? "bg-green-100 text-green-700"
    : s === "REJECTED" ? "bg-red-100 text-red-600"
    : "bg-amber-100 text-amber-600";

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Link href="/sanad" className="hover:text-[#3D1F6E] transition-colors">{t("breadcrumb")}</Link>
        <span>/</span>
        <span className="text-[#3D1F6E] font-medium">{t("subadmin.pageTitle")}</span>
      </div>

      {/* Welcome */}
      <div className="bg-gradient-to-l from-[#2C1650] to-[#3D1F6E] rounded-2xl p-6 text-white">
        <p className="text-purple-300 text-sm">{t("subadmin.module")}</p>
        <h1 className="text-xl font-bold mt-1">{t("subadmin.welcome", { name: user.name })}</h1>
        <p className="text-purple-300 text-sm mt-1">{t("subadmin.overview")}</p>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="bg-white rounded-xl border border-purple-100 p-4 text-center">
            <p className="text-2xl font-bold" style={{ color: kpi.color }}>{kpi.value}</p>
            <p className="text-xs text-gray-500 mt-1">{kpi.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Distribution */}
        <div className="bg-white rounded-2xl shadow-sm border border-purple-100 p-6">
          <h2 className="font-bold text-[#3D1F6E] mb-5">{t("subadmin.distribution.title")}</h2>
          <div className="space-y-4">
            {[
              { label: t("subadmin.distribution.activities"), total: totalActivityApps,  pending: pendingActivityApps,  color: "#6B46C1" },
              { label: t("subadmin.distribution.volunteer"),  total: totalVolunteerApps,  pending: pendingVolunteerApps,  color: "#00B4C8" },
              { label: t("subadmin.distribution.services"),   total: totalServiceApps,    pending: pendingServiceApps,    color: "#3D1F6E" },
            ].map((row) => {
              const pct = totalRequests > 0 ? Math.round((row.total / totalRequests) * 100) : 0;
              return (
                <div key={row.label}>
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span className="font-medium" style={{ color: row.color }}>{row.label}</span>
                    <span>{row.total} {t("subadmin.distribution.requestSuffix")} ({row.pending} {t("subadmin.distribution.pendingSuffix")})</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: row.color }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Organizers */}
        <div className="bg-white rounded-2xl shadow-sm border border-purple-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-purple-50 flex items-center justify-between">
            <h2 className="font-bold text-[#3D1F6E]">{t("subadmin.organizers.title")}</h2>
            <span className="text-xs text-gray-400">{organizers.length} {t("subadmin.organizers.countSuffix")}</span>
          </div>
          {organizers.length === 0 ? (
            <div className="py-10 text-center">
              <p className="text-gray-400 text-sm">{t("subadmin.organizers.empty")}</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {organizers.map((org) => (
                <div key={org.id} className="px-5 py-3 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#F5F3FF] flex items-center justify-center text-sm font-bold text-[#3D1F6E] shrink-0">
                    {org.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#1F2937] truncate">{org.name}</p>
                    <p className="text-xs text-gray-400 truncate">{org.email}</p>
                  </div>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium shrink-0">
                    {t("subadmin.organizers.active")}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent volunteer applications */}
      <div className="bg-white rounded-2xl shadow-sm border border-purple-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-purple-50">
          <h2 className="font-bold text-[#3D1F6E]">{t("subadmin.recentVolunteer.title")}</h2>
        </div>
        {recentVolunteerApps.length === 0 ? (
          <div className="py-10 text-center">
            <p className="text-gray-400 text-sm">{t("subadmin.recentVolunteer.empty")}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#F5F3FF]">
                <tr>
                  <th className="px-4 py-3 text-start text-xs font-bold text-[#3D1F6E]">{t("subadmin.recentVolunteer.student")}</th>
                  <th className="px-4 py-3 text-start text-xs font-bold text-[#3D1F6E]">{t("subadmin.recentVolunteer.opportunity")}</th>
                  <th className="px-4 py-3 text-start text-xs font-bold text-[#3D1F6E] hidden sm:table-cell">{t("subadmin.recentVolunteer.date")}</th>
                  <th className="px-4 py-3 text-start text-xs font-bold text-[#3D1F6E]">{t("subadmin.recentVolunteer.status")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentVolunteerApps.map((app) => (
                  <tr key={app.id} className="hover:bg-[#F5F3FF]/50">
                    <td className="px-4 py-3 font-medium text-[#1F2937]">{app.user.name}</td>
                    <td className="px-4 py-3 text-gray-500 max-w-[160px] truncate">{app.opportunity.title}</td>
                    <td className="px-4 py-3 text-gray-400 text-xs hidden sm:table-cell">
                      {app.createdAt.toLocaleDateString("ar-SA")}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusClass(app.status)}`}>
                        {statusLabel(app.status)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
