"use server";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/db";

export async function enrollInTrainingModule(
  trainingId: string
): Promise<{ success?: true; error?: string }> {
  const session = await getSession();
  if (!session?.userId) return { error: "يجب تسجيل الدخول أولاً" };

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
    revalidatePath("/training");
    revalidatePath("/training/catalog");
    revalidatePath("/training/my-courses");
    return { success: true };
  } catch {
    return { error: "أنت مسجّل في هذا البرنامج مسبقاً" };
  }
}
