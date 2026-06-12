import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/dal";
import { prisma } from "@/lib/db";
import EnrollButton from "./_components/EnrollButton";

const trainingStatusLabel: Record<string, string> = {
  UPCOMING:  "قادم",
  ONGOING:   "جارٍ",
  COMPLETED: "منتهٍ",
  CANCELLED: "ملغى",
};
const trainingStatusStyle: Record<string, string> = {
  UPCOMING:  "bg-blue-100 text-blue-700",
  ONGOING:   "bg-green-100 text-green-700",
  COMPLETED: "bg-gray-100 text-gray-500",
  CANCELLED: "bg-red-100 text-red-500",
};

const enrStatusLabel: Record<string, string> = {
  PENDING:   "قيد المراجعة",
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

export default async function StudentTrainingsPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "STUDENT") redirect("/dashboard");

  const [trainings, myEnrollments] = await Promise.all([
    prisma.training.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        description: true,
        instructor: true,
        category: true,
        capacity: true,
        startDate: true,
        endDate: true,
        status: true,
        _count: { select: { enrollments: true } },
      },
    }),
    prisma.trainingEnrollment.findMany({
      where: { userId: user.id },
      select: {
        trainingId: true,
        status: true,
        createdAt: true,
        training: {
          select: { title: true, category: true, startDate: true, status: true },
        },
      },
    }),
  ]);

  const enrolledIds = new Set(myEnrollments.map((e) => e.trainingId));

  const open = trainings.filter(
    (t) => t.status === "UPCOMING" || t.status === "ONGOING"
  );
  const past = trainings.filter(
    (t) => t.status === "COMPLETED" || t.status === "CANCELLED"
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">التدريب التعاوني</h1>
        <p className="text-gray-500 text-sm mt-0.5">
          {open.length} برنامج متاح — سجّلت في {myEnrollments.length} برنامج
        </p>
      </div>

      {/* My enrollments */}
      {myEnrollments.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-800">تسجيلاتي</h2>
          </div>
          <ul className="divide-y divide-gray-100">
            {myEnrollments.map((enr) => (
              <li key={enr.trainingId} className="px-5 py-4 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="font-medium text-gray-800 text-sm">{enr.training.title}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    {enr.training.category && (
                      <span className="text-xs text-gray-400">{enr.training.category}</span>
                    )}
                    {enr.training.startDate && (
                      <span className="text-xs text-gray-400">
                        · {enr.training.startDate.toLocaleDateString("ar-SA")}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${trainingStatusStyle[enr.training.status]}`}>
                    {trainingStatusLabel[enr.training.status]}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${enrStatusStyle[enr.status]}`}>
                    {enrStatusLabel[enr.status]}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Available trainings */}
      {open.length > 0 && (
        <div className="space-y-3">
          <h2 className="font-semibold text-gray-700">برامج متاحة للتسجيل</h2>
          <div className="grid grid-cols-1 gap-3">
            {open.map((t) => {
              const isFull =
                t.capacity !== null && t._count.enrollments >= t.capacity;
              const unavailable =
                t.status === "CANCELLED" || t.status === "COMPLETED";
              return (
                <div
                  key={t.id}
                  className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-gray-800">{t.title}</h3>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${trainingStatusStyle[t.status]}`}>
                        {trainingStatusLabel[t.status]}
                      </span>
                    </div>
                    {t.description && (
                      <p className="text-sm text-gray-500 mt-1 line-clamp-2">{t.description}</p>
                    )}
                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-400 flex-wrap">
                      {t.instructor && <span>المدرب: {t.instructor}</span>}
                      {t.category && <span>· {t.category}</span>}
                      {t.startDate && (
                        <span>· البدء: {t.startDate.toLocaleDateString("ar-SA")}</span>
                      )}
                      {t.capacity !== null && (
                        <span>
                          · {t._count.enrollments}/{t.capacity} مسجّل
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="shrink-0">
                    <EnrollButton
                      trainingId={t.id}
                      enrolled={enrolledIds.has(t.id)}
                      isFull={isFull}
                      unavailable={unavailable}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Past trainings */}
      {past.length > 0 && (
        <div className="space-y-3">
          <h2 className="font-semibold text-gray-500 text-sm">برامج منتهية</h2>
          <div className="grid grid-cols-1 gap-2">
            {past.map((t) => (
              <div
                key={t.id}
                className="bg-gray-50 rounded-xl border border-gray-100 p-4 flex items-center justify-between gap-4 opacity-70"
              >
                <div>
                  <p className="font-medium text-gray-600 text-sm">{t.title}</p>
                  {t.category && (
                    <p className="text-xs text-gray-400 mt-0.5">{t.category}</p>
                  )}
                </div>
                <span className={`shrink-0 text-xs px-2.5 py-0.5 rounded-full font-medium ${trainingStatusStyle[t.status]}`}>
                  {trainingStatusLabel[t.status]}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {trainings.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-200 py-12 text-center">
          <p className="text-gray-400">لا توجد برامج تدريبية متاحة حالياً</p>
        </div>
      )}
    </div>
  );
}
