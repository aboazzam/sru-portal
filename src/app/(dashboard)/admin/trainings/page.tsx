import { prisma } from "@/lib/db";
import EnrollmentStatusSelect from "./_components/EnrollmentStatusSelect";
import TrainingProgramsTab from "./_components/TrainingProgramsTab";
import TrainingRequestsTab from "./_components/TrainingRequestsTab";

export const dynamic = "force-dynamic";

const enrollmentStatusLabel: Record<string, string> = {
  PENDING:   "معلّق",
  APPROVED:  "مقبول",
  REJECTED:  "مرفوض",
  COMPLETED: "مكتمل",
};

const badgeStyle: Record<string, string> = {
  PENDING:   "bg-yellow-100 text-yellow-700",
  APPROVED:  "bg-green-100 text-green-700",
  REJECTED:  "bg-red-100 text-red-700",
  COMPLETED: "bg-blue-100 text-blue-700",
};

const ENROLLMENT_FILTERS = [
  { value: "",          label: "الكل"    },
  { value: "PENDING",   label: "معلّق"   },
  { value: "APPROVED",  label: "مقبول"   },
  { value: "REJECTED",  label: "مرفوض"   },
  { value: "COMPLETED", label: "مكتمل"   },
];

const REQ_STATUS_LABEL: Record<string, string> = {
  PENDING:   "معلّق",
  APPROVED:  "مقبول",
  REJECTED:  "مرفوض",
  COMPLETED: "مكتمل",
};

const REQ_BADGE: Record<string, string> = {
  PENDING:   "bg-yellow-100 text-yellow-700",
  APPROVED:  "bg-green-100 text-green-700",
  REJECTED:  "bg-red-100 text-red-700",
  COMPLETED: "bg-blue-100 text-blue-700",
};

