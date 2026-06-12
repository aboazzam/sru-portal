import type { NextRequest } from 'next/server'
import { prisma } from '@/lib/db'
import { withAuth } from '@/lib/with-auth'
import type { JwtPayload } from '@/lib/jwt'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  return withAuth(async (_req: NextRequest, user: JwtPayload) => {
    const training = await prisma.training.findUnique({
      where: { id },
      select: {
        id: true,
        status: true,
        capacity: true,
        _count: { select: { enrollments: true } },
      },
    })

    if (!training) {
      return Response.json({ error: 'Training not found.' }, { status: 404 })
    }

    if (training.status === 'COMPLETED' || training.status === 'CANCELLED') {
      return Response.json({ error: 'Enrollment is closed for this training.' }, { status: 410 })
    }

    if (training.capacity !== null && training._count.enrollments >= training.capacity) {
      return Response.json({ error: 'Training is at full capacity.' }, { status: 409 })
    }

    const existing = await prisma.trainingEnrollment.findUnique({
      where: { userId_trainingId: { userId: user.sub, trainingId: id } },
    })
    if (existing) {
      return Response.json({ error: 'You are already enrolled in this training.' }, { status: 409 })
    }

    const enrollment = await prisma.trainingEnrollment.create({
      data: { userId: user.sub, trainingId: id },
      select: { id: true, status: true, trainingId: true, createdAt: true },
    })

    return Response.json({ enrollment }, { status: 201 })
  }, ['STUDENT'])(req)
}
