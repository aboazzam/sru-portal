"use client";
import { useState, useTransition } from "react";
import { applyForVolunteer } from "../../_actions";

type Opportunity = {
  id: string;
  title: string;
  description: string | null;
  date: Date | null;
  _count: { applications: number };
};

interface Props {
  opportunities: Opportunity[];
  appliedIds: Set<string>;
}

export default function VolunteerOpportunities({ opportunities, appliedIds }: Props) {
  const [applied, setApplied] = useState<Set<string>>(new Set(appliedIds));
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleApply(id: string, title: string) {
    setError(null);
    startTransition(async () => {
      const res = await applyForVolunteer(id);
      if (res.error) {
        setError(res.error);
      } else {
        setApplied((prev) => new Set([...prev, id]));
        setSuccess(`تم التسجيل في "${title}" بنجاح!`);
        setTimeout(() => setSuccess(null), 4000);
      }
    });
  }

  if (opportunities.length === 0) {
    return (
      <p className="text-center text-gray-400 text-sm py-8">
        لا توجد فرص تطوعية متاحة حالياً
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg px-4 py-2.5 text-sm font-medium">
          ✅ {success}
        </div>
      )}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg px-4 py-2.5 text-sm">
          {error}
        </div>
      )}

      <div className="space-y-3">
        {opportunities.map((opp) => {
          const done = applied.has(opp.id);
          return (
            <div
              key={opp.id}
              className={`rounded-xl border p-4 transition-all ${
                done ? "border-green-200 bg-green-50" : "border-gray-100 bg-white hover:border-purple-200"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-[#1F2937] text-sm">{opp.title}</h4>
                  {opp.description && (
                    <p className="text-gray-500 text-xs mt-1 line-clamp-2">{opp.description}</p>
                  )}
                  <div className="flex gap-4 mt-2 text-xs text-gray-400 flex-wrap">
                    {opp.date && (
                      <span>📅 {opp.date.toLocaleDateString("ar-SA")}</span>
                    )}
                    <span>👥 {opp._count.applications} مسجّل</span>
                  </div>
                </div>
                <button
                  onClick={() => !done && !isPending && handleApply(opp.id, opp.title)}
                  disabled={done || isPending}
                  className={`shrink-0 px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
                    done
                      ? "bg-green-100 text-green-700 cursor-default"
                      : "bg-[#3D1F6E] text-white hover:bg-[#2C1650] disabled:opacity-60"
                  }`}
                >
                  {done ? "✓ مسجّل" : isPending ? "..." : "التسجيل"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
