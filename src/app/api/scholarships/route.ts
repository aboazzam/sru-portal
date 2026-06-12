import type { NextRequest } from 'next/server'
import { prisma } from '@/lib/db'
import { withAuth } from '@/lib/with-auth'

export const GET = withAuth(async (_req: NextRequest) => {
  const scholarships = await prisma.scholarship.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      title: true,
      description: true,
      amount: true,
      deadline: true,
      createdAt: true,
      _count: { select: { applications: true } },
    },
  })

  return Response.json({ scholarships })
})
