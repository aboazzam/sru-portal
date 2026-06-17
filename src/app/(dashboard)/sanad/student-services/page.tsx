export const dynamic = 'force-dynamic';

import Link from "next/link";
import { getTranslations } from "next-intl/server";

export default async function StudentServicesPage() {
  const t = await getTranslations("Sanad");

  const services = [
    {
      icon: "🏥",
      title: t("studentServicesPage.health.title"),
      accentColor: "#00B4C8",
      items: [
        { label: t("studentServicesPage.health.clinic.label"),    desc: t("studentServicesPage.health.clinic.desc") },
        { label: t("studentServicesPage.health.insurance.label"), desc: t("studentServicesPage.health.insurance.desc") },
        { label: t("studentServicesPage.health.counseling.label"),desc: t("studentServicesPage.health.counseling.desc") },
      ],
      emergencyNote: t("studentServicesPage.health.emergency"),
    },
    {
      icon: "🏠",
      title: t("studentServicesPage.housing.title"),
      accentColor: "#3D1F6E",
      items: [
        { label: t("studentServicesPage.housing.dormitory.label"),  desc: t("studentServicesPage.housing.dormitory.desc") },
        { label: t("studentServicesPage.housing.rules.label"),      desc: t("studentServicesPage.housing.rules.desc") },
        { label: t("studentServicesPage.housing.maintenance.label"),desc: t("studentServicesPage.housing.maintenance.desc") },
      ],
      emergencyNote: t("studentServicesPage.housing.emergency"),
    },
    {
      icon: "🚌",
      title: t("studentServicesPage.transport.title"),
      accentColor: "#6B46C1",
      items: [
        { label: t("studentServicesPage.transport.buses.label"),       desc: t("studentServicesPage.transport.buses.desc") },
        { label: t("studentServicesPage.transport.registration.label"),desc: t("studentServicesPage.transport.registration.desc") },
        { label: t("studentServicesPage.transport.schedules.label"),   desc: t("studentServicesPage.transport.schedules.desc") },
      ],
      emergencyNote: t("studentServicesPage.transport.emergency"),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Link href="/sanad" className="hover:text-[#3D1F6E] transition-colors">{t("breadcrumb")}</Link>
        <span>/</span>
        <span className="text-[#3D1F6E] font-medium">{t("studentServicesPage.breadcrumb")}</span>
      </div>

      {services.map((svc) => (
        <div
          key={svc.title}
          className="bg-white rounded-2xl shadow-sm border border-purple-100 overflow-hidden"
        >
          <div className="h-1" style={{ background: svc.accentColor }} />
          <div className="p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0"
                style={{ background: svc.accentColor + "22" }}
              >
                {svc.icon}
              </div>
              <h2 className="font-bold text-[#3D1F6E] text-base">{svc.title}</h2>
            </div>

            <div className="space-y-3">
              {svc.items.map((item) => (
                <div key={item.label} className="flex gap-3">
                  <div
                    className="w-1 rounded-full shrink-0 mt-1"
                    style={{ background: svc.accentColor, minHeight: "16px" }}
                  />
                  <div>
                    <p className="font-semibold text-[#1F2937] text-sm">{item.label}</p>
                    <p className="text-gray-500 text-xs mt-0.5 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs"
              style={{ background: svc.accentColor + "11", color: svc.accentColor }}
            >
              <span>ℹ️</span>
              <span>{svc.emergencyNote}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
