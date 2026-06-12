import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/dal";
import { graduationRequirements, clearanceSteps, type RequirementStatus } from "@/lib/mock/graduates";

const statusConfig: Record<RequirementStatus, { label: string; color: string; bg: string; icon: string }> = {
  completed:   { label: "مكتمل",   color: "#16A34A", bg: "#DCFCE7", icon: "✅" },
  in_progress: { label: "جارٍ",    color: "#D97706", bg: "#FEF3C7", icon: "🔄" },
  pending:     { label: "معلّق",   color: "#DC2626", bg: "#FEE2E2", icon: "⏳" },
  waived:      { label: "مُعفى",   color: "#6B7280", bg: "#F3F4F6", icon: "➖" },
};

const categories = ["الكل", "أكاديمي", "مالي", "إداري", "تدريب"];

export default async function RequirementsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const { category } = await searchParams;
  const filtered = (!category || category === "الكل")
    ? graduationRequirements
    : graduationRequirements.filter((r) => r.category === category);

  const completed  = graduationRequirements.filter((r) => r.status === "completed" || r.status === "waived").length;
  const total      = graduationRequirements.length;
  const overallPct = Math.round((completed / total) * 100);

  const clearanceDone  = clearanceSteps.filter((s) => s.signed).length;
  const clearanceTotal = clearanceSteps.length;

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Link href="/graduates" className="hover:text-rose-600 transition-colors">الخريجون</Link>
        <span>/</span>
        <span className="text-gray-800 font-medium">متطلبات التخرج</span>
      </div>

      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">متطلبات التخرج</h1>
          <p className="text-gray-500 text-sm mt-0.5">{completed} مكتملة من أصل {total} متطلب</p>
        </div>
        <div
          className="flex items-center gap-3 px-4 py-2 rounded-xl text-white text-sm font-bold"
          style={{ background: overallPct === 100 ? "#16A34A" : overallPct >= 70 ? "#D97706" : "#DC2626" }}
        >
          <span>{overallPct}%</span>
          <span className="text-xs font-normal opacity-80">جاهزية التخرج</span>
        </div>
      </div>

      {/* Overall progress */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span className="font-medium">التقدم الإجمالي</span>
          <span>{completed} / {total}</span>
        </div>
        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all"
            style={{ width: `${overallPct}%`, background: overallPct === 100 ? "#16A34A" : overallPct >= 70 ? "#D97706" : "#DC2626" }}
          />
        </div>
        <div className="flex gap-4 mt-3 flex-wrap">
          {(["completed", "in_progress", "pending", "waived"] as RequirementStatus[]).map((s) => {
            const count = graduationRequirements.filter((r) => r.status === s).length;
            const cfg = statusConfig[s];
            return (
              <div key={s} className="flex items-center gap-1.5 text-xs">
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: cfg.color }} />
                <span className="text-gray-500">{cfg.label}:</span>
                <span className="font-semibold" style={{ color: cfg.color }}>{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Category filters */}
      <div className="flex gap-2 flex-wrap">
        {categories.map((cat) => {
          const href = cat === "الكل" ? "/graduates/requirements" : `/graduates/requirements?category=${cat}`;
          const isActive = (!category && cat === "الكل") || category === cat;
          return (
            <Link
              key={cat}
              href={href}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                isActive ? "bg-rose-600 text-white shadow-sm" : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
              }`}
            >
              {cat}
            </Link>
          );
        })}
      </div>

      {/* Requirements list */}
      <div className="space-y-3">
        {filtered.map((req) => {
          const cfg = statusConfig[req.status];
          return (
            <div key={req.id} className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-sm transition-shadow">
              <div className="flex items-start gap-4">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0"
                  style={{ background: cfg.bg }}
                >
                  {cfg.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div>
                      <p className="font-semibold text-gray-800">{req.title}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{req.detail}</p>
                      <span className="inline-block mt-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">
                        {req.category}
                      </span>
                    </div>
                    <span
                      className="shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full"
                      style={{ color: cfg.color, background: cfg.bg }}
                    >
                      {cfg.label}
                    </span>
                  </div>
                  {req.status !== "waived" && (
                    <div className="mt-3">
                      <div className="flex justify-between text-xs text-gray-400 mb-1">
                        <span>التقدم</span>
                        <span>{req.progress}%</span>
                      </div>
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{ width: `${req.progress}%`, background: cfg.color }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Clearance stepper */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span>🏛️</span>
            <h2 className="font-semibold text-gray-800 text-sm">تفاصيل إخلاء الطرف</h2>
          </div>
          <span className="text-xs text-gray-500">{clearanceDone} / {clearanceTotal} أقسام</span>
        </div>
        <div className="divide-y divide-gray-50">
          {clearanceSteps.map((step, idx) => (
            <div key={idx} className="px-5 py-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                  step.signed ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"
                }`}>
                  {step.signed ? "✓" : idx + 1}
                </div>
                <p className="text-sm text-gray-700">{step.dept}</p>
              </div>
              <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                step.signed ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
              }`}>
                {step.signed ? "موقّع" : "في الانتظار"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
