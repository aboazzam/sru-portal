"use client";
import { useActionState } from "react";
import { useTranslations } from "next-intl";
import { login } from "@/actions/auth";

export default function LoginForm() {
  const t = useTranslations("Login");
  const [state, formAction, pending] = useActionState(login, undefined);

  return (
    <form action={formAction} className="space-y-5">
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
        {state?.errors?.email && (
          <p className="mt-1 text-xs text-red-600">{state.errors.email[0]}</p>
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
        {state?.errors?.password && (
          <p className="mt-1 text-xs text-red-600">{state.errors.password[0]}</p>
        )}
      </div>

      {state?.message && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700">{state.message}</p>
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
