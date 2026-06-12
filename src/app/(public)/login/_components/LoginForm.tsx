"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

const roleDashboard: Record<string, string> = {
  STUDENT: "/student",
  FACULTY: "/faculty",
  ADMIN: "/admin",
  ORGANIZER: "/sanad",
  SUBADMIN: "/sanad",
};

export default function LoginForm() {
  const t = useTranslations("Login");
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ email?: string[]; password?: string[] }>({});
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setFieldErrors({});
    setPending(true);

    const form = e.currentTarget;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement).value;

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 422 && typeof data.error === "object") {
          setFieldErrors(data.error);
        } else {
          setError(typeof data.error === "string" ? data.error : "حدث خطأ، يرجى المحاولة مرة أخرى.");
        }
        return;
      }

      const maxAge = 7 * 24 * 60 * 60;
      document.cookie = `auth-token=${data.token}; path=/; samesite=lax; max-age=${maxAge}`;

      const dest = roleDashboard[data.user.role as string] ?? "/student";
      router.push(dest);
    } catch {
      setError("تعذر الاتصال بالخادم. يرجى المحاولة لاحقاً.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          {t("email")}
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent text-sm"
          placeholder={t("emailPlaceholder")}
        />
        {fieldErrors.email && (
          <p className="mt-1 text-xs text-red-600">{fieldErrors.email[0]}</p>
        )}
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
          {t("password")}
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent text-sm"
          placeholder={t("passwordPlaceholder")}
        />
        {fieldErrors.password && (
          <p className="mt-1 text-xs text-red-600">{fieldErrors.password[0]}</p>
        )}
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full py-2.5 bg-green-700 hover:bg-green-800 disabled:opacity-60 text-white font-semibold rounded-lg transition-colors"
      >
        {pending ? t("submitting") : t("submit")}
      </button>
    </form>
  );
}
