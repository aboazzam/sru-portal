import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/dal";
import CardClient from "./_components/CardClient";

export default async function AlumniCardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return <CardClient name={user.name} />;
}
