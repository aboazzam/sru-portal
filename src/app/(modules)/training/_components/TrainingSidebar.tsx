"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useTranslations } from "next-intl";

interface Props {
  userName: string;
  userRole: string;
}

export default function TrainingSidebar({ userName, userRole }: Props) {
  const t = useTranslations("Training");
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const navItems = [
    { href: "/training",              label: t("nav.dashboard"),    icon: "🏠" },
    { href: "/training/catalog",      label: t("nav.catalog"),      icon: "📚" },
    { href: "/training/my-courses",   label: t("nav.myCourses"),    icon: "🎓" },
    { href: "/training/certificates", label: t("nav.certificates"), icon: "🏆" },
    { href: "/training/requests",     label: t("nav.requests"),     icon: "📝" },
  ];

  const NavContent = () => (
    <nav className="flex flex-col h-full">
      {/* Brand */}
      <div className="px-5 py-5 border-b border-[#C8D4D8] flex items-center">
        <Image
          src="/assets/logos/logo-dark.svg"
          alt="جامعة سليمان الراجحي"
          width={160}
          height={40}
          style={{ height: "40px", width: "auto" }}
          priority
        />
      </div>

      {/* Module label */}
      <div className="px-5 py-3 border-b border-[#E8EDEF]">
        <div className="flex items-center gap-2">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center text-sm"
            style={{ background: "linear-gradient(135deg, #6CAEBD, #4A8FA0)" }}
          >
            🎯
          </div>
          <span className="text-xs font-bold text-[#4A8FA0]">{t("nav.moduleLabel")}</span>
        </div>
      </div>

      {/* Nav links */}
      <ul className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive =
            item.href === "/training"
              ? pathname === "/training"
              : pathname.startsWith(item.href);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? "text-white shadow-sm"
                    : "text-[#506570] hover:bg-[#EEF2F3] hover:text-[#1A2A30]"
                }`}
                style={isActive ? { background: "#6CAEBD" } : undefined}
              >
                <span className="text-base shrink-0">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>

      {/* User info */}
      <div className="px-5 py-4 border-t border-[#C8D4D8] bg-[#F4F7F8]">
        <p className="text-[#8FA4AB] text-xs mb-0.5">{t("nav.loggedInAs")}</p>
        <p className="text-[#1A2A30] text-sm font-semibold truncate">{userName}</p>
        <p className="text-[#8FA4AB] text-xs">{userRole}</p>
      </div>
    </nav>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setOpen(!open)}
        className="md:hidden fixed bottom-6 start-6 z-50 w-12 h-12 rounded-full text-white shadow-xl flex items-center justify-center text-xl"
        style={{ background: "#6CAEBD" }}
        aria-label="Toggle sidebar"
      >
        {open ? "✕" : "☰"}
      </button>

      {/* Mobile overlay */}
      {open && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/40"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-56 shrink-0 bg-white border-e border-[#C8D4D8] min-h-full shadow-sm">
        <NavContent />
      </aside>

      {/* Mobile drawer */}
      <aside
        className={`md:hidden fixed top-0 start-0 h-full w-64 bg-white z-50 transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ direction: "rtl" }}
      >
        <NavContent />
      </aside>
    </>
  );
}
