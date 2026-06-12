import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/dal";
import StudentView from "./_components/StudentView";
import FacultyView from "./_components/FacultyView";

export default async function HalaPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  if (user.role === "FACULTY" || user.role === "ADMIN") {
    return <FacultyView name={user.name} />;
  }

  return <StudentView name={user.name} />;
}
