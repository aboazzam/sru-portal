"use server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";

export async function adjustPoints(formData: FormData) {
  const userId = formData.get("userId") as string;
  const delta = parseInt(formData.get("delta") as string, 10);
  if (!userId || isNaN(delta) || delta === 0) return;

  await prisma.user.update({
    where: { id: userId },
    data: { points: { increment: delta } },
  });

  revalidatePath("/admin/points");
}

export async function setPoints(formData: FormData) {
  const userId = formData.get("userId") as string;
  const value = parseInt(formData.get("value") as string, 10);
  if (!userId || isNaN(value) || value < 0) return;

  await prisma.user.update({
    where: { id: userId },
    data: { points: value },
  });

  revalidatePath("/admin/points");
}
