"use server";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/db";

export async function updateApplicationStatus(
  id: string,
  status: "PENDING" | "APPROVED" | "REJECTED"
): Promise<{ success?: true; error?: string }> {
  const session = await getSession();
  if (!session?.userId || session.role !== "ADMIN") return { error: "غير مصرح" };

  await prisma.scholarshipApplication.update({
    where: { id },
    data: { status },
  });

  revalidatePath("/admin/scholarships");
  return { success: true };
}
