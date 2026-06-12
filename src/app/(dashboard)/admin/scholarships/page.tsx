import { prisma } from "@/lib/db";

const statusLabel: Record<string, string> = {
  PENDING: "معلّق",
  APPROVED: "مقبول",
  REJECTED: "مرفوض",
};

const statusStyle: Record<string, string> = {
  PENDING:  "bg-yellow-100 text-yellow-700",
  APPROVED: "bg-green-100  text-green-700",
  REJECTED: "bg-red-100    text-red-700",
};

export default async function ScholarshipsAdminPage() {
  const applications = await prisma.scholarshipApplication.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      scholarship: { select: { id: true, title: true, amount: true } },
      user: { select: { id: true, name: true, email: true } },
    },
  });

  const byStatus = applications.reduce<Record<string, number>>((acc, a) => {
    acc[a.status] = (acc[a.status] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">طلبات المنح</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            {applications.length} طلب إجمالاً
          </p>
        </div>
        <div className="flex gap-2 flex-wrap justify-end">
          {Object.entries(byStatus).map(([status, count]) => (
            <span
              key={status}
              className={`px-3 py-1 rounded-full text-xs font-medium ${statusStyle[status] ?? "bg-gray-100 text-gray-600"}`}
            >
              {statusLabel[status] ?? status}: {count}
            </span>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
              <tr>
                <th className="px-5 py-3 text-start">المتقدّم</th>
                <th className="px-5 py-3 text-start">البريد الإلكتروني</th>
                <th className="px-5 py-3 text-start">المنحة</th>
                <th className="px-5 py-3 text-start">المبلغ</th>
                <th className="px-5 py-3 text-start">الحالة</th>
                <th className="px-5 py-3 text-start">تاريخ التقديم</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {applications.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-gray-400">
                    لا توجد طلبات بعد
                  </td>
                </tr>
              )}
              {applications.map((app) => (
                <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3 font-medium text-gray-900">{app.user.name}</td>
                  <td className="px-5 py-3 text-gray-500 text-xs">{app.user.email}</td>
                  <td className="px-5 py-3 text-gray-700">{app.scholarship.title}</td>
                  <td className="px-5 py-3 text-gray-600">
                    {app.scholarship.amount != null
                      ? `${app.scholarship.amount.toLocaleString("ar")} ر.س`
                      : "—"}
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyle[app.status] ?? "bg-gray-100 text-gray-600"}`}
                    >
                      {statusLabel[app.status] ?? app.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-gray-400 text-xs">
                    {app.createdAt.toLocaleDateString("ar-SA")}
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
