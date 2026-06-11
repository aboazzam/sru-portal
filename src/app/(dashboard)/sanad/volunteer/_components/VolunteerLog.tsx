import { volunteerLog } from "@/lib/sanad-mock";

export default function VolunteerLog() {
  const total = volunteerLog.reduce((s, l) => s + (l.status === "مكتمل" ? l.hours : 0), 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="bg-[#E0F7FA] rounded-xl px-5 py-3 text-center">
          <p className="text-2xl font-bold text-[#00B4C8]">{total}</p>
          <p className="text-xs text-gray-500">ساعة تطوع مكتملة</p>
        </div>
        <div className="bg-[#F5F3FF] rounded-xl px-5 py-3 text-center">
          <p className="text-2xl font-bold text-[#3D1F6E]">{volunteerLog.length}</p>
          <p className="text-xs text-gray-500">نشاط إجمالي</p>
        </div>
      </div>

      {volunteerLog.length === 0 ? (
        <p className="text-gray-400 text-sm text-center py-6">لا يوجد سجل تطوع بعد</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-100">
          <table className="w-full text-sm">
            <thead className="bg-[#F5F3FF]">
              <tr>
                <th className="px-4 py-3 text-start text-xs font-bold text-[#3D1F6E]">النشاط</th>
                <th className="px-4 py-3 text-start text-xs font-bold text-[#3D1F6E]">التاريخ</th>
                <th className="px-4 py-3 text-start text-xs font-bold text-[#3D1F6E]">الساعات</th>
                <th className="px-4 py-3 text-start text-xs font-bold text-[#3D1F6E]">الحالة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {volunteerLog.map((log) => (
                <tr key={log.id} className="hover:bg-[#F5F3FF]/50">
                  <td className="px-4 py-3 font-medium text-[#1F2937]">{log.activity}</td>
                  <td className="px-4 py-3 text-gray-500">{new Date(log.date).toLocaleDateString("ar-SA")}</td>
                  <td className="px-4 py-3 text-[#3D1F6E] font-bold">{log.hours}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        log.status === "مكتمل"
                          ? "bg-green-100 text-green-700"
                          : "bg-[#E0F7FA] text-[#0097AA]"
                      }`}
                    >
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
