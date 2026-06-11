import { schedule } from "@/lib/sanad-mock";

const days = ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس"];

export default function CourseSchedule() {
  const byDay: Record<string, typeof schedule> = {};
  for (const d of days) byDay[d] = schedule.filter((s) => s.day === d);

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-separate" style={{ borderSpacing: "4px" }}>
        <thead>
          <tr>
            {days.map((d) => (
              <th
                key={d}
                className="px-3 py-2 text-center text-xs font-bold text-white rounded-lg"
                style={{ background: "#3D1F6E", minWidth: "120px" }}
              >
                {d}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            {days.map((d) => (
              <td key={d} className="align-top">
                <div className="space-y-2">
                  {byDay[d].length === 0 ? (
                    <div className="text-center text-gray-300 text-xs py-4">—</div>
                  ) : (
                    byDay[d].map((s, i) => (
                      <div
                        key={i}
                        className="rounded-lg p-2 text-white text-xs"
                        style={{ background: s.color }}
                      >
                        <p className="font-semibold leading-tight">{s.course}</p>
                        <p className="opacity-80 mt-0.5">{s.slot}</p>
                        <p className="opacity-70">{s.room}</p>
                      </div>
                    ))
                  )}
                </div>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
