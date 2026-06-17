import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getCurrentUser } from "@/lib/dal";
import TrainingSidebar from "./_components/TrainingSidebar";

export default async function TrainingLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const td = await getTranslations("Dashboard");
  const roleLabel = td(`roles.${user.role}` as Parameters<typeof td>[0]);

  return (
    <div className="flex" style={{ minHeight: "calc(100vh - 64px)" }}>
      <TrainingSidebar
        userName={user?.name ?? ""}
        userRole={roleLabel ?? ""}
      />
      <div className="flex-1 min-w-0 bg-[#F4F7F8] overflow-auto">
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
