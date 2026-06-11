import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/dal";
import { getTranslations } from "next-intl/server";

export default async function FacultyDashboard() {
  const user = await getCurrentUser();
  if (!user || user.role !== "FACULTY") redirect("/dashboard");
  const t = await getTranslations("Faculty");

  const cards = [
    { title: t("activeCourses"), value: "3", sub: t("thisSemester"), color: "bg-blue-50 border-blue-200 text-blue-700" },
    { title: t("totalStudents"), value: "124", sub: t("acrossAllCourses"), color: "bg-amber-50 border-amber-200 text-amber-700" },
    { title: t("pendingGrades"), value: "18", sub: t("needSubmission"), color: "bg-red-50 border-red-200 text-red-700" },
  ];

  const links = [t("manage"), t("grades"), t("attendance"), t("students"), t("office")];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{t("welcome", { name: user.name })}</h1>
        <p className="text-gray-500 text-sm mt-1">{t("subtitle")}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((card) => (
          <div key={card.title} className={`rounded-xl border p-5 ${card.color}`}>
            <p className="text-sm font-medium opacity-80">{card.title}</p>
            <p className="text-3xl font-bold mt-1">{card.value}</p>
            <p className="text-xs opacity-70 mt-1">{card.sub}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="font-semibold text-gray-800 mb-3">{t("quickLinks")}</h2>
        <ul className="space-y-2 text-sm text-green-700">
          {links.map((link) => (
            <li key={link}>
              <a href="#" className="hover:underline underline-offset-2">
                {link}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
