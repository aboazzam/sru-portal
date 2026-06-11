import Link from "next/link";
import { guideBuildings, guideFacilities, guideContacts } from "@/lib/mock/hala";

function SectionHeader({ icon, title }: { icon: string; title: string }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg" style={{ background: "#E8F6F8" }}>
        {icon}
      </div>
      <h2 className="font-bold text-[#1A2A30] text-base">{title}</h2>
    </div>
  );
}

export default function GuidePage() {
  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-[#8FA4AB]">
        <Link href="/hala" className="hover:text-[#6CAEBD] transition-colors">هلا بك</Link>
        <span>/</span>
        <span className="text-[#1A2A30] font-medium">دليل الجامعة</span>
      </div>

      {/* Hero */}
      <div
        className="rounded-2xl p-6 text-white shadow-sm"
        style={{ background: "linear-gradient(135deg, #6CAEBD 0%, #8FA4AB 100%)" }}
      >
        <div className="flex items-center gap-3">
          <span className="text-4xl">🗺️</span>
          <div>
            <h1 className="text-xl font-bold">دليل الحرم الجامعي</h1>
            <p className="text-white/80 text-sm mt-0.5">
              جامعة سليمان الراجحي – كل ما تحتاجه في مكان واحد
            </p>
          </div>
        </div>
      </div>

      {/* Buildings */}
      <div className="bg-white rounded-2xl p-5 border border-[#E8EDEF] shadow-sm">
        <SectionHeader icon="🏛️" title="المباني الرئيسية" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {guideBuildings.map((b) => (
            <div
              key={b.code}
              className="flex items-start gap-3 p-4 rounded-xl border border-[#E8EDEF] hover:border-[#6CAEBD] hover:bg-[#E8F6F8]/30 transition-all"
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
                style={{ background: "#E8F6F8" }}
              >
                {b.icon}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span
                    className="text-xs font-bold px-2 py-0.5 rounded-full"
                    style={{ background: "#6CAEBD", color: "#fff" }}
                  >
                    {b.code}
                  </span>
                  <p className="font-semibold text-[#1F2937] text-sm">{b.name}</p>
                </div>
                <p className="text-[#6B7280] text-xs mt-1 leading-relaxed">{b.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Facilities */}
      <div className="bg-white rounded-2xl p-5 border border-[#E8EDEF] shadow-sm">
        <SectionHeader icon="🏢" title="المرافق والخدمات" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {guideFacilities.map((f) => (
            <div
              key={f.name}
              className="flex items-start gap-3 p-4 rounded-xl border border-[#E8EDEF] hover:shadow-sm transition-all"
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
                style={{ background: f.color + "15" }}
              >
                {f.icon}
              </div>
              <div>
                <p className="font-semibold text-[#1F2937] text-sm">{f.name}</p>
                <p className="text-[#6B7280] text-xs mt-0.5 leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Contacts */}
      <div className="bg-white rounded-2xl p-5 border border-[#E8EDEF] shadow-sm">
        <SectionHeader icon="📞" title="جهات الاتصال" />
        <div className="space-y-3">
          {guideContacts.map((c) => (
            <div
              key={c.dept}
              className="flex items-center gap-4 p-3 rounded-xl hover:bg-[#F4F7F8] transition-colors"
            >
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center text-lg shrink-0"
                style={{ background: "#E8F6F8" }}
              >
                {c.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-[#1F2937] text-sm">{c.dept}</p>
                <p className="text-[#8FA4AB] text-xs mt-0.5">{c.email}</p>
              </div>
              <div className="shrink-0 text-end">
                <p className="text-xs text-[#8FA4AB]">داخلي</p>
                <p className="font-bold text-[#6CAEBD] text-sm">{c.ext}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Emergency note */}
        <div
          className="mt-4 flex items-center gap-3 px-4 py-3 rounded-xl"
          style={{ background: "#FEE2E2", color: "#DC2626" }}
        >
          <span className="text-lg">🆘</span>
          <p className="text-sm font-medium">الطوارئ: اتصل بـ 911 أو توجّه للعيادة الجامعية فوراً</p>
        </div>
      </div>
    </div>
  );
}
