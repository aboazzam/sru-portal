import Link from "next/link";
import { studentRequests, type RequestStatus } from "@/lib/sanad-mock";

const statusConfig: Record<RequestStatus, { label: string; color: string; bg: string; dot: string }> = {
  pending:     { label: "قيد المراجعة",  color: "#d97706", bg: "#fef3c7", dot: "🟡" },
  in_progress: { label: "جاري التنفيذ",  color: "#2563eb", bg: "#dbeafe", dot: "🔵" },
  completed:   { label: "مكتمل",         color: "#16a34a", bg: "#dcfce7", dot: "🟢" },
  rejected:    { label: "مرفوض",         color: "#dc2626", bg: "#fee2e2", dot: "🔴" },
};

export default function MyRequestsPage() {
  const counts = {
    pending:     studentRequests.filter((r) => r.status === "pending").length,
    in_progress: studentRequests.filter((r) => r.status === "in_progress").length,
    completed:   studentRequests.filter((r) => r.status === "completed").length,
    rejected:    studentRequests.filter((r) => r.status === "rejected").length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Link href="/sanad" className="hover:text-[#3D1F6E] transition-colors">سند</Link>
        <span>/</span>
        <span className="text-[#3D1F6E] font-medium">طلباتي</span>
      </div>

      {/* Status summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {(Object.entries(counts) as [RequestStatus, number][]).map(([status, count]) => {
          const cfg = statusConfig[status];
          return (
            <div
              key={status}
              className="bg-white rounded-xl border border-purple-100 p-4 text-center"
            >
              <div className="text-2xl mb-1">{cfg.dot}</div>
              <div className="text-2xl font-bold" style={{ color: cfg.color }}>{count}</div>
              <div className="text-xs text-gray-500 mt-0.5">{cfg.label}</div>
            </div>
          );
        })}
      </div>

      {/* Requests table */}
      <div className="bg-white rounded-2xl shadow-sm border border-purple-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-purple-50 flex items-center justify-between">
          <h2 className="font-bold text-[#3D1F6E]">جميع الطلبات</h2>
          <span className="text-xs text-gray-400">{studentRequests.length} طلب</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[#F5F3FF]">
              <tr>
                <th className="px-4 py-3 text-start text-xs font-bold text-[#3D1F6E]">رقم الطلب</th>
                <th className="px-4 py-3 text-start text-xs font-bold text-[#3D1F6E]">نوع الطلب</th>
                <th className="px-4 py-3 text-start text-xs font-bold text-[#3D1F6E] hidden sm:table-cell">التاريخ</th>
                <th className="px-4 py-3 text-start text-xs font-bold text-[#3D1F6E]">الحالة</th>
                <th className="px-4 py-3 text-start text-xs font-bold text-[#3D1F6E] hidden md:table-cell">ملاحظات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {studentRequests.map((req) => {
                const cfg = statusConfig[req.status];
                return (
                  <tr key={req.id} className="hover:bg-[#F5F3FF]/50 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-[#6B46C1] font-bold">{req.id}</td>
                    <td className="px-4 py-3 font-medium text-[#1F2937]">{req.type}</td>
                    <td className="px-4 py-3 text-gray-400 text-xs hidden sm:table-cell">
                      {new Date(req.date).toLocaleDateString("ar-SA")}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full"
                        style={{ color: cfg.color, background: cfg.bg }}
                      >
                        {cfg.dot} {cfg.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-xs hidden md:table-cell max-w-xs truncate">
                      {req.notes}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
