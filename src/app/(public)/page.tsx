import Link from "next/link";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import LanguageToggle from "@/components/LanguageToggle";

// ── All built modules ─────────────────────────────────────────
const modules = [
  {
    href:        "/hala",
    icon:        "👋",
    name:        "هلا بك",
    description: "الدليل الجامعي والإعلانات والاستفسارات — نقطة البداية لكل طالب جديد",
    party:       "عمادة شؤون الطلاب",
    primary:     "#0D9488",
    bg:          "#F0FDFA",
    border:      "#99F6E4",
    badge:       "#CCFBF1",
    badgeText:   "#0F766E",
  },
  {
    href:        "/financial",
    icon:        "💳",
    name:        "الخدمات المالية",
    description: "الرسوم الدراسية والمدفوعات والفواتير والكشوف المالية",
    party:       "الإدارة المالية",
    primary:     "#6CAEBD",
    bg:          "#E8F6F8",
    border:      "#C8E6EC",
    badge:       "#C8E6EC",
    badgeText:   "#4A8FA0",
  },
  {
    href:        "/scholarships",
    icon:        "🎓",
    name:        "المنح الدراسية",
    description: "المنح الدراسية والدعم المالي والتقديم على برامج التمويل",
    party:       "عمادة شؤون الطلاب",
    primary:     "#875E9E",
    bg:          "#F3EEF7",
    border:      "#D8C8E8",
    badge:       "#D8C8E8",
    badgeText:   "#6A4A7E",
  },
  {
    href:        "/training",
    icon:        "🏢",
    name:        "التدريب التعاوني",
    description: "فرص التدريب وخدمات التوظيف والتسجيل في البرامج التدريبية",
    party:       "عمادة التطوير الوظيفي",
    primary:     "#4A8FA0",
    bg:          "#EFF8FA",
    border:      "#A8D8E2",
    badge:       "#A8D8E2",
    badgeText:   "#2E6878",
  },
  {
    href:        "/alumni",
    icon:        "🤝",
    name:        "الخريجون",
    description: "شبكة الخريجين وفرص العمل والتواصل المهني وخدمات ما بعد التخرج",
    party:       "عمادة خدمة المجتمع",
    primary:     "#6A4A7E",
    bg:          "#F5F0F9",
    border:      "#D8C8E8",
    badge:       "#E8D8F0",
    badgeText:   "#6A4A7E",
  },
  {
    href:        "/services",
    icon:        "🛎️",
    name:        "الخدمات الطلابية",
    description: "طلب الوثائق والشهادات والخدمات الإدارية الجامعية",
    party:       "عمادة شؤون الطلاب",
    primary:     "#059669",
    bg:          "#ECFDF5",
    border:      "#A7F3D0",
    badge:       "#A7F3D0",
    badgeText:   "#065F46",
  },
  {
    href:        "/volunteers",
    icon:        "🌱",
    name:        "التطوع",
    description: "فرص التطوع المجتمعي والمشاركة في المبادرات والحصول على شهادات",
    party:       "عمادة شؤون الطلاب",
    primary:     "#EA580C",
    bg:          "#FFF7ED",
    border:      "#FED7AA",
    badge:       "#FED7AA",
    badgeText:   "#9A3412",
  },
  {
    href:        "/activities",
    icon:        "🎯",
    name:        "الأنشطة الطلابية",
    description: "الأنشطة الثقافية والاجتماعية والتسجيل في الفعاليات الجامعية",
    party:       "عمادة شؤون الطلاب",
    primary:     "#2563EB",
    bg:          "#EFF6FF",
    border:      "#BFDBFE",
    badge:       "#BFDBFE",
    badgeText:   "#1E40AF",
  },
  {
    href:        "/clubs",
    icon:        "⚽",
    name:        "الأندية الرياضية",
    description: "الانضمام للأندية الرياضية والمشاركة في البطولات والفعاليات",
    party:       "عمادة شؤون الطلاب",
    primary:     "#DC2626",
    bg:          "#FEF2F2",
    border:      "#FECACA",
    badge:       "#FECACA",
    badgeText:   "#991B1B",
  },
  {
    href:        "/news",
    icon:        "📰",
    name:        "الأخبار الجامعية",
    description: "آخر أخبار الجامعة والفعاليات والإعلانات الأكاديمية والإبداعية",
    party:       "إدارة الاتصال المؤسسي",
    primary:     "#7C3AED",
    bg:          "#F5F3FF",
    border:      "#DDD6FE",
    badge:       "#DDD6FE",
    badgeText:   "#5B21B6",
  },
];

const stats = [
  { value: "+2359", label: "طالب وطالبة" },
  { value: "+85",  label: "عضو هيئة تدريس" },
  { value: "+100",    label: "خدمات رقمية" },
  { value: "+12",   label: "عاماً من التميز" },
];

