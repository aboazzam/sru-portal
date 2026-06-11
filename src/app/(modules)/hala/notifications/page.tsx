"use client";
import Link from "next/link";
import { useState } from "react";
import { notifications } from "@/lib/mock/hala";
import type { NotifType } from "@/lib/mock/hala";

const filterOptions: { label: string; value: NotifType | "الكل" }[] = [
  { label: "الكل",    value: "الكل" },
  { label: "عاجل",   value: "urgent" },
  { label: "تنبيه",  value: "warning" },
  { label: "معلومة", value: "info" },
  { label: "نجاح",   value: "success" },
];

const notifConfig: Record<NotifType, { icon: string; label: string; border: string; bg: string; text: string }> = {
  urgent:  { icon: "🔴", label: "عاجل",    border: "#DC2626", bg: "#FEE2E2", text: "#DC2626" },
  warning: { icon: "🟡", label: "تنبيه",   border: "#D97706", bg: "#FEF3C7", text: "#D97706" },
  info:    { icon: "ℹ️",  label: "معلومة",  border: "#6CAEBD", bg: "#E8F6F8", text: "#4A8FA0" },
  success: { icon: "✅", label: "نجاح",    border: "#16A34A", bg: "#DCFCE7", text: "#16A34A" },
};

export default function NotificationsPage() {
  const [filter, setFilter] = useState<NotifType | "الكل">("الكل");
  const [read, setRead] = useState<Set<number>>(new Set());

  const filtered =
    filter === "الكل" ? notifications : notifications.filter((n) => n.type === filter);

  function markAllRead() {
    setRead(new Set(notifications.map((n) => n.id)));
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-[#8FA4AB]">
        <Link href="/hala" className="hover:text-[#6CAEBD] transition-colors">هلا بك</Link>
        <span>/</span>
        <span className="text-[#1A2A30] font-medium">التنبيهات</span>
      </div>

      {/* Header */}
      <div className="bg-white rounded-2xl p-5 border border-[#E8EDEF] shadow-sm flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl" style={{ background: "#E8F6F8" }}>
            🔔
          </div>
          <div>
            <h1 className="font-bold text-[#1A2A30] text-lg">التنبيهات</h1>
            <p className="text-[#8FA4AB] text-sm">
              {notifications.length - read.size} غير مقروء
            </p>
          </div>
        </div>
        <button
          onClick={markAllRead}
          className="text-sm font-semibold px-4 py-2 rounded-xl border border-[#C8E6EC] text-[#4A8FA0] hover:bg-[#E8F6F8] transition-colors"
        >
          تعليم الكل كمقروء ✓
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {filterOptions.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setFilter(opt.value)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
              filter === opt.value
                ? "text-white shadow-sm"
                : "bg-white border border-[#E8EDEF] text-[#506570] hover:border-[#6CAEBD]"
            }`}
            style={filter === opt.value ? { background: "#6CAEBD" } : undefined}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Notifications list */}
      <div className="space-y-3">
        {filtered.length === 0 && (
          <div className="bg-white rounded-2xl p-12 text-center border border-[#E8EDEF]">
            <p className="text-3xl mb-3">🔕</p>
            <p className="text-[#8FA4AB]">لا توجد تنبيهات في هذه الفئة</p>
          </div>
        )}
        {filtered.map((n) => {
          const cfg = notifConfig[n.type];
          const isRead = read.has(n.id);
          return (
            <div
              key={n.id}
              className={`bg-white rounded-xl border overflow-hidden transition-all ${
                isRead ? "opacity-60" : "shadow-sm"
              }`}
              style={{ borderColor: isRead ? "#E8EDEF" : cfg.border }}
            >
              <div
                className="px-5 py-4 flex items-start gap-4"
                style={!isRead ? { borderRightWidth: "4px", borderRightColor: cfg.border, borderRightStyle: "solid" } : undefined}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0"
                  style={{ background: cfg.bg }}
                >
                  {cfg.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span
                      className="text-xs font-bold px-2 py-0.5 rounded-full"
                      style={{ background: cfg.bg, color: cfg.text }}
                    >
                      {cfg.label}
                    </span>
                    {!isRead && (
                      <span className="w-2 h-2 rounded-full bg-[#6CAEBD] inline-block" />
                    )}
                  </div>
                  <p className={`font-semibold text-sm ${isRead ? "text-[#8FA4AB]" : "text-[#1F2937]"}`}>
                    {n.title}
                  </p>
                  <div className="flex items-center gap-3 mt-1 text-xs text-[#9CA3AF]">
                    <span>{new Date(n.date).toLocaleDateString("ar-SA")}</span>
                    {n.daysLeft != null && (
                      <span className="font-semibold" style={{ color: cfg.text }}>
                        قبل {n.daysLeft} {n.daysLeft === 1 ? "يوم" : "أيام"}
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => setRead((prev) => { const s = new Set(prev); s.add(n.id); return s; })}
                  disabled={isRead}
                  className="shrink-0 text-xs text-[#8FA4AB] hover:text-[#4A8FA0] disabled:opacity-30 disabled:cursor-default transition-colors"
                >
                  {isRead ? "✓" : "تعليم كمقروء"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
