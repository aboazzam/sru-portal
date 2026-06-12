"use server";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/db";

export async function applyForVolunteer(
  opportunityId: string
): Promise<{ success?: true; error?: string }> {
  const session = await getSession();
  if (!session?.userId) return { error: "يجب تسجيل الدخول أولاً" };

  const opportunity = await prisma.volunteerOpportunity.findUnique({
    where: { id: opportunityId },
    select: { id: true, date: true },
  });
  if (!opportunity) return { error: "فرصة التطوع غير موجودة" };
  if (opportunity.date && opportunity.date < new Date()) {
    return { error: "انتهت مدة التسجيل لهذه الفرصة" };
  }

  try {
    await prisma.volunteerApplication.create({
      data: { userId: session.userId, opportunityId },
    });
    revalidatePath("/volunteers");
    revalidatePath("/volunteers/opportunities");
    revalidatePath("/volunteers/my-applications");
    return { success: true };
  } catch {
    return { error: "لقد تقدّمت لهذه الفرصة مسبقاً" };
  }
}
