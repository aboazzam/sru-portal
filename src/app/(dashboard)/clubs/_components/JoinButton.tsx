"use client";
import { useState, useTransition } from "react";
import { joinClub } from "../_actions";

interface Props {
  clubId: string;
  status: string | null;
}

const statusLabel: Record<string, string> = {
  PENDING:  "قيد المراجعة",
  APPROVED: "عضو",
  REJECTED: "مرفوض",
};

const statusStyle: Record<string, string> = {
  PENDING:  "bg-amber-100 text-amber-700 cursor-default",
  APPROVED: "bg-green-100 text-green-700 cursor-default",
  REJECTED: "bg-red-100 text-red-600 cursor-default",
};

export default function JoinButton({ clubId, status: initialStatus }: Props) {
  const [status, setStatus] = useState(initialStatus);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  if (status) {
    return (
      <span className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${statusStyle[status]}`}>
        {statusLabel[status] ?? status}
      </span>
    );
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        onClick={() => {
          setError(null);
          startTransition(async () => {
            const res = await joinClub(clubId);
            if (res.error) setError(res.error);
            else setStatus("PENDING");
          });
        }}
        disabled={isPending}
        className="px-3 py-1.5 bg-yellow-600 text-white rounded-lg text-xs font-semibold hover:bg-yellow-700 disabled:opacity-60 transition-colors"
      >
        {isPending ? "..." : "انضمام"}
      </button>
      {error && <p className="text-red-500 text-[10px]">{error}</p>}
    </div>
  );
}
