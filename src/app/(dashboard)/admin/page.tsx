import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/dal";
import { getTranslations } from "next-intl/server";
import { prisma } from "@/lib/db";

export default async function AdminDashboard() {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") redirect("/dashboard");
  const t = await getTranslations("Admin");
  const td = await getTranslations("Dashboard");

  const [totalUsers, students, faculty] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { role: "STUDENT" } }),
    prisma.user.count({ where: { role: "FACULTY" } }),
  ]);

  const recentUsers = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });

  const cards = [
    { title: t("totalUsers"), value: totalUsers, color: "bg-gray-50 border-gray-200 text-gray-700" },
    { title: t("students"), value: students, color: "bg-blue-50 border-blue-200 text-blue-700" },
    { title: t("faculty"), value: faculty, color: "bg-green-50 border-green-200 text-green-700" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{t("title")}</h1>
        <p className="text-gray-500 text-sm mt-1">{t("subtitle")}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {cards.map((card) => (
          <div key={card.title} className={`rounded-xl border p-5 ${card.color}`}>
            <p className="text-sm font-medium opacity-80">{card.title}</p>
            <p className="text-3xl font-bold mt-1">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-800">{t("recentUsers")}</h2>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
            <tr>
              <th className="px-5 py-3 text-start">{t("name")}</th>
              <th className="px-5 py-3 text-start">{t("email")}</th>
              <th className="px-5 py-3 text-start">{t("role")}</th>
              <th className="px-5 py-3 text-start">{t("joined")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {recentUsers.map((u: typeof recentUsers[number]) => (
              <tr key={u.id} className="hover:bg-gray-50">
                <td className="px-5 py-3 font-medium text-gray-900">{u.name}</td>
                <td className="px-5 py-3 text-gray-500">{u.email}</td>
                <td className="px-5 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    u.role === "ADMIN" ? "bg-purple-100 text-purple-700" :
                    u.role === "FACULTY" ? "bg-green-100 text-green-700" :
                    "bg-blue-100 text-blue-700"
                  }`}>
                    {td(`roles.${u.role}`)}
                  </span>
                </td>
                <td className="px-5 py-3 text-gray-400">
                  {u.createdAt.toLocaleDateString()}
                </td>
              </tr>
            ))}
            {recentUsers.length === 0 && (
              <tr>
                <td colSpan={4} className="px-5 py-6 text-center text-gray-400">
                  {t("noUsers")}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
