import type { NextRequest } from 'next/server'
import { prisma } from '@/lib/db'
import { withAuth } from '@/lib/with-auth'

export const GET = withAuth(async (req: NextRequest) => {
  const status = req.nextUrl.searchParams.get('status') ?? undefined

  const requests = await prisma.trainingRequest.findMany({
    where: status ? { status: status as any } : undefined,
    orderBy: { createdAt: 'desc' },
    include: {
      user: { select: { id: true, name: true, email: true } },
    },
  })

  const counts = await prisma.trainingRequest.groupBy({
    by: ['status'],
    _count: { _all: true },
  })

  return Response.json({ requests, counts })
}, ['ADMIN'])
