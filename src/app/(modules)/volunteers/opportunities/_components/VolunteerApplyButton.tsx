"use client";
import { useState, useTransition } from "react";
import { applyForVolunteer } from "../../_actions";

interface Props {
  opportunityId: string;
  alreadyApplied: boolean;
  existingStatus?: string;
  isPast: boolean;
}

const statusLabel: Record<string, string> = {
  PENDING:  "⏳ قيد المراجعة",
  APPROVED: "✅ مقبول",
  REJECTED: "❌ مرفوض",
};

export default function VolunteerApplyButton({ opportunityId, alreadyApplied, existingStatus, isPast }: Props) {
  const [isPending, startTransition] = useTransition();
  const [applied, setApplied]   = useState(alreadyApplied);
  const [status, setStatus]     = useState(existingStatus ?? null);
  const [error, setError]       = useState<string | null>(null);

  if (applied && status) {
    const isOk = status === "APPROVED";
    return (
      <span
        className="inline-flex items-center text-xs font-semibold px-3 py-1.5 rounded-xl"
        style={{
          background: isOk ? "#DCFCE7" : status === "REJECTED" ? "#FEE2E2" : "#FEF3C7",
          color: isOk ? "#16A34A" : status === "REJECTED" ? "#DC2626" : "#D97706",
        }}
      >
        {statusLabel[status] ?? "مقدَّم"}
      </span>
    );
  }

  if (isPast) {
    return (
      <span className="inline-flex items-center text-xs font-semibold px-3 py-1.5 rounded-xl bg-[#F3F4F6] text-[#9CA3AF]">
        انتهت الفرصة
      </span>
    );
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        onClick={() =>
          startTransition(async () => {
            setError(null);
            const result = await applyForVolunteer(opportunityId);
            if (result.success) {
              setApplied(true);
              setStatus("PENDING");
            } else {
              setError(result.error ?? "حدث خطأ");
            }
          })
        }
        disabled={isPending}
        className="px-4 py-1.5 rounded-xl text-xs font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
        style={{ background: "linear-gradient(to left, #EA580C, #C2410C)" }}
      >
        {isPending ? "جارٍ التسجيل…" : "سجّل الآن"}
      </button>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