const features = [
  {
    icon: "🔐",
    title: "أمان وخصوصية",
    desc:  "بياناتك محمية بأحدث معايير التشفير وضوابط الوصول المبنية على الأدوار.",
    bg:    "#F0FDFA",
    color: "#0F766E",
  },
  {
    icon: "📱",
    title: "وصول موحّد",
    desc:  "جميع الخدمات الجامعية من منصة واحدة — في أي وقت ومن أي مكان.",
    bg:    "#EFF6FF",
    color: "#1D4ED8",
  },
  {
    icon: "⚡",
    title: "سرعة وكفاءة",
    desc:  "أنجز معاملاتك في دقائق بدلاً من ساعات دون الحاجة للحضور الشخصي.",
    bg:    "#F5F3FF",
    color: "#6D28D9",
  },
];

export default async function LandingPage() {
  const t  = await getTranslations("Common");
  const tl = await getTranslations("Landing");
  const year = new Date().getFullYear();

  return (
    <main className="min-h-screen bg-white flex flex-col font-sans" dir="rtl">

      {/* ── Sticky Header ──────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-[#2C1650]/95 backdrop-blur-sm shadow-lg">
  <div className="max-w-7xl mx-auto px-6 py-3.5 flex items-center justify-between">
    <a
      href="https://sru-portal.aboazzam.art"
      target="_blank"
      rel="noopener noreferrer"
    >
    <img src="/assets/logos/logo-white.png"
      alt={t("universityName")}
      width={180}
      height={40}
      />
    </a>
    <div className="flex items-center gap-3">
      <LanguageToggle className="text-white" />
      <Link
        href="/login"
        className="px-5 py-2 bg-white text-[#1B5E20] rounded-lg font-semibold hover:bg-green-50 transition-colors text-sm shadow"
      >
        {t("signIn")}
      </Link>
    </div>
  </div>
</header>

      {/* ── Hero ───────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#6B46C1] via-[#3D1F6E] to-[#2C1650] text-white">
        <div className="absolute -top-32 -start-32 w-96 h-96 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute top-20 -end-20 w-72 h-72 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute -bottom-1 start-0 end-0 h-16 bg-white"
          style={{ borderRadius: "50% 50% 0 0 / 100% 100% 0 0" }}
        />

        <div className="relative max-w-4xl mx-auto px-6 pt-24 pb-32 text-center">
          <div className="inline-block mb-5 px-4 py-1.5 rounded-full border border-#2C1650-400/40 bg-#2C1650-700/40 text-#2C1650-200 text-xs font-medium tracking-wide animate-fade-in">
            البوابة الجامعية الرسمية
          </div>

          <h1 className="text-4xl md:text-3xl font-extrabold mb-5 leading-tight animate-fade-in-up">
            {tl("heroTitle")}
          </h1>

          <p className="text-green-200 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in-up" style={{ animationDelay: "80ms" }}>
            {tl("heroSubtitle")}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up" style={{ animationDelay: "160ms" }}>
            <Link
              href="/login"
              className="px-10 py-4 bg-white text-[#1B5E20] rounded-xl font-bold text-base shadow-2xl hover:bg-green-50 hover:scale-105 transition-all duration-200"
            >
              {tl("getStarted")} ←
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

      {/* ── Stats Strip ────────────────────────────────── */}
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

      {/* ── Services Grid ──────────────────────────────── */}
      <section id="services" className="py-20 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#4A8FA0] mb-2">الخدمات</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              {tl("servicesTitle")}
            </h2>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">{tl("servicesSubtitle")}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {modules.map((mod, i) => (
              <div
                key={mod.href}
                className="group flex flex-col rounded-2xl border p-6 gap-4 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-fade-in-up"
                style={{
                  background:    mod.bg,
                  borderColor:   mod.border,
                  animationDelay: `${i * 50}ms`,
                }}
              >
                {/* Icon + name */}
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 shadow-sm"
                    style={{ background: "white" }}
                  >
                    {mod.icon}
                  </div>
                  <h3 className="font-bold text-gray-900 text-sm leading-snug">{mod.name}</h3>
                </div>

                {/* Description */}
                <p className="text-gray-600 text-xs leading-relaxed flex-1">{mod.description}</p>

                {/* Party badge */}
                <p
                  className="text-[10px] font-semibold px-2 py-1 rounded-lg w-fit"
                  style={{ background: mod.badge, color: mod.badgeText }}
                >
                  {mod.party}
                </p>

                {/* CTA */}
                <Link
                  href={mod.href}
                  className="w-full text-center py-2.5 px-4 rounded-xl text-white text-xs font-bold transition-all duration-200 hover:opacity-90 hover:shadow-md"
                  style={{ background: `linear-gradient(to left, ${mod.primary}, ${mod.primary}CC)` }}
                >
                  {tl("enterService")} ←
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why the Portal ─────────────────────────────── */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#4A8FA0] mb-2">لماذا بوابتنا؟</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">منصة واحدة لكل احتياجاتك الجامعية</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((f, i) => (
              <div
                key={f.title}
                className="flex flex-col items-center text-center gap-4 p-8 rounded-2xl border border-gray-100 hover:shadow-md transition-shadow animate-fade-in-up"
                style={{ background: f.bg, animationDelay: `${i * 100}ms` }}
              >
                <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center text-3xl shadow-sm">
                  {f.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Portal Access by Role ──────────────────────── */}
      <section className="py-16 px-6 bg-gray-50 border-y border-gray-100">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">بوابة مخصّصة لكل مستخدم</h2>
            <p className="text-gray-500 text-sm mt-2 max-w-md mx-auto">سجّل دخولك وستُوجَّه تلقائياً إلى لوحة التحكم المناسبة لدورك</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[
              {
                icon:  "🎓",
                title: "الطلاب",
                desc:  "وصول كامل لجميع الخدمات الطلابية والأنشطة والأندية والمنح",
                bg:    "#EFF6FF",
                color: "#2563EB",
              },
              {
                icon:  "👨‍🏫",
                title: "هيئة التدريس",
                desc:  "إدارة المقررات وتسجيل الدرجات ومتابعة الطلاب",
                bg:    "#ECFDF5",
                color: "#059669",
              },
              {
                icon:  "⚙️",
                title: "الإدارة",
                desc:  "لوحة تحكم كاملة لإدارة المنصة والمستخدمين والصلاحيات",
                bg:    "#FEF3C7",
                color: "#D97706",
              },
            ].map((role, i) => (
              <div
                key={role.title}
                className="rounded-2xl p-6 text-center flex flex-col items-center gap-3 animate-fade-in-up border border-gray-100"
                style={{ background: role.bg, animationDelay: `${i * 100}ms` }}
              >
                <div className="text-4xl">{role.icon}</div>
                <h3 className="font-bold text-gray-900">{role.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{role.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ─────────────────────────────────── */}
      <section className="py-20 px-6 bg-gradient-to-l from-[#3D1F6E] to-[#6B46C1] text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4">ابدأ رحلتك الجامعية اليوم</h2>
          <p className="text-green-200 text-lg mb-8 max-w-xl mx-auto leading-relaxed">
            سجّل دخولك للوصول إلى جميع الخدمات الجامعية المتاحة لك في ثوانٍ.
          </p>
          <Link
            href="/login"
            className="inline-block px-12 py-4 bg-white text-[#3D1F6E] rounded-xl font-bold text-base shadow-xl hover:bg-green-50 hover:scale-105 transition-all duration-200"
          >
            {t("signIn")} →
          </Link>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────── */}
      <footer className="bg-[#3D1F6E] text-gray-300 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 mb-8 pb-8 border-b border-green-800">

            {/* Brand */}
            <div>
              <img
                src="/assets/logos/logo-white.png"
                alt={t("universityName")}
                width={160}
                height={38}
                style={{ height: "38px", width: "auto" }}
                className="mb-3 opacity-90"
              />
              <p className="text-sm text-gray-400 max-w-xs leading-relaxed">
                بوابة جامعة سليمان الراجحي — منصة رقمية متكاملة لجميع الخدمات الجامعية.
              </p>
            </div>

            {/* Quick links */}
            <nav className="flex flex-col gap-2 text-sm">
              <p className="font-semibold text-green-200 mb-1">{tl("footerLinks")}</p>
              <Link href="/"      className="hover:text-white transition-colors">{tl("footerHome")}</Link>
              <Link href="/login" className="hover:text-white transition-colors">{tl("footerLogin")}</Link>
              <a    href="#services" className="hover:text-white transition-colors">الخدمات</a>
            </nav>

            {/* Module links */}
            <nav className="flex flex-col gap-2 text-sm">
              <p className="font-semibold text-green-200 mb-1">الخدمات الطلابية</p>
              {[
                { label: "الخدمات المالية",   href: "/financial"   },
                { label: "المنح الدراسية",    href: "/scholarships" },
                { label: "التدريب التعاوني",  href: "/training"    },
                { label: "الأنشطة الطلابية",  href: "/activities"  },
                { label: "الأندية الرياضية",  href: "/clubs"       },
              ].map((l) => (
                <Link key={l.href} href={l.href} className="hover:text-white transition-colors">
                  {l.label}
                </Link>
              ))}
            </nav>

            {/* More links */}
            <nav className="flex flex-col gap-2 text-sm">
              <p className="font-semibold text-green-200 mb-1">روابط أخرى</p>
              {[
                { label: "التطوع",           href: "/volunteers" },
                { label: "الخدمات الطلابية", href: "/services"   },
                { label: "الخريجون",         href: "/alumni"     },
                { label: "الأخبار",          href: "/news"       },
                { label: "هلا بك",           href: "/hala"       },
              ].map((l) => (
                <Link key={l.href} href={l.href} className="hover:text-white transition-colors">
                  {l.label}
                </Link>
              ))}
            </nav>

          </div>

          <p className="text-center text-xs text-gray-600">
            {t("copyright", { year })}
          </p>
        </div>
      </footer>

    </main>
  );
}
