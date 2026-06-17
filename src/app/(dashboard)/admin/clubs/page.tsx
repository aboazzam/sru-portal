import Link from "next/link";
import { prisma } from "@/lib/db";
import { MembershipStatusButtons, CouncilStatusButtons } from "./_components/ClubStatusButtons";
import { getTranslations } from "next-intl/server";

export default async function ClubsAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string; tab?: string }>;
}) {
  const t = await getTranslations("Admin");
  const ts = await getTranslations("Status");

  const { filter, tab } = await searchParams;
  const activeTab = tab === "council" ? "council" : "memberships";
  const validFilter = ["PENDING", "APPROVED", "REJECTED"].includes(filter ?? "")
    ? (filter as "PENDING" | "APPROVED" | "REJECTED")
    : undefined;

  const statusLabel: Record<string, string> = {
    PENDING:  ts("pending"),
    APPROVED: ts("approved"),
    REJECTED: ts("rejected"),
  };

  const FILTERS = [
    { value: "",         label: t("requests.filters.all")      },
    { value: "PENDING",  label: t("requests.filters.pending")  },
    { value: "APPROVED", label: t("requests.filters.approved") },
    { value: "REJECTED", label: t("requests.filters.rejected") },
  ];

  const [memberships, membershipCounts, councilApps, councilCounts] = await Promise.all([
    prisma.clubMembership.findMany({
      where: validFilter ? { status: validFilter } : undefined,
      orderBy: { createdAt: "desc" },
      include: {
        club: { select: { name: true } },
        user: { select: { name: true, email: true } },
      },
    }),
    prisma.clubMembership.groupBy({ by: ["status"], _count: { _all: true } }),

    prisma.councilApplication.findMany({
      where: validFilter ? { status: validFilter } : undefined,
      orderBy: { createdAt: "desc" },
      include: {
        club: { select: { name: true } },
        user: { select: { name: true, email: true } },
      },
    }),
    prisma.councilApplication.groupBy({ by: ["status"], _count: { _all: true } }),
  ]);

  const memCountMap     = Object.fromEntries(membershipCounts.map((c) => [c.status, c._count._all]));
  const councilCountMap = Object.fromEntries(councilCounts.map((c) => [c.status, c._count._all]));

  const displayData    = activeTab === "memberships" ? memberships    : councilApps;
  const displayCounts  = activeTab === "memberships" ? memCountMap    : councilCountMap;
  const displayRaw     = activeTab === "memberships" ? membershipCounts : councilCounts;
  const total          = Object.values(displayCounts).reduce((s, v) => s + v, 0);

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t("clubsPage.title")}</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            {validFilter
              ? t("requests.filtered", { n: displayData.length }) + ` — ${statusLabel[validFilter]}`
              : t("requests.total", { n: total })}
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {displayRaw.map((c) => (
            <span key={c.status} className={`px-3 py-1 rounded-full text-xs font-medium ${c.status === "PENDING" ? "bg-yellow-100 text-yellow-700" : c.status === "APPROVED" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
              {statusLabel[c.status]}: {c._count._all}
            </span>
          ))}
        </div>
      </div>

      {/* Tab toggle */}
      <div className="flex gap-2">
        <Link
          href="/admin/clubs?tab=memberships"
          className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${activeTab === "memberships" ? "bg-green-600 text-white shadow-sm" : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"}`}
        >
          {t("clubsPage.memberships")}
          <span className={`ms-1.5 text-xs ${activeTab === "memberships" ? "opacity-80" : "text-gray-400"}`}>
            ({Object.values(memCountMap).reduce((s, v) => s + v, 0)})
          </span>
        </Link>
        <Link
          href="/admin/clubs?tab=council"
          className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${activeTab === "council" ? "bg-green-600 text-white shadow-sm" : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"}`}
        >
          {t("clubsPage.council")}
          <span className={`ms-1.5 text-xs ${activeTab === "council" ? "opacity-80" : "text-gray-400"}`}>
            ({Object.values(councilCountMap).reduce((s, v) => s + v, 0)})
          </span>
        </Link>
      </div>

      {/* Status filters */}
      <div className="flex gap-2 flex-wrap">
        {FILTERS.map((f) => {
          const href = f.value
            ? `/admin/clubs?tab=${activeTab}&filter=${f.value}`
            : `/admin/clubs?tab=${activeTab}`;
          const isActive = (f.value === "" && !validFilter) || f.value === validFilter;
          return (
            <Link key={f.value} href={href} className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${isActive ? "bg-gray-700 text-white shadow-sm" : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"}`}>
              {f.label}{f.value && displayCounts[f.value] != null && <span className={`ms-1.5 text-xs ${isActive ? "opacity-80" : "text-gray-400"}`}>({displayCounts[f.value]})</span>}
            </Link>
          );
        })}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
              <tr>
                <th className="px-5 py-3 text-start">{t("requests.cols.applicant")}</th>
                <th className="px-5 py-3 text-start">{t("requests.cols.email")}</th>
                <th className="px-5 py-3 text-start">{t("requests.cols.club")}</th>
                <th className="px-5 py-3 text-start">{t("requests.cols.requestDate")}</th>
                <th className="px-5 py-3 text-start">{t("requests.cols.statusAction")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {displayData.length === 0 && (
                <tr><td colSpan={5} className="px-5 py-8 text-center text-gray-400">{t("requests.noRequests")}</td></tr>
              )}
              {activeTab === "memberships" && memberships.map((m) => (
                <tr key={m.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3 font-medium text-gray-900">{m.user.name}</td>
                  <td className="px-5 py-3 text-gray-500 text-xs">{m.user.email}</td>
                  <td className="px-5 py-3 text-gray-700">{m.club.name}</td>
                  <td className="px-5 py-3 text-gray-400 text-xs">{m.createdAt.toLocaleDateString("ar-SA")}</td>
                  <td className="px-5 py-3"><MembershipStatusButtons id={m.id} initialStatus={m.status} /></td>
                </tr>
              ))}
              {activeTab === "council" && councilApps.map((a) => (
                <tr key={a.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3 font-medium text-gray-900">{a.user.name}</td>
                  <td className="px-5 py-3 text-gray-500 text-xs">{a.user.email}</td>
                  <td className="px-5 py-3 text-gray-700">{a.club.name}</td>
                  <td className="px-5 py-3 text-gray-400 text-xs">{a.createdAt.toLocaleDateString("ar-SA")}</td>
                  <td className="px-5 py-3"><CouncilStatusButtons id={a.id} initialStatus={a.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
