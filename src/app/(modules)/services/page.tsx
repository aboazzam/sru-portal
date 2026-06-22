import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/dal";
import { prisma } from "@/lib/db";

const statusConfig: Record<string, { label: string; bg: string; color: string; icon: string }> = {
  PENDING:  { label: "قيد المراجعة", bg: "#FEF3C7", color: "#D97706", icon: "⏳" },
  APPROVED: { label: "مقبول",        bg: "#DCFCE7", color: "#16A34A", icon: "✅" },
  REJECTED: { label: "مرفوض",        bg: "#FEE2E2", color: "#DC2626", icon: "❌" },
};

const serviceIcons = ["📋", "📄", "🎓", "📝", "🏠", "🚌", "🏥", "📚", "💼", "🎯"];

const quickLinks = [
  { href: "/services/catalog",     label: "كتالوج الخدمات",   icon: "📋", desc: "تصفّح جميع الخدمات المتاحة" },
  { href: "/services/my-requests", label: "طلباتي",            icon: "📄", desc: "تابع حالة طلباتك المقدَّمة" },
];

export default async function ServicesDashboard() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const [totalServices, myApplications] = await Promise.all([
    prisma.studentService.count(),
    prisma.serviceApplications.findMany({
      where: { userId: user.id },
      include: { service: { select: { id: true, title: true, description: true } } },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const pendingCount  = myApplications.filter((a) => a.status === "PENDING").length;
  const approvedCount = myApplications.filter((a) => a.status === "APPROVED").length;
  const rejectedCount = myApplications.filter((a) => a.status === "REJECTED").length;

  const recentApplications = myApplications.slice(0, 5);

  // Featured services (first 4 from DB)
  const featuredServices = await prisma.studentService.findMany({
    take: 4,
    orderBy: { createdAt: "asc" },
    select: { id: true, title: true, description: true },
  });

  return (
    <div className="space-y-6">

      {/* Hero */}
      <div
        className="rounded-2xl p-6 text-white shadow-sm"
        style={{ background: "linear-gradient(135deg, #2C1650 0%, #6B46C1 100%)" }}
      >
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <p className="text-white/70 text-xs mb-1">خدمات الطلاب — جامعة سليمان الراجحي</p>
            <h1 className="text-xl font-bold">مرحباً، {user.name.split(" ")[0]} 👋</h1>
            <p className="text-white/80 text-sm mt-0.5">{user.email}</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-xl font-bold shrink-0">
            {user.name.charAt(0)}
          </div>
        </div>

        {/* Progress hint */}
        <div className="mt-5 flex items-center justify-between gap-4 flex-wrap">
          <p className="text-white/70 text-sm">
            {myApplications.length === 0
              ? "لم تُقدّم أي طلب بعد — تصفّح الخدمات المتاحة"
              : `لديك ${myApplications.length} طلب · ${pendingCount} قيد المراجعة`}
          </p>
          <Link
            href="/services/catalog"
            className="text-xs font-bold px-4 py-2 rounded-xl text-white transition-all hover:bg-white/20"
            style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.3)" }}
          >
            تصفّح الخدمات ←
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "خدمات متاحة",     value: String(totalServices),       icon: "🛎️", color: "#059669" },
          { label: "قيد المراجعة",    value: String(pendingCount),         icon: "⏳", color: "#D97706" },
          { label: "مقبولة",          value: String(approvedCount),        icon: "✅", color: "#16A34A" },
          { label: "إجمالي طلباتي",   value: String(myApplications.length), icon: "📄", color: "#4A8FA0" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-[#E8EDEF] p-4 hover:shadow-sm transition-shadow">
            <div className="text-2xl mb-1">{s.icon}</div>
            <p className="text-lg font-bold" style={{ color: s.color }}>{s.value}</p>
            <p className="text-xs text-[#8FA4AB] mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Quick links + recent applications */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Quick links */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#E8EDEF] p-5">
          <h2 className="font-bold text-[#1A2A30] text-sm mb-4 flex items-center gap-2">
            <span>⚡</span> روابط سريعة
          </h2>
          <div className="space-y-3">
            {quickLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-4 p-4 rounded-xl border border-[#E8EDEF] hover:shadow-sm hover:border-[#A7F3D0] transition-all group"
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0" style={{ background: "#ECFDF5" }}>
                  {link.icon}
                </div>
                <div>
                  <p className="font-semibold text-sm text-[#1F2937] group-hover:text-[#059669] transition-colors">{link.label}</p>
                  <p className="text-xs text-[#9CA3AF] mt-0.5">{link.desc}</p>
                </div>
                <span className="ms-auto text-[#059669] text-sm opacity-0 group-hover:opacity-100 transition-opacity">←</span>
              </Link>
            ))}
          </div>

          {/* Featured services */}
          {featuredServices.length > 0 && (
            <div className="mt-5">
              <h3 className="text-xs font-bold text-[#506570] mb-3">خدمات مميزة</h3>
              <div className="grid grid-cols-2 gap-2">
                {featuredServices.map((svc, i) => (
                  <Link
                    key={svc.id}
                    href="/services/catalog"
                    className="flex items-center gap-2 p-2.5 rounded-xl bg-[#F9FAFB] hover:bg-[#ECFDF5] border border-[#E8EDEF] hover:border-[#A7F3D0] transition-all group"
                  >
                    <span className="text-base">{serviceIcons[i % serviceIcons.length]}</span>
                    <p className="text-xs font-medium text-[#374151] group-hover:text-[#065F46] leading-tight line-clamp-2">{svc.title}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Recent applications */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#E8EDEF] overflow-hidden">
          <div className="px-5 py-4 border-b border-[#E8EDEF] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span>📋</span>
              <h2 className="font-bold text-[#1A2A30] text-sm">آخر طلباتي</h2>
            </div>
            {myApplications.length > 0 && (
              <Link href="/services/my-requests" className="text-xs font-medium hover:underline" style={{ color: "#059669" }}>
                عرض الكل
              </Link>
            )}
          </div>

          {recentApplications.length === 0 ? (
            <div className="px-5 py-12 text-center">
              <p className="text-3xl mb-2">📭</p>
              <p className="text-sm text-[#8FA4AB]">لا توجد طلبات بعد</p>
              <Link
                href="/services/catalog"
                className="inline-block mt-3 text-xs font-semibold px-4 py-2 rounded-xl text-white"
                style={{ background: "#059669" }}
              >
                تقدّم لخدمة الآن
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-[#F4F7F8]">
              {recentApplications.map((app) => {
                const sc = statusConfig[app.status] ?? statusConfig.PENDING;
                return (
                  <div key={app.id} className="px-5 py-4 hover:bg-[#F9FAFB] transition-colors">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-xl bg-[#ECFDF5] flex items-center justify-center text-base shrink-0">
                          📋
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-sm text-[#1F2937] leading-snug">{app.service.title}</p>
                          <p className="text-xs text-[#9CA3AF] mt-0.5">
                            {app.createdAt.toLocaleDateString("ar-SA", { day: "numeric", month: "long", year: "numeric" })}
                          </p>
                        </div>
                      </div>
                      <span className="shrink-0 text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: sc.bg, color: sc.color }}>
                        {sc.icon} {sc.label}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>

      {/* Info banner */}
      <div
        className="rounded-2xl px-6 py-5 flex items-start gap-4"
        style={{ background: "linear-gradient(to left, #ECFDF5, #D1FAE5)", border: "1px solid #6EE7B7" }}
      >
        <span className="text-2xl shrink-0">ℹ️</span>
        <div>
          <p className="font-bold text-[#065F46] text-sm mb-1">كيف تعمل خدمات الطلاب؟</p>
          <p className="text-xs text-[#047857] leading-relaxed">
            تصفّح الكتالوج واختر الخدمة المناسبة · قدّم طلبك بنقرة واحدة · تابع حالة طلبك في صفحة "طلباتي" · ستصلك إشعارات عند الموافقة أو رفض الطلب.
          </p>
        </div>
      </div>

    </div>
  );
}
