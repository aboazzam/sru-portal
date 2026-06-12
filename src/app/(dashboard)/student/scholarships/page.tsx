import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/dal";
import { prisma } from "@/lib/db";
import ApplyButton from "./_components/ApplyButton";

const statusLabel: Record<string, string> = {
  PENDING:  "معلّق",
  APPROVED: "مقبول",
  REJECTED: "مرفوض",
};
const statusStyle: Record<string, string> = {
  PENDING:  "bg-yellow-100 text-yellow-700",
  APPROVED: "bg-green-100 text-green-700",
  REJECTED: "bg-red-100 text-red-700",
};

export default async function StudentScholarshipsPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "STUDENT") redirect("/dashboard");

  const [scholarships, myApplications] = await Promise.all([
    prisma.scholarship.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        description: true,
        amount: true,
        deadline: true,
        _count: { select: { applications: true } },
      },
    }),
    prisma.scholarshipApplication.findMany({
      where: { userId: user.id },
      select: {
        scholarshipId: true,
        status: true,
        createdAt: true,
        scholarship: { select: { title: true, amount: true } },
      },
    }),
  ]);

  const appliedIds = new Set(myApplications.map((a) => a.scholarshipId));
  const now = new Date();

  const available = scholarships.filter(
    (s) => !s.deadline || s.deadline >= now
  );
  const closed = scholarships.filter(
    (s) => s.deadline && s.deadline < now
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">المنح الدراسية</h1>
        <p className="text-gray-500 text-sm mt-0.5">
          {available.length} منحة متاحة — تقدّمت لـ {myApplications.length} منحة
        </p>
      </div>

      {/* My applications */}
      {myApplications.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-800">طلباتي</h2>
          </div>
          <ul className="divide-y divide-gray-100">
            {myApplications.map((app) => (
              <li key={app.scholarshipId} className="px-5 py-4 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="font-medium text-gray-800 text-sm">{app.scholarship.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    تقدّمت {app.createdAt.toLocaleDateString("ar-SA")}
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  {app.scholarship.amount != null && (
                    <span className="text-xs text-gray-500 hidden sm:block">
                      {app.scholarship.amount.toLocaleString("ar")} ر.س
                    </span>
                  )}
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyle[app.status]}`}>
                    {statusLabel[app.status]}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Available scholarships */}
      {available.length > 0 && (
        <div className="space-y-3">
          <h2 className="font-semibold text-gray-700">منح متاحة للتقديم</h2>
          <div className="grid grid-cols-1 gap-3">
            {available.map((s) => (
              <div
                key={s.id}
                className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-gray-800">{s.title}</h3>
                    {s.amount != null && (
                      <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                        {s.amount.toLocaleString("ar")} ر.س
                      </span>
                    )}
                  </div>
                  {s.description && (
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">{s.description}</p>
                  )}
                  <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                    {s.deadline && (
                      <span>
                        آخر موعد: {s.deadline.toLocaleDateString("ar-SA")}
                      </span>
                    )}
                    <span>{s._count.applications} متقدّم</span>
                  </div>
                </div>
                <div className="shrink-0">
                  <ApplyButton
                    scholarshipId={s.id}
                    applied={appliedIds.has(s.id)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Closed scholarships */}
      {closed.length > 0 && (
        <div className="space-y-3">
          <h2 className="font-semibold text-gray-500 text-sm">منح انتهت مدة التقديم</h2>
          <div className="grid grid-cols-1 gap-2">
            {closed.map((s) => (
              <div
                key={s.id}
                className="bg-gray-50 rounded-xl border border-gray-100 p-4 flex items-center justify-between gap-4 opacity-70"
              >
                <div>
                  <p className="font-medium text-gray-600 text-sm">{s.title}</p>
                  {s.deadline && (
                    <p className="text-xs text-gray-400 mt-0.5">
                      انتهى التقديم: {s.deadline.toLocaleDateString("ar-SA")}
                    </p>
                  )}
                </div>
                <span className="shrink-0 text-xs text-gray-400 bg-gray-200 px-2.5 py-0.5 rounded-full">
                  منتهية
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {scholarships.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-200 py-12 text-center">
          <p className="text-gray-400">لا توجد منح دراسية متاحة حالياً</p>
        </div>
      )}
    </div>
  );
}
