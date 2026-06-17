"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";

interface Props {
  role: string;
  userName: string;
}

export default function SanadSidebar({ role, userName }: Props) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const t = useTranslations("Sanad");

  const navItems = [
    { href: "/sanad",                  label: t("nav.home"),           icon: "🏠", roles: ["ALL"] },
    { href: "/sanad/academic",         label: t("nav.academic"),       icon: "📚", roles: ["ALL"] },
    { href: "/sanad/activities",       label: t("nav.activities"),     icon: "💡", roles: ["ALL"] },
    { href: "/sanad/volunteer",        label: t("nav.volunteer"),      icon: "🤲", roles: ["ALL"] },
    { href: "/sanad/student-services", label: t("nav.studentServices"),icon: "🎓", roles: ["ALL"] },
    { href: "/sanad/my-requests",      label: t("nav.myRequests"),     icon: "📋", roles: ["ALL"] },
    { href: "/sanad/organizer",        label: t("nav.organizer"),      icon: "⚙️", roles: ["ORGANIZER", "SUBADMIN", "ADMIN"] },
    { href: "/sanad/subadmin",         label: t("nav.adminPanel"),     icon: "🛡️", roles: ["SUBADMIN", "ADMIN"] },
  ];

  const visible = navItems.filter(
    (item) => item.roles.includes("ALL") || item.roles.includes(role)
  );

  const NavContent = () => (
    <nav className="flex flex-col h-full">
      {/* Brand */}
      <div className="px-5 py-5 border-b border-[#2C1650] flex items-center">
        <Image
          src="/assets/logos/logo-white.svg"
          alt={t("title")}
          width={160}
          height={40}
          style={{ height: "40px", width: "auto" }}
          priority
        />
      </div>

      {/* Nav links */}
      <ul className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {visible.map((item) => {
          const isActive =
            item.href === "/sanad"
              ? pathname === "/sanad"
              : pathname.startsWith(item.href);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? "bg-[#00B4C8] text-white shadow-md"
                    : "text-[#C4A8E8] hover:bg-[#2C1650] hover:text-white"
                }`}
              >
                <span className="text-base shrink-0">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>

      {/* User info */}
      <div className="px-5 py-4 border-t border-[#2C1650]">
        <p className="text-[#9D7EC8] text-xs mb-0.5">{t("nav.loggedInAs")}</p>
        <p className="text-white text-sm font-medium truncate">{userName}</p>
      </div>
    </nav>
  );

  return (
    <>
      {/* Mobile toggle button */}
      <button
        onClick={() => setOpen(!open)}
        className="md:hidden fixed bottom-6 start-6 z-50 w-12 h-12 rounded-full bg-[#3D1F6E] text-white shadow-xl flex items-center justify-center text-xl"
        aria-label="Toggle sidebar"
      >
        {open ? "✕" : "☰"}
      </button>

      {/* Mobile overlay */}
      {open && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/50"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-56 shrink-0 bg-[#3D1F6E] min-h-full">
        <NavContent />
      </aside>

      {/* Mobile drawer */}
      <aside
        className={`md:hidden fixed top-0 start-0 h-full w-64 bg-[#3D1F6E] z-50 transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ direction: "rtl" }}
      >
        <NavContent />
      </aside>
    </>
  );
}
