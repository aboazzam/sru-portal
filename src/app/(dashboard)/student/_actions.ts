"use server";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/db";

export async function applyForScholarship(
  scholarshipId: string
): Promise<{ success?: true; error?: string }> {
  const session = await getSession();
  if (!session?.userId || session.role !== "STUDENT") {
    return { error: "غير مصرح" };
  }

  const scholarship = await prisma.scholarship.findUnique({
    where: { id: scholarshipId },
    select: { deadline: true },
  });
  if (!scholarship) return { error: "المنحة غير موجودة" };
  if (scholarship.deadline && scholarship.deadline < new Date()) {
    return { error: "انتهت مدة التقديم على هذه المنحة" };
  }

  try {
    await prisma.scholarshipApplication.create({
      data: { userId: session.userId, scholarshipId },
    });
    revalidatePath("/student/scholarships");
    return { success: true };
  } catch {
    return { error: "لقد تقدمت لهذه المنحة مسبقاً" };
  }
}

export async function enrollInTraining(
  trainingId: string
): Promise<{ success?: true; error?: string }> {
  const session = await getSession();
  if (!session?.userId || session.role !== "STUDENT") {
    return { error: "غير مصرح" };
  }

  const training = await prisma.training.findUnique({
    where: { id: trainingId },
    select: { status: true, capacity: true, _count: { select: { enrollments: true } } },
  });
  if (!training) return { error: "البرنامج التدريبي غير موجود" };
  if (training.status === "CANCELLED" || training.status === "COMPLETED") {
    return { error: "التسجيل غير متاح لهذا البرنامج" };
  }
  if (training.capacity !== null && training._count.enrollments >= training.capacity) {
    return { error: "وصل البرنامج إلى الطاقة الاستيعابية القصوى" };
  }

  try {
    await prisma.trainingEnrollment.create({
      data: { userId: session.userId, trainingId },
    });
    revalidatePath("/student/trainings");
    return { success: true };
  } catch {
    return { error: "أنت مسجّل في هذا البرنامج مسبقاً" };
  }
}
