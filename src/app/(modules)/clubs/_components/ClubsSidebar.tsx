"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";

const PRIMARY = "#DC2626";

const navItems = [
  { href: "/clubs",               label: "لوحة الأندية",   icon: "🏠" },
  { href: "/clubs/browse",        label: "تصفّح الأندية",  icon: "🏟️" },
  { href: "/clubs/my-memberships", label: "عضوياتي",       icon: "🪪" },
];

interface Props {
  userName: string;
  userRole: string;
}

export default function ClubsSidebar({ userName, userRole }: Props) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const NavContent = () => (
    <nav className="flex flex-col h-full">
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

      <div className="px-5 py-3 border-b border-[#E8EDEF]">
        <div className="flex items-center gap-2">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center text-sm"
            style={{ background: "linear-gradient(135deg, #DC2626, #991B1B)" }}
          >
            🏆
          </div>
          <span className="text-xs font-bold" style={{ color: PRIMARY }}>الأندية الرياضية</span>
        </div>
      </div>

      <ul className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive =
            item.href === "/clubs"
              ? pathname === "/clubs"
              : pathname.startsWith(item.href);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? "text-white shadow-sm"
                    : "text-[#506570] hover:bg-[#FEF2F2] hover:text-[#991B1B]"
                }`}
                style={isActive ? { background: PRIMARY } : undefined}
              >
                <span className="text-base shrink-0">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>

      <div className="px-5 py-4 border-t border-[#C8D4D8] bg-[#F4F7F8]">
        <p className="text-[#8FA4AB] text-xs mb-0.5">مسجّل الدخول</p>
        <p className="text-[#1A2A30] text-sm font-semibold truncate">{userName}</p>
        <p className="text-[#8FA4AB] text-xs">{userRole}</p>
      </div>
    </nav>
  );

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="md:hidden fixed bottom-6 start-6 z-50 w-12 h-12 rounded-full text-white shadow-xl flex items-center justify-center text-xl"
        style={{ background: PRIMARY }}
        aria-label="Toggle sidebar"
      >
        {open ? "✕" : "☰"}
      </button>

      {open && (
        <div className="md:hidden fixed inset-0 z-40 bg-black/40" onClick={() => setOpen(false)} />
      )}

      <aside className="hidden md:flex flex-col w-56 shrink-0 bg-white border-e border-[#C8D4D8] min-h-full shadow-sm">
        <NavContent />
      </aside>

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
