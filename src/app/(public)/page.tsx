import Link from "next/link";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import LanguageToggle from "@/components/LanguageToggle";

const modules = [
  {
    key: "hala",
    href: "/sanad",
    icon: "◉",
    accent: "#0D9488",
    bg: "bg-teal-50",
    border: "border-teal-200",
    iconBg: "bg-teal-100 text-teal-700",
    btn: "bg-teal-600 hover:bg-teal-700",
  },
  {
    key: "sanad",
    href: "/sanad",
    icon: "◎",
    accent: "#7C3AED",
    bg: "bg-purple-50",
    border: "border-purple-200",
    iconBg: "bg-purple-100 text-purple-700",
    btn: "bg-purple-600 hover:bg-purple-700",
  },
  {
    key: "facultyServices",
    href: "/faculty-services",
    icon: "◈",
    accent: "#2563EB",
    bg: "bg-blue-50",
    border: "border-blue-200",
    iconBg: "bg-blue-100 text-blue-700",
    btn: "bg-blue-600 hover:bg-blue-700",
  },
  {
    key: "clubs",
    href: "/sanad",
    icon: "◆",
    accent: "#D97706",
    bg: "bg-amber-50",
    border: "border-amber-200",
    iconBg: "bg-amber-100 text-amber-700",
    btn: "bg-amber-600 hover:bg-amber-700",
  },
  {
    key: "financial",
    href: "/sanad",
    icon: "◐",
    accent: "#0891B2",
    bg: "bg-cyan-50",
    border: "border-cyan-200",
    iconBg: "bg-cyan-100 text-cyan-700",
    btn: "bg-cyan-600 hover:bg-cyan-700",
  },
  {
    key: "scholarships",
    href: "/student/scholarships",
    icon: "◑",
    accent: "#6CAEBD",
    bg: "bg-primary-light",
    border: "border-primary-subtle",
    iconBg: "bg-primary-subtle text-primary-dark",
    btn: "bg-primary hover:bg-primary-dark",
  },
  {
    key: "training",
    href: "/student/trainings",
    icon: "◒",
    accent: "#EA580C",
    bg: "bg-orange-50",
    border: "border-orange-200",
    iconBg: "bg-orange-100 text-orange-700",
    btn: "bg-orange-600 hover:bg-orange-700",
  },
  {
    key: "graduates",
    href: "/sanad",
    icon: "◓",
    accent: "#BE185D",
    bg: "bg-rose-50",
    border: "border-rose-200",
    iconBg: "bg-rose-100 text-rose-700",
    btn: "bg-rose-600 hover:bg-rose-700",
  },
];

const stats = [
  { value: "+٥٠٠٠", label: "طالب وطالبة" },
  { value: "+٤٠٠",  label: "عضو هيئة تدريس" },
  { value: "٨",     label: "خدمات رقمية" },
  { value: "+١٥",   label: "عاماً من التميز" },
];

const features = [
  {
    icon: "◈",
    title: "وصول موحّد",
    desc: "جميع الخدمات الجامعية من منصة واحدة — من التسجيل الأكاديمي إلى الأنشطة الطلابية.",
    color: "text-primary",
    bg: "bg-primary-light",
  },
  {
    icon: "◉",
    title: "أمان وخصوصية",
    desc: "بياناتك محمية بأحدث معايير التشفير وضوابط الوصول المبنية على الأدوار.",
    color: "text-green-700",
    bg: "bg-green-50",
  },
  {
    icon: "◆",
    title: "دعم متكامل",
    desc: "إدارة المنح والتدريب التعاوني والأنشطة والمزيد — كل ما تحتاجه في مكان واحد.",
    color: "text-secondary",
    bg: "bg-secondary-light",
  },
];

