import { type NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/db";

const SubmitSchema = z.object({
  serviceId: z.string().min(1),
  studentId: z.string().optional(),
  formData: z.record(z.string(), z.unknown()).optional(),
  attachments: z
    .array(z.object({ name: z.string(), size: z.number(), type: z.string() }))
    .optional(),
  notes: z.string().optional(),
  submittedAt: z.string().optional(),
});

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session?.userId) {
    return Response.json({ error: "غير مصرح. يجب تسجيل الدخول أولاً." }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  if (!body) {
    return Response.json({ error: "طلب غير صالح." }, { status: 400 });
  }

  const parsed = SubmitSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: parsed.error.flatten().fieldErrors }, { status: 422 });
  }

  const { serviceId, formData, attachments, notes } = parsed.data;

  const service = await prisma.studentService.findUnique({
    where: { id: serviceId },
    select: { id: true, title: true },
  });
  if (!service) {
    return Response.json({ error: "الخدمة غير موجودة." }, { status: 404 });
  }

  const existing = await prisma.serviceApplications.findUnique({
    where: { userId_serviceId: { userId: session.userId, serviceId } },
  });
  if (existing) {
    return Response.json({ error: "لقد تقدّمت لهذه الخدمة مسبقاً." }, { status: 409 });
  }

  const application = await prisma.serviceApplications.create({
    data: {
      userId: session.userId,
      serviceId,
      notes: notes || null,
      formData: formData || attachments
        ? JSON.stringify({ ...formData, attachments: attachments ?? [] })
        : null,
    },
    select: { id: true, status: true, createdAt: true, serviceId: true },
  });

  revalidatePath("/services");
  revalidatePath("/services/catalog");
  revalidatePath("/services/my-requests");

  return Response.json(
    {
      application,
      message: "تم تقديم طلبك بنجاح وسيتم مراجعته قريباً.",
    },
    { status: 201 }
  );
}
