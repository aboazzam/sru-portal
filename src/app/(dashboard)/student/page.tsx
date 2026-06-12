import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/dal";
import { prisma } from "@/lib/db";

const appStatusLabel: Record<string, string> = {
  PENDING:  "معلّق",
  APPROVED: "مقبول",
  REJECTED: "مرفوض",
};
const appStatusStyle: Record<string, string> = {
  PENDING:  "bg-yellow-100 text-yellow-700",
  APPROVED: "bg-green-100 text-green-700",
  REJECTED: "bg-red-100 text-red-700",
};

const enrStatusLabel: Record<string, string> = {
  PENDING:   "معلّق",
  APPROVED:  "مقبول",
  REJECTED:  "مرفوض",
  COMPLETED: "مكتمل",
};
const enrStatusStyle: Record<string, string> = {
  PENDING:   "bg-yellow-100 text-yellow-700",
  APPROVED:  "bg-green-100 text-green-700",
  REJECTED:  "bg-red-100 text-red-700",
  COMPLETED: "bg-blue-100 text-blue-700",
};

export default async function StudentOverview() {
  const user = await getCurrentUser();
  if (!user || user.role !== "STUDENT") redirect("/dashboard");

  const [dbUser, scholarshipApps, trainingEnrollments] = await Promise.all([
    prisma.user.findUnique({
      where: { id: user.id },
      select: { points: true },
    }),
    prisma.scholarshipApplication.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 4,
      select: {
        id: true,
        status: true,
        createdAt: true,
        scholarship: { select: { title: true, amount: true } },
      },
    }),
    prisma.trainingEnrollment.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 4,
      select: {
        id: true,
        status: true,
        createdAt: true,
        training: { select: { title: true, category: true, status: true } },
      },
    }),
  ]);

  const points = dbUser?.points ?? 0;
  const totalApps = scholarshipApps.length;
  const approvedApps = scholarshipApps.filter((a) => a.status === "APPROVED").length;
  const totalEnr = trainingEnrollments.length;
  const activeEnr = trainingEnrollments.filter(
    (e) => e.status === "APPROVED" || e.status === "PENDING"
  ).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">مرحباً، {user.name}</h1>
          <p className="text-gray-500 text-sm mt-0.5">لوحة تحكم الطالب</p>
        </div>
        <div className="text-end">
          <p className="text-xs text-gray-400">نقاطي</p>
          <p className="text-3xl font-bold text-amber-500">{points}</p>
          <p className="text-xs text-gray-400">نقطة</p>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "طلبات المنح",    value: totalApps,    color: "border-blue-200 bg-blue-50 text-blue-700"   },
          { label: "منح مقبولة",     value: approvedApps, color: "border-green-200 bg-green-50 text-green-700" },
          { label: "تسجيلات التدريب",value: totalEnr,     color: "border-purple-200 bg-purple-50 text-purple-700" },
          { label: "تدريبات نشطة",   value: activeEnr,    color: "border-orange-200 bg-orange-50 text-orange-700" },
        ].map((s) => (
          <div key={s.label} className={`rounded-xl border p-4 ${s.color}`}>
            <p className="text-2xl font-bold">{s.value}</p>
            <p className="text-xs opacity-80 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Recent activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Recent scholarship apps */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-800">آخر طلبات المنح</h2>
            <Link href="/student/scholarships" className="text-xs text-primary hover:underline">
              عرض الكل
            </Link>
          </div>
          {scholarshipApps.length === 0 ? (
            <p className="px-5 py-6 text-sm text-gray-400 text-center">لم تتقدم لأي منحة بعد</p>
          ) : (
            <ul className="divide-y divide-gray-100">
              {scholarshipApps.map((app) => (
                <li key={app.id} className="px-5 py-3 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">
                      {app.scholarship.title}
                    </p>
                    <p className="text-xs text-gray-400">
                      {app.createdAt.toLocaleDateString("ar-SA")}
                    </p>
                  </div>
                  <span className={`shrink-0 px-2.5 py-0.5 rounded-full text-xs font-medium ${appStatusStyle[app.status]}`}>
                    {appStatusLabel[app.status]}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Recent training enrollments */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-800">آخر تسجيلات التدريب</h2>
            <Link href="/student/trainings" className="text-xs text-primary hover:underline">
              عرض الكل
            </Link>
          </div>
          {trainingEnrollments.length === 0 ? (
            <p className="px-5 py-6 text-sm text-gray-400 text-center">لم تسجّل في أي تدريب بعد</p>
          ) : (
            <ul className="divide-y divide-gray-100">
              {trainingEnrollments.map((enr) => (
                <li key={enr.id} className="px-5 py-3 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">
                      {enr.training.title}
                    </p>
                    <p className="text-xs text-gray-400">
                      {enr.training.category ?? "—"}
                    </p>
                  </div>
                  <span className={`shrink-0 px-2.5 py-0.5 rounded-full text-xs font-medium ${enrStatusStyle[enr.status]}`}>
                    {enrStatusLabel[enr.status]}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
