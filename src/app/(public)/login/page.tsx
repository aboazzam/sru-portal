import Link from "next/link";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import LoginForm from "./_components/LoginForm";
import LanguageToggle from "@/components/LanguageToggle";

export default async function LoginPage() {
  const t = await getTranslations("Login");
  const tc = await getTranslations("Common");

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#1B5E20] to-emerald-800 flex flex-col items-center justify-center px-4">
      <div className="absolute top-4 end-6">
        <LanguageToggle className="text-white" />
      </div>

      <div className="w-full max-w-md animate-fade-in-up">
        <div className="text-center mb-8 flex flex-col items-center">
          <Image
            src="/assets/logos/sru-logo.png"
            alt={tc("universityName")}
            width={200}
            height={48}
            style={{ height: "48px", width: "auto" }}
            className="mb-4"
            priority
          />
          <h1 className="text-2xl font-bold text-white">{t("title")}</h1>
          <p className="text-green-300 text-sm mt-1">{t("subtitle")}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <LoginForm />
        </div>

        <p className="text-center text-sm text-green-300 mt-6">
          <Link
            href="/"
            className="hover:text-white underline underline-offset-2 transition-colors"
          >
            {tc("backToHome")}
          </Link>
        </p>
      </div>
    </main>
  );
}
