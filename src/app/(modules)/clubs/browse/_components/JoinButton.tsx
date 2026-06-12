"use client";
import { useState, useTransition } from "react";
import { joinClub } from "../../_actions";

interface Props {
  clubId:         string;
  alreadyJoined:  boolean;
  existingStatus?: string;
}

const statusLabel: Record<string, string> = {
  PENDING:  "⏳ قيد المراجعة",
  APPROVED: "✅ عضو فعّال",
  REJECTED: "❌ مرفوض",
};

const statusStyle: Record<string, { bg: string; color: string }> = {
  PENDING:  { bg: "#FEF3C7", color: "#D97706" },
  APPROVED: { bg: "#DCFCE7", color: "#16A34A" },
  REJECTED: { bg: "#FEE2E2", color: "#DC2626" },
};

export default function JoinButton({ clubId, alreadyJoined, existingStatus }: Props) {
  const [isPending, startTransition] = useTransition();
  const [joined, setJoined] = useState(alreadyJoined);
  const [status, setStatus] = useState(existingStatus ?? null);
  const [error, setError]   = useState<string | null>(null);

  if (joined && status) {
    const s = statusStyle[status] ?? statusStyle.PENDING;
    return (
      <span
        className="inline-flex items-center text-xs font-semibold px-3 py-1.5 rounded-xl"
        style={{ background: s.bg, color: s.color }}
      >
        {statusLabel[status] ?? "مسجّل"}
      </span>
    );
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        onClick={() =>
          startTransition(async () => {
            setError(null);
            const result = await joinClub(clubId);
            if (result.success) {
              setJoined(true);
              setStatus("PENDING");
            } else {
              setError(result.error ?? "حدث خطأ");
            }
          })
        }
        disabled={isPending}
        className="px-4 py-1.5 rounded-xl text-xs font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
        style={{ background: "linear-gradient(to left, #DC2626, #991B1B)" }}
      >
        {isPending ? "جارٍ التسجيل…" : "انضم للنادي"}
      </button>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
