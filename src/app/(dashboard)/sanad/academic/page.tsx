import Link from "next/link";
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

export default function AcademicPage() {
  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Link href="/sanad" className="hover:text-[#3D1F6E] transition-colors">سند</Link>
        <span>/</span>
        <span className="text-[#3D1F6E] font-medium">الأنشطة الأكاديمية</span>
      </div>

      {/* Document request */}
      <ServiceCard title="طلب وثيقة رسمية" icon="📄">
        <OfficialDocumentForm />
      </ServiceCard>

      {/* Schedule */}
      <ServiceCard title="الجدول الدراسي" icon="🗓️">
        <CourseSchedule />
      </ServiceCard>

      {/* Course registration */}
      <ServiceCard title="التسجيل في المقررات" icon="📝">
        <CourseRegistration />
      </ServiceCard>

      {/* Clearance stepper */}
      <ServiceCard title="إخلاء الطرف" icon="✅">
        <ClearanceStepper />
      </ServiceCard>
    </div>
  );
}
