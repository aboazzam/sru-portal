import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/dal";
import {
  financialSummary,
  financialAlerts,
  paymentsHistory,
  type AlertType,
} from "@/lib/mock/financial";

const ROLE_LABELS: Record<string, string> = {
  STUDENT:   "طالب",
  FACULTY:   "عضو هيئة التدريس",
  ADMIN:     "مدير النظام",
  ORGANIZER: "منظم فعاليات",
  SUBADMIN:  "مشرف النظام",
};

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  paid:     { label: "مسدد بالكامل", color: "#16A34A", bg: "#DCFCE7" },
  partial:  { label: "مسدد جزئياً",  color: "#D97706", bg: "#FEF3C7" },
  unpaid:   { label: "غير مسدد",     color: "#DC2626", bg: "#FEE2E2" },
  overdue:  { label: "متأخر",        color: "#991B1B", bg: "#FEE2E2" },
  pending:  { label: "معلق",         color: "#6B7280", bg: "#F3F4F6" },
};

const alertConfig: Record<AlertType, { icon: string; border: string; bg: string; text: string }> = {
  urgent:  { icon: "🔴", border: "#DC2626", bg: "#FEE2E2", text: "#DC2626" },
  warning: { icon: "🟡", border: "#D97706", bg: "#FEF3C7", text: "#D97706" },
  success: { icon: "✅", border: "#16A34A", bg: "#DCFCE7", text: "#16A34A" },
  info:    { icon: "ℹ️",  border: "#6CAEBD", bg: "#E8F6F8", text: "#4A8FA0" },
};

const quickLinks = [
  { href: "/financial/tuition",  label: "الرسوم الدراسية",     icon: "🎓", color: "#6CAEBD" },
  { href: "/financial/payments", label: "سجل المدفوعات",       icon: "💳", color: "#875E9E" },
  { href: "/financial/invoices", label: "الفواتير",             icon: "📄", color: "#8FA4AB" },
  { href: "/financial/requests", label: "طلب مالي",            icon: "📝", color: "#6CAEBD" },
];

function fmt(n: number) {
  return n.toLocaleString("ar-SA");
}

export default async function FinancialDashboard() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const { totalFees, paid, remaining, dueDate, status, currency } = financialSummary;
  const paidPct = Math.round((paid / totalFees) * 100);
  const cfg = statusConfig[status];
  const roleLabel = ROLE_LABELS[user.role] ?? "";
  const dueDateFmt = new Date(dueDate).toLocaleDateString("ar-SA", {
    day: "numeric", month: "long", year: "numeric",
  });

  return (
    <div className="space-y-6">
      {/* Welcome + summary card */}
      <div
        className="rounded-2xl p-6 text-white shadow-sm"
        style={{ background: "linear-gradient(135deg, #6CAEBD 0%, #875E9E 100%)" }}
      >
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <p className="text-white/70 text-xs mb-1">{roleLabel} — جامعة سليمان الراجحي</p>
            <h1 className="text-xl font-bold">مرحباً، {user.name.split(" ")[0]} 👋</h1>
            <p className="text-white/80 text-sm mt-0.5">{user.email}</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <span
              className="text-xs font-bold px-3 py-1.5 rounded-full shrink-0"
              style={{ background: "rgba(255,255,255,0.2)", color: "#fff" }}
            >
              {cfg.label}
            </span>
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-xl font-bold">
              {user.name.charAt(0)}
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-5">
          <div className="flex justify-between text-xs text-white/80 mb-1.5">
            <span>المدفوع: {fmt(paid)} {currency}</span>
            <span>المتبقي: {fmt(remaining)} {currency}</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2.5">
            <div
              className="h-2.5 rounded-full bg-white transition-all"
              style={{ width: `${paidPct}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-white/70 mt-1.5">
            <span>{paidPct}% مسدد</span>
            <span>الإجمالي: {fmt(totalFees)} {currency}</span>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2 text-xs text-white/70">
          <span>⏰</span>
          <span>آخر موعد للسداد: {dueDateFmt}</span>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "إجمالي الرسوم",  value: `${fmt(totalFees)} ر`,  icon: "💰", color: "#6CAEBD" },
          { label: "المبلغ المدفوع", value: `${fmt(paid)} ر`,       icon: "✅", color: "#16A34A" },
          { label: "المبلغ المتبقي", value: `${fmt(remaining)} ر`,  icon: "⏳", color: "#D97706" },
          { label: "نسبة السداد",    value: `${paidPct}%`,           icon: "📊", color: "#875E9E" },
        ].map((s) => (
          <div
            key={s.label}
            className="bg-white rounded-xl border border-[#E8EDEF] p-4 hover:shadow-sm transition-shadow"
          >
            <div className="text-2xl mb-1">{s.icon}</div>
            <p className="text-lg font-bold" style={{ color: s.color }}>{s.value}</p>
            <p className="text-xs text-[#8FA4AB] mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Alerts */}
      {financialAlerts.length > 0 && (
        <div className="space-y-3">
          <h2 className="font-bold text-[#1A2A30] text-sm flex items-center gap-2">
            <span>🔔</span> التنبيهات المالية
          </h2>
          {financialAlerts.map((alert) => {
            const ac = alertConfig[alert.type];
            return (
              <div
                key={alert.id}
                className="bg-white rounded-xl border overflow-hidden flex items-start gap-4 px-5 py-4 shadow-sm"
                style={{ borderColor: ac.border, borderRightWidth: "4px" }}
              >
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-lg shrink-0"
                  style={{ background: ac.bg }}
                >
                  {ac.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-[#1F2937]">{alert.title}</p>
                  <p className="text-xs text-[#6B7280] mt-0.5">{alert.detail}</p>
                </div>
                {alert.daysLeft != null && (
                  <span
                    className="shrink-0 text-xs font-bold px-2 py-1 rounded-full"
                    style={{ background: ac.bg, color: ac.text }}
                  >
                    بعد {alert.daysLeft} يوم
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick links */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#E8EDEF] p-5">
          <h2 className="font-bold text-[#1A2A30] text-sm mb-4 flex items-center gap-2">
            <span>⚡</span> روابط سريعة
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {quickLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex flex-col items-center gap-2 p-4 rounded-xl border border-[#E8EDEF] hover:shadow-sm transition-all group text-center"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                  style={{ background: link.color + "18" }}
                >
                  {link.icon}
                </div>
                <span className="text-xs font-medium text-[#506570] group-hover:text-[#4A8FA0] transition-colors">
                  {link.label}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Last payments */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#E8EDEF] overflow-hidden">
          <div className="px-5 py-4 border-b border-[#E8EDEF] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span>💳</span>
              <h2 className="font-bold text-[#1A2A30] text-sm">آخر المدفوعات</h2>
            </div>
            <Link
              href="/financial/payments"
              className="text-xs font-medium hover:underline"
              style={{ color: "#6CAEBD" }}
            >
              عرض الكل
            </Link>
          </div>
          <div className="divide-y divide-[#F4F7F8]">
            {paymentsHistory.slice(0, 4).map((p) => (
              <div
                key={p.id}
                className="px-5 py-3 flex items-center justify-between gap-3 hover:bg-[#F4F7F8] transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-sm shrink-0"
                    style={{ background: "#E8F6F8" }}
                  >
                    💳
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-[#1F2937] truncate">{p.method}</p>
                    <p className="text-xs text-[#9CA3AF]">
                      {new Date(p.date).toLocaleDateString("ar-SA")}
                    </p>
                  </div>
                </div>
                <p className="font-bold text-sm shrink-0" style={{ color: "#16A34A" }}>
                  {fmt(p.amount)} ر
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
