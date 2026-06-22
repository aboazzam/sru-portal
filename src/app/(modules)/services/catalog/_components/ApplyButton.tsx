"use client";
import { useState } from "react";
import ServiceApplicationModal from "./ServiceApplicationModal";

interface Props {
  serviceId: string;
  serviceTitle: string;
  userName: string;
  userEmail: string;
  alreadyApplied: boolean;
  existingStatus?: string;
}

const statusLabel: Record<string, { text: string; bg: string; color: string }> = {
  PENDING:  { text: "⏳ قيد المراجعة", bg: "#FEF3C7", color: "#D97706" },
  APPROVED: { text: "✅ مقبول",         bg: "#DCFCE7", color: "#16A34A" },
  REJECTED: { text: "❌ مرفوض",         bg: "#FEE2E2", color: "#DC2626" },
};

export default function ApplyButton({
  serviceId,
  serviceTitle,
  userName,
  userEmail,
  alreadyApplied,
  existingStatus,
}: Props) {
  const [applied, setApplied] = useState(alreadyApplied);
  const [status, setStatus]   = useState(existingStatus ?? null);
  const [showModal, setShowModal] = useState(false);

  if (applied && status) {
    const cfg = statusLabel[status] ?? statusLabel.PENDING;
    return (
      <span
        className="inline-flex items-center text-xs font-semibold px-3 py-1.5 rounded-xl"
        style={{ background: cfg.bg, color: cfg.color }}
      >
        {cfg.text}
      </span>
    );
  }

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="px-4 py-1.5 rounded-xl text-xs font-bold text-white transition-opacity hover:opacity-90"
        style={{ background: "linear-gradient(to left, #059669, #047857)" }}
      >
        تقدّم الآن
      </button>

      {showModal && (
        <ServiceApplicationModal
          serviceId={serviceId}
          serviceTitle={serviceTitle}
          userName={userName}
          userEmail={userEmail}
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            setShowModal(false);
            setApplied(true);
            setStatus("PENDING");
          }}
        />
      )}
    </>
  );
}
