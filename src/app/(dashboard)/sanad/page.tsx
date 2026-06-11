import Link from "next/link";
import { getCurrentUser } from "@/lib/dal";

const sections = [
  {
    href: "/sanad/academic",
    icon: "📚",
    title: "الأنشطة الأكاديمية",
    desc: "طلب الوثائق الرسمية، الجدول الدراسي، التسجيل في المقررات، وإخلاء الطرف",
    services: ["طلب وثيقة رسمية", "الجدول الدراسي", "التسجيل في المقررات", "إخلاء الطرف"],
    accent: "#3D1F6E",
  },
  {
    href: "/sanad/activities",
    icon: "💡",
    title: "المهارات والأنشطة",
    desc: "الأنشطة والفعاليات، برامج تطوير المهارات، والأندية الطلابية",
    services: ["الأنشطة والفعاليات", "برامج تطوير المهارات", "الأندية الطلابية"],
    accent: "#00B4C8",
  },
  {
    href: "/sanad/volunteer",
    icon: "🤲",
    title: "الفرص التطوعية",
    desc: "استعرض فرص التطوع المتاحة وتابع سجل تطوعك",
    services: ["الفرص المتاحة", "سجل التطوع"],
    accent: "#6B46C1",
  },
  {
    href: "/sanad/student-services",
    icon: "🎓",
    title: "الخدمات الطلابية",
    desc: "الخدمات الصحية، الإسكان والسكن، وخدمات النقل",
    services: ["الخدمات الصحية", "الإسكان والسكن", "خدمات النقل"],
    accent: "#0097AA",
  },
];

export default async function SanadHomePage() {
  const user = await getCurrentUser();

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
            <h1 className="text-2xl font-bold text-[#3D1F6E]">سند – خدمات الطلاب</h1>
            <p className="text-gray-500 text-sm mt-0.5">
              مرحباً {user?.name}، اختر القسم الذي تحتاجه
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
              طلباتي
            </p>
            <p className="text-gray-400 text-xs">تابع حالة طلباتك المقدّمة</p>
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
                الدخول للقسم
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
