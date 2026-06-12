import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/dal";
import FacultySidebar from "./_components/FacultySidebar";

export default async function FacultyLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user || user.role !== "FACULTY") redirect("/dashboard");

  return (
    <div
      className="-mx-6 -my-6 flex"
      style={{ minHeight: "calc(100vh - 73px)" }}
    >
      <FacultySidebar userName={user.name} />
      <div className="flex-1 min-w-0 bg-gray-50 overflow-auto">
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
