import Link from "next/link";

const services = [
  {
    icon: "🏥",
    title: "الخدمات الصحية",
    accentColor: "#00B4C8",
    items: [
      { label: "العيادة الجامعية",         desc: "الأحد – الخميس، 8:00 – 16:00 | مبنى الخدمات الطلابية" },
      { label: "التأمين الطلابي",           desc: "تغطية شاملة لجميع الطلاب المسجّلين خلال الفصل الدراسي" },
      { label: "التوجيه النفسي والإرشاد",   desc: "جلسات فردية وجماعية مع متخصصين معتمدين" },
    ],
    emergencyNote: "للطوارئ: اتصل بـ 911 أو زر العيادة فوراً",
  },
  {
    icon: "🏠",
    title: "الإسكان والسكن",
    accentColor: "#3D1F6E",
    items: [
      { label: "السكن الجامعي",        desc: "غرف فردية ومشتركة — التقديم قبل بداية كل فصل بـ 4 أسابيع" },
      { label: "قواعد السكن",          desc: "راجع دليل السكن الجامعي للاطلاع على الأنظمة واللوائح" },
      { label: "الصيانة والبلاغات",    desc: "قدّم بلاغات الصيانة عبر بوابة السكن أو اتصل بالإدارة" },
    ],
    emergencyNote: "إدارة السكن: داخلي 2400 | يعمل 24 ساعة",
  },
  {
    icon: "🚌",
    title: "خدمات النقل",
    accentColor: "#6B46C1",
    items: [
      { label: "الحافلات الجامعية",    desc: "مسارات يومية تغطي المناطق السكنية الرئيسية حول الجامعة" },
      { label: "التسجيل في الخدمة",    desc: "سجّل في خدمة الحافلات عبر النظام — المقاعد محدودة" },
      { label: "جداول التشغيل",        desc: "الجدول متاح على لوحات الجامعة وبوابة الطالب" },
    ],
    emergencyNote: "للاستفسار عن مواعيد الحافلات: داخلي 2600",
  },
];

export default function StudentServicesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Link href="/sanad" className="hover:text-[#3D1F6E] transition-colors">سند</Link>
        <span>/</span>
        <span className="text-[#3D1F6E] font-medium">الخدمات الطلابية</span>
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
