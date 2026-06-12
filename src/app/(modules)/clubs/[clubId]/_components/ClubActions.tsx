"use client";
import { useState, useTransition } from "react";
import { joinClub, applyForCouncil } from "../../_actions";

interface Props {
  clubId:              string;
  membershipStatus:    string | null;
  councilAppStatus:    string | null;
}

const membershipLabel: Record<string, string> = {
  PENDING:  "⏳ قيد المراجعة",
  APPROVED: "✅ عضو فعّال",
  REJECTED: "❌ طلب مرفوض",
};

const membershipStyle: Record<string, { bg: string; color: string }> = {
  PENDING:  { bg: "#FEF3C7", color: "#D97706" },
  APPROVED: { bg: "#DCFCE7", color: "#16A34A" },
  REJECTED: { bg: "#FEE2E2", color: "#DC2626" },
};

const councilLabel: Record<string, string> = {
  PENDING:  "⏳ طلب المجلس قيد المراجعة",
  APPROVED: "✅ عضو في مجلس النادي",
  REJECTED: "❌ طلب المجلس مرفوض",
};

export default function ClubActions({ clubId, membershipStatus, councilAppStatus }: Props) {
  const [joinPending,    startJoin]    = useTransition();
  const [councilPending, startCouncil] = useTransition();

  const [memStatus,     setMemStatus]     = useState(membershipStatus);
  const [councilStatus, setCouncilStatus] = useState(councilAppStatus);
  const [joinError,     setJoinError]     = useState<string | null>(null);
  const [councilError,  setCouncilError]  = useState<string | null>(null);

  const isApprovedMember = memStatus === "APPROVED";

  return (
    <div className="flex flex-col gap-3">
      {/* Membership */}
      {memStatus ? (
        <span
          className="inline-flex items-center justify-center text-sm font-semibold px-4 py-2 rounded-xl"
          style={membershipStyle[memStatus] ?? membershipStyle.PENDING}
        >
          {membershipLabel[memStatus] ?? "مسجّل"}
        </span>
      ) : (
        <div className="flex flex-col gap-1">
          <button
            onClick={() =>
              startJoin(async () => {
                setJoinError(null);
                const r = await joinClub(clubId);
                if (r.success) setMemStatus("PENDING");
                else setJoinError(r.error ?? "حدث خطأ");
              })
            }
            disabled={joinPending}
            className="w-full px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
            style={{ background: "linear-gradient(to left, #DC2626, #991B1B)" }}
          >
            {joinPending ? "جارٍ التسجيل…" : "انضم للنادي"}
          </button>
          {joinError && <p className="text-xs text-red-500 text-center">{joinError}</p>}
        </div>
      )}

      {/* Council application — only for approved members */}
      {isApprovedMember && (
        councilStatus ? (
          <span className="inline-flex items-center justify-center text-xs font-semibold px-4 py-2 rounded-xl bg-[#F5F3FF] text-[#7C3AED]">
            {councilLabel[councilStatus] ?? "مقدّم للمجلس"}
          </span>
        ) : (
          <div className="flex flex-col gap-1">
            <button
              onClick={() =>
                startCouncil(async () => {
                  setCouncilError(null);
                  const r = await applyForCouncil(clubId);
                  if (r.success) setCouncilStatus("PENDING");
                  else setCouncilError(r.error ?? "حدث خطأ");
                })
              }
              disabled={councilPending}
              className="w-full px-5 py-2 rounded-xl text-xs font-bold transition-colors hover:bg-[#F5F3FF] disabled:opacity-50"
              style={{ border: "1px solid #7C3AED", color: "#7C3AED" }}
            >
              {councilPending ? "جارٍ التقديم…" : "تقدّم لمجلس النادي"}
            </button>
            {councilError && <p className="text-xs text-red-500 text-center">{councilError}</p>}
          </div>
        )
      )}
    </div>
  );
}
