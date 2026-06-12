import type { NextRequest } from 'next/server'
import { prisma } from '@/lib/db'
import { withAuth } from '@/lib/with-auth'

export const GET = withAuth(async (_req: NextRequest) => {
  const trainings = await prisma.training.findMany({
    orderBy: { createdAt: 'desc' },
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
    },
  })

  return Response.json({ trainings })
})
