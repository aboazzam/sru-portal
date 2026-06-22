import { type NextRequest } from "next/server";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/db";

const ADMIN_ROLES = ["ADMIN", "SUBADMIN"];

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session?.userId || !ADMIN_ROLES.includes(session.role)) {
    return Response.json({ error: "غير مصرح" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const status    = searchParams.get("status") ?? undefined;
  const serviceId = searchParams.get("serviceId") ?? undefined;

  const applications = await prisma.serviceApplications.findMany({
    where: {
      ...(status    ? { status: status as "PENDING" | "APPROVED" | "REJECTED" } : {}),
      ...(serviceId ? { serviceId } : {}),
    },
    include: {
      user:    { select: { id: true, name: true, email: true } },
      service: { select: { id: true, title: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return Response.json({ applications });
}
