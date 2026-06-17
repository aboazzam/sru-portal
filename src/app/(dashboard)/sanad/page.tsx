import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { getCurrentUser } from "@/lib/dal";

export default async function SanadHomePage() {
  const user = await getCurrentUser();
  const t = await getTranslations("Sanad");

  const sections = [
    {
      href: "/sanad/academic",
      icon: "📚",
      title: t("sections.academic.title"),
      desc: t("sections.academic.desc"),
      services: [
        t("sections.academic.services.officialDoc"),
        t("sections.academic.services.schedule"),
        t("sections.academic.services.registration"),
        t("sections.academic.services.clearance"),
      ],
      accent: "#3D1F6E",
    },
    {
      href: "/sanad/activities",
      icon: "💡",
      title: t("sections.activities.title"),
      desc: t("sections.activities.desc"),
      services: [
        t("sections.activities.services.activities"),
        t("sections.activities.services.skills"),
        t("sections.activities.services.clubs"),
      ],
      accent: "#00B4C8",
    },
    {
      href: "/sanad/volunteer",
      icon: "🤲",
      title: t("sections.volunteer.title"),
      desc: t("sections.volunteer.desc"),
      services: [
        t("sections.volunteer.services.opportunities"),
        t("sections.volunteer.services.log"),
      ],
      accent: "#6B46C1",
    },
    {
      href: "/sanad/student-services",
      icon: "🎓",
      title: t("sections.studentServices.title"),
      desc: t("sections.studentServices.desc"),
      services: [
        t("sections.studentServices.services.health"),
        t("sections.studentServices.services.housing"),
        t("sections.studentServices.services.transport"),
      ],
      accent: "#0097AA",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-purple-100">
        <div className="flex items-center gap-4">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shrink-0"
            style={{ background: "linear-gradient(135deg,#3D1F6E,#6B46C1)" }}
          >
            📋
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#3D1F6E]">{t("title")}</h1>
            <p className="text-gray-500 text-sm mt-0.5">
              {t("welcome", { name: user?.name ?? "" })}، {t("subtitle")}
            </p>
          </div>
        </div>
      </div>

      {/* Quick action */}
      <Link
        href="/sanad/my-requests"
        className="flex items-center justify-between bg-white rounded-xl px-5 py-4 border border-cyan-200 hover:border-[#00B4C8] hover:shadow-md transition-all group"
      >
        <div className="flex items-center gap-3">
          <span className="text-xl">📋</span>
          <div>
            <p className="font-semibold text-[#3D1F6E] group-hover:text-[#00B4C8] transition-colors">
              {t("myRequests")}
            </p>
            <p className="text-gray-400 text-xs">{t("myRequestsDesc")}</p>
          </div>
        </div>
        <span className="text-[#00B4C8] text-lg">←</span>
      </Link>

      {/* Section cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {sections.map((sec) => (
          <div
            key={sec.href}
            className="bg-white rounded-2xl shadow-sm border border-purple-100 overflow-hidden hover:shadow-lg transition-shadow"
          >
            {/* Card top accent */}
            <div className="h-1" style={{ background: sec.accent }} />

            <div className="p-5 flex flex-col gap-4">
              <div className="flex items-start gap-3">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0"
                  style={{ backgroundColor: sec.accent + "22" }}
                >
                  {sec.icon}
                </div>
                <div>
                  <h2 className="font-bold text-[#1F2937] text-base">{sec.title}</h2>
                  <p className="text-gray-500 text-xs mt-1 leading-relaxed">{sec.desc}</p>
                </div>
              </div>

              {/* Services list */}
              <ul className="space-y-1.5">
                {sec.services.map((svc) => (
                  <li key={svc} className="flex items-center gap-2 text-sm text-gray-600">
                    <span
                      className="w-1.5 h-1.5 rounded-full shrink-0"
                      style={{ background: sec.accent }}
                    />
                    {svc}
                  </li>
                ))}
              </ul>

              <Link
                href={sec.href}
                className="mt-1 block text-center py-2.5 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
                style={{ background: sec.accent }}
              >
                {t("enterSection")}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
