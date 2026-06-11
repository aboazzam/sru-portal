import Link from "next/link";
import { myScholarshipStatus } from "@/lib/mock/scholarships";

function fmt(n: number) { return n.toLocaleString("ar-SA"); }

const statusConfig: Record<string, { label: string; color: string; bg: string; icon: string }> = {
  approved:  { label: "مقبول",    color: "#16A34A", bg: "#DCFCE7", icon: "✅" },
  rejected:  { label: "مرفوض",   color: "#DC2626", bg: "#FEE2E2", icon: "❌" },
  pending:   { label: "قيد المراجعة", color: "#D97706", bg: "#FEF3C7", icon: "⏳" },
  completed: { label: "مكتمل",   color: "#2563EB", bg: "#DBEAFE", icon: "🏁" },
  active:    { label: "نشطة",    color: "#16A34A", bg: "#DCFCE7", icon: "✨" },
};

export default function TrackPage() {
  const { hasActiveScholarship, scholarship, applicationHistory } = myScholarshipStatus;

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-[#8FA4AB]">
        <Link href="/scholarships" className="hover:text-[#875E9E] transition-colors">المنح والحلول المالية</Link>
        <span>/</span>
        <span className="text-[#1A2A30] font-medium">تتبع الطلب</span>
      </div>

      {/* Hero */}
      <div
        className="rounded-2xl p-6 text-white shadow-sm"
        style={{ background: "linear-gradient(135deg, #875E9E 0%, #6CAEBD 100%)" }}
      >
        <div className="flex items-center gap-3">
          <span className="text-4xl">🔍</span>
          <div>
            <h1 className="text-xl font-bold">تتبع حالة الطلب</h1>
            <p className="text-white/80 text-sm mt-0.5">اطلع على حالة منحتك الحالية وسجل طلباتك السابقة</p>
          </div>
        </div>
      </div>

      {/* Active scholarship status */}
      {hasActiveScholarship && (
        <div className="bg-white rounded-2xl shadow-sm border border-[#E8EDEF] overflow-hidden">
          <div
            className="px-5 py-3 flex items-center gap-2"
            style={{ background: "linear-gradient(to left, #875E9E08, #6CAEBD08)", borderBottom: "1px solid #E8EDEF" }}
          >
            <span>✨</span>
            <h2 className="font-bold text-[#1A2A30] text-sm">المنحة النشطة الحالية</h2>
            <span
              className="ms-auto text-xs font-semibold px-2.5 py-1 rounded-full"
              style={{ background: "#DCFCE7", color: "#16A34A" }}
            >
              ✅ نشطة
            </span>
          </div>
          <div className="p-5">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <h3 className="font-bold text-[#1F2937] text-base">{scholarship.title}</h3>
                <p className="text-[#8FA4AB] text-sm mt-0.5">{scholarship.college} — {scholarship.year}</p>
                <p className="text-xs text-[#9CA3AF] mt-1">
                  منحة {scholarship.type === "partial" ? "جزئية" : "كاملة"}
                </p>
              </div>
              <div
                className="w-16 h-16 rounded-2xl flex flex-col items-center justify-center shrink-0"
                style={{ background: "linear-gradient(135deg, #875E9E18, #6CAEBD18)" }}
              >
                <span className="font-bold text-xl" style={{ color: "#875E9E" }}>{scholarship.percentage}%</span>
                <span className="text-xs text-[#8FA4AB]">خصم</span>
              </div>
            </div>

            {/* Financial breakdown */}
            <div className="mt-4 grid grid-cols-3 gap-3">
              <div className="rounded-xl p-3 text-center" style={{ background: "#F4F7F8" }}>
                <p className="text-xs text-[#8FA4AB]">الرسوم الأصلية</p>
                <p className="font-bold text-sm text-[#1A2A30] mt-0.5">{fmt(scholarship.feesOrigin)} ر</p>
              </div>
              <div className="rounded-xl p-3 text-center" style={{ background: "#DCFCE7" }}>
                <p className="text-xs text-[#8FA4AB]">قيمة الخصم</p>
                <p className="font-bold text-sm mt-0.5" style={{ color: "#16A34A" }}>{fmt(scholarship.discount)} ر</p>
              </div>
              <div className="rounded-xl p-3 text-center" style={{ background: "#F3EEF7" }}>
                <p className="text-xs text-[#8FA4AB]">بعد المنحة</p>
                <p className="font-bold text-sm mt-0.5" style={{ color: "#875E9E" }}>{fmt(scholarship.feesAfter)} ر</p>
              </div>
            </div>

            {/* Progress bar */}
            <div className="mt-4">
              <div className="flex justify-between text-xs text-[#8FA4AB] mb-1">
                <span>الخصم المطبَّق</span>
                <span>{scholarship.percentage}%</span>
              </div>
              <div className="w-full bg-[#E8EDEF] rounded-full h-2">
                <div
                  className="h-2 rounded-full"
                  style={{ width: `${scholarship.percentage}%`, background: "linear-gradient(to left, #875E9E, #6CAEBD)" }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* No active scholarship */}
      {!hasActiveScholarship && (
        <div className="bg-white rounded-2xl border border-[#E8EDEF] p-12 text-center">
          <p className="text-4xl mb-3">📭</p>
          <h3 className="font-bold text-[#1A2A30] text-base">لا توجد منحة نشطة حالياً</h3>
          <p className="text-[#8FA4AB] text-sm mt-1 mb-4">يمكنك التقديم على إحدى المنح المتاحة</p>
          <Link
            href="/scholarships/apply"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
            style={{ background: "linear-gradient(to left, #875E9E, #6A4A7E)" }}
          >
            📝 تقديم طلب الآن
          </Link>
        </div>
      )}

      {/* Application history */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#E8EDEF] overflow-hidden">
        <div className="px-5 py-4 border-b border-[#E8EDEF] flex items-center gap-2">
          <span>📜</span>
          <h2 className="font-bold text-[#1A2A30] text-sm">سجل الطلبات السابقة</h2>
        </div>

        {applicationHistory.length === 0 ? (
          <div className="p-10 text-center">
            <p className="text-[#8FA4AB]">لا يوجد سجل طلبات سابقة</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#F4F7F8]">
                <tr>
                  <th className="px-5 py-3 text-start text-xs font-bold text-[#506570]">رقم الطلب</th>
                  <th className="px-5 py-3 text-start text-xs font-bold text-[#506570]">نوع المنحة</th>
                  <th className="px-5 py-3 text-start text-xs font-bold text-[#506570]">العام</th>
                  <th className="px-5 py-3 text-start text-xs font-bold text-[#506570]">تاريخ التقديم</th>
                  <th className="px-5 py-3 text-center text-xs font-bold text-[#506570]">الحالة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F4F7F8]">
                {applicationHistory.map((h) => {
                  const cfg = statusConfig[h.status] ?? statusConfig.pending;
                  return (
                    <tr key={h.id} className="hover:bg-[#F9FAFB] transition-colors">
                      <td className="px-5 py-3.5 font-mono text-xs text-[#6B7280]">{h.id}</td>
                      <td className="px-5 py-3.5 font-semibold text-[#1F2937]">{h.type}</td>
                      <td className="px-5 py-3.5 text-[#506570]">{h.year}</td>
                      <td className="px-5 py-3.5 text-[#6B7280]">
                        {new Date(h.date).toLocaleDateString("ar-SA", {
                          day: "numeric", month: "long", year: "numeric",
                        })}
                      </td>
                      <td className="px-5 py-3.5 text-center">
                        <span
                          className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full"
                          style={{ color: cfg.color, background: cfg.bg }}
                        >
                          {cfg.icon} {cfg.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Apply again CTA */}
      <div
        className="rounded-2xl p-5 flex items-center justify-between gap-4 flex-wrap"
        style={{ background: "linear-gradient(to left, #875E9E18, #6CAEBD18)", border: "1px solid #D8C8E8" }}
      >
        <div>
          <p className="font-bold text-[#1A2A30] text-sm">هل تريد التقديم على منحة جديدة؟</p>
          <p className="text-xs text-[#6B7280] mt-0.5">تصفّح المنح المتاحة وقدّم طلبك للعام القادم</p>
        </div>
        <Link
          href="/scholarships/apply"
          className="shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
          style={{ background: "linear-gradient(to left, #875E9E, #6A4A7E)" }}
        >
          📝 تقديم طلب جديد
        </Link>
      </div>
    </div>
  );
}
