"use client";
import { useTransition, useState } from "react";
import { enrollInTrainingModule } from "../../_actions";

interface Props {
  trainingId: string;
  myStatus:   string | null;
  isFull:     boolean;
  unavailable: boolean;
}

const enrolledLabels: Record<string, string> = {
  PENDING:   "قيد المراجعة",
  APPROVED:  "مقبول ✓",
  REJECTED:  "مرفوض",
  COMPLETED: "مكتمل ✓",
};

export default function CatalogEnrollButton({ trainingId, myStatus, isFull, unavailable }: Props) {
  const [isPending, startTransition] = useTransition();
  const [localStatus, setLocalStatus] = useState<string | null>(myStatus);
  const [error, setError] = useState<string | null>(null);

  if (localStatus) {
    const label = enrolledLabels[localStatus] ?? "مسجّل";
    const isOk  = localStatus === "APPROVED" || localStatus === "COMPLETED";
    return (
      <span
        className="inline-flex items-center text-xs font-semibold px-3 py-1.5 rounded-xl"
        style={{ background: isOk ? "#DCFCE7" : "#F3F4F6", color: isOk ? "#16A34A" : "#6B7280" }}
      >
        {label}
      </span>
    );
  }

  if (unavailable || isFull) {
    return (
      <span className="inline-flex items-center text-xs font-semibold px-3 py-1.5 rounded-xl bg-[#F3F4F6] text-[#9CA3AF]">
        {unavailable ? "غير متاح" : "اكتمل التسجيل"}
      </span>
    );
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        onClick={() =>
          startTransition(async () => {
            setError(null);
            const result = await enrollInTrainingModule(trainingId);
            if (result.success) setLocalStatus("PENDING");
            else setError(result.error ?? "حدث خطأ");
          })
        }
        disabled={isPending}
        className="px-4 py-1.5 rounded-xl text-xs font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
        style={{ background: "linear-gradient(to left, #6CAEBD, #4A8FA0)" }}
      >
        {isPending ? "جارٍ التسجيل…" : "سجّل الآن"}
      </button>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