export default async function TrainingsAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string; filter?: string }>;
}) {
  const { tab = "enrollments", filter } = await searchParams;

  // ─── Enrollments tab data ───────────────────────────────────────
  const validEnrFilter = ["PENDING", "APPROVED", "REJECTED", "COMPLETED"].includes(filter ?? "")
    ? (filter as "PENDING" | "APPROVED" | "REJECTED" | "COMPLETED")
    : undefined;

  const [enrollments, enrCounts, trainings, reqCounts, trainingRequests] = await Promise.all([
    tab === "enrollments"
      ? prisma.trainingEnrollment.findMany({
          where: validEnrFilter ? { status: validEnrFilter } : undefined,
          orderBy: { createdAt: "desc" },
          include: {
            training: { select: { id: true, title: true, category: true, status: true } },
            user: { select: { id: true, name: true, email: true } },
          },
        })
      : Promise.resolve([]),

    prisma.trainingEnrollment.groupBy({ by: ["status"], _count: { _all: true } }),

    tab === "programs"
      ? prisma.training.findMany({
          orderBy: [{ status: "asc" }, { startDate: "asc" }],
          include: { _count: { select: { enrollments: true } } },
        })
      : Promise.resolve([]),

    prisma.trainingRequest.groupBy({ by: ["status"], _count: { _all: true } }),

    tab === "requests"
      ? prisma.trainingRequest.findMany({
          where: filter && ["PENDING", "APPROVED", "REJECTED", "COMPLETED"].includes(filter)
            ? { status: filter as any }
            : undefined,
          orderBy: { createdAt: "desc" },
          include: { user: { select: { id: true, name: true, email: true } } },
        })
      : Promise.resolve([]),
  ]);

  const enrCountMap = Object.fromEntries(enrCounts.map((c) => [c.status, c._count._all]));
  const reqCountMap = Object.fromEntries(reqCounts.map((c) => [c.status, c._count._all]));
  const enrTotal = Object.values(enrCountMap).reduce((s, v) => s + v, 0);
  const reqTotal = Object.values(reqCountMap).reduce((s, v) => s + v, 0);

  const tabs = [
    { key: "enrollments", label: "التسجيلات", count: enrTotal },
    { key: "programs",    label: "البرامج",    count: trainings.length },
    { key: "requests",    label: "طلبات التدريب", count: reqTotal },
  ];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">إدارة التدريب</h1>
        <p className="text-gray-500 text-sm mt-0.5">إدارة البرامج التدريبية، التسجيلات، والطلبات</p>
      </div>

      {/* Tab bar */}
      <div className="flex gap-2 border-b border-gray-200">
        {tabs.map((t) => (
          <a
            key={t.key}
            href={`/admin/trainings?tab=${t.key}`}
            className={`px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${
              tab === t.key
                ? "border-green-600 text-green-700"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {t.label}
            {t.count > 0 && (
              <span className={`ms-1.5 text-xs px-1.5 py-0.5 rounded-full ${tab === t.key ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                {t.count}
              </span>
            )}
          </a>
        ))}
      </div>

      {/* ── Enrollments tab ─────────────────────────── */}
      {tab === "enrollments" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <p className="text-gray-500 text-sm">
              {validEnrFilter
                ? `${enrollments.length} تسجيل — ${enrollmentStatusLabel[validEnrFilter]}`
                : `${enrTotal} تسجيل إجمالاً`}
            </p>
            <div className="flex gap-2 flex-wrap">
              {enrCounts.map((c) => (
                <span key={c.status} className={`px-3 py-1 rounded-full text-xs font-medium ${badgeStyle[c.status] ?? "bg-gray-100 text-gray-600"}`}>
                  {enrollmentStatusLabel[c.status]}: {c._count._all}
                </span>
              ))}
            </div>
          </div>

          <div className="flex gap-2 flex-wrap">
            {ENROLLMENT_FILTERS.map((f) => {
              const href = f.value
                ? `/admin/trainings?tab=enrollments&filter=${f.value}`
                : "/admin/trainings?tab=enrollments";
              const isActive = (f.value === "" && !validEnrFilter) || f.value === validEnrFilter;
              return (
                <a key={f.value} href={href}
                  className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive ? "bg-green-600 text-white shadow-sm" : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
                  }`}
                >
                  {f.label}
                  {f.value && enrCountMap[f.value] != null && (
                    <span className={`ms-1.5 text-xs ${isActive ? "opacity-80" : "text-gray-400"}`}>
                      ({enrCountMap[f.value]})
                    </span>
                  )}
                </a>
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
                    <th className="px-5 py-3 text-start">البرنامج التدريبي</th>
                    <th className="px-5 py-3 text-start">التصنيف</th>
                    <th className="px-5 py-3 text-start">تاريخ التسجيل</th>
                    <th className="px-5 py-3 text-start">الحالة</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {enrollments.length === 0 && (
                    <tr><td colSpan={6} className="px-5 py-8 text-center text-gray-400">لا توجد تسجيلات</td></tr>
                  )}
                  {enrollments.map((enr) => (
                    <tr key={enr.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-3 font-medium text-gray-900">{enr.user.name}</td>
                      <td className="px-5 py-3 text-gray-500 text-xs">{enr.user.email}</td>
                      <td className="px-5 py-3 text-gray-700">{enr.training.title}</td>
                      <td className="px-5 py-3 text-gray-500 text-xs">{enr.training.category ?? "—"}</td>
                      <td className="px-5 py-3 text-gray-400 text-xs">{enr.createdAt.toLocaleDateString("ar-SA")}</td>
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
      )}

      {/* ── Programs tab ─────────────────────────────── */}
      {tab === "programs" && (
        <TrainingProgramsTab trainings={trainings as any} />
      )}

      {/* ── Requests tab ─────────────────────────────── */}
      {tab === "requests" && (
        <TrainingRequestsTab
          requests={trainingRequests as any}
          countMap={reqCountMap}
          activeFilter={filter ?? ""}
          statusLabel={REQ_STATUS_LABEL}
          badgeStyle={REQ_BADGE}
        />
      )}
    </div>
  );
}
