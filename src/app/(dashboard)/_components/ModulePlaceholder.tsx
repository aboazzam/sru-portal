import Link from "next/link";
import { getTranslations } from "next-intl/server";

interface Props {
  icon: string;
  nameKey: string;
}

export default async function ModulePlaceholder({ icon, nameKey }: Props) {
  const t = await getTranslations();

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6 py-16 space-y-6">
      <div className="text-7xl">{icon}</div>
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {t(`Modules.${nameKey}.name`)}
        </h1>
        <h2 className="text-lg font-semibold text-green-700 mb-4">
          {t("ModulePage.underDevTitle")}
        </h2>
        <p className="text-gray-500 max-w-md mx-auto leading-relaxed">
          {t("ModulePage.underDevDesc")}
        </p>
      </div>
      <Link
        href="/"
        className="px-6 py-2.5 bg-green-700 text-white rounded-lg font-medium hover:bg-green-800 transition-colors"
      >
        {t("ModulePage.backBtn")}
      </Link>
    </div>
  );
}
