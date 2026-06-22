"use server";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/db";

// ── Enrollment status ─────────────────────────────────────────────
export async function updateEnrollmentStatus(
  id: string,
  status: "PENDING" | "APPROVED" | "REJECTED" | "COMPLETED"
): Promise<{ success?: true; error?: string }> {
  const session = await getSession();
  if (!session?.userId || session.role !== "ADMIN") return { error: "غير مصرح" };

  await prisma.trainingEnrollment.update({ where: { id }, data: { status } });
  revalidatePath("/admin/trainings");
  return { success: true };
}

// ── Training CRUD ─────────────────────────────────────────────────
type TrainingPayload = {
  title?:       string;
  description?: string;
  instructor?:  string;
  category?:    string;
  capacity?:    number;
  startDate?:   string;
  endDate?:     string;
  status?:      string;
};

export async function createTraining(
  payload: TrainingPayload
): Promise<{ training?: any; error?: unknown }> {
  const session = await getSession();
  if (!session?.userId || session.role !== "ADMIN") return { error: "غير مصرح" };

  const { startDate, endDate, status, ...rest } = payload;

  if (!rest.title) return { error: "العنوان مطلوب" };

  const training = await prisma.training.create({
    data: {
      title:       rest.title,
      description: rest.description,
      instructor:  rest.instructor,
      category:    rest.category,
      capacity:    rest.capacity,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate:   endDate   ? new Date(endDate)   : undefined,
      status:    (status ?? "UPCOMING") as any,
    },
  });

  revalidatePath("/admin/trainings");
  return { training };
}

export async function updateTraining(
  id: string,
  payload: TrainingPayload
): Promise<{ training?: any; error?: unknown }> {
  const session = await getSession();
  if (!session?.userId || session.role !== "ADMIN") return { error: "غير مصرح" };

  const { startDate, endDate, status, capacity, ...rest } = payload;

  const training = await prisma.training.update({
    where: { id },
    data: {
      ...rest,
      ...(capacity !== undefined ? { capacity: capacity ?? null } : {}),
      ...(startDate !== undefined ? { startDate: startDate ? new Date(startDate) : null } : {}),
      ...(endDate   !== undefined ? { endDate:   endDate   ? new Date(endDate)   : null } : {}),
      ...(status    !== undefined ? { status: status as any } : {}),
    },
  });

  revalidatePath("/admin/trainings");
  return { training };
}

export async function deleteTraining(
  id: string
): Promise<{ success?: true; error?: string }> {
  const session = await getSession();
  if (!session?.userId || session.role !== "ADMIN") return { error: "غير مصرح" };

  await prisma.$transaction([
    prisma.trainingEnrollment.deleteMany({ where: { trainingId: id } }),
    prisma.training.delete({ where: { id } }),
  ]);

  revalidatePath("/admin/trainings");
  return { success: true };
}

// ── Training request status ───────────────────────────────────────
export async function updateTrainingRequestStatus(
  id: string,
  status: "PENDING" | "APPROVED" | "REJECTED" | "COMPLETED"
): Promise<{ success?: true; error?: string }> {
  const session = await getSession();
  if (!session?.userId || session.role !== "ADMIN") return { error: "غير مصرح" };

  await prisma.trainingRequest.update({ where: { id }, data: { status } });
  revalidatePath("/admin/trainings");
  return { success: true };
}
