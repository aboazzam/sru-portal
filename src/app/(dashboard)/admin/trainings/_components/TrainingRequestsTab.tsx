"use client";
import { useState, useTransition } from "react";
import { updateTrainingRequestStatus } from "../_actions";

interface TrainingRequest {
  id: string;
  type: string;
  programName: string;
  notes: string | null;
  status: string;
  createdAt: Date;
  user: { id: string; name: string; email: string };
}

interface Props {
  requests:    TrainingRequest[];
  countMap:    Record<string, number>;
  activeFilter: string;
  statusLabel: Record<string, string>;
  badgeStyle:  Record<string, string>;
}

const STATUS_OPTIONS = ["PENDING", "APPROVED", "REJECTED", "COMPLETED"];

function RequestStatusSelect({ id, initialStatus, statusLabel, badgeStyle }: {
  id: string; initialStatus: string;
  statusLabel: Record<string, string>;
  badgeStyle: Record<string, string>;
}) {
  const [status, setStatus] = useState(initialStatus);
  const [pending, start] = useTransition();

  function handleChange(next: string) {
    start(async () => {
      const res = await updateTrainingRequestStatus(id, next as any);
      if (res.success) setStatus(next);
    });
  }

  const selectStyle: Record<string, string> = {
    PENDING:   "bg-yellow-50 text-yellow-700 border-yellow-300",
    APPROVED:  "bg-green-50  text-green-700  border-green-300",
    REJECTED:  "bg-red-50    text-red-700    border-red-300",
    COMPLETED: "bg-blue-50   text-blue-700   border-blue-300",
  };

  return (
    <select
      value={status}
      onChange={(e) => handleChange(e.target.value)}
      disabled={pending}
      className={`text-xs font-medium px-2 py-1 rounded-lg border focus:outline-none disabled:opacity-60 cursor-pointer transition-colors ${selectStyle[status] ?? "bg-gray-50 text-gray-600 border-gray-200"}`}
    >
      {STATUS_OPTIONS.map((o) => (
        <option key={o} value={o}>{statusLabel[o] ?? o}</option>
      ))}
    </select>
  );
}

const FILTERS = [
  { value: "",          label: "الكل"    },
  { value: "PENDING",   label: "معلّق"   },
  { value: "APPROVED",  label: "مقبول"   },
  { value: "REJECTED",  label: "مرفوض"   },
  { value: "COMPLETED", label: "مكتمل"   },
];

export default function TrainingRequestsTab({ requests, countMap, activeFilter, statusLabel, badgeStyle }: Props) {
  const total = Object.values(countMap).reduce((s, v) => s + v, 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <p className="text-gray-500 text-sm">
          {activeFilter
            ? `${requests.length} طلب — ${statusLabel[activeFilter]}`
            : `${total} طلب إجمالاً`}
        </p>
        <div className="flex gap-2 flex-wrap">
          {Object.entries(countMap).map(([st, cnt]) => (
            <span key={st} className={`px-3 py-1 rounded-full text-xs font-medium ${badgeStyle[st] ?? "bg-gray-100 text-gray-600"}`}>
              {statusLabel[st]}: {cnt}
            </span>
          ))}
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        {FILTERS.map((f) => {
          const href = f.value
            ? `/admin/trainings?tab=requests&filter=${f.value}`
            : "/admin/trainings?tab=requests";
          const isActive = (f.value === "" && !activeFilter) || f.value === activeFilter;
          return (
            <a key={f.value} href={href}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                isActive ? "bg-green-600 text-white shadow-sm" : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
              }`}
            >
              {f.label}
              {f.value && countMap[f.value] != null && (
                <span className={`ms-1.5 text-xs ${isActive ? "opacity-80" : "text-gray-400"}`}>
                  ({countMap[f.value]})
                </span>
              )}
            </a>
          );
        })}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
              <tr>
                <th className="px-5 py-3 text-start">المتقدّم</th>
                <th className="px-5 py-3 text-start">البريد الإلكتروني</th>
                <th className="px-5 py-3 text-start">نوع الطلب</th>
                <th className="px-5 py-3 text-start">اسم البرنامج</th>
                <th className="px-5 py-3 text-start">تاريخ الطلب</th>
                <th className="px-5 py-3 text-start">الحالة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {requests.length === 0 && (
                <tr><td colSpan={6} className="px-5 py-8 text-center text-gray-400">لا توجد طلبات</td></tr>
              )}
              {requests.map((req) => (
                <tr key={req.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3 font-medium text-gray-900">{req.user.name}</td>
                  <td className="px-5 py-3 text-gray-500 text-xs">{req.user.email}</td>
                  <td className="px-5 py-3 text-gray-700">{req.type}</td>
                  <td className="px-5 py-3">
                    <p className="text-gray-700">{req.programName}</p>
                    {req.notes && <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{req.notes}</p>}
                  </td>
                  <td className="px-5 py-3 text-gray-400 text-xs">
                    {new Date(req.createdAt).toLocaleDateString("ar-SA")}
                  </td>
                  <td className="px-5 py-3">
                    <RequestStatusSelect id={req.id} initialStatus={req.status} statusLabel={statusLabel} badgeStyle={badgeStyle} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