export default async function LandingPage() {
  const t = await getTranslations();
  const year = new Date().getFullYear();

  return (
    <main className="min-h-screen bg-white flex flex-col font-sans">

      {/* ── Sticky Header ─────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-[#1B5E20]/95 backdrop-blur-sm shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-3.5 flex items-center justify-between">
          <Image
            src="/assets/logos/logo-white.svg"
            alt={t("Common.universityName")}
            width={180}
            height={40}
            style={{ height: "38px", width: "auto" }}
            priority
          />
          <div className="flex items-center gap-3">
            <LanguageToggle className="text-white" />
            <Link
              href="/login"
              className="px-5 py-2 bg-white text-green-800 rounded-lg font-semibold hover:bg-green-50 transition-colors text-sm shadow"
            >
              {t("Common.signIn")}
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero ──────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#1B5E20] via-green-800 to-[#1B5E20] text-white">
        {/* Decorative circles */}
        <div className="absolute -top-32 -start-32 w-96 h-96 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute top-20 -end-20 w-72 h-72 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute bottom-0 start-1/2 -translate-x-1/2 w-[120%] h-16 bg-white rounded-t-[50%] pointer-events-none" />

        <div className="relative max-w-4xl mx-auto px-6 pt-24 pb-32 text-center">
          <div
            className="inline-block mb-5 px-4 py-1.5 rounded-full border border-green-400/40 bg-green-700/40 text-green-200 text-xs font-medium tracking-wide animate-fade-in"
          >
            البوابة الجامعية الرسمية
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight animate-fade-in-up">
            {t("Landing.heroTitle")}
          </h1>

          <p className="text-green-200 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in-up" style={{ animationDelay: "80ms" }}>
            {t("Landing.heroSubtitle")}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up" style={{ animationDelay: "160ms" }}>
            <Link
              href="/login"
              className="px-10 py-4 bg-white text-[#1B5E20] rounded-xl font-bold text-base shadow-2xl hover:bg-green-50 hover:scale-105 transition-all duration-200"
            >
              {t("Landing.getStarted")} ←
            </Link>
            <a
              href="#services"
              className="px-8 py-4 border border-white/40 rounded-xl font-semibold text-base text-white hover:bg-white/10 transition-colors duration-200"
            >
              استكشف الخدمات
            </a>
          </div>
        </div>
      </section>

      {/* ── Stats Strip ───────────────────────────────── */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((s, i) => (
            <div
              key={s.label}
              className="animate-fade-in-up"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <p className="text-4xl font-extrabold text-[#1B5E20] mb-1 tabular-nums">{s.value}</p>
              <p className="text-gray-500 text-sm">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Services Grid ─────────────────────────────── */}
      <section id="services" className="py-20 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-2">الخدمات</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              {t("Landing.servicesTitle")}
            </h2>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">{t("Landing.servicesSubtitle")}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {modules.map((mod, i) => (
              <div
                key={mod.key}
                className={`group flex flex-col rounded-2xl border ${mod.border} ${mod.bg} p-6 gap-4 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-fade-in-up`}
                style={{ animationDelay: `${i * 50}ms` }}
              >
                {/* Icon + title */}
                <div className="flex items-center gap-3">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl font-bold shrink-0 ${mod.iconBg}`}>
                    {mod.icon}
                  </div>
                  <h3 className="font-bold text-gray-900 text-sm leading-snug">
                    {t(`Modules.${mod.key}.name`)}
                  </h3>
                </div>

                {/* Description */}
                <p className="text-gray-600 text-xs leading-relaxed flex-1">
                  {t(`Modules.${mod.key}.description`)}
                </p>

                {/* Responsible party */}
                <p className="text-[10px] text-gray-400">
                  <span className="font-semibold text-gray-500">{t("Landing.responsibleParty")}: </span>
                  {t(`Modules.${mod.key}.party`)}
                </p>

                {/* CTA */}
                <Link
                  href={mod.href}
                  className={`w-full text-center py-2 px-4 rounded-lg text-white text-xs font-semibold transition-colors ${mod.btn}`}
                >
                  {t("Landing.enterService")}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ──────────────────────────────────── */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-2">لماذا بوابتنا؟</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              منصة واحدة لكل احتياجاتك الجامعية
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((f, i) => (
              <div
                key={f.title}
                className="flex flex-col items-center text-center gap-4 p-8 rounded-2xl bg-gray-50 border border-gray-100 hover:shadow-md transition-shadow animate-fade-in-up"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-bold ${f.bg}`}>
                  <span className={f.color}>{f.icon}</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ────────────────────────────────── */}
      <section className="py-16 px-6 bg-gradient-to-l from-[#1B5E20] to-green-700 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
            ابدأ رحلتك الجامعية اليوم
          </h2>
          <p className="text-green-200 text-lg mb-8 max-w-xl mx-auto leading-relaxed">
            سجّل دخولك للوصول إلى جميع الخدمات الجامعية المتاحة لك في ثوانٍ.
          </p>
          <Link
            href="/login"
            className="inline-block px-12 py-4 bg-white text-[#1B5E20] rounded-xl font-bold text-base shadow-xl hover:bg-green-50 hover:scale-105 transition-all duration-200"
          >
            {t("Common.signIn")} →
          </Link>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────── */}
      <footer className="bg-[#0f3d18] text-green-300 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 mb-8 pb-8 border-b border-green-800">
            {/* Brand */}
            <div>
              <Image
                src="/assets/logos/logo-white.svg"
                alt={t("Common.universityName")}
                width={160}
                height={38}
                style={{ height: "38px", width: "auto" }}
                className="mb-3 opacity-90"
              />
              <p className="text-sm text-green-400 max-w-xs leading-relaxed">
                بوابة جامعة سليمان الراجحي — منصة رقمية متكاملة للخدمات الجامعية.
              </p>
            </div>

            {/* Quick links */}
            <nav className="flex flex-col gap-2 text-sm">
              <p className="font-semibold text-green-200 mb-1">{t("Landing.footerLinks")}</p>
              <Link href="/" className="hover:text-white transition-colors">{t("Landing.footerHome")}</Link>
              <Link href="/login" className="hover:text-white transition-colors">{t("Landing.footerLogin")}</Link>
              <a href="#services" className="hover:text-white transition-colors">الخدمات</a>
            </nav>

            {/* Portal access */}
            <div className="flex flex-col gap-2 text-sm">
              <p className="font-semibold text-green-200 mb-1">دخول المستخدمين</p>
              <Link href="/student" className="hover:text-white transition-colors">بوابة الطلاب</Link>
              <Link href="/faculty" className="hover:text-white transition-colors">بوابة هيئة التدريس</Link>
              <Link href="/admin" className="hover:text-white transition-colors">لوحة الإدارة</Link>
            </div>
          </div>

          <p className="text-center text-xs text-green-600">
            {t("Common.copyright", { year })}
          </p>
        </div>
      </footer>
    </main>
  );
}
