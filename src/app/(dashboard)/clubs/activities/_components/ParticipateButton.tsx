"use client";
import { useState, useTransition } from "react";
import { participateInActivity } from "../../_actions";

interface Props {
  activityId: string;
  participated: boolean;
  points: number;
  canParticipate: boolean;
}

export default function ParticipateButton({ activityId, participated: initial, points, canParticipate }: Props) {
  const [participated, setParticipated] = useState(initial);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  if (!canParticipate) {
    return (
      <span className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-gray-100 text-gray-400">
        غير عضو
      </span>
    );
  }

  if (participated) {
    return (
      <span className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-green-100 text-green-700">
        ✓ مشارك {points > 0 && `(+${points} نقطة)`}
      </span>
    );
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        onClick={() => {
          setError(null);
          startTransition(async () => {
            const res = await participateInActivity(activityId);
            if (res.error) setError(res.error);
            else setParticipated(true);
          });
        }}
        disabled={isPending}
        className="px-3 py-1.5 bg-yellow-600 text-white rounded-lg text-xs font-semibold hover:bg-yellow-700 disabled:opacity-60 transition-colors"
      >
        {isPending ? "..." : `مشاركة${points > 0 ? ` (+${points} نقطة)` : ""}`}
      </button>
      {error && <p className="text-red-500 text-[10px] max-w-[160px] text-end">{error}</p>}
    </div>
  );
}
