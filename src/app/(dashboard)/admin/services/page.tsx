import { prisma } from "@/lib/db";
import ServiceStatusButtons from "./_components/ServiceStatusButtons";
import ManageServicesTab from "./_components/ManageServicesTab";
import ApplicationDetailsButton from "./_components/ApplicationDetailsButton";

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
  { value: "",         label: "الكل"   },
  { value: "PENDING",  label: "معلّق"  },
  { value: "APPROVED", label: "مقبول"  },
  { value: "REJECTED", label: "مرفوض" },
];

export default async function ServicesAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string; filter?: string }>;
}) {
  const { tab = "applications", filter } = await searchParams;

  const validFilter = ["PENDING", "APPROVED", "REJECTED"].includes(filter ?? "")
    ? (filter as "PENDING" | "APPROVED" | "REJECTED")
    : undefined;

  const [applications, counts, services] = await Promise.all([
    tab === "applications"
      ? prisma.serviceApplications.findMany({
          where: validFilter ? { status: validFilter } : undefined,
          orderBy: { createdAt: "desc" },
          include: {
            service: { select: { title: true } },
            user:    { select: { name: true, email: true } },
          },
        })
      : Promise.resolve([]),

    prisma.serviceApplications.groupBy({ by: ["status"], _count: { _all: true } }),

    tab === "services"
      ? prisma.studentService.findMany({
          orderBy: { createdAt: "desc" },
          include: { _count: { select: { applications: true } } },
        })
      : Promise.resolve([]),
  ]);

  const countMap = Object.fromEntries(counts.map((c) => [c.status, c._count._all]));
  const total    = Object.values(countMap).reduce((s, v) => s + v, 0);

  const tabs = [
    { key: "applications", label: "الطلبات",       count: total },
    { key: "services",     label: "إدارة الخدمات", count: null  },
  ];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">الخدمات الطلابية</h1>
        <p className="text-gray-500 text-sm mt-0.5">إدارة الخدمات وطلبات الطلاب</p>
      </div>

      {/* Tab bar */}
      <div className="flex gap-0 border-b border-gray-200">
        {tabs.map((t) => (
          <a
            key={t.key}
            href={`/admin/services?tab=${t.key}`}
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

      {/* ── Applications tab ──────────────────────────── */}
      {tab === "applications" && (
        <div className="space-y-4">
          {counts.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {counts.map((c) => (
                <span key={c.status} className={`px-3 py-1 rounded-full text-xs font-medium ${STATUS_BADGE[c.status] ?? "bg-gray-100 text-gray-600"}`}>
                  {STATUS_LABEL[c.status]}: {c._count._all}
                </span>
              ))}
            </div>
          )}

          <div className="flex gap-2 flex-wrap">
            {FILTERS.map((f) => {
              const href = f.value ? `/admin/services?tab=applications&filter=${f.value}` : "/admin/services?tab=applications";
              const isActive = (f.value === "" && !validFilter) || f.value === validFilter;
              return (
                <a key={f.value} href={href}
                  className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${isActive ? "bg-gray-700 text-white shadow-sm" : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"}`}>
                  {f.label}
                  {f.value && countMap[f.value] != null && (
                    <span className={`ms-1.5 text-xs ${isActive ? "opacity-80" : "text-gray-400"}`}>
                      ({countMap[f.value]})
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
                    <th className="px-5 py-3 text-start">الخدمة</th>
                    <th className="px-5 py-3 text-start">تاريخ التقديم</th>
                    <th className="px-5 py-3 text-start">الحالة والإجراء</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {applications.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-5 py-8 text-center text-gray-400">لا توجد طلبات</td>
                    </tr>
                  )}
                  {applications.map((app) => (
                    <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-3 font-medium text-gray-900">{app.user.name}</td>
                      <td className="px-5 py-3 text-gray-500 text-xs">{app.user.email}</td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <span className="text-gray-700">{app.service.title}</span>
                          <ApplicationDetailsButton notes={app.notes ?? null} formData={app.formData ?? null} />
                        </div>
                      </td>
                      <td className="px-5 py-3 text-gray-400 text-xs">
                        {app.createdAt.toLocaleDateString("ar-SA")}
                      </td>
                      <td className="px-5 py-3">
                        <ServiceStatusButtons id={app.id} initialStatus={app.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── Manage services tab ───────────────────────── */}
      {tab === "services" && (
        <ManageServicesTab services={services as any} />
      )}
    </div>
  );
}
