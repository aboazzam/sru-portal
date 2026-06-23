import { prisma } from "@/lib/db";
import { MembershipStatusButtons, CouncilStatusButtons } from "./_components/ClubStatusButtons";
import ManageClubsTab from "./_components/ManageClubsTab";
import ManageActivitiesTab from "./_components/ManageActivitiesTab";

export const dynamic = "force-dynamic";

const STATUS_LABEL: Record<string, string> = {
  PENDING:  "معلّق",
  APPROVED: "مقبول",
  REJECTED: "مرفوض",
};

const STATUS_BADGE: Record<string, string> = {
  PENDING:  "bg-yellow-100 text-yellow-700",
  APPROVED: "bg-green-100 text-green-700",
  REJECTED: "bg-red-100 text-red-700",
};

const FILTERS = [
  { value: "",         label: "الكل"    },
  { value: "PENDING",  label: "معلّق"   },
  { value: "APPROVED", label: "مقبول"   },
  { value: "REJECTED", label: "مرفوض"   },
];

export default async function ClubsAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string; filter?: string }>;
}) {
  const { tab = "memberships", filter } = await searchParams;

  const validFilter = ["PENDING", "APPROVED", "REJECTED"].includes(filter ?? "")
    ? (filter as "PENDING" | "APPROVED" | "REJECTED")
    : undefined;

  const [
    memberships, membershipCounts,
    councilApps, councilCounts,
    clubs,
    activities,
  ] = await Promise.all([
    tab === "memberships"
      ? prisma.clubMembership.findMany({
          where: validFilter ? { status: validFilter } : undefined,
          orderBy: { createdAt: "desc" },
          include: {
            club: { select: { name: true } },
            user: { select: { name: true, email: true } },
          },
        })
      : Promise.resolve([]),

    prisma.clubMembership.groupBy({ by: ["status"], _count: { _all: true } }),

    tab === "council"
      ? prisma.councilApplication.findMany({
          where: validFilter ? { status: validFilter } : undefined,
          orderBy: { createdAt: "desc" },
          include: {
            club: { select: { name: true } },
            user: { select: { name: true, email: true } },
          },
        })
      : Promise.resolve([]),

    prisma.councilApplication.groupBy({ by: ["status"], _count: { _all: true } }),

    tab === "clubs"
      ? prisma.sportsClub.findMany({
          orderBy: { name: "asc" },
          include: { _count: { select: { memberships: true, activities: true } } },
        })
      : Promise.resolve([]),

    tab === "activities"
      ? prisma.clubActivity.findMany({
          orderBy: [{ clubId: "asc" }, { createdAt: "desc" }],
          include: {
            club: { select: { name: true } },
            _count: { select: { participations: true } },
          },
        })
      : Promise.resolve([]),
  ]);

  // For the activities tab we always need the clubs list for the filter/dropdown
  const allClubs =
    tab === "activities" || tab === "clubs"
      ? await prisma.sportsClub.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } })
      : [];

  const memCountMap     = Object.fromEntries(membershipCounts.map((c) => [c.status, c._count._all]));
  const councilCountMap = Object.fromEntries(councilCounts.map((c)   => [c.status, c._count._all]));
  const memTotal        = Object.values(memCountMap).reduce((s, v) => s + v, 0);
  const councilTotal    = Object.values(councilCountMap).reduce((s, v) => s + v, 0);

  const tabs = [
    { key: "memberships", label: "عضويات الأندية",  count: memTotal    },
    { key: "council",     label: "طلبات المجلس",    count: councilTotal },
    { key: "clubs",       label: "إدارة الأندية",   count: null         },
    { key: "activities",  label: "إدارة الأنشطة",   count: null         },
  ];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">الأندية الطلابية</h1>
        <p className="text-gray-500 text-sm mt-0.5">إدارة الأندية والعضويات والأنشطة</p>
      </div>

      {/* Tab bar */}
      <div className="flex gap-0 border-b border-gray-200">
        {tabs.map((t) => (
          <a
            key={t.key}
            href={`/admin/clubs?tab=${t.key}`}
            className={`px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${
              tab === t.key
                ? "border-green-600 text-green-700"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {t.label}
            {t.count != null && t.count > 0 && (
              <span className={`ms-1.5 text-xs px-1.5 py-0.5 rounded-full ${tab === t.key ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                {t.count}
              </span>
            )}
          </a>
        ))}
      </div>

      {/* ── Memberships tab ───────────────────────────── */}
      {tab === "memberships" && (
        <div className="space-y-4">
          {/* Status badges */}
          {membershipCounts.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {membershipCounts.map((c) => (
                <span key={c.status} className={`px-3 py-1 rounded-full text-xs font-medium ${STATUS_BADGE[c.status] ?? "bg-gray-100 text-gray-600"}`}>
                  {STATUS_LABEL[c.status]}: {c._count._all}
                </span>
              ))}
            </div>
          )}
          {/* Filter pills */}
          <div className="flex gap-2 flex-wrap">
            {FILTERS.map((f) => {
              const href = f.value ? `/admin/clubs?tab=memberships&filter=${f.value}` : "/admin/clubs?tab=memberships";
              const isActive = (f.value === "" && !validFilter) || f.value === validFilter;
              return (
                <a key={f.value} href={href}
                  className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${isActive ? "bg-gray-700 text-white shadow-sm" : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"}`}>
                  {f.label}
                  {f.value && memCountMap[f.value] != null && (
                    <span className={`ms-1.5 text-xs ${isActive ? "opacity-80" : "text-gray-400"}`}>
                      ({memCountMap[f.value]})
                    </span>
                  )}
                </a>
              );
            })}
          </div>
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                  <tr>
                    <th className="px-5 py-3 text-start">المتقدّم</th>
                    <th className="px-5 py-3 text-start">البريد الإلكتروني</th>
                    <th className="px-5 py-3 text-start">النادي</th>
                    <th className="px-5 py-3 text-start">تاريخ الطلب</th>
                    <th className="px-5 py-3 text-start">الحالة والإجراء</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {memberships.length === 0 && (
                    <tr><td colSpan={5} className="px-5 py-8 text-center text-gray-400">لا توجد طلبات</td></tr>
                  )}
                  {memberships.map((m) => (
                    <tr key={m.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-3 font-medium text-gray-900">{m.user.name}</td>
                      <td className="px-5 py-3 text-gray-500 text-xs">{m.user.email}</td>
                      <td className="px-5 py-3 text-gray-700">{m.club.name}</td>
                      <td className="px-5 py-3 text-gray-400 text-xs">{m.createdAt.toLocaleDateString("ar-SA")}</td>
                      <td className="px-5 py-3"><MembershipStatusButtons id={m.id} initialStatus={m.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── Council tab ───────────────────────────────── */}
      {tab === "council" && (
        <div className="space-y-4">
          {councilCounts.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {councilCounts.map((c) => (
                <span key={c.status} className={`px-3 py-1 rounded-full text-xs font-medium ${STATUS_BADGE[c.status] ?? "bg-gray-100 text-gray-600"}`}>
                  {STATUS_LABEL[c.status]}: {c._count._all}
                </span>
              ))}
            </div>
          )}
          <div className="flex gap-2 flex-wrap">
            {FILTERS.map((f) => {
              const href = f.value ? `/admin/clubs?tab=council&filter=${f.value}` : "/admin/clubs?tab=council";
              const isActive = (f.value === "" && !validFilter) || f.value === validFilter;
              return (
                <a key={f.value} href={href}
                  className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${isActive ? "bg-gray-700 text-white shadow-sm" : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"}`}>
                  {f.label}
                  {f.value && councilCountMap[f.value] != null && (
                    <span className={`ms-1.5 text-xs ${isActive ? "opacity-80" : "text-gray-400"}`}>
                      ({councilCountMap[f.value]})
                    </span>
                  )}
                </a>
              );
            })}
          </div>
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                  <tr>
                    <th className="px-5 py-3 text-start">المتقدّم</th>
                    <th className="px-5 py-3 text-start">البريد الإلكتروني</th>
                    <th className="px-5 py-3 text-start">النادي</th>
                    <th className="px-5 py-3 text-start">تاريخ الطلب</th>
                    <th className="px-5 py-3 text-start">الحالة والإجراء</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {councilApps.length === 0 && (
                    <tr><td colSpan={5} className="px-5 py-8 text-center text-gray-400">لا توجد طلبات</td></tr>
                  )}
                  {councilApps.map((a) => (
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
      )}

      {/* ── Clubs management tab ──────────────────────── */}
      {tab === "clubs" && (
        <ManageClubsTab clubs={clubs as any} />
      )}

      {/* ── Activities management tab ─────────────────── */}
      {tab === "activities" && (
        <ManageActivitiesTab activities={activities as any} clubs={allClubs} />
      )}
    </div>
  );
}
