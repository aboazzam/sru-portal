"use server";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/db";

// ── Application status ────────────────────────────────────────────

export async function updateVolunteerAppStatus(
  id: string,
  status: "PENDING" | "APPROVED" | "REJECTED"
): Promise<{ success?: true; error?: string }> {
  const session = await getSession();
  if (!session?.userId || session.role !== "ADMIN") return { error: "غير مصرح" };

  await prisma.volunteerApplication.update({ where: { id }, data: { status } });
  revalidatePath("/admin/volunteers");
  return { success: true };
}

// ── Opportunity CRUD ──────────────────────────────────────────────

export async function createOpportunity(payload: {
  title: string;
  description?: string;
  date?: string;
}): Promise<{ opportunity?: any; error?: string }> {
  const session = await getSession();
  if (!session?.userId || session.role !== "ADMIN") return { error: "غير مصرح" };
  if (!payload.title?.trim()) return { error: "عنوان الفرصة مطلوب" };

  try {
    const opportunity = await prisma.volunteerOpportunity.create({
      data: {
        title:       payload.title.trim(),
        description: payload.description?.trim() || undefined,
        date:        payload.date ? new Date(payload.date) : undefined,
      },
      include: { _count: { select: { applications: true } } },
    });
    revalidatePath("/admin/volunteers");
    revalidatePath("/volunteers");
    revalidatePath("/volunteers/opportunities");
    return { opportunity };
  } catch {
    return { error: "حدث خطأ أثناء الإنشاء" };
  }
}

export async function updateOpportunity(
  id: string,
  payload: { title?: string; description?: string | null; date?: string | null }
): Promise<{ opportunity?: any; error?: string }> {
  const session = await getSession();
  if (!session?.userId || session.role !== "ADMIN") return { error: "غير مصرح" };

  try {
    const opportunity = await prisma.volunteerOpportunity.update({
      where: { id },
      data: {
        ...(payload.title       !== undefined ? { title:       payload.title?.trim()              } : {}),
        ...(payload.description !== undefined ? { description: payload.description?.trim() || null } : {}),
        ...(payload.date        !== undefined ? { date:        payload.date ? new Date(payload.date) : null } : {}),
      },
      include: { _count: { select: { applications: true } } },
    });
    revalidatePath("/admin/volunteers");
    revalidatePath("/volunteers");
    revalidatePath("/volunteers/opportunities");
    return { opportunity };
  } catch {
    return { error: "حدث خطأ أثناء التعديل" };
  }
}

export async function deleteOpportunity(id: string): Promise<{ success?: true; error?: string }> {
  const session = await getSession();
  if (!session?.userId || session.role !== "ADMIN") return { error: "غير مصرح" };

  try {
    await prisma.$transaction([
      prisma.volunteerApplication.deleteMany({ where: { opportunityId: id } }),
      prisma.volunteerOpportunity.delete({ where: { id } }),
    ]);
    revalidatePath("/admin/volunteers");
    revalidatePath("/volunteers");
    revalidatePath("/volunteers/opportunities");
    return { success: true };
  } catch {
    return { error: "حدث خطأ أثناء الحذف" };
  }
}
