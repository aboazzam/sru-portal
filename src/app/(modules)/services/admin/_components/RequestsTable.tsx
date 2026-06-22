"use client";
import { useState } from "react";
import ReviewModal from "./ReviewModal";

interface Application {
  id: string;
  status: string;
  notes: string | null;
  formData: string | null;
  createdAt: string;
  user: { id: string; name: string; email: string };
  service: { id: string; title: string };
}

interface Props {
  applications: Application[];
  services: { id: string; title: string }[];
}

const statusConfig: Record<string, { label: string; bg: string; color: string; icon: string }> = {
  PENDING:  { label: "قيد المراجعة", bg: "#FEF3C7", color: "#D97706", icon: "⏳" },
  APPROVED: { label: "مقبول",         bg: "#DCFCE7", color: "#16A34A", icon: "✅" },
  REJECTED: { label: "مرفوض",         bg: "#FEE2E2", color: "#DC2626", icon: "❌" },
};

const TABS = [
  { key: "ALL",      label: "الكل" },
  { key: "PENDING",  label: "قيد المراجعة" },
  { key: "APPROVED", label: "مقبولة" },
  { key: "REJECTED", label: "مرفوضة" },
] as const;

export default function RequestsTable({ applications, services }: Props) {
  const [activeTab, setActiveTab]           = useState<"ALL" | "PENDING" | "APPROVED" | "REJECTED">("ALL");
  const [serviceFilter, setServiceFilter]   = useState("ALL");
  const [search, setSearch]                 = useState("");
  const [reviewing, setReviewing]           = useState<Application | null>(null);
  const [localApps, setLocalApps]           = useState(applications);

  function handleDone(id: string, decision: "APPROVED" | "REJECTED") {
    setLocalApps((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: decision } : a))
    );
    setReviewing(null);
  }

  const filtered = localApps.filter((a) => {
    if (activeTab !== "ALL" && a.status !== activeTab) return false;
    if (serviceFilter !== "ALL" && a.service.id !== serviceFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      if (!a.user.name.toLowerCase().includes(q) && !a.user.email.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const counts = {
    ALL:      localApps.length,
    PENDING:  localApps.filter((a) => a.status === "PENDING").length,
    APPROVED: localApps.filter((a) => a.status === "APPROVED").length,
    REJECTED: localApps.filter((a) => a.status === "REJECTED").length,
  };

  return (
    <>
      {/* Filter bar */}
      <div className="bg-white rounded-2xl border border-[#E8EDEF] shadow-sm overflow-hidden">
        {/* Status tabs */}
        <div className="flex border-b border-[#E8EDEF] overflow-x-auto">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-5 py-3.5 text-sm font-medium whitespace-nowrap transition-colors border-b-2 -mb-px ${
                activeTab === tab.key
                  ? "border-[#6B46C1] text-[#6B46C1]"
                  : "border-transparent text-[#6B7280] hover:text-[#374151]"
              }`}
            >
              {tab.label}
              <span
                className="text-xs font-bold px-2 py-0.5 rounded-full"
                style={{
                  background: activeTab === tab.key ? "#F3F0FF" : "#F3F4F6",
                  color:      activeTab === tab.key ? "#6B46C1"  : "#6B7280",
                }}
              >
                {counts[tab.key]}
              </span>
            </button>
          ))}
        </div>

        {/* Search + service filter */}
        <div className="p-4 flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="🔍  بحث بالاسم أو البريد الإلكتروني…"
            dir="rtl"
            className="flex-1 border border-[#D1D5DB] rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#6B46C1]/30"
          />
          <select
            value={serviceFilter}
            onChange={(e) => setServiceFilter(e.target.value)}
            dir="rtl"
            className="border border-[#D1D5DB] rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#6B46C1]/30 bg-white"
          >
            <option value="ALL">جميع الخدمات</option>
            {services.map((s) => (
              <option key={s.id} value={s.id}>{s.title}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#E8EDEF] py-20 text-center">
          <p className="text-4xl mb-3">📭</p>
          <p className="font-bold text-[#1A2A30] text-base">لا توجد طلبات</p>
          <p className="text-[#8FA4AB] text-sm mt-1">جرّب تغيير الفلتر أو معايير البحث</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[#E8EDEF] shadow-sm overflow-hidden">
          <div className="divide-y divide-[#F4F7F8]">
            {filtered.map((app) => {
              const sc = statusConfig[app.status] ?? statusConfig.PENDING;
              const date = new Date(app.createdAt).toLocaleDateString("ar-SA", {
                day: "numeric", month: "long", year: "numeric",
              });
              return (
                <div
                  key={app.id}
                  className="px-5 py-4 hover:bg-[#FAFAFA] transition-colors"
                >
                  <div className="flex items-center gap-4 flex-wrap">
                    {/* Avatar */}
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold text-white shrink-0"
                      style={{ background: "linear-gradient(135deg, #6B46C1, #3D1F6E)" }}
                    >
                      {app.user.name.charAt(0)}
                    </div>

                    {/* Student + service */}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-[#1F2937]">{app.user.name}</p>
                      <p className="text-xs text-[#6B7280] truncate">{app.user.email}</p>
                      <p className="text-xs text-[#9CA3AF] mt-0.5">
                        <span className="font-medium text-[#6B46C1]">{app.service.title}</span>
                        {" · "}{date}
                      </p>
                    </div>

                    {/* Status + action */}
                    <div className="flex items-center gap-3 shrink-0">
                      <span
                        className="text-xs font-bold px-2.5 py-1 rounded-full"
                        style={{ background: sc.bg, color: sc.color }}
                      >
                        {sc.icon} {sc.label}
                      </span>
                      <button
                        onClick={() => setReviewing(app)}
                        className="px-3.5 py-1.5 rounded-xl border text-xs font-semibold transition-colors hover:bg-[#F3F0FF] hover:border-[#6B46C1] hover:text-[#6B46C1]"
                        style={{ borderColor: "#D1D5DB", color: "#374151" }}
                      >
                        {app.status === "PENDING" ? "مراجعة" : "عرض"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {reviewing && (
        <ReviewModal
          application={reviewing}
          onClose={() => setReviewing(null)}
          onDone={handleDone}
        />
      )}
    </>
  );
}
