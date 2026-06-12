"use client";
import { useTransition, useState } from "react";
import { applyForScholarship } from "../../_actions";

interface Props {
  scholarshipId: string;
  applied: boolean;
}

export default function ApplyButton({ scholarshipId, applied }: Props) {
  const [pending, startTransition] = useTransition();
  const [done, setDone] = useState(applied);
  const [error, setError] = useState<string | null>(null);

  if (done) {
    return (
      <span className="inline-flex items-center px-3 py-1.5 bg-green-100 text-green-700 text-xs rounded-lg font-medium">
        تم التقديم ✓
      </span>
    );
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        onClick={() =>
          startTransition(async () => {
            const result = await applyForScholarship(scholarshipId);
            if (result.success) setDone(true);
            else setError(result.error ?? "حدث خطأ");
          })
        }
        disabled={pending}
        className="px-3 py-1.5 bg-primary hover:bg-primary-dark text-white text-xs rounded-lg font-medium transition-colors disabled:opacity-50"
      >
        {pending ? "جارٍ التقديم…" : "تقدّم الآن"}
      </button>
      {error && <p className="text-xs text-red-500 text-end">{error}</p>}
    </div>
  );
}
