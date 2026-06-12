"use client";
import { useState, useTransition } from "react";
import { applyForCouncil } from "../../_actions";

interface Props {
  clubId: string;
  existingStatus: string | null;
}

export default function CouncilApplyButton({ clubId, existingStatus }: Props) {
  const [status, setStatus] = useState(existingStatus);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  if (status === "APPROVED") {
    return (
      <span className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-green-100 text-green-700">
        ✓ عضو المجلس
      </span>
    );
  }
  if (status === "PENDING") {
    return (
      <span className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-100 text-amber-700">
        قيد المراجعة
      </span>
    );
  }
  if (status === "REJECTED") {
    return (
      <span className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-100 text-red-600">
        مرفوض
      </span>
    );
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        onClick={() => {
          setError(null);
          startTransition(async () => {
            const res = await applyForCouncil(clubId);
            if (res.error) setError(res.error);
            else setStatus("PENDING");
          });
        }}
        disabled={isPending}
        className="px-3 py-1.5 bg-yellow-600 text-white rounded-lg text-xs font-semibold hover:bg-yellow-700 disabled:opacity-60 transition-colors"
      >
        {isPending ? "..." : "تقديم طلب"}
      </button>
      {error && <p className="text-red-500 text-[10px] max-w-[160px] text-end">{error}</p>}
    </div>
  );
}
