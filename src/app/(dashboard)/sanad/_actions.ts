"use server";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/db";

export async function applyForVolunteer(opportunityId: string) {
  const session = await getSession();
  if (!session?.userId) return { error: "يجب تسجيل الدخول" };

  const existing = await prisma.volunteerApplication.findUnique({
    where: { userId_opportunityId: { userId: session.userId, opportunityId } },
  });
  if (existing) return { error: "أنت مسجّل مسبقاً" };

  await prisma.volunteerApplication.create({
    data: { userId: session.userId, opportunityId },
  });
  revalidatePath("/sanad/volunteer");
  revalidatePath("/sanad/my-requests");
  return { success: true };
}

export async function applyForActivity(activityId: string) {
  const session = await getSession();
  if (!session?.userId) return { error: "يجب تسجيل الدخول" };

  const existing = await prisma.activityApplication.findUnique({
    where: { userId_activityId: { userId: session.userId, activityId } },
  });
  if (existing) return { error: "أنت مسجّل مسبقاً" };

  await prisma.activityApplication.create({
    data: { userId: session.userId, activityId },
  });
  revalidatePath("/sanad/activities");
  revalidatePath("/sanad/my-requests");
  return { success: true };
}
