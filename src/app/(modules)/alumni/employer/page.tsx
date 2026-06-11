import Link from "next/link";
import { employerDashboardData, employerJobPostings } from "@/lib/mock/alumni";

const statusBadge: Record<string, { label: string; color: string; bg: string }> = {
  new:       { label: "جديد",      color: "#6CAEBD", bg: "#E8F6F8" },
  reviewed:  { label: "مراجَع",    color: "#D97706", bg: "#FEF3C7" },
  interview: { label: "مقابلة",    color: "#875E9E", bg: "#F3EEF7" },
  accepted:  { label: "مقبول",     color: "#16A34A", bg: "#DCFCE7" },
  rejected:  { label: "مرفوض",     color: "#DC2626", bg: "#FEE2E2" },
};

const jobStatusBadge: Record<string, { label: string; color: string; bg: string }> = {
  active: { label: "نشطة", color: "#16A34A", bg: "#DCFCE7" },
  closed: { label: "مغلقة", color: "#6B7280", bg: "#F3F4F6" },
  draft:  { label: "مسودة", color: "#D97706", bg: "#FEF3C7" },
};

export default function EmployerDashboardPage() {
  const { stats, recentApplicants } = employerDashboardData;

  return (
    <div className="space-y-6">

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-[#8FA4AB]">
        <Link href="/alumni" className="hover:text-[#6CAEBD] transition-colors">بوابة الخريجين</Link>
        <span>/</span>
        <span className="text-[#1A2A30] font-medium">لوحة الشركة</span>
      </div>

      {/* Hero */}
      <div
        className="rounded-2xl p-6 text-white shadow-sm"
        style={{ background: "linear-gradient(135deg, #6CAEBD 0%, #4A8FA0 100%)" }}
      >
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <p className="text-white/70 text-xs mb-1">بوابة التوظيف</p>
            <h1 className="text-xl font-bold">مرحباً بك في بوابة الشركات 🏢</h1>
            <p className="text-white/80 text-sm mt-0.5">
              وصّل شركتك بأفضل خريجي جامعة سليمان الراجحي
            </p>
          </div>
          <Link
            href="/alumni/employer/post-job"
            className="shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-opacity hover:opacity-90"
            style={{ background: "rgba(255,255,255,0.2)", color: "#fff" }}
          >
            + نشر وظيفة جديدة
          </Link>
        </div>
      </div>

      {/* 5 Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {stats.map((s) => (
          <div
            key={s.id}
            className="bg-white rounded-xl border border-[#E8EDEF] p-4 text-center hover:shadow-sm transition-shadow"
          >
            <div className="text-2xl mb-1">{s.icon}</div>
            <p className="text-xl font-bold" style={{ color: s.color }}>{s.value}</p>
            <p className="text-xs text-[#8FA4AB] mt-0.5 leading-tight">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Active jobs */}
        <div className="bg-white rounded-2xl border border-[#E8EDEF] shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-[#E8EDEF] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span>💼</span>
              <h2 className="font-bold text-[#1A2A30] text-sm">الوظائف المنشورة</h2>
            </div>
            <Link href="/alumni/employer/post-job" className="text-xs font-medium hover:underline" style={{ color: "#6CAEBD" }}>
              + نشر جديد
            </Link>
          </div>
          <div className="divide-y divide-[#F4F7F8]">
            {employerJobPostings.map((job) => {
              const jb = jobStatusBadge[job.status];
              return (
                <div key={job.id} className="px-5 py-3.5 hover:bg-[#F9FAFB] transition-colors">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="font-semibold text-sm text-[#1F2937] truncate">{job.title}</p>
                      <p className="text-xs text-[#8FA4AB] mt-0.5">{job.department} · {job.location}</p>
                    </div>
                    <span
                      className="shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full"
                      style={{ background: jb.bg, color: jb.color }}
                    >
                      {jb.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-2 text-xs text-[#9CA3AF]">
                    <span>👥 {job.applicants} متقدم</span>
                    <span>📅 حتى {new Date(job.deadline).toLocaleDateString("ar-SA", { day: "numeric", month: "short" })}</span>
                    <Link href="/alumni/employer/applicants" className="ms-auto font-semibold" style={{ color: "#6CAEBD" }}>
                      عرض ←
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent applicants */}
        <div className="bg-white rounded-2xl border border-[#E8EDEF] shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-[#E8EDEF] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span>👥</span>
              <h2 className="font-bold text-[#1A2A30] text-sm">آخر المتقدمين</h2>
            </div>
            <Link href="/alumni/employer/applicants" className="text-xs font-medium hover:underline" style={{ color: "#6CAEBD" }}>
              عرض الكل
            </Link>
          </div>
          <div className="divide-y divide-[#F4F7F8]">
            {recentApplicants.map((app) => {
              const sb = statusBadge[app.status];
              return (
                <div key={app.id} className="px-5 py-3.5 flex items-center gap-3 hover:bg-[#F9FAFB] transition-colors">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold text-white shrink-0"
                    style={{ background: `linear-gradient(135deg, ${app.color}, ${app.color}99)` }}
                  >
                    {app.initial}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-[#1F2937] truncate">{app.name}</p>
                    <p className="text-xs text-[#9CA3AF]">{app.major} · معدل {app.gpa}</p>
                  </div>
                  <span
                    className="shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full"
                    style={{ background: sb.bg, color: sb.color }}
                  >
                    {sb.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { href: "/alumni/employer/post-job",   label: "نشر وظيفة جديدة",        icon: "📝", color: "#6CAEBD" },
          { href: "/alumni/employer/applicants", label: "إدارة المتقدمين",         icon: "👥", color: "#875E9E" },
          { href: "/alumni/employer/verify",     label: "التحقق من شهادة خريج",   icon: "🔐", color: "#4A8FA0" },
        ].map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="bg-white flex items-center gap-3 p-4 rounded-xl border border-[#E8EDEF] hover:shadow-sm transition-all group"
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
              style={{ background: link.color + "18" }}
            >
              {link.icon}
            </div>
            <span className="text-sm font-semibold text-[#506570] group-hover:text-[#4A8FA0] transition-colors">
              {link.label}
            </span>
            <span className="ms-auto text-[#C8D4D8]">←</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
