"use server";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/db";

export async function joinClub(clubId: string) {
  const session = await getSession();
  if (!session?.userId) return { error: "يجب تسجيل الدخول" };

  const existing = await prisma.clubMembership.findUnique({
    where: { userId_clubId: { userId: session.userId, clubId } },
  });
  if (existing) return { error: "أنت مسجّل في هذا النادي مسبقاً" };

  await prisma.clubMembership.create({
    data: { userId: session.userId, clubId },
  });
  revalidatePath("/clubs");
  revalidatePath("/clubs/my-clubs");
  return { success: true };
}

export async function applyForCouncil(clubId: string) {
  const session = await getSession();
  if (!session?.userId) return { error: "يجب تسجيل الدخول" };

  const membership = await prisma.clubMembership.findUnique({
    where: { userId_clubId: { userId: session.userId, clubId } },
  });
  if (!membership || membership.status !== "APPROVED") {
    return { error: "يجب أن تكون عضواً مقبولاً في النادي للتقديم على مجلس الإدارة" };
  }

  const existing = await prisma.councilApplication.findUnique({
    where: { userId_clubId: { userId: session.userId, clubId } },
  });
  if (existing) return { error: "لقد تقدّمت بطلب مجلس إدارة لهذا النادي مسبقاً" };

  await prisma.councilApplication.create({
    data: { userId: session.userId, clubId },
  });
  revalidatePath("/clubs/my-clubs");
  return { success: true };
}

export async function participateInActivity(activityId: string) {
  const session = await getSession();
  if (!session?.userId) return { error: "يجب تسجيل الدخول" };

  const activity = await prisma.clubActivity.findUnique({
    where: { id: activityId },
    select: { clubId: true, points: true },
  });
  if (!activity) return { error: "النشاط غير موجود" };

  const membership = await prisma.clubMembership.findUnique({
    where: { userId_clubId: { userId: session.userId, clubId: activity.clubId } },
    select: { id: true, status: true },
  });
  if (!membership || membership.status !== "APPROVED") {
    return { error: "يجب أن تكون عضواً مقبولاً في النادي للمشاركة في الأنشطة" };
  }

  const existing = await prisma.clubActivityParticipation.findUnique({
    where: { membershipId_activityId: { membershipId: membership.id, activityId } },
  });
  if (existing) return { error: "أنت مسجّل في هذا النشاط مسبقاً" };

  await prisma.clubActivityParticipation.create({
    data: { membershipId: membership.id, activityId, pointsEarned: activity.points ?? 0 },
  });

  // Award points to user
  if (activity.points && activity.points > 0) {
    await prisma.user.update({
      where: { id: session.userId },
      data: { points: { increment: activity.points } },
    });
  }

  revalidatePath("/clubs/activities");
  return { success: true };
}
