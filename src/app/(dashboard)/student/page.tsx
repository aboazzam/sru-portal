import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/dal";
import { getTranslations } from "next-intl/server";

export default async function StudentDashboard() {
  const user = await getCurrentUser();
  if (!user || user.role !== "STUDENT") redirect("/dashboard");
  const t = await getTranslations("Student");

  const cards = [
    { title: t("myCourses"), value: "5", sub: t("coursesEnrolled"), color: "bg-blue-50 border-blue-200 text-blue-700" },
    { title: t("gpa"), value: "3.8", sub: t("currentSemester"), color: "bg-green-50 border-green-200 text-green-700" },
    { title: t("attendance"), value: "92%", sub: t("overallAttendance"), color: "bg-purple-50 border-purple-200 text-purple-700" },
  ];

  const links = [t("grades"), t("schedule"), t("exams"), t("library"), t("financial")];

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
