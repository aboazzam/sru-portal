import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/dal";
import { prisma } from "@/lib/db";
import StudentSidebar from "./_components/StudentSidebar";

export default async function StudentLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user || user.role !== "STUDENT") redirect("/dashboard");

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { points: true },
  });

  return (
    <div
      className="-mx-6 -my-6 flex"
      style={{ minHeight: "calc(100vh - 73px)" }}
    >
      <StudentSidebar userName={user.name} points={dbUser?.points ?? 0} />
      <div className="flex-1 min-w-0 bg-gray-50 overflow-auto">
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
