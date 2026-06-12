"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navItems = [
  { href: "/student",              label: "نظرة عامة",         icon: "◈", exact: true  },
  { href: "/student/scholarships", label: "المنح الدراسية",    icon: "◎", exact: false },
  { href: "/student/trainings",    label: "التدريب التعاوني",  icon: "◷", exact: false },
];

interface Props {
  userName: string;
  points: number;
}

export default function StudentSidebar({ userName, points }: Props) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const NavContent = () => (
    <nav className="flex flex-col h-full">
      <div className="px-5 py-5 border-b border-slate-700 flex items-center">
        <Image
          src="/assets/logos/logo-white.svg"
          alt="جامعة سليمان الراجحي"
          width={160}
          height={40}
          style={{ height: "40px", width: "auto" }}
          priority
        />
      </div>

      <div className="px-4 py-3 border-b border-slate-700">
        <p className="text-slate-400 text-[10px] uppercase tracking-wider mb-0.5">بوابة الطالب</p>
        <div className="flex items-center justify-between">
          <p className="text-slate-200 text-xs font-medium truncate">{userName}</p>
          <span className="text-[10px] font-bold text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded-full">
            {points} ن
          </span>
        </div>
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
                    ? "bg-primary text-white shadow"
                    : "text-slate-300 hover:bg-slate-700 hover:text-white"
                }`}
              >
                <span className="text-lg leading-none shrink-0 w-5 text-center">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>

      <div className="px-5 py-4 border-t border-slate-700">
        <p className="text-slate-500 text-[10px] mb-0.5">مسجّل الدخول</p>
        <p className="text-white text-sm font-medium truncate">{userName}</p>
      </div>
    </nav>
  );

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="md:hidden fixed bottom-6 start-6 z-50 w-12 h-12 rounded-full bg-slate-800 text-white shadow-xl flex items-center justify-center text-xl"
        aria-label="فتح القائمة"
      >
        {open ? "✕" : "☰"}
      </button>

      {open && (
        <div className="md:hidden fixed inset-0 z-40 bg-black/50" onClick={() => setOpen(false)} />
      )}

      <aside className="hidden md:flex flex-col w-56 shrink-0 bg-slate-800 min-h-full">
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
