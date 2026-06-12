type Application = {
  id: string;
  status: string;
  createdAt: Date;
  opportunity: { title: string };
};

interface Props {
  applications: Application[];
}

const statusLabel: Record<string, string> = {
  PENDING:  "قيد المراجعة",
  APPROVED: "مقبول",
  REJECTED: "مرفوض",
  COMPLETED: "مكتمل",
};

export default function VolunteerLog({ applications }: Props) {
  const approved = applications.filter((a) => a.status === "APPROVED" || a.status === "COMPLETED").length;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="bg-[#E0F7FA] rounded-xl px-5 py-3 text-center">
          <p className="text-2xl font-bold text-[#00B4C8]">{approved}</p>
          <p className="text-xs text-gray-500">فرصة مقبولة</p>
        </div>
        <div className="bg-[#F5F3FF] rounded-xl px-5 py-3 text-center">
          <p className="text-2xl font-bold text-[#3D1F6E]">{applications.length}</p>
          <p className="text-xs text-gray-500">إجمالي التسجيلات</p>
        </div>
      </div>

      {applications.length === 0 ? (
        <p className="text-gray-400 text-sm text-center py-6">لم تسجّل في أي فرصة تطوعية بعد</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-100">
          <table className="w-full text-sm">
            <thead className="bg-[#F5F3FF]">
              <tr>
                <th className="px-4 py-3 text-start text-xs font-bold text-[#3D1F6E]">الفرصة</th>
                <th className="px-4 py-3 text-start text-xs font-bold text-[#3D1F6E]">تاريخ التسجيل</th>
                <th className="px-4 py-3 text-start text-xs font-bold text-[#3D1F6E]">الحالة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {applications.map((app) => (
                <tr key={app.id} className="hover:bg-[#F5F3FF]/50">
                  <td className="px-4 py-3 font-medium text-[#1F2937]">{app.opportunity.title}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs">
                    {app.createdAt.toLocaleDateString("ar-SA")}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      app.status === "APPROVED" || app.status === "COMPLETED"
                        ? "bg-green-100 text-green-700"
                        : app.status === "REJECTED"
                        ? "bg-red-100 text-red-600"
                        : "bg-[#E0F7FA] text-[#0097AA]"
                    }`}>
                      {statusLabel[app.status] ?? app.status}
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
