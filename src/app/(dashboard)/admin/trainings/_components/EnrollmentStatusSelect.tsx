"use client";
import { useTransition, useState } from "react";
import { updateEnrollmentStatus } from "../_actions";

const OPTIONS = [
  { value: "PENDING",   label: "معلّق"   },
  { value: "APPROVED",  label: "مقبول"   },
  { value: "REJECTED",  label: "مرفوض"   },
  { value: "COMPLETED", label: "مكتمل"   },
];

const selectStyle: Record<string, string> = {
  PENDING:   "bg-yellow-50 text-yellow-700 border-yellow-300",
  APPROVED:  "bg-green-50  text-green-700  border-green-300",
  REJECTED:  "bg-red-50    text-red-700    border-red-300",
  COMPLETED: "bg-blue-50   text-blue-700   border-blue-300",
};

interface Props { id: string; initialStatus: string }

export default function EnrollmentStatusSelect({ id, initialStatus }: Props) {
  const [status, setStatus] = useState(initialStatus);
  const [pending, startTransition] = useTransition();

  function handleChange(next: string) {
    startTransition(async () => {
      const res = await updateEnrollmentStatus(
        id,
        next as "PENDING" | "APPROVED" | "REJECTED" | "COMPLETED"
      );
      if (res.success) setStatus(next);
    });
  }

  return (
    <select
      value={status}
      onChange={(e) => handleChange(e.target.value)}
      disabled={pending}
      className={`text-xs font-medium px-2 py-1 rounded-lg border focus:outline-none focus:ring-1 focus:ring-offset-0 disabled:opacity-60 cursor-pointer transition-colors ${selectStyle[status] ?? "bg-gray-50 text-gray-600 border-gray-200"}`}
    >
      {OPTIONS.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  );
}
