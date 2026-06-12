import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/dal";
import ProfileClient from "./_components/ProfileClient";

export default async function AlumniProfilePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return <ProfileClient name={user.name} email={user.email} />;
}
