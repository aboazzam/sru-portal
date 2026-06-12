"use server";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/db";

export async function applyForActivity(
  activityId: string
): Promise<{ success?: true; error?: string }> {
  const session = await getSession();
  if (!session?.userId) return { error: "يجب تسجيل الدخول أولاً" };

  const activity = await prisma.studentActivity.findUnique({
    where: { id: activityId },
    select: { id: true, date: true },
  });
  if (!activity) return { error: "النشاط غير موجود" };
  if (activity.date && activity.date < new Date()) {
    return { error: "انتهى موعد التسجيل لهذا النشاط" };
  }

  try {
    await prisma.activityApplication.create({
      data: { userId: session.userId, activityId },
    });
    revalidatePath("/activities");
    revalidatePath("/activities/catalog");
    revalidatePath("/activities/my-applications");
    return { success: true };
  } catch {
    return { error: "لقد سجّلت في هذا النشاط مسبقاً" };
  }
}
