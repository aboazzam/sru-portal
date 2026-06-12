import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/dal";
import GraduatesSidebar from "./_components/GraduatesSidebar";

export default async function GraduatesLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return (
    <div className="-mx-6 -my-6 flex" style={{ minHeight: "calc(100vh - 73px)" }}>
      <GraduatesSidebar userName={user.name} />
      <div className="flex-1 min-w-0 bg-gray-50 overflow-auto">
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
