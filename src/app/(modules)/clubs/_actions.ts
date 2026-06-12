"use server";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/db";

export async function joinClub(
  clubId: string
): Promise<{ success?: true; error?: string }> {
  const session = await getSession();
  if (!session?.userId) return { error: "يجب تسجيل الدخول أولاً" };

  const club = await prisma.sportsClub.findUnique({
    where: { id: clubId },
    select: { id: true },
  });
  if (!club) return { error: "النادي غير موجود" };

  try {
    await prisma.clubMembership.create({
      data: { userId: session.userId, clubId },
    });
    revalidatePath("/clubs");
    revalidatePath("/clubs/browse");
    revalidatePath("/clubs/my-memberships");
    revalidatePath(`/clubs/${clubId}`);
    return { success: true };
  } catch {
    return { error: "أنت مسجّل في هذا النادي مسبقاً" };
  }
}

export async function applyForCouncil(
  clubId: string
): Promise<{ success?: true; error?: string }> {
  const session = await getSession();
  if (!session?.userId) return { error: "يجب تسجيل الدخول أولاً" };

  const membership = await prisma.clubMembership.findUnique({
    where: { userId_clubId: { userId: session.userId, clubId } },
    select: { status: true },
  });
  if (!membership || membership.status !== "APPROVED") {
    return { error: "يجب أن تكون عضواً معتمداً في النادي أولاً" };
  }

  try {
    await prisma.councilApplication.create({
      data: { userId: session.userId, clubId },
    });
    revalidatePath(`/clubs/${clubId}`);
    return { success: true };
  } catch {
    return { error: "لقد تقدّمت لمجلس هذا النادي مسبقاً" };
  }
}
