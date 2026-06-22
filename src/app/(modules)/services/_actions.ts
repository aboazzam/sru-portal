"use server";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/db";

const ADMIN_ROLES = ["ADMIN", "SUBADMIN"] as const;

export async function reviewServiceApplication(
  applicationId: string,
  decision: "APPROVED" | "REJECTED",
  adminNote?: string
): Promise<{ success?: true; error?: string }> {
  const session = await getSession();
  if (!session?.userId) return { error: "يجب تسجيل الدخول أولاً" };
  if (!(ADMIN_ROLES as readonly string[]).includes(session.role))
    return { error: "غير مصرح. هذه الصلاحية للمشرفين فقط." };

  const app = await prisma.serviceApplications.findUnique({
    where: { id: applicationId },
    select: { id: true, status: true },
  });
  if (!app) return { error: "الطلب غير موجود" };
  if (app.status !== "PENDING") return { error: "تم البت في هذا الطلب مسبقاً" };

  await prisma.serviceApplications.update({
    where: { id: applicationId },
    data: {
      status: decision,
      ...(adminNote ? { notes: adminNote } : {}),
    },
  });

  revalidatePath("/services/admin");
  revalidatePath("/services/my-requests");
  revalidatePath("/services");
  return { success: true };
}

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
