"use server";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/db";

export async function updateEnrollmentStatus(
  id: string,
  status: "PENDING" | "APPROVED" | "REJECTED" | "COMPLETED"
): Promise<{ success?: true; error?: string }> {
  const session = await getSession();
  if (!session?.userId || session.role !== "ADMIN") return { error: "غير مصرح" };

  await prisma.trainingEnrollment.update({
    where: { id },
    data: { status },
  });

  revalidatePath("/admin/trainings");
  return { success: true };
}
