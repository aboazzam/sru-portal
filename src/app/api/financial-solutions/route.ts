import type { NextRequest } from 'next/server'
import { prisma } from '@/lib/db'
import { withAuth } from '@/lib/with-auth'

export const GET = withAuth(async (_req: NextRequest) => {
  const solutions = await prisma.financialSolution.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      title: true,
      description: true,
      createdAt: true,
    },
  })

  return Response.json({ solutions })
})
