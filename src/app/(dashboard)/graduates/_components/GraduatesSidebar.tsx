"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navItems = [
  { href: "/graduates",         label: "نظرة عامة",      icon: "🏛️", exact: true  },
  { href: "/alumni",            label: "بوابة الخريجين", icon: "🎓", exact: true  },
  { href: "/alumni/jobs",       label: "فرص العمل",       icon: "💼", exact: false },
  { href: "/alumni/events",     label: "الفعاليات",       icon: "📅", exact: false },
  { href: "/alumni/network",    label: "الشبكة المهنية",  icon: "🤝", exact: false },
  { href: "/alumni/documents",  label: "وثائقي",          icon: "📄", exact: false },
  { href: "/alumni/card",       label: "بطاقة الخريج",   icon: "🪪", exact: false },
  { href: "/alumni/contribute", label: "المساهمة والعطاء",icon: "❤️", exact: false },
];

interface Props { userName: string }

export default function GraduatesSidebar({ userName }: Props) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const NavContent = () => (
    <nav className="flex flex-col h-full">
      <div className="px-5 py-5 border-b border-rose-950 flex items-center">
        <Image
          src="/assets/logos/logo-white.svg"
          alt="جامعة سليمان الراجحي"
          width={160}
          height={40}
          style={{ height: "40px", width: "auto" }}
          priority
        />
      </div>

      <div className="px-4 py-3 border-b border-rose-950">
        <p className="text-rose-400 text-[10px] uppercase tracking-wider mb-0.5">بوابة الخريجين</p>
        <p className="text-rose-100 text-xs font-medium truncate">{userName}</p>
      </div>

      <ul className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
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
                    ? "bg-rose-600 text-white shadow"
                    : "text-rose-200 hover:bg-rose-800 hover:text-white"
                }`}
              >
                <span className="text-lg leading-none shrink-0 w-5 text-center">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>

      <div className="px-5 py-4 border-t border-rose-950">
        <p className="text-rose-600 text-[10px] mb-0.5">مسجّل الدخول</p>
        <p className="text-white text-sm font-medium truncate">{userName}</p>
      </div>
    </nav>
  );

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="md:hidden fixed bottom-6 start-6 z-50 w-12 h-12 rounded-full bg-rose-900 text-white shadow-xl flex items-center justify-center text-xl"
        aria-label="فتح القائمة"
      >
        {open ? "✕" : "☰"}
      </button>

      {open && (
        <div className="md:hidden fixed inset-0 z-40 bg-black/50" onClick={() => setOpen(false)} />
      )}

      <aside className="hidden md:flex flex-col w-56 shrink-0 bg-rose-900 min-h-full">
        <NavContent />
      </aside>

      <aside
        className={`md:hidden fixed top-0 start-0 h-full w-64 bg-rose-900 z-50 transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ direction: "rtl" }}
      >
        <NavContent />
      </aside>
    </>
  );
}
