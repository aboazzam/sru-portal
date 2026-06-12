"use server";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/db";

export async function applyForService(
  serviceId: string
): Promise<{ success?: true; error?: string }> {
  const session = await getSession();
  if (!session?.userId) return { error: "يجب تسجيل الدخول أولاً" };

  const service = await prisma.studentService.findUnique({
    where: { id: serviceId },
    select: { id: true },
  });
  if (!service) return { error: "الخدمة غير موجودة" };

  try {
    await prisma.serviceApplications.create({
      data: { userId: session.userId, serviceId },
    });
    revalidatePath("/services");
    revalidatePath("/services/catalog");
    revalidatePath("/services/my-requests");
    return { success: true };
  } catch {
    return { error: "لقد تقدّمت لهذه الخدمة مسبقاً" };
  }
}
