import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/dal";
import { prisma } from "@/lib/db";

export default async function FacultyStudentsPage({
  searchParams,
}: {
  searchParams: Promise<{ college?: string }>;
}) {
  const user = await getCurrentUser();
  if (!user || user.role !== "FACULTY") redirect("/dashboard");

  const { college: collegeFilter } = await searchParams;

  const [students, colleges] = await Promise.all([
    prisma.user.findMany({
      where: {
        role: "STUDENT",
        ...(collegeFilter ? { collegeId: collegeFilter } : {}),
      },
      orderBy: { createdAt: "desc" },
      include: {
        college: { select: { id: true, name: true } },
        _count: {
          select: {
            scholarshipApplications: true,
            trainingEnrollments: true,
            activityApplications: true,
            volunteerApplications: true,
          },
        },
      },
    }),
    prisma.college.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">قائمة الطلاب</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            {students.length} طالب {collegeFilter ? "في هذه الكلية" : "مسجّل"}
          </p>
        </div>
      </div>

      {/* College filter */}
      {colleges.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          <a
            href="/faculty/students"
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              !collegeFilter ? "bg-amber-600 text-white shadow-sm" : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
            }`}
          >
            الكل
          </a>
          {colleges.map((c) => (
            <a
              key={c.id}
              href={`/faculty/students?college=${c.id}`}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                collegeFilter === c.id ? "bg-amber-600 text-white shadow-sm" : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
              }`}
            >
              {c.name}
            </a>
          ))}
        </div>
      )}

      {students.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 py-16 text-center">
          <p className="text-3xl mb-2">👥</p>
          <p className="text-gray-400">لا يوجد طلاب في هذه الكلية</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 text-xs uppercase">
                <tr>
                  <th className="px-5 py-3 text-start">#</th>
                  <th className="px-5 py-3 text-start">الطالب</th>
                  <th className="px-5 py-3 text-start">الكلية</th>
                  <th className="px-5 py-3 text-start">النقاط</th>
                  <th className="px-5 py-3 text-start">المنح</th>
                  <th className="px-5 py-3 text-start">التدريب</th>
                  <th className="px-5 py-3 text-start">الأنشطة</th>
                  <th className="px-5 py-3 text-start">تاريخ الانضمام</th>
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
                        <div className="min-w-0">
                          <p className="font-medium text-gray-800 truncate">{s.name}</p>
                          <p className="text-xs text-gray-400 truncate">{s.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-gray-500 text-xs">{s.college?.name ?? "—"}</td>
                    <td className="px-5 py-3">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-semibold border border-amber-200">
                        {s.points} نقطة
                      </span>
                    </td>
                    <td className="px-5 py-3 text-gray-600 tabular-nums text-center">{s._count.scholarshipApplications}</td>
                    <td className="px-5 py-3 text-gray-600 tabular-nums text-center">{s._count.trainingEnrollments}</td>
                    <td className="px-5 py-3 text-gray-600 tabular-nums text-center">{s._count.activityApplications + s._count.volunteerApplications}</td>
                    <td className="px-5 py-3 text-gray-400 text-xs">{s.createdAt.toLocaleDateString("ar-SA")}</td>
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
