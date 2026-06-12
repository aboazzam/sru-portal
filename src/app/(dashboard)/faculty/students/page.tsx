import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/dal";
import { prisma } from "@/lib/db";

export default async function FacultyStudentsPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "FACULTY") redirect("/dashboard");

  const students = await prisma.user.findMany({
    where: { role: "STUDENT" },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      points: true,
      createdAt: true,
      _count: {
        select: {
          scholarshipApplications: true,
          trainingEnrollments: true,
        },
      },
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">قائمة الطلاب</h1>
        <p className="text-gray-500 text-sm mt-0.5">{students.length} طالب مسجّل</p>
      </div>

      {students.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 py-16 text-center">
          <p className="text-gray-400">لا يوجد طلاب مسجّلون حالياً</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 text-xs uppercase tracking-wide">
                  <th className="px-5 py-3 text-start font-semibold">#</th>
                  <th className="px-5 py-3 text-start font-semibold">الطالب</th>
                  <th className="px-5 py-3 text-start font-semibold">البريد الإلكتروني</th>
                  <th className="px-5 py-3 text-start font-semibold">النقاط</th>
                  <th className="px-5 py-3 text-start font-semibold">المنح</th>
                  <th className="px-5 py-3 text-start font-semibold">التدريب</th>
                  <th className="px-5 py-3 text-start font-semibold">تاريخ الانضمام</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {students.map((s, idx) => (
                  <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3 text-gray-400 tabular-nums">{idx + 1}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold shrink-0">
                          {s.name.charAt(0)}
                        </div>
                        <span className="font-medium text-gray-800">{s.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-gray-500">{s.email}</td>
                    <td className="px-5 py-3">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-semibold border border-amber-200">
                        {s.points ?? 0} نقطة
                      </span>
                    </td>
                    <td className="px-5 py-3 text-gray-600 tabular-nums">
                      {s._count.scholarshipApplications}
                    </td>
                    <td className="px-5 py-3 text-gray-600 tabular-nums">
                      {s._count.trainingEnrollments}
                    </td>
                    <td className="px-5 py-3 text-gray-400 text-xs">
                      {s.createdAt.toLocaleDateString("ar-SA")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
