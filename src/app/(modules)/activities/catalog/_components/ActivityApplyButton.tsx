"use client";
import { useState, useTransition } from "react";
import { applyForActivity } from "../../_actions";

interface Props {
  activityId:     string;
  alreadyApplied: boolean;
  existingStatus?: string;
  isPast:         boolean;
}

const statusLabel: Record<string, string> = {
  PENDING:  "⏳ قيد المراجعة",
  APPROVED: "✅ مقبول",
  REJECTED: "❌ مرفوض",
};

export default function ActivityApplyButton({ activityId, alreadyApplied, existingStatus, isPast }: Props) {
  const [isPending, startTransition] = useTransition();
  const [applied, setApplied] = useState(alreadyApplied);
  const [status, setStatus]   = useState(existingStatus ?? null);
  const [error, setError]     = useState<string | null>(null);

  if (applied && status) {
    const isOk = status === "APPROVED";
    return (
      <span
        className="inline-flex items-center text-xs font-semibold px-3 py-1.5 rounded-xl"
        style={{
          background: isOk ? "#DCFCE7" : status === "REJECTED" ? "#FEE2E2" : "#DBEAFE",
          color:      isOk ? "#16A34A" : status === "REJECTED" ? "#DC2626" : "#2563EB",
        }}
      >
        {statusLabel[status] ?? "مسجَّل"}
      </span>
    );
  }

  if (isPast) {
    return (
      <span className="inline-flex items-center text-xs font-semibold px-3 py-1.5 rounded-xl bg-[#F3F4F6] text-[#9CA3AF]">
        انتهى النشاط
      </span>
    );
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        onClick={() =>
          startTransition(async () => {
            setError(null);
            const result = await applyForActivity(activityId);
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
        style={{ background: "linear-gradient(to left, #2563EB, #1D4ED8)" }}
      >
        {isPending ? "جارٍ التسجيل…" : "سجّل الآن"}
      </button>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
