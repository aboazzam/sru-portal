import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/dal";
import ClubsSidebar from "./_components/ClubsSidebar";

export default async function ClubsLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return (
    <div className="-mx-6 -my-6 flex" style={{ minHeight: "calc(100vh - 73px)" }}>
      <ClubsSidebar userName={user.name} />
      <div className="flex-1 min-w-0 bg-gray-50 overflow-auto">
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
