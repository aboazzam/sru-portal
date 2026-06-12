import { prisma } from "@/lib/db";

export default async function AdminOverview() {
  const [
    totalUsers,
    students,
    faculty,
    admins,
    totalScholarships,
    activeScholarships,
    pendingApplications,
    totalApplications,
    totalTrainings,
    upcomingTrainings,
    pendingEnrollments,
    totalEnrollments,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { role: "STUDENT" } }),
    prisma.user.count({ where: { role: "FACULTY" } }),
    prisma.user.count({ where: { role: "ADMIN" } }),
    prisma.scholarship.count(),
    prisma.scholarship.count({
      where: { OR: [{ deadline: null }, { deadline: { gte: new Date() } }] },
    }),
    prisma.scholarshipApplication.count({ where: { status: "PENDING" } }),
    prisma.scholarshipApplication.count(),
    prisma.training.count(),
    prisma.training.count({ where: { status: "UPCOMING" } }),
    prisma.trainingEnrollment.count({ where: { status: "PENDING" } }),
    prisma.trainingEnrollment.count(),
  ]);

  const statGroups = [
    {
      title: "المستخدمون",
      color: "border-blue-200 bg-blue-50",
      titleColor: "text-blue-600",
      stats: [
        { label: "إجمالي المستخدمين", value: totalUsers, sub: null },
        { label: "الطلاب", value: students, sub: null },
        { label: "أعضاء هيئة التدريس", value: faculty, sub: null },
        { label: "المدراء", value: admins, sub: null },
      ],
    },
    {
      title: "المنح الدراسية",
      color: "border-emerald-200 bg-emerald-50",
      titleColor: "text-emerald-600",
      stats: [
        { label: "إجمالي المنح", value: totalScholarships, sub: null },
        { label: "المنح النشطة", value: activeScholarships, sub: null },
        { label: "الطلبات المعلّقة", value: pendingApplications, sub: "يحتاج مراجعة" },
        { label: "إجمالي الطلبات", value: totalApplications, sub: null },
      ],
    },
    {
      title: "التدريب التعاوني",
      color: "border-purple-200 bg-purple-50",
      titleColor: "text-purple-600",
      stats: [
        { label: "إجمالي التدريبات", value: totalTrainings, sub: null },
        { label: "تدريبات قادمة", value: upcomingTrainings, sub: null },
        { label: "تسجيلات معلّقة", value: pendingEnrollments, sub: "يحتاج مراجعة" },
        { label: "إجمالي التسجيلات", value: totalEnrollments, sub: null },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">نظرة عامة</h1>
        <p className="text-gray-500 text-sm mt-1">إحصائيات النظام في الوقت الفعلي</p>
      </div>

      <div className="space-y-6">
        {statGroups.map((group) => (
          <div key={group.title} className={`rounded-xl border p-5 ${group.color}`}>
            <h2 className={`text-sm font-semibold uppercase tracking-wide mb-4 ${group.titleColor}`}>
              {group.title}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {group.stats.map((s) => (
                <div key={s.label} className="bg-white rounded-lg p-4 border border-white/60 shadow-sm">
                  <p className="text-2xl font-bold text-gray-800">{s.value.toLocaleString("ar")}</p>
                  <p className="text-xs text-gray-500 mt-1">{s.label}</p>
                  {s.sub && (
                    <p className="text-[10px] text-orange-500 font-medium mt-0.5">{s.sub}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
