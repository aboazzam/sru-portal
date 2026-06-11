"use client";
import Link from "next/link";
import { useState } from "react";
import { employerJobPostings, employerApplicants, type Applicant } from "@/lib/mock/alumni";

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  new:       { label: "جديد",    color: "#6CAEBD", bg: "#E8F6F8" },
  reviewed:  { label: "مراجَع",  color: "#D97706", bg: "#FEF3C7" },
  interview: { label: "مقابلة",  color: "#875E9E", bg: "#F3EEF7" },
  accepted:  { label: "مقبول",   color: "#16A34A", bg: "#DCFCE7" },
  rejected:  { label: "مرفوض",   color: "#DC2626", bg: "#FEE2E2" },
};

type ApplicantStatus = "new" | "reviewed" | "interview" | "accepted" | "rejected";

function ApplicantCard({
  app,
  onAction,
}: {
  app: Applicant;
  onAction: (id: string, status: ApplicantStatus) => void;
}) {
  const sc = statusConfig[app.status];
  return (
    <div className="bg-white rounded-2xl border border-[#E8EDEF] shadow-sm p-5 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start gap-3 mb-3">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center text-base font-bold text-white shrink-0"
          style={{ background: `linear-gradient(135deg, ${app.color}, ${app.color}99)` }}
        >
          {app.initial}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-bold text-sm text-[#1F2937]">{app.name}</h3>
            <span
              className="text-xs font-semibold px-2 py-0.5 rounded-full"
              style={{ background: sc.bg, color: sc.color }}
            >
              {sc.label}
            </span>
          </div>
          <p className="text-xs text-[#6B7280] mt-0.5">{app.major} · معدل {app.gpa} · دفعة {app.gradYear}</p>
        </div>
      </div>

      {/* Contact + date */}
      <div className="flex flex-wrap gap-x-4 gap-y-1 mb-3 text-xs text-[#6B7280]">
        <span>✉️ {app.email}</span>
        <span>📱 {app.phone}</span>
        <span className="ms-auto text-[#9CA3AF]">
          تقدّم في {new Date(app.appliedDate).toLocaleDateString("ar-SA", { day: "numeric", month: "short" })}
        </span>
      </div>

      {/* Cover note */}
      {app.coverNote && (
        <p className="text-xs text-[#374151] leading-relaxed bg-[#F4F7F8] rounded-xl p-3 mb-3 line-clamp-2">
          {app.coverNote}
        </p>
      )}

      {/* Action buttons */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => onAction(app.id, "accepted")}
          disabled={app.status === "accepted"}
          className="flex-1 min-w-[80px] py-2 rounded-xl text-xs font-bold transition-all disabled:opacity-40 disabled:cursor-default"
          style={
            app.status === "accepted"
              ? { background: "#DCFCE7", color: "#16A34A" }
              : { background: "#16A34A18", color: "#16A34A" }
          }
        >
          ✓ قبول
        </button>
        <button
          onClick={() => onAction(app.id, "interview")}
          disabled={app.status === "interview" || app.status === "accepted" || app.status === "rejected"}
          className="flex-1 min-w-[80px] py-2 rounded-xl text-xs font-bold transition-all disabled:opacity-40 disabled:cursor-default"
          style={
            app.status === "interview"
              ? { background: "#F3EEF7", color: "#875E9E" }
              : { background: "#875E9E18", color: "#875E9E" }
          }
        >
          📅 مقابلة
        </button>
        <button
          onClick={() => onAction(app.id, "rejected")}
          disabled={app.status === "rejected"}
          className="flex-1 min-w-[80px] py-2 rounded-xl text-xs font-bold transition-all disabled:opacity-40 disabled:cursor-default"
          style={
            app.status === "rejected"
              ? { background: "#FEE2E2", color: "#DC2626" }
              : { background: "#DC262618", color: "#DC2626" }
          }
        >
          ✕ رفض
        </button>
      </div>
    </div>
  );
}

export default function ApplicantsPage() {
  const [activeJob, setActiveJob] = useState(employerJobPostings[0].id);
  const [statuses, setStatuses] = useState<Record<string, ApplicantStatus>>({});
  const [toast, setToast] = useState<string | null>(null);

  function handleAction(appId: string, newStatus: ApplicantStatus) {
    setStatuses((p) => ({ ...p, [appId]: newStatus }));
    const labels: Record<ApplicantStatus, string> = {
      accepted:  "تم قبول المتقدم ✓",
      interview: "تمت جدولة المقابلة 📅",
      rejected:  "تم رفض الطلب",
      new:       "تم التحديث",
      reviewed:  "تم التحديث",
    };
    setToast(labels[newStatus]);
    setTimeout(() => setToast(null), 2500);
  }

  const applicantsForJob = employerApplicants
    .filter((a) => a.jobId === activeJob)
    .map((a) => ({ ...a, status: (statuses[a.id] ?? a.status) as ApplicantStatus }));

  const jobStatusBadge: Record<string, { label: string; color: string; bg: string }> = {
    active: { label: "نشطة", color: "#16A34A", bg: "#DCFCE7" },
    closed: { label: "مغلقة", color: "#6B7280", bg: "#F3F4F6" },
    draft:  { label: "مسودة", color: "#D97706", bg: "#FEF3C7" },
  };

  const countsForJob = (jobId: string) =>
    employerApplicants.filter((a) => a.jobId === jobId).length;

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-[#8FA4AB]">
        <Link href="/alumni/employer" className="hover:text-[#6CAEBD] transition-colors">لوحة الشركة</Link>
        <span>/</span>
        <span className="text-[#1A2A30] font-medium">إدارة المتقدمين</span>
      </div>

      {toast && (
        <div
          className="fixed top-6 start-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-xl text-sm font-semibold text-white shadow-lg"
          style={{ background: "#4A8FA0" }}
        >
          {toast}
        </div>
      )}

      {/* Hero */}
      <div
        className="rounded-2xl p-5 text-white shadow-sm"
        style={{ background: "linear-gradient(135deg, #6CAEBD 0%, #4A8FA0 100%)" }}
      >
        <h1 className="text-xl font-bold">إدارة المتقدمين 👥</h1>
        <p className="text-white/80 text-sm mt-0.5">
          راجع الطلبات وقرّر القبول أو تحديد موعد مقابلة
        </p>
      </div>

      {/* Job tabs */}
      <div className="bg-white rounded-2xl border border-[#E8EDEF] shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-[#E8EDEF]" style={{ background: "#F4F7F8" }}>
          <p className="text-xs font-bold text-[#506570]">اختر الوظيفة</p>
        </div>
        <div className="flex overflow-x-auto divide-x divide-x-reverse divide-[#F4F7F8]">
          {employerJobPostings.map((job) => {
            const jb = jobStatusBadge[job.status];
            const isActive = job.id === activeJob;
            return (
              <button
                key={job.id}
                onClick={() => setActiveJob(job.id)}
                className="flex-1 min-w-[160px] px-4 py-3.5 text-start transition-colors hover:bg-[#F9FAFB]"
                style={isActive ? { borderBottom: "2px solid #6CAEBD", background: "#F0F9FB" } : {}}
              >
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-bold text-[#1F2937] leading-snug">{job.title}</p>
                  <span
                    className="shrink-0 text-xs font-semibold px-1.5 py-0.5 rounded-full"
                    style={{ background: jb.bg, color: jb.color }}
                  >
                    {jb.label}
                  </span>
                </div>
                <p className="text-xs text-[#9CA3AF]">
                  {countsForJob(job.id)} متقدم
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Applicants grid */}
      {applicantsForJob.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#E8EDEF] p-12 text-center shadow-sm">
          <p className="text-4xl mb-3">📭</p>
          <p className="font-bold text-[#1A2A30]">لا يوجد متقدمون لهذه الوظيفة بعد</p>
          <p className="text-sm text-[#8FA4AB] mt-1">ستظهر الطلبات هنا عند تقدم الخريجين</p>
        </div>
      ) : (
        <>
          {/* Status summary */}
          <div className="flex flex-wrap gap-2">
            {(Object.entries(statusConfig) as [ApplicantStatus, typeof statusConfig[string]][]).map(([key, cfg]) => {
              const cnt = applicantsForJob.filter((a) => a.status === key).length;
              if (cnt === 0) return null;
              return (
                <span
                  key={key}
                  className="text-xs font-semibold px-3 py-1.5 rounded-full"
                  style={{ background: cfg.bg, color: cfg.color }}
                >
                  {cfg.label}: {cnt}
                </span>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {applicantsForJob.map((app) => (
              <ApplicantCard key={app.id} app={app} onAction={handleAction} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
