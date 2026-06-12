import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/dal";
import { prisma } from "@/lib/db";

const statusLabel: Record<string, string> = { PENDING: "معلّق", APPROVED: "مقبول", REJECTED: "مرفوض" };
const statusStyle: Record<string, string> = {
  PENDING:  "bg-yellow-100 text-yellow-700",
  APPROVED: "bg-green-100  text-green-700",
  REJECTED: "bg-red-100    text-red-600",
};

const FILTERS = [
  { value: "",         label: "الكل"    },
  { value: "PENDING",  label: "معلّقة"  },
  { value: "APPROVED", label: "مقبولة"  },
  { value: "REJECTED", label: "مرفوضة" },
];

export default async function FacultyScholarshipsPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>;
}) {
  const user = await getCurrentUser();
  if (!user || user.role !== "FACULTY") redirect("/dashboard");

  const { filter } = await searchParams;
  const validFilter = ["PENDING", "APPROVED", "REJECTED"].includes(filter ?? "")
    ? (filter as "PENDING" | "APPROVED" | "REJECTED")
    : undefined;

  const [scholarships, applications, counts] = await Promise.all([
    prisma.scholarship.findMany({
      orderBy: { createdAt: "desc" },
      include: { _count: { select: { applications: true } } },
    }),
    prisma.scholarshipApplication.findMany({
      where: validFilter ? { status: validFilter } : undefined,
      orderBy: { createdAt: "desc" },
      include: {
        scholarship: { select: { title: true } },
        user:        { select: { name: true, email: true } },
      },
    }),
    prisma.scholarshipApplication.groupBy({ by: ["status"], _count: { _all: true } }),
  ]);

  const countMap = Object.fromEntries(counts.map((c) => [c.status, c._count._all]));
  const total = Object.values(countMap).reduce((s, v) => s + v, 0);

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">المنح الدراسية</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            {scholarships.length} منحة متاحة · {total} طلب إجمالاً
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {counts.map((c) => (
            <span key={c.status} className={`px-3 py-1 rounded-full text-xs font-medium ${statusStyle[c.status]}`}>
              {statusLabel[c.status]}: {c._count._all}
            </span>
          ))}
        </div>
      </div>

      {/* Scholarships overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {scholarships.map((s) => (
          <div key={s.id} className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-sm transition-shadow">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center text-lg shrink-0">🎓</div>
              <div className="min-w-0">
                <p className="font-semibold text-gray-800 text-sm truncate">{s.title}</p>
                {s.description && <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">{s.description}</p>}
                <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                  <span>{s._count.applications} طلب</span>
                  {s.amount != null && <span>· {s.amount.toLocaleString("ar-SA")} ريال</span>}
                  {s.deadline && <span>· ينتهي: {s.deadline.toLocaleDateString("ar-SA")}</span>}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-gray-200 pt-5">
        <h2 className="font-semibold text-gray-800 mb-4 text-sm">طلبات المنح</h2>

        {/* Filters */}
        <div className="flex gap-2 flex-wrap mb-4">
          {FILTERS.map((f) => {
            const href = f.value ? `/faculty/scholarships?filter=${f.value}` : "/faculty/scholarships";
            const isActive = (f.value === "" && !validFilter) || f.value === validFilter;
            return (
              <Link
                key={f.value}
                href={href}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? "bg-amber-600 text-white shadow-sm" : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
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

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                <tr>
                  <th className="px-5 py-3 text-start">الطالب</th>
                  <th className="px-5 py-3 text-start">البريد الإلكتروني</th>
                  <th className="px-5 py-3 text-start">المنحة</th>
                  <th className="px-5 py-3 text-start">تاريخ التقديم</th>
                  <th className="px-5 py-3 text-start">الحالة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {applications.length === 0 && (
                  <tr><td colSpan={5} className="px-5 py-8 text-center text-gray-400">لا توجد طلبات</td></tr>
                )}
                {applications.map((app) => (
                  <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3 font-medium text-gray-900">{app.user.name}</td>
                    <td className="px-5 py-3 text-gray-500 text-xs">{app.user.email}</td>
                    <td className="px-5 py-3 text-gray-700">{app.scholarship.title}</td>
                    <td className="px-5 py-3 text-gray-400 text-xs">{app.createdAt.toLocaleDateString("ar-SA")}</td>
                    <td className="px-5 py-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyle[app.status]}`}>
                        {statusLabel[app.status]}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
