import Link from "next/link";
import { prisma } from "@/lib/db";
import EnrollmentStatusSelect from "./_components/EnrollmentStatusSelect";

const statusLabel: Record<string, string> = {
  PENDING:   "معلّق",
  APPROVED:  "مقبول",
  REJECTED:  "مرفوض",
  COMPLETED: "مكتمل",
};

const FILTERS = [
  { value: "",          label: "الكل"    },
  { value: "PENDING",   label: "معلّق"   },
  { value: "APPROVED",  label: "مقبول"   },
  { value: "REJECTED",  label: "مرفوض"   },
  { value: "COMPLETED", label: "مكتمل"   },
];

const filterTabStyle = {
  active:   "bg-green-600 text-white shadow-sm",
  inactive: "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200",
};

const badgeStyle: Record<string, string> = {
  PENDING:   "bg-yellow-100 text-yellow-700",
  APPROVED:  "bg-green-100 text-green-700",
  REJECTED:  "bg-red-100 text-red-700",
  COMPLETED: "bg-blue-100 text-blue-700",
};

export default async function TrainingsAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>;
}) {
  const { filter } = await searchParams;
  const validFilter = ["PENDING", "APPROVED", "REJECTED", "COMPLETED"].includes(filter ?? "")
    ? (filter as "PENDING" | "APPROVED" | "REJECTED" | "COMPLETED")
    : undefined;

  const enrollments = await prisma.trainingEnrollment.findMany({
    where: validFilter ? { status: validFilter } : undefined,
    orderBy: { createdAt: "desc" },
    include: {
      training: { select: { id: true, title: true, category: true, status: true } },
      user: { select: { id: true, name: true, email: true } },
    },
  });

  const counts = await prisma.trainingEnrollment.groupBy({
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
          <h1 className="text-2xl font-bold text-gray-900">تسجيلات التدريب</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            {validFilter
              ? `${enrollments.length} تسجيل — ${statusLabel[validFilter]}`
              : `${total} تسجيل إجمالاً`}
          </p>
        </div>

        {/* Summary badges */}
        <div className="flex gap-2 flex-wrap">
          {counts.map((c) => (
            <span
              key={c.status}
              className={`px-3 py-1 rounded-full text-xs font-medium ${badgeStyle[c.status] ?? "bg-gray-100 text-gray-600"}`}
            >
              {statusLabel[c.status]}: {c._count._all}
            </span>
          ))}
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {FILTERS.map((f) => {
          const href = f.value ? `/admin/trainings?filter=${f.value}` : "/admin/trainings";
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
                <th className="px-5 py-3 text-start">الطالب</th>
                <th className="px-5 py-3 text-start">البريد الإلكتروني</th>
                <th className="px-5 py-3 text-start">البرنامج التدريبي</th>
                <th className="px-5 py-3 text-start">التصنيف</th>
                <th className="px-5 py-3 text-start">تاريخ التسجيل</th>
                <th className="px-5 py-3 text-start">الحالة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {enrollments.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-gray-400">
                    لا توجد تسجيلات
                  </td>
                </tr>
              )}
              {enrollments.map((enr) => (
                <tr key={enr.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3 font-medium text-gray-900">{enr.user.name}</td>
                  <td className="px-5 py-3 text-gray-500 text-xs">{enr.user.email}</td>
                  <td className="px-5 py-3 text-gray-700">{enr.training.title}</td>
                  <td className="px-5 py-3 text-gray-500 text-xs">
                    {enr.training.category ?? "—"}
                  </td>
                  <td className="px-5 py-3 text-gray-400 text-xs">
                    {enr.createdAt.toLocaleDateString("ar-SA")}
                  </td>
                  <td className="px-5 py-3">
                    <EnrollmentStatusSelect id={enr.id} initialStatus={enr.status} />
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
