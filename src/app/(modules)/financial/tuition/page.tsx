import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/dal";
import { tuitionDetails, financialSummary } from "@/lib/mock/financial";

const statusConfig = {
  paid:    { label: "مسدد",          color: "#16A34A", bg: "#DCFCE7", icon: "✅" },
  partial: { label: "جزئي",          color: "#D97706", bg: "#FEF3C7", icon: "🔸" },
  unpaid:  { label: "غير مسدد",      color: "#DC2626", bg: "#FEE2E2", icon: "❌" },
  overdue: { label: "متأخر",         color: "#991B1B", bg: "#FEE2E2", icon: "⚠️" },
  pending: { label: "معلق",          color: "#6B7280", bg: "#F3F4F6", icon: "⏳" },
};

function fmt(n: number) {
  return n.toLocaleString("ar-SA");
}

export default async function TuitionPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const { totalFees, paid, remaining, dueDate, currency } = financialSummary;
  const paidPct = Math.round((paid / totalFees) * 100);

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-[#8FA4AB]">
        <Link href="/financial" className="hover:text-[#6CAEBD] transition-colors">الخدمات المالية</Link>
        <span>/</span>
        <span className="text-[#1A2A30] font-medium">الرسوم الدراسية</span>
      </div>

      {/* Hero */}
      <div
        className="rounded-2xl p-6 text-white shadow-sm"
        style={{ background: "linear-gradient(135deg, #6CAEBD 0%, #8FA4AB 100%)" }}
      >
        <div className="flex items-center gap-3 mb-4">
          <span className="text-4xl">🎓</span>
          <div>
            <h1 className="text-xl font-bold">الرسوم الدراسية</h1>
            <p className="text-white/80 text-sm">
              {user.name} — الفصل الثاني 1446-1447
            </p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 mt-2">
          <div className="text-center">
            <p className="text-xs text-white/70">إجمالي الرسوم</p>
            <p className="font-bold text-base">{fmt(totalFees)}</p>
            <p className="text-xs text-white/60">{currency}</p>
          </div>
          <div className="text-center border-x border-white/20">
            <p className="text-xs text-white/70">المدفوع</p>
            <p className="font-bold text-base">{fmt(paid)}</p>
            <p className="text-xs text-white/60">{currency}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-white/70">المتبقي</p>
            <p className="font-bold text-base">{fmt(remaining)}</p>
            <p className="text-xs text-white/60">{currency}</p>
          </div>
        </div>
        <div className="mt-4">
          <div className="w-full bg-white/20 rounded-full h-2">
            <div
              className="h-2 rounded-full bg-white"
              style={{ width: `${paidPct}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-white/70 mt-1">
            <span>{paidPct}% مسدد</span>
            <span>
              آخر موعد: {new Date(dueDate).toLocaleDateString("ar-SA", { day: "numeric", month: "long" })}
            </span>
          </div>
        </div>
      </div>

      {/* Fee items table */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#E8EDEF] overflow-hidden">
        <div className="px-5 py-4 border-b border-[#E8EDEF] flex items-center gap-2">
          <span>📋</span>
          <h2 className="font-bold text-[#1A2A30] text-sm">تفاصيل بنود الرسوم</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[#F4F7F8]">
              <tr>
                <th className="px-5 py-3 text-start text-xs font-bold text-[#506570]">البند</th>
                <th className="px-5 py-3 text-end text-xs font-bold text-[#506570]">المبلغ</th>
                <th className="px-5 py-3 text-end text-xs font-bold text-[#506570]">المدفوع</th>
                <th className="px-5 py-3 text-end text-xs font-bold text-[#506570]">المتبقي</th>
                <th className="px-5 py-3 text-center text-xs font-bold text-[#506570]">الحالة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F4F7F8]">
              {tuitionDetails.map((row) => {
                const cfg = statusConfig[row.status] ?? statusConfig.pending;
                return (
                  <tr key={row.id} className="hover:bg-[#F9FAFB] transition-colors">
                    <td className="px-5 py-3.5 font-medium text-[#1F2937]">{row.item}</td>
                    <td className="px-5 py-3.5 text-end text-[#374151] font-semibold">{fmt(row.amount)}</td>
                    <td className="px-5 py-3.5 text-end font-semibold" style={{ color: "#16A34A" }}>
                      {fmt(row.paid)}
                    </td>
                    <td className="px-5 py-3.5 text-end font-semibold" style={{ color: row.remaining > 0 ? "#D97706" : "#16A34A" }}>
                      {fmt(row.remaining)}
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
            <tfoot className="bg-[#F4F7F8]">
              <tr>
                <td className="px-5 py-3.5 font-bold text-[#1A2A30]">الإجمالي</td>
                <td className="px-5 py-3.5 text-end font-bold text-[#1A2A30]">{fmt(totalFees)}</td>
                <td className="px-5 py-3.5 text-end font-bold" style={{ color: "#16A34A" }}>{fmt(paid)}</td>
                <td className="px-5 py-3.5 text-end font-bold" style={{ color: "#D97706" }}>{fmt(remaining)}</td>
                <td />
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* CTA */}
      <div className="flex flex-wrap gap-3">
        <Link
          href="/financial/requests"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
          style={{ background: "linear-gradient(to left, #6CAEBD, #4A8FA0)" }}
        >
          📝 تقديم طلب مالي
        </Link>
        <Link
          href="/financial/payments"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold border border-[#C8E6EC] text-[#4A8FA0] hover:bg-[#E8F6F8] transition-colors"
        >
          💳 عرض المدفوعات
        </Link>
      </div>
    </div>
  );
}
