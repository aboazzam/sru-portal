import type { NextRequest } from 'next/server'
import { prisma } from '@/lib/db'
import { withAuth } from '@/lib/with-auth'
import type { JwtPayload } from '@/lib/jwt'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  return withAuth(async (_req: NextRequest, user: JwtPayload) => {
    const training = await prisma.training.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        description: true,
        instructor: true,
        category: true,
        capacity: true,
        startDate: true,
        endDate: true,
        status: true,
        createdAt: true,
        _count: { select: { enrollments: true } },
        enrollments: {
          where: { userId: user.sub },
          select: { id: true, status: true, createdAt: true },
          take: 1,
        },
      },
    })

    if (!training) {
      return Response.json({ error: 'Training not found.' }, { status: 404 })
    }

    const { enrollments, ...rest } = training
    return Response.json({
      training: {
        ...rest,
        myEnrollment: enrollments[0] ?? null,
      },
    })
  })(req)
}
