import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/dal";
import { prisma } from "@/lib/db";
import ApplyForm from "./_components/ApplyForm";

export default async function ApplyPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const [scholarships, myApps] = await Promise.all([
    prisma.scholarship.findMany({
      where: { OR: [{ deadline: null }, { deadline: { gte: new Date() } }] },
      select: { id: true, title: true, description: true, amount: true },
      orderBy: { createdAt: "asc" },
    }),
    prisma.scholarshipApplication.findMany({
      where: { userId: user.id },
      select: { scholarshipId: true },
    }),
  ]);

  const appliedIds = myApps.map((a) => a.scholarshipId);

  return <ApplyForm scholarships={scholarships} appliedIds={appliedIds} />;
}
