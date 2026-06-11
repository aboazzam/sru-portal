"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

type Role = "alumni" | "employer" | "admin";

const roles: { id: Role; label: string; icon: string; color: string }[] = [
  { id: "alumni",    label: "خريج",   icon: "🎓", color: "#875E9E" },
  { id: "employer",  label: "شركة",   icon: "🏢", color: "#6CAEBD" },
  { id: "admin",     label: "إدارة",  icon: "⚙️", color: "#4A8FA0" },
];

const navByRole: Record<Role, { href: string; label: string; icon: string }[]> = {
  alumni: [
    { href: "/alumni",             label: "لوحة التحكم",      icon: "🏠" },
    { href: "/alumni/profile",     label: "ملفي الشخصي",      icon: "👤" },
    { href: "/alumni/documents",   label: "وثائقي",           icon: "📄" },
    { href: "/alumni/card",        label: "بطاقة الخريج",     icon: "🪪" },
    { href: "/alumni/jobs",        label: "فرص العمل",        icon: "💼" },
    { href: "/alumni/development", label: "التطوير المهني",   icon: "📈" },
    { href: "/alumni/network",     label: "شبكة الخريجين",    icon: "🤝" },
    { href: "/alumni/events",      label: "الفعاليات",        icon: "📅" },
    { href: "/alumni/contribute",  label: "المساهمة والعطاء", icon: "❤️" },
  ],
  employer: [
    { href: "/alumni/employer",             label: "لوحة الشركة",     icon: "🏢" },
    { href: "/alumni/employer/post-job",    label: "نشر وظيفة",       icon: "📝" },
    { href: "/alumni/employer/applicants",  label: "المتقدمون",        icon: "👥" },
    { href: "/alumni/employer/verify",      label: "التحقق من الخريج", icon: "✅" },
  ],
  admin: [
    { href: "/alumni/admin",                label: "لوحة الإدارة",    icon: "⚙️" },
    { href: "/alumni/admin/statistics",     label: "الإحصائيات",      icon: "📊" },
    { href: "/alumni/admin/alumni-list",    label: "قائمة الخريجين",  icon: "👥" },
    { href: "/alumni/admin/events-manage",  label: "إدارة الفعاليات", icon: "📅" },
  ],
};

const moduleLabel: Record<Role, { text: string; gradient: string }> = {
  alumni:   { text: "بوابة الخريجين",  gradient: "linear-gradient(135deg, #875E9E, #6A4A7E)" },
  employer: { text: "بوابة الشركات",   gradient: "linear-gradient(135deg, #6CAEBD, #4A8FA0)" },
  admin:    { text: "إدارة الخريجين",  gradient: "linear-gradient(135deg, #4A8FA0, #354850)" },
};

interface Props {
  userName: string;
  userRole: string;
}

export default function AlumniSidebar({ userName, userRole }: Props) {
  const pathname  = usePathname();
  const router    = useRouter();
  const [open, setOpen]     = useState(false);
  const [role, setRole]     = useState<Role>("alumni");

  function switchRole(newRole: Role) {
    setRole(newRole);
    router.push(navByRole[newRole][0].href);
  }

  const activeColor = roles.find((r) => r.id === role)!.color;
  const navItems    = navByRole[role];
  const mod         = moduleLabel[role];

  const navContent = () => (
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

      {/* Role switcher */}
      <div className="px-3 py-3 border-b border-[#E8EDEF]">
        <p className="text-xs text-[#8FA4AB] font-medium px-1 mb-2">تصفح بصفتك</p>
        <div className="flex gap-1">
          {roles.map((r) => (
            <button
              key={r.id}
              onClick={() => switchRole(r.id)}
              className="flex-1 flex flex-col items-center gap-0.5 py-1.5 rounded-lg text-xs font-semibold transition-all"
              style={
                role === r.id
                  ? { background: r.color, color: "#fff" }
                  : { background: "#F4F7F8", color: "#506570" }
              }
            >
              <span className="text-sm">{r.icon}</span>
              <span>{r.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Module label */}
      <div className="px-5 py-3 border-b border-[#E8EDEF]">
        <div className="flex items-center gap-2">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center text-sm"
            style={{ background: mod.gradient }}
          >
            {roles.find((r) => r.id === role)!.icon}
          </div>
          <span className="text-xs font-bold" style={{ color: activeColor }}>{mod.text}</span>
        </div>
      </div>

      {/* Nav links */}
      <ul className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive =
            item.href === "/alumni" || item.href === "/alumni/employer" || item.href === "/alumni/admin"
              ? pathname === item.href
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
                style={isActive ? { background: activeColor } : undefined}
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
        <p className="text-[#8FA4AB] text-xs mb-0.5">مسجّل الدخول</p>
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
        style={{ background: activeColor }}
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
        {navContent()}
      </aside>

      {/* Mobile drawer — start-0 = right:0 in RTL; translate-x-full slides it off-screen right when closed */}
      <aside
        className={`md:hidden fixed top-0 start-0 h-full w-64 bg-white z-50 shadow-xl transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {navContent()}
      </aside>
    </>
  );
}
