import Link from "next/link";
import { getTranslations } from "next-intl/server";
import OfficialDocumentForm from "./_components/OfficialDocumentForm";
import CourseSchedule from "./_components/CourseSchedule";
import CourseRegistration from "./_components/CourseRegistration";
import ClearanceStepper from "./_components/ClearanceStepper";

function ServiceCard({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-purple-100 overflow-hidden">
      <div className="h-1 bg-[#3D1F6E]" />
      <div className="p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-[#F5F3FF] flex items-center justify-center text-xl shrink-0">
            {icon}
          </div>
          <h2 className="font-bold text-[#3D1F6E] text-base">{title}</h2>
        </div>
        {children}
      </div>
    </div>
  );
}

export default async function AcademicPage() {
  const t = await getTranslations("Sanad");

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Link href="/sanad" className="hover:text-[#3D1F6E] transition-colors">{t("breadcrumb")}</Link>
        <span>/</span>
        <span className="text-[#3D1F6E] font-medium">{t("academic.breadcrumb")}</span>
      </div>

      <ServiceCard title={t("academic.officialDoc")} icon="📄">
        <OfficialDocumentForm />
      </ServiceCard>

      <ServiceCard title={t("academic.schedule")} icon="🗓️">
        <CourseSchedule />
      </ServiceCard>

      <ServiceCard title={t("academic.registration")} icon="📝">
        <CourseRegistration />
      </ServiceCard>

      <ServiceCard title={t("academic.clearance")} icon="✅">
        <ClearanceStepper />
      </ServiceCard>
    </div>
  );
}
