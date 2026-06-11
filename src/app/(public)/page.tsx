import Link from "next/link";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import LanguageToggle from "@/components/LanguageToggle";

const modules = [
  {
    key: "hala",
    href: "/hala",
    icon: "💬",
    color: "from-teal-500 to-teal-600",
    btnStyle: undefined as React.CSSProperties | undefined,
    border: "border-teal-300",
    bg: "bg-teal-50",
    iconBg: "bg-teal-100",
  },
  {
    key: "sanad",
    href: "/sanad",
    icon: "📋",
    color: "from-purple-500 to-purple-600",
    btnStyle: undefined as React.CSSProperties | undefined,
    border: "border-purple-300",
    bg: "bg-purple-50",
    iconBg: "bg-purple-100",
  },
  {
    key: "facultyServices",
    href: "/faculty-services",
    icon: "🎓",
    color: "from-blue-500 to-blue-600",
    btnStyle: undefined as React.CSSProperties | undefined,
    border: "border-blue-300",
    bg: "bg-blue-50",
    iconBg: "bg-blue-100",
  },
  {
    key: "clubs",
    href: "/clubs",
    icon: "⭐",
    color: "from-yellow-500 to-amber-600",
    btnStyle: undefined as React.CSSProperties | undefined,
    border: "border-yellow-300",
    bg: "bg-yellow-50",
    iconBg: "bg-yellow-100",
  },
  {
    key: "financial",
    href: "/financial",
    icon: "💰",
    color: "",
    btnStyle: { background: "linear-gradient(to left, #00B4C8, #0097AA)" } as React.CSSProperties,
    border: "border-cyan-300",
    bg: "bg-cyan-50",
    iconBg: "bg-cyan-100",
  },
  {
    key: "scholarships",
    href: "/scholarships",
    icon: "🎁",
    color: "",
    btnStyle: { background: "linear-gradient(to left, #3D1F6E, #2C1650)" } as React.CSSProperties,
    border: "border-purple-300",
    bg: "bg-purple-50",
    iconBg: "bg-purple-100",
  },
  {
    key: "training",
    href: "/training",
    icon: "💼",
    color: "from-orange-500 to-orange-600",
    btnStyle: undefined as React.CSSProperties | undefined,
    border: "border-orange-300",
    bg: "bg-orange-50",
    iconBg: "bg-orange-100",
  },
  {
    key: "graduates",
    href: "/graduates",
    icon: "🏛️",
    color: "from-rose-500 to-rose-600",
    btnStyle: undefined as React.CSSProperties | undefined,
    border: "border-rose-300",
    bg: "bg-rose-50",
    iconBg: "bg-rose-100",
  },
];

export default async function LandingPage() {
  const t = await getTranslations();

  return (
    <main className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#1B5E20] shadow-lg">
  <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
    <div className="flex items-center">
      <Image
  src="/assets/logos/sru-logo.svg"
  alt={t("Common.universityName")}
  width={200}
  height={40}
  className="h-10 w-auto brightness-0 invert"
  priority
/>
    </div>
          <div className="flex items-center gap-3">
            <LanguageToggle className="text-white" />
            <Link
              href="/login"
              className="px-5 py-2 bg-white text-green-800 rounded-lg font-semibold hover:bg-green-50 transition-colors text-sm"
            >
              {t("Common.signIn")}
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-br from-[#1B5E20] via-green-800 to-emerald-700 text-white py-24 px-6">
        <div className="max-w-4xl mx-auto text-center animate-fade-in">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
            {t("Landing.heroTitle")}
          </h1>
          <p className="text-green-200 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            {t("Landing.heroSubtitle")}
          </p>
          <Link
            href="/login"
            className="inline-block px-10 py-4 bg-white text-[#1B5E20] rounded-2xl font-bold text-lg shadow-2xl hover:bg-green-50 hover:scale-105 transition-all duration-200"
          >
            {t("Landing.getStarted")}
          </Link>
        </div>
      </section>

      {/* Services Grid */}
      <section className="flex-1 py-20 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              {t("Landing.servicesTitle")}
            </h2>
            <p className="text-gray-500 text-lg">{t("Landing.servicesSubtitle")}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {modules.map((mod, i) => (
              <div
                key={mod.key}
                className={`group rounded-2xl border ${mod.border} ${mod.bg} p-6 flex flex-col gap-4 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-fade-in-up`}
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-12 h-12 rounded-xl ${mod.iconBg} flex items-center justify-center text-2xl shrink-0`}
                  >
                    {mod.icon}
                  </div>
                  <h3 className="font-bold text-gray-900 text-base leading-tight">
                    {t(`Modules.${mod.key}.name`)}
                  </h3>
                </div>

                <p className="text-gray-600 text-sm leading-relaxed flex-1">
                  {t(`Modules.${mod.key}.description`)}
                </p>

                <div className="text-xs text-gray-500">
                  <span className="font-semibold">{t("Landing.responsibleParty")}: </span>
                  {t(`Modules.${mod.key}.party`)}
                </div>

                <div className="flex gap-2 pt-1">
                  <Link
                    href={mod.href}
                    className={`flex-1 text-center py-2 px-3 rounded-lg text-white text-xs font-semibold hover:opacity-90 transition-opacity${mod.color ? ` bg-gradient-to-l ${mod.color}` : ""}`}
                    style={mod.btnStyle}
                  >
                    {t("Landing.enterService")}
                  </Link>
                  <button className="flex-1 py-2 px-3 rounded-lg border border-gray-300 text-gray-600 text-xs font-semibold hover:bg-white transition-colors">
                    {t("Landing.rateService")}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-green-900 text-green-200 py-10 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="font-bold text-white text-lg mb-1">
              {t("Common.universityName")}
            </div>
            <p className="text-sm">
              {t("Common.copyright", { year: new Date().getFullYear() })}
            </p>
          </div>
          <nav className="flex gap-6 text-sm">
            <span className="font-semibold text-green-300">
              {t("Landing.footerLinks")}:
            </span>
            <Link href="/" className="hover:text-white transition-colors">
              {t("Landing.footerHome")}
            </Link>
            <Link href="/login" className="hover:text-white transition-colors">
              {t("Landing.footerLogin")}
            </Link>
          </nav>
        </div>
      </footer>
    </main>
  );
}
