import Image from "next/image";
import { logout } from "@/actions/auth";
import { getCurrentUser } from "@/lib/dal";
import { getTranslations } from "next-intl/server";
import LanguageToggle from "@/components/LanguageToggle";

export default async function ModulesLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  const t  = await getTranslations("Dashboard");
  const tc = await getTranslations("Common");

  type RoleKey = "STUDENT" | "FACULTY" | "ADMIN" | "ORGANIZER" | "SUBADMIN";
  const roleKey = user?.role as RoleKey | undefined;

  return (
    <div className="min-h-screen bg-[#F4F7F8] flex flex-col">
      <header className="bg-[#1B5E20] text-white px-6 py-3 flex items-center justify-between shadow-md shrink-0">
        <Image
          src="/assets/logos/logo-white.svg"
          alt={tc("universityName")}
          width={200}
          height={40}
          style={{ height: "40px", width: "auto" }}
          priority
        />
        <div className="flex items-center gap-4">
          <LanguageToggle className="text-white" />
          <div className="text-end hidden sm:block">
            <p className="text-sm font-medium">{user?.name}</p>
            <p className="text-xs text-green-200">
              {roleKey ? t(`roles.${roleKey}`) : ""}
            </p>
          </div>
          <form action={logout}>
            <button
              type="submit"
              className="px-4 py-1.5 bg-green-700 hover:bg-green-600 rounded-lg text-sm font-medium transition-colors"
            >
              {tc("signOut")}
            </button>
          </form>
        </div>
      </header>

      <main className="flex-1 overflow-hidden">{children}</main>
    </div>
  );
}
