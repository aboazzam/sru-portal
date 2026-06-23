"use server";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/db";

// ── Membership / Council ──────────────────────────────────────────

export async function updateMembershipStatus(
  id: string,
  status: "PENDING" | "APPROVED" | "REJECTED"
): Promise<{ success?: true; error?: string }> {
  const session = await getSession();
  if (!session?.userId || session.role !== "ADMIN") return { error: "غير مصرح" };
  await prisma.clubMembership.update({ where: { id }, data: { status } });
  revalidatePath("/admin/clubs");
  return { success: true };
}

export async function updateCouncilAppStatus(
  id: string,
  status: "PENDING" | "APPROVED" | "REJECTED"
): Promise<{ success?: true; error?: string }> {
  const session = await getSession();
  if (!session?.userId || session.role !== "ADMIN") return { error: "غير مصرح" };
  await prisma.councilApplication.update({ where: { id }, data: { status } });
  revalidatePath("/admin/clubs");
  return { success: true };
}

// ── Club CRUD ─────────────────────────────────────────────────────

export async function createClub(payload: {
  name: string;
  description?: string;
}): Promise<{ club?: any; error?: string }> {
  const session = await getSession();
  if (!session?.userId || session.role !== "ADMIN") return { error: "غير مصرح" };
  if (!payload.name?.trim()) return { error: "اسم النادي مطلوب" };

  try {
    const club = await prisma.sportsClub.create({
      data: { name: payload.name.trim(), description: payload.description?.trim() || undefined },
      include: { _count: { select: { memberships: true, activities: true } } },
    });
    revalidatePath("/admin/clubs");
    revalidatePath("/clubs");
    return { club };
  } catch (e: any) {
    if (e.message?.includes("Unique")) return { error: "يوجد ناد بهذا الاسم مسبقاً" };
    return { error: "حدث خطأ أثناء الإنشاء" };
  }
}

export async function updateClub(
  id: string,
  payload: { name?: string; description?: string | null }
): Promise<{ club?: any; error?: string }> {
  const session = await getSession();
  if (!session?.userId || session.role !== "ADMIN") return { error: "غير مصرح" };

  try {
    const club = await prisma.sportsClub.update({
      where: { id },
      data: {
        ...(payload.name !== undefined ? { name: payload.name.trim() } : {}),
        ...(payload.description !== undefined ? { description: payload.description?.trim() || null } : {}),
      },
      include: { _count: { select: { memberships: true, activities: true } } },
    });
    revalidatePath("/admin/clubs");
    revalidatePath("/clubs");
    return { club };
  } catch (e: any) {
    if (e.message?.includes("Unique")) return { error: "يوجد ناد بهذا الاسم مسبقاً" };
    return { error: "حدث خطأ أثناء التعديل" };
  }
}

export async function deleteClub(id: string): Promise<{ success?: true; error?: string }> {
  const session = await getSession();
  if (!session?.userId || session.role !== "ADMIN") return { error: "غير مصرح" };

  try {
    await prisma.$transaction(async (tx) => {
      const activities = await tx.clubActivity.findMany({ where: { clubId: id }, select: { id: true } });
      if (activities.length > 0) {
        await tx.clubActivityParticipation.deleteMany({
          where: { activityId: { in: activities.map((a) => a.id) } },
        });
      }
      await tx.clubActivity.deleteMany({ where: { clubId: id } });
      await tx.clubMembership.deleteMany({ where: { clubId: id } });
      await tx.councilApplication.deleteMany({ where: { clubId: id } });
      await tx.sportsClub.delete({ where: { id } });
    });
    revalidatePath("/admin/clubs");
    revalidatePath("/clubs");
    return { success: true };
  } catch {
    return { error: "حدث خطأ أثناء الحذف" };
  }
}

// ── Activity CRUD ─────────────────────────────────────────────────

export async function createActivity(payload: {
  clubId: string;
  title: string;
  description?: string;
  points?: number;
  date?: string;
}): Promise<{ activity?: any; error?: string }> {
  const session = await getSession();
  if (!session?.userId || session.role !== "ADMIN") return { error: "غير مصرح" };
  if (!payload.title?.trim()) return { error: "عنوان النشاط مطلوب" };
  if (!payload.clubId) return { error: "النادي مطلوب" };

  try {
    const activity = await prisma.clubActivity.create({
      data: {
        clubId: payload.clubId,
        title: payload.title.trim(),
        description: payload.description?.trim() || undefined,
        points: payload.points ?? 0,
        date: payload.date ? new Date(payload.date) : undefined,
      },
      include: { club: { select: { name: true } }, _count: { select: { participations: true } } },
    });
    revalidatePath("/admin/clubs");
    revalidatePath("/clubs/activities");
    return { activity };
  } catch {
    return { error: "حدث خطأ أثناء الإنشاء" };
  }
}

export async function updateActivity(
  id: string,
  payload: { title?: string; description?: string | null; points?: number; date?: string | null }
): Promise<{ activity?: any; error?: string }> {
  const session = await getSession();
  if (!session?.userId || session.role !== "ADMIN") return { error: "غير مصرح" };

  try {
    const activity = await prisma.clubActivity.update({
      where: { id },
      data: {
        ...(payload.title !== undefined ? { title: payload.title.trim() } : {}),
        ...(payload.description !== undefined ? { description: payload.description?.trim() || null } : {}),
        ...(payload.points !== undefined ? { points: payload.points } : {}),
        ...(payload.date !== undefined ? { date: payload.date ? new Date(payload.date) : null } : {}),
      },
      include: { club: { select: { name: true } }, _count: { select: { participations: true } } },
    });
    revalidatePath("/admin/clubs");
    revalidatePath("/clubs/activities");
    return { activity };
  } catch {
    return { error: "حدث خطأ أثناء التعديل" };
  }
}

export async function deleteActivity(id: string): Promise<{ success?: true; error?: string }> {
  const session = await getSession();
  if (!session?.userId || session.role !== "ADMIN") return { error: "غير مصرح" };

  try {
    await prisma.$transaction([
      prisma.clubActivityParticipation.deleteMany({ where: { activityId: id } }),
      prisma.clubActivity.delete({ where: { id } }),
    ]);
    revalidatePath("/admin/clubs");
    revalidatePath("/clubs/activities");
    return { success: true };
  } catch {
    return { error: "حدث خطأ أثناء الحذف" };
  }
}
