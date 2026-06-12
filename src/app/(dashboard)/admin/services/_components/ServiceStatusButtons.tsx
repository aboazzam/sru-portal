"use client";
import { useTransition, useState } from "react";
import { updateServiceAppStatus } from "../_actions";

const statusLabel: Record<string, string> = { PENDING: "معلّق", APPROVED: "مقبول", REJECTED: "مرفوض" };
const statusStyle: Record<string, string> = {
  PENDING:  "bg-yellow-100 text-yellow-700",
  APPROVED: "bg-green-100 text-green-700",
  REJECTED: "bg-red-100 text-red-700",
};

export default function ServiceStatusButtons({ id, initialStatus }: { id: string; initialStatus: string }) {
  const [status, setStatus] = useState(initialStatus);
  const [pending, startTransition] = useTransition();

  function update(next: "APPROVED" | "REJECTED" | "PENDING") {
    startTransition(async () => {
      const res = await updateServiceAppStatus(id, next);
      if (res.success) setStatus(next);
    });
  }

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium shrink-0 ${statusStyle[status] ?? "bg-gray-100 text-gray-600"}`}>
        {statusLabel[status] ?? status}
      </span>
      {status === "PENDING" && (
        <>
          <button onClick={() => update("APPROVED")} disabled={pending} className="px-2.5 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-xs font-medium disabled:opacity-50 transition-colors">قبول</button>
          <button onClick={() => update("REJECTED")} disabled={pending} className="px-2.5 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-xs font-medium disabled:opacity-50 transition-colors">رفض</button>
        </>
      )}
      {status !== "PENDING" && (
        <button onClick={() => update("PENDING")} disabled={pending} className="text-xs text-gray-400 hover:text-gray-600 underline underline-offset-2 disabled:opacity-50">إعادة</button>
      )}
    </div>
  );
}
