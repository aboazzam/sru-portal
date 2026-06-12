"use client";
import { useTransition, useState } from "react";
import { enrollInTraining } from "../../_actions";

interface Props {
  trainingId: string;
  enrolled: boolean;
  isFull: boolean;
  unavailable: boolean;
}

export default function EnrollButton({ trainingId, enrolled, isFull, unavailable }: Props) {
  const [pending, startTransition] = useTransition();
  const [done, setDone] = useState(enrolled);
  const [error, setError] = useState<string | null>(null);

  if (done) {
    return (
      <span className="inline-flex items-center px-3 py-1.5 bg-green-100 text-green-700 text-xs rounded-lg font-medium">
        مسجّل ✓
      </span>
    );
  }

  if (unavailable) {
    return (
      <span className="inline-flex items-center px-3 py-1.5 bg-gray-100 text-gray-400 text-xs rounded-lg font-medium">
        غير متاح
      </span>
    );
  }

  if (isFull) {
    return (
      <span className="inline-flex items-center px-3 py-1.5 bg-orange-100 text-orange-600 text-xs rounded-lg font-medium">
        اكتمل التسجيل
      </span>
    );
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        onClick={() =>
          startTransition(async () => {
            const result = await enrollInTraining(trainingId);
            if (result.success) setDone(true);
            else setError(result.error ?? "حدث خطأ");
          })
        }
        disabled={pending}
        className="px-3 py-1.5 bg-secondary hover:bg-secondary-dark text-white text-xs rounded-lg font-medium transition-colors disabled:opacity-50"
      >
        {pending ? "جارٍ التسجيل…" : "سجّل الآن"}
      </button>
      {error && <p className="text-xs text-red-500 text-end">{error}</p>}
    </div>
  );
}
