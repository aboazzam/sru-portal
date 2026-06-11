import Link from "next/link";
import { fundingSolutions, generalTerms } from "@/lib/mock/scholarships";

export default function FundingPage() {
  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-[#8FA4AB]">
        <Link href="/scholarships" className="hover:text-[#875E9E] transition-colors">المنح والحلول المالية</Link>
        <span>/</span>
        <span className="text-[#1A2A30] font-medium">الحلول التمويلية</span>
      </div>

      {/* Hero */}
      <div
        className="rounded-2xl p-6 text-white shadow-sm"
        style={{ background: "linear-gradient(135deg, #8FA4AB 0%, #875E9E 100%)" }}
      >
        <div className="flex items-center gap-3">
          <span className="text-4xl">💡</span>
          <div>
            <h1 className="text-xl font-bold">الحلول التمويلية</h1>
            <p className="text-white/80 text-sm mt-0.5">
              خيارات تقسيط وتمويل ميسّر لدراستك في جامعة سليمان الراجحي
            </p>
          </div>
        </div>
      </div>

      {/* Funding solution cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {fundingSolutions.map((sol) => (
          <div
            key={sol.id}
            className="bg-white rounded-2xl border border-[#E8EDEF] shadow-sm overflow-hidden"
          >
            {/* Top accent */}
            <div className="h-1.5" style={{ background: sol.color }} />
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between gap-3 mb-4">
                <div>
                  <div
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold text-white mb-2"
                    style={{ background: sol.color }}
                  >
                    {sol.name}
                  </div>
                  <p className="font-bold text-[#1F2937] text-base">{sol.tagline}</p>
                </div>
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0"
                  style={{ background: sol.color + "18" }}
                >
                  💰
                </div>
              </div>

              <p className="text-[#374151] text-sm leading-relaxed mb-4">{sol.description}</p>

              {/* Features */}
              <ul className="space-y-2 mb-5">
                {sol.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-[#374151]">
                    <span className="shrink-0 mt-0.5" style={{ color: sol.color }}>✓</span>
                    {f}
                  </li>
                ))}
              </ul>

              {/* Contact */}
              <div className="p-4 rounded-xl border border-[#E8EDEF] bg-[#F4F7F8] space-y-1.5">
                <p className="text-xs font-bold text-[#506570] mb-2">التواصل</p>
                {"website" in sol.contact && (
                  <div className="flex items-center gap-2 text-xs text-[#374151]">
                    <span>🌐</span>
                    <span>{sol.contact.website}</span>
                  </div>
                )}
                {"phone" in sol.contact && (
                  <div className="flex items-center gap-2 text-xs text-[#374151]">
                    <span>📞</span>
                    <span dir="ltr">{sol.contact.phone}</span>
                  </div>
                )}
                {"email" in sol.contact && (
                  <div className="flex items-center gap-2 text-xs text-[#374151]">
                    <span>✉️</span>
                    <span dir="ltr">{sol.contact.email}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Note */}
      <div
        className="rounded-2xl p-5 flex items-start gap-4"
        style={{ background: "#E8F6F8", border: "1px solid #C8E6EC" }}
      >
        <span className="text-2xl shrink-0">ℹ️</span>
        <div>
          <p className="font-bold text-sm text-[#1A2A30] mb-1">ملاحظة مهمة</p>
          <p className="text-xs text-[#374151] leading-relaxed">
            الحلول التمويلية مستقلة عن منح الجامعة. يمكنك الاستفادة من منحة الجامعة والحل التمويلي معاً
            إذا كانت تغطية المنحة جزئية. للاستفسار، تواصل مع مكتب الصندوق والحلول المالية.
          </p>
        </div>
      </div>

      {/* General terms summary */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#E8EDEF] p-5">
        <h2 className="font-bold text-[#1A2A30] text-sm mb-4 flex items-center gap-2">
          <span>📋</span> الشروط العامة
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {generalTerms.slice(0, 4).map((t) => (
            <div key={t.title} className="flex items-start gap-3 p-3 rounded-xl bg-[#F4F7F8]">
              <span className="text-lg shrink-0">{t.icon}</span>
              <div>
                <p className="font-semibold text-xs text-[#1F2937]">{t.title}</p>
                <p className="text-xs text-[#6B7280] mt-0.5 leading-relaxed">{t.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
