import Link from "next/link";
import { prisma } from "@/lib/db";
import AppStatusButtons from "./_components/AppStatusButtons";

const statusLabel: Record<string, string> = {
  PENDING:  "معلّق",
  APPROVED: "مقبول",
  REJECTED: "مرفوض",
};

const FILTERS = [
  { value: "",         label: "الكل"    },
  { value: "PENDING",  label: "معلّق"   },
  { value: "APPROVED", label: "مقبول"   },
  { value: "REJECTED", label: "مرفوض"   },
];

const filterTabStyle = {
  active:   "bg-green-600 text-white shadow-sm",
  inactive: "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200",
};

export default async function ScholarshipsAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>;
}) {
  const { filter } = await searchParams;
  const validFilter = ["PENDING", "APPROVED", "REJECTED"].includes(filter ?? "")
    ? (filter as "PENDING" | "APPROVED" | "REJECTED")
    : undefined;

  const applications = await prisma.scholarshipApplication.findMany({
    where: validFilter ? { status: validFilter } : undefined,
    orderBy: { createdAt: "desc" },
    include: {
      scholarship: { select: { id: true, title: true, amount: true } },
      user: { select: { id: true, name: true, email: true } },
    },
  });

  const counts = await prisma.scholarshipApplication.groupBy({
    by: ["status"],
    _count: { _all: true },
  });
  const countMap = Object.fromEntries(counts.map((c) => [c.status, c._count._all]));
  const total = Object.values(countMap).reduce((s, v) => s + v, 0);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">طلبات المنح</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            {validFilter
              ? `${applications.length} طلب — ${statusLabel[validFilter]}`
              : `${total} طلب إجمالاً`}
          </p>
        </div>

        {/* Summary badges */}
        <div className="flex gap-2 flex-wrap">
          {counts.map((c) => (
            <span
              key={c.status}
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                c.status === "PENDING"
                  ? "bg-yellow-100 text-yellow-700"
                  : c.status === "APPROVED"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {statusLabel[c.status]}: {c._count._all}
            </span>
          ))}
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {FILTERS.map((f) => {
          const href = f.value ? `/admin/scholarships?filter=${f.value}` : "/admin/scholarships";
          const isActive = (f.value === "" && !validFilter) || f.value === validFilter;
          return (
            <Link
              key={f.value}
              href={href}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                isActive ? filterTabStyle.active : filterTabStyle.inactive
              }`}
            >
              {f.label}
              {f.value && countMap[f.value] != null && (
                <span className={`ms-1.5 text-xs ${isActive ? "opacity-80" : "text-gray-400"}`}>
                  ({countMap[f.value]})
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
              <tr>
                <th className="px-5 py-3 text-start">المتقدّم</th>
                <th className="px-5 py-3 text-start">البريد الإلكتروني</th>
                <th className="px-5 py-3 text-start">المنحة</th>
                <th className="px-5 py-3 text-start">المبلغ</th>
                <th className="px-5 py-3 text-start">تاريخ التقديم</th>
                <th className="px-5 py-3 text-start">الحالة والإجراء</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {applications.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-gray-400">
                    لا توجد طلبات
                  </td>
                </tr>
              )}
              {applications.map((app) => (
                <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3 font-medium text-gray-900">{app.user.name}</td>
                  <td className="px-5 py-3 text-gray-500 text-xs">{app.user.email}</td>
                  <td className="px-5 py-3 text-gray-700">{app.scholarship.title}</td>
                  <td className="px-5 py-3 text-gray-600 tabular-nums">
                    {app.scholarship.amount != null
                      ? `${app.scholarship.amount.toLocaleString("ar")} ر.س`
                      : "—"}
                  </td>
                  <td className="px-5 py-3 text-gray-400 text-xs">
                    {app.createdAt.toLocaleDateString("ar-SA")}
                  </td>
                  <td className="px-5 py-3">
                    <AppStatusButtons id={app.id} initialStatus={app.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
