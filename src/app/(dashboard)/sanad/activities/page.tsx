import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/dal";
import { prisma } from "@/lib/db";
import ActivitiesCalendar from "./_components/ActivitiesCalendar";
import SkillsPrograms from "./_components/SkillsPrograms";

function ServiceCard({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-purple-100 overflow-hidden">
      <div className="h-1 bg-[#00B4C8]" />
      <div className="p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-[#E0F7FA] flex items-center justify-center text-xl shrink-0">{icon}</div>
          <h2 className="font-bold text-[#3D1F6E] text-base">{title}</h2>
        </div>
        {children}
      </div>
    </div>
  );
}

export default async function ActivitiesPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const [activities, myApplications, trainings, myEnrollments] = await Promise.all([
    prisma.studentActivity.findMany({
      orderBy: { date: "asc" },
      select: {
        id: true, title: true, description: true, date: true,
        _count: { select: { applications: true } },
      },
    }),
    prisma.activityApplication.findMany({
      where: { userId: user.id },
      select: { activityId: true },
    }),
    prisma.training.findMany({
      where: { status: { in: ["UPCOMING", "ONGOING"] } },
      orderBy: { startDate: "asc" },
      take: 10,
      select: { id: true, title: true, category: true, startDate: true, capacity: true, status: true, _count: { select: { enrollments: true } } },
    }),
    prisma.trainingEnrollment.findMany({
      where: { userId: user.id },
      select: { trainingId: true },
    }),
  ]);

  const appliedActivityIds = new Set(myApplications.map((a) => a.activityId));
  const enrolledTrainingIds = new Set(myEnrollments.map((e) => e.trainingId));

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Link href="/sanad" className="hover:text-[#3D1F6E] transition-colors">سند</Link>
        <span>/</span>
        <span className="text-[#3D1F6E] font-medium">المهارات والأنشطة</span>
      </div>

      <ServiceCard title="الأنشطة والفعاليات" icon="📅">
        <ActivitiesCalendar activities={activities} appliedIds={appliedActivityIds} />
      </ServiceCard>

      <ServiceCard title="برامج التدريب التعاوني" icon="💡">
        <SkillsPrograms trainings={trainings} enrolledIds={enrolledTrainingIds} />
      </ServiceCard>

      <div className="bg-white rounded-2xl shadow-sm border border-yellow-200 overflow-hidden">
        <div className="h-1 bg-yellow-400" />
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-yellow-50 flex items-center justify-center text-xl shrink-0">⭐</div>
            <div>
              <h2 className="font-bold text-[#3D1F6E] text-base">الأندية الطلابية</h2>
              <p className="text-gray-400 text-xs mt-0.5">اكتشف الأندية الطلابية والفعاليات التنظيمية</p>
            </div>
          </div>
          <Link
            href="/clubs"
            className="flex items-center gap-1.5 px-4 py-2 bg-yellow-400 text-yellow-900 rounded-lg text-sm font-semibold hover:bg-yellow-500 transition-colors shrink-0"
          >
            <span>الأندية</span>
            <span>↗</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
