import { prisma } from "@/lib/db";

const statusLabel: Record<string, string> = {
  PENDING:   "معلّق",
  APPROVED:  "مقبول",
  REJECTED:  "مرفوض",
  COMPLETED: "مكتمل",
};

const statusStyle: Record<string, string> = {
  PENDING:   "bg-yellow-100 text-yellow-700",
  APPROVED:  "bg-green-100  text-green-700",
  REJECTED:  "bg-red-100    text-red-700",
  COMPLETED: "bg-blue-100   text-blue-700",
};

export default async function TrainingsAdminPage() {
  const enrollments = await prisma.trainingEnrollment.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      training: { select: { id: true, title: true, category: true, status: true } },
      user: { select: { id: true, name: true, email: true } },
    },
  });

  const byStatus = enrollments.reduce<Record<string, number>>((acc, e) => {
    acc[e.status] = (acc[e.status] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">تسجيلات التدريب</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            {enrollments.length} تسجيل إجمالاً
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
                <th className="px-5 py-3 text-start">الطالب</th>
                <th className="px-5 py-3 text-start">البريد الإلكتروني</th>
                <th className="px-5 py-3 text-start">البرنامج التدريبي</th>
                <th className="px-5 py-3 text-start">التصنيف</th>
                <th className="px-5 py-3 text-start">الحالة</th>
                <th className="px-5 py-3 text-start">تاريخ التسجيل</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {enrollments.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-gray-400">
                    لا توجد تسجيلات بعد
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
                  <td className="px-5 py-3">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyle[enr.status] ?? "bg-gray-100 text-gray-600"}`}
                    >
                      {statusLabel[enr.status] ?? enr.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-gray-400 text-xs">
                    {enr.createdAt.toLocaleDateString("ar-SA")}
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
