import Link from "next/link";
import VolunteerOpportunities from "./_components/VolunteerOpportunities";
import VolunteerLog from "./_components/VolunteerLog";

function ServiceCard({ title, icon, accentColor, children }: {
  title: string; icon: string; accentColor: string; children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-purple-100 overflow-hidden">
      <div className="h-1" style={{ background: accentColor }} />
      <div className="p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
            style={{ background: accentColor + "22" }}>
            {icon}
          </div>
          <h2 className="font-bold text-[#3D1F6E] text-base">{title}</h2>
        </div>
        {children}
      </div>
    </div>
  );
}

export default function VolunteerPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Link href="/sanad" className="hover:text-[#3D1F6E] transition-colors">سند</Link>
        <span>/</span>
        <span className="text-[#3D1F6E] font-medium">الفرص التطوعية</span>
      </div>

      <ServiceCard title="الفرص المتاحة" icon="🤲" accentColor="#6B46C1">
        <VolunteerOpportunities />
      </ServiceCard>

      <ServiceCard title="سجل التطوع" icon="📊" accentColor="#00B4C8">
        <VolunteerLog />
      </ServiceCard>
    </div>
  );
}
