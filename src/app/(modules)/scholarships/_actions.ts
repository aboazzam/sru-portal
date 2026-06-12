"use server";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/db";

export async function submitScholarshipApplication(
  scholarshipId: string
): Promise<{ success?: true; error?: string }> {
  const session = await getSession();
  if (!session?.userId) return { error: "يجب تسجيل الدخول أولاً" };

  const scholarship = await prisma.scholarship.findUnique({
    where: { id: scholarshipId },
    select: { deadline: true },
  });
  if (!scholarship) return { error: "المنحة غير موجودة" };
  if (scholarship.deadline && scholarship.deadline < new Date()) {
    return { error: "انتهت مدة التقديم على هذه المنحة" };
  }

  try {
    await prisma.scholarshipApplication.create({
      data: { userId: session.userId, scholarshipId },
    });
    revalidatePath("/scholarships");
    revalidatePath("/scholarships/track");
    return { success: true };
  } catch {
    return { error: "لقد تقدّمت لهذه المنحة مسبقاً" };
  }
}
