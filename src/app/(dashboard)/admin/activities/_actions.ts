"use server";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/db";

// ── Application status ────────────────────────────────────────────

export async function updateActivityAppStatus(
  id: string,
  status: "PENDING" | "APPROVED" | "REJECTED"
): Promise<{ success?: true; error?: string }> {
  const session = await getSession();
  if (!session?.userId || session.role !== "ADMIN") return { error: "غير مصرح" };

  await prisma.activityApplication.update({ where: { id }, data: { status } });
  revalidatePath("/admin/activities");
  return { success: true };
}

// ── Activity CRUD ─────────────────────────────────────────────────

export async function createActivity(payload: {
  title: string;
  description?: string;
  date?: string;
}): Promise<{ activity?: any; error?: string }> {
  const session = await getSession();
  if (!session?.userId || session.role !== "ADMIN") return { error: "غير مصرح" };
  if (!payload.title?.trim()) return { error: "عنوان النشاط مطلوب" };

  try {
    const activity = await prisma.studentActivity.create({
      data: {
        title:       payload.title.trim(),
        description: payload.description?.trim() || undefined,
        date:        payload.date ? new Date(payload.date) : undefined,
      },
      include: { _count: { select: { applications: true } } },
    });
    revalidatePath("/admin/activities");
    revalidatePath("/activities");
    revalidatePath("/activities/catalog");
    return { activity };
  } catch {
    return { error: "حدث خطأ أثناء الإنشاء" };
  }
}

export async function updateActivity(
  id: string,
  payload: { title?: string; description?: string | null; date?: string | null }
): Promise<{ activity?: any; error?: string }> {
  const session = await getSession();
  if (!session?.userId || session.role !== "ADMIN") return { error: "غير مصرح" };

  try {
    const activity = await prisma.studentActivity.update({
      where: { id },
      data: {
        ...(payload.title       !== undefined ? { title:       payload.title?.trim()             } : {}),
        ...(payload.description !== undefined ? { description: payload.description?.trim() || null } : {}),
        ...(payload.date        !== undefined ? { date:        payload.date ? new Date(payload.date) : null } : {}),
      },
      include: { _count: { select: { applications: true } } },
    });
    revalidatePath("/admin/activities");
    revalidatePath("/activities");
    revalidatePath("/activities/catalog");
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
      prisma.activityApplication.deleteMany({ where: { activityId: id } }),
      prisma.studentActivity.delete({ where: { id } }),
    ]);
    revalidatePath("/admin/activities");
    revalidatePath("/activities");
    revalidatePath("/activities/catalog");
    return { success: true };
  } catch {
    return { error: "حدث خطأ أثناء الحذف" };
  }
}
