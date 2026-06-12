import type { NextRequest } from 'next/server'
import { prisma } from '@/lib/db'
import { withAuth } from '@/lib/with-auth'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return withAuth(async (_req, user) => {
    const scholarship = await prisma.scholarship.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        description: true,
        amount: true,
        deadline: true,
        createdAt: true,
        _count: { select: { applications: true } },
        applications: {
          where: { userId: user.sub },
          select: { id: true, status: true, createdAt: true },
          take: 1,
        },
      },
    })

    if (!scholarship) {
      return Response.json({ error: 'Scholarship not found.' }, { status: 404 })
    }

    const { applications, ...rest } = scholarship
    return Response.json({
      scholarship: {
        ...rest,
        myApplication: applications[0] ?? null,
      },
    })
  })(req)
}
