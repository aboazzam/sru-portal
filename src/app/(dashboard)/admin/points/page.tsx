import { prisma } from "@/lib/db";
import PointsRow from "./_components/PointsRow";

const roleLabel: Record<string, string> = {
  STUDENT:  "طالب",
  FACULTY:  "عضو هيئة التدريس",
  ADMIN:    "مدير",
  ORGANIZER:"منظم",
  SUBADMIN: "مشرف",
};

const roleStyle: Record<string, string> = {
  STUDENT:  "bg-blue-100 text-blue-700",
  FACULTY:  "bg-green-100 text-green-700",
  ADMIN:    "bg-purple-100 text-purple-700",
  ORGANIZER:"bg-orange-100 text-orange-700",
  SUBADMIN: "bg-gray-100 text-gray-700",
};

export default async function PointsPage() {
  const users = await prisma.user.findMany({
    orderBy: { points: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      points: true,
    },
  });

  const totalPoints = users.reduce((sum, u) => sum + u.points, 0);
  const topUser = users[0];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">إدارة النقاط</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            إجمالي النقاط الموزّعة:{" "}
            <span className="font-semibold text-gray-700">{totalPoints.toLocaleString("ar")}</span>
          </p>
        </div>
        {topUser && topUser.points > 0 && (
          <div className="text-end">
            <p className="text-xs text-gray-400">الأعلى نقاطاً</p>
            <p className="text-sm font-semibold text-gray-700">{topUser.name}</p>
            <p className="text-lg font-bold text-green-600">{topUser.points} نقطة</p>
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-100 text-xs text-gray-400">
          انقر على +/− لضبط النقاط بمقدار 10، أو اختر تعديل لإدخال قيمة مخصصة
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
              <tr>
                <th className="px-5 py-3 text-start w-8">#</th>
                <th className="px-5 py-3 text-start">الاسم</th>
                <th className="px-5 py-3 text-start">البريد الإلكتروني</th>
                <th className="px-5 py-3 text-start">الدور</th>
                <th className="px-5 py-3 text-start">النقاط</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((user, index) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3 text-gray-400 text-xs">{index + 1}</td>
                  <td className="px-5 py-3 font-medium text-gray-900">{user.name}</td>
                  <td className="px-5 py-3 text-gray-500 text-xs">{user.email}</td>
                  <td className="px-5 py-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${roleStyle[user.role] ?? "bg-gray-100 text-gray-600"}`}>
                      {roleLabel[user.role] ?? user.role}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <PointsRow userId={user.id} currentPoints={user.points} />
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
