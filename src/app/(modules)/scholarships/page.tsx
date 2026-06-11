import Link from "next/link";
import {
  scholarshipStats,
  myScholarshipStatus,
  generalTerms,
  applicationJourney,
} from "@/lib/mock/scholarships";

function fmt(n: number) { return n.toLocaleString("ar-SA"); }

const quickLinks = [
  { href: "/scholarships/full",    label: "المنح الكاملة",    icon: "🎓", desc: `${scholarshipStats.fullScholarships} منح`,    color: "#6CAEBD" },
  { href: "/scholarships/partial", label: "المنح الجزئية",    icon: "📊", desc: `${scholarshipStats.partialCategories} فئات`,   color: "#875E9E" },
  { href: "/scholarships/funding", label: "الحلول التمويلية", icon: "💡", desc: `${scholarshipStats.fundingSolutions} حلول`,    color: "#8FA4AB" },
  { href: "/scholarships/apply",   label: "تقديم طلب",       icon: "📝", desc: "تقديم جديد",                                   color: "#6CAEBD" },
];

export default function ScholarshipsOverview() {
  const { scholarship, applicationHistory } = myScholarshipStatus;

  return (
    <div className="space-y-6">
      {/* Hero */}
      <div
        className="rounded-2xl p-6 text-white shadow-sm"
        style={{ background: "linear-gradient(135deg, #875E9E 0%, #6CAEBD 100%)" }}
      >
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">🎁</span>
              <h1 className="text-xl font-bold">المنح والحلول المالية</h1>
            </div>
            <p className="text-white/80 text-sm">جامعة سليمان الراجحي — {scholarshipStats.academicYear}</p>
          </div>
          <span
            className="text-xs font-bold px-3 py-1.5 rounded-full shrink-0"
            style={{ background: "rgba(255,255,255,0.2)" }}
          >
            ✅ لديك منحة نشطة
          </span>
        </div>

        {/* Stats row */}
        <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "منح كاملة",       value: `+${scholarshipStats.fullScholarships}`, icon: "🎓" },
            { label: "فئات جزئية",      value: `+${scholarshipStats.partialCategories}`, icon: "📊" },
            { label: "تغطية كاملة",     value: `${scholarshipStats.fullCoverage}%`,      icon: "💯" },
            { label: "حلول تمويلية",    value: scholarshipStats.fundingSolutions,         icon: "💡" },
          ].map((s) => (
            <div key={s.label} className="text-center bg-white/10 rounded-xl p-3">
              <p className="text-lg">{s.icon}</p>
              <p className="font-bold text-base">{s.value}</p>
              <p className="text-xs text-white/70 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Active scholarship card */}
      {myScholarshipStatus.hasActiveScholarship && (
        <div className="bg-white rounded-2xl shadow-sm border border-[#E8EDEF] overflow-hidden">
          <div className="px-5 py-4 border-b border-[#E8EDEF] flex items-center gap-2">
            <span>✨</span>
            <h2 className="font-bold text-[#1A2A30] text-sm">منحتك الحالية</h2>
          </div>
          <div className="p-5">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <p className="font-bold text-[#1F2937] text-base">{scholarship.title}</p>
                <p className="text-[#8FA4AB] text-sm mt-0.5">{scholarship.college} — {scholarship.year}</p>
                <div className="flex items-center gap-3 mt-3 flex-wrap">
                  <div className="text-center px-4 py-2 rounded-xl" style={{ background: "#E8F6F8" }}>
                    <p className="text-xs text-[#8FA4AB]">الرسوم الأصلية</p>
                    <p className="font-bold text-sm text-[#1A2A30]">{fmt(scholarship.feesOrigin)} ر</p>
                  </div>
                  <div className="text-center px-4 py-2 rounded-xl" style={{ background: "#DCFCE7" }}>
                    <p className="text-xs text-[#8FA4AB]">قيمة الخصم</p>
                    <p className="font-bold text-sm" style={{ color: "#16A34A" }}>{fmt(scholarship.discount)} ر</p>
                  </div>
                  <div className="text-center px-4 py-2 rounded-xl" style={{ background: "#F3EEF7" }}>
                    <p className="text-xs text-[#8FA4AB]">بعد المنحة</p>
                    <p className="font-bold text-sm" style={{ color: "#875E9E" }}>{fmt(scholarship.feesAfter)} ر</p>
                  </div>
                </div>
              </div>
              <div className="text-center shrink-0">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto"
                  style={{ background: "linear-gradient(135deg, #875E9E18, #6CAEBD18)" }}
                >
                  <span className="text-2xl font-bold" style={{ color: "#875E9E" }}>{scholarship.percentage}%</span>
                </div>
                <p className="text-xs text-[#8FA4AB] mt-1.5">نسبة المنحة</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick links */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {quickLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="bg-white rounded-2xl border border-[#E8EDEF] p-5 flex flex-col items-center gap-2 hover:shadow-md transition-all group text-center"
          >
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
              style={{ background: link.color + "18" }}
            >
              {link.icon}
            </div>
            <p className="font-bold text-sm text-[#1A2A30] group-hover:text-[#6A4A7E] transition-colors">
              {link.label}
            </p>
            <p className="text-xs text-[#8FA4AB]">{link.desc}</p>
          </Link>
        ))}
      </div>

      {/* Application journey */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#E8EDEF] p-5">
        <h2 className="font-bold text-[#1A2A30] text-sm mb-5 flex items-center gap-2">
          <span>🗺️</span> رحلة التقديم على المنحة
        </h2>
        <div className="flex flex-col sm:flex-row gap-0">
          {applicationJourney.map((step, idx) => (
            <div key={step.step} className="flex sm:flex-col items-start sm:items-center gap-3 sm:gap-2 flex-1 relative">
              {/* Connector line */}
              {idx < applicationJourney.length - 1 && (
                <div
                  className="hidden sm:block absolute top-5 start-1/2 w-full h-0.5"
                  style={{ background: "#E8EDEF", zIndex: 0 }}
                />
              )}
              {/* Circle */}
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0 relative z-10"
                style={{
                  background: step.actor === "الطالب"
                    ? "linear-gradient(135deg, #875E9E, #6CAEBD)"
                    : "linear-gradient(135deg, #6CAEBD, #8FA4AB)",
                }}
              >
                {step.step}
              </div>
              <div className="sm:text-center flex-1 sm:flex-initial">
                <p className="text-xs font-bold text-[#1F2937] leading-snug">{step.title}</p>
                <p className="text-xs text-[#9CA3AF] mt-0.5 leading-relaxed">{step.description}</p>
                <span
                  className="inline-block mt-1 text-xs px-2 py-0.5 rounded-full font-medium"
                  style={
                    step.actor === "الطالب"
                      ? { background: "#F3EEF7", color: "#875E9E" }
                      : { background: "#E8F6F8", color: "#4A8FA0" }
                  }
                >
                  {step.actor}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* General terms */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#E8EDEF] p-5">
        <h2 className="font-bold text-[#1A2A30] text-sm mb-4 flex items-center gap-2">
          <span>📋</span> الشروط العامة لسياسة المنح
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {generalTerms.map((term) => (
            <div
              key={term.title}
              className="flex items-start gap-3 p-4 rounded-xl border border-[#E8EDEF] hover:border-[#875E9E]/40 hover:bg-[#F3EEF7]/30 transition-all"
            >
              <span className="text-xl shrink-0">{term.icon}</span>
              <div>
                <p className="font-semibold text-[#1F2937] text-sm">{term.title}</p>
                <p className="text-[#6B7280] text-xs mt-1 leading-relaxed">{term.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* History */}
      {applicationHistory.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-[#E8EDEF] overflow-hidden">
          <div className="px-5 py-4 border-b border-[#E8EDEF] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span>📜</span>
              <h2 className="font-bold text-[#1A2A30] text-sm">سجل الطلبات</h2>
            </div>
            <Link href="/scholarships/track" className="text-xs font-medium hover:underline" style={{ color: "#875E9E" }}>
              عرض الكل
            </Link>
          </div>
          <div className="divide-y divide-[#F4F7F8]">
            {applicationHistory.map((h) => (
              <div key={h.id} className="px-5 py-3.5 flex items-center justify-between gap-3 hover:bg-[#F9FAFB]">
                <div>
                  <p className="font-semibold text-sm text-[#1F2937]">{h.type}</p>
                  <p className="text-xs text-[#9CA3AF] mt-0.5">{h.year} · {new Date(h.date).toLocaleDateString("ar-SA")}</p>
                </div>
                <span
                  className="text-xs font-semibold px-2.5 py-1 rounded-full"
                  style={{ background: "#DCFCE7", color: "#16A34A" }}
                >
                  ✅ مقبول
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
