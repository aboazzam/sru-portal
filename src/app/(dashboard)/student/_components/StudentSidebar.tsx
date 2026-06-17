"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useTranslations } from "next-intl";

interface Props {
  userName: string;
  points:   number;
}

export default function StudentSidebar({ userName, points }: Props) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const t = useTranslations("Student");
  const tc = useTranslations("Common");

  const navGroups = [
    {
      label: null,
      items: [
        { href: "/student", label: t("sidebar.overview"), icon: "🏠", exact: true },
      ],
    },
    {
      label: t("sidebar.records"),
      items: [
        { href: "/student/my-applications", label: t("sidebar.myApps"),      icon: "📋", exact: false },
        { href: "/student/scholarships",    label: t("sidebar.scholarships"), icon: "🎓", exact: false },
        { href: "/student/trainings",       label: t("sidebar.training"),     icon: "🏢", exact: false },
      ],
    },
    {
      label: t("sidebar.services"),
      items: [
        { href: "/financial",  label: t("sidebar.financial"),        icon: "💳", exact: false },
        { href: "/activities", label: t("sidebar.activities"),       icon: "🎯", exact: false },
        { href: "/clubs",      label: t("sidebar.clubs"),            icon: "⚽", exact: false },
        { href: "/volunteers", label: t("sidebar.volunteer"),        icon: "🌱", exact: false },
        { href: "/services",   label: t("sidebar.studentServices"),  icon: "🛎️", exact: false },
      ],
    },
    {
      label: t("sidebar.more"),
      items: [
        { href: "/news",   label: t("sidebar.news"),   icon: "📰", exact: false },
        { href: "/alumni", label: t("sidebar.alumni"), icon: "🤝", exact: false },
        { href: "/hala",   label: t("sidebar.hala"),   icon: "👋", exact: false },
      ],
    },
  ];

  const NavContent = () => (
    <nav className="flex flex-col h-full">
      <div className="px-5 py-5 border-b border-slate-700 flex items-center shrink-0">
        <Image
          src="/assets/logos/logo-white.svg"
          alt="جامعة سليمان الراجحي"
          width={160}
          height={40}
          style={{ height: "40px", width: "auto" }}
          priority
        />
      </div>

      <div className="px-4 py-3 border-b border-slate-700 shrink-0">
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0">
            <p className="text-slate-400 text-[10px] uppercase tracking-wider mb-0.5">{t("sidebar.portal")}</p>
            <p className="text-slate-200 text-xs font-medium truncate">{userName}</p>
          </div>
          <div className="text-center shrink-0">
            <p className="text-amber-400 font-bold text-sm tabular-nums">{points}</p>
            <p className="text-[9px] text-slate-500">{t("sidebar.points")}</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4">
        {navGroups.map((group, gi) => (
          <div key={gi}>
            {group.label && (
              <p className="text-[10px] text-slate-500 uppercase tracking-wider px-2 mb-1.5">{group.label}</p>
            )}
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const isActive = item.exact
                  ? pathname === item.href
                  : pathname.startsWith(item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                        isActive
                          ? "bg-cyan-600 text-white shadow"
                          : "text-slate-300 hover:bg-slate-700 hover:text-white"
                      }`}
                    >
                      <span className="text-base shrink-0 leading-none">{item.icon}</span>
                      <span className="truncate">{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      <div className="px-5 py-4 border-t border-slate-700 shrink-0">
        <p className="text-slate-500 text-[10px] mb-0.5">{tc("loggedIn")}</p>
        <p className="text-white text-sm font-medium truncate">{userName}</p>
      </div>
    </nav>
  );

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="md:hidden fixed bottom-6 start-6 z-50 w-12 h-12 rounded-full bg-slate-800 text-white shadow-xl flex items-center justify-center text-xl"
        aria-label={tc("openMenu")}
      >
        {open ? "✕" : "☰"}
      </button>

      {open && (
        <div className="md:hidden fixed inset-0 z-40 bg-black/50" onClick={() => setOpen(false)} />
      )}

      <aside className="hidden md:flex flex-col w-60 shrink-0 bg-slate-800 min-h-full">
        <NavContent />
      </aside>

      <aside
        className={`md:hidden fixed top-0 start-0 h-full w-64 bg-slate-800 z-50 transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ direction: "rtl" }}
      >
        <NavContent />
      </aside>
    </>
  );
}
