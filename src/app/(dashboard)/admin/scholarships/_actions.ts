"use server";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/db";

// ── Application status ────────────────────────────────────────────

export async function updateApplicationStatus(
  id: string,
  status: "PENDING" | "APPROVED" | "REJECTED"
): Promise<{ success?: true; error?: string }> {
  const session = await getSession();
  if (!session?.userId || session.role !== "ADMIN") return { error: "غير مصرح" };

  await prisma.scholarshipApplication.update({ where: { id }, data: { status } });
  revalidatePath("/admin/scholarships");
  return { success: true };
}

// ── Scholarship CRUD ──────────────────────────────────────────────

type ScholarshipPayload = {
  title?: string;
  description?: string | null;
  amount?: number | null;
  deadline?: string | null;
};

export async function createScholarship(
  payload: { title: string; description?: string; amount?: number; deadline?: string }
): Promise<{ scholarship?: any; error?: string }> {
  const session = await getSession();
  if (!session?.userId || session.role !== "ADMIN") return { error: "غير مصرح" };
  if (!payload.title?.trim()) return { error: "عنوان المنحة مطلوب" };

  try {
    const scholarship = await prisma.scholarship.create({
      data: {
        title:       payload.title.trim(),
        description: payload.description?.trim() || undefined,
        amount:      payload.amount ?? undefined,
        deadline:    payload.deadline ? new Date(payload.deadline) : undefined,
      },
      include: { _count: { select: { applications: true } } },
    });
    revalidatePath("/admin/scholarships");
    revalidatePath("/student/scholarships");
    return { scholarship };
  } catch {
    return { error: "حدث خطأ أثناء الإنشاء" };
  }
}

export async function updateScholarship(
  id: string,
  payload: ScholarshipPayload
): Promise<{ scholarship?: any; error?: string }> {
  const session = await getSession();
  if (!session?.userId || session.role !== "ADMIN") return { error: "غير مصرح" };

  try {
    const scholarship = await prisma.scholarship.update({
      where: { id },
      data: {
        ...(payload.title       !== undefined ? { title:       payload.title?.trim()             } : {}),
        ...(payload.description !== undefined ? { description: payload.description?.trim() || null } : {}),
        ...(payload.amount      !== undefined ? { amount:      payload.amount                     } : {}),
        ...(payload.deadline    !== undefined ? { deadline:    payload.deadline ? new Date(payload.deadline) : null } : {}),
      },
      include: { _count: { select: { applications: true } } },
    });
    revalidatePath("/admin/scholarships");
    revalidatePath("/student/scholarships");
    return { scholarship };
  } catch {
    return { error: "حدث خطأ أثناء التعديل" };
  }
}

export async function deleteScholarship(
  id: string
): Promise<{ success?: true; error?: string }> {
  const session = await getSession();
  if (!session?.userId || session.role !== "ADMIN") return { error: "غير مصرح" };

  try {
    await prisma.$transaction([
      prisma.scholarshipApplication.deleteMany({ where: { scholarshipId: id } }),
      prisma.scholarship.delete({ where: { id } }),
    ]);
    revalidatePath("/admin/scholarships");
    revalidatePath("/student/scholarships");
    return { success: true };
  } catch {
    return { error: "حدث خطأ أثناء الحذف" };
  }
}
