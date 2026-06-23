"use server";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/db";

// ── Application status ────────────────────────────────────────────

export async function updateServiceAppStatus(
  id: string,
  status: "PENDING" | "APPROVED" | "REJECTED"
): Promise<{ success?: true; error?: string }> {
  const session = await getSession();
  if (!session?.userId || session.role !== "ADMIN") return { error: "غير مصرح" };

  await prisma.serviceApplications.update({ where: { id }, data: { status } });
  revalidatePath("/admin/services");
  return { success: true };
}

// ── Service CRUD ──────────────────────────────────────────────────

export async function createService(payload: {
  title: string;
  description?: string;
}): Promise<{ service?: any; error?: string }> {
  const session = await getSession();
  if (!session?.userId || session.role !== "ADMIN") return { error: "غير مصرح" };
  if (!payload.title?.trim()) return { error: "عنوان الخدمة مطلوب" };

  try {
    const service = await prisma.studentService.create({
      data: {
        title:       payload.title.trim(),
        description: payload.description?.trim() || undefined,
      },
      include: { _count: { select: { applications: true } } },
    });
    revalidatePath("/admin/services");
    revalidatePath("/services");
    revalidatePath("/services/catalog");
    return { service };
  } catch {
    return { error: "حدث خطأ أثناء الإنشاء" };
  }
}

export async function updateService(
  id: string,
  payload: { title?: string; description?: string | null }
): Promise<{ service?: any; error?: string }> {
  const session = await getSession();
  if (!session?.userId || session.role !== "ADMIN") return { error: "غير مصرح" };

  try {
    const service = await prisma.studentService.update({
      where: { id },
      data: {
        ...(payload.title       !== undefined ? { title:       payload.title?.trim()              } : {}),
        ...(payload.description !== undefined ? { description: payload.description?.trim() || null } : {}),
      },
      include: { _count: { select: { applications: true } } },
    });
    revalidatePath("/admin/services");
    revalidatePath("/services");
    revalidatePath("/services/catalog");
    return { service };
  } catch {
    return { error: "حدث خطأ أثناء التعديل" };
  }
}

export async function deleteService(id: string): Promise<{ success?: true; error?: string }> {
  const session = await getSession();
  if (!session?.userId || session.role !== "ADMIN") return { error: "غير مصرح" };

  try {
    await prisma.$transaction([
      prisma.serviceApplications.deleteMany({ where: { serviceId: id } }),
      prisma.studentService.delete({ where: { id } }),
    ]);
    revalidatePath("/admin/services");
    revalidatePath("/services");
    revalidatePath("/services/catalog");
    return { success: true };
  } catch {
    return { error: "حدث خطأ أثناء الحذف" };
  }
}
