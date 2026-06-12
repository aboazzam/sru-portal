import type { NextRequest } from 'next/server'
import { prisma } from '@/lib/db'
import { withAuth } from '@/lib/with-auth'
import type { JwtPayload } from '@/lib/jwt'

export const GET = withAuth(async (_req: NextRequest, user: JwtPayload) => {
  const enrollments = await prisma.trainingEnrollment.findMany({
    where: { userId: user.sub },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      status: true,
      createdAt: true,
      training: {
        select: {
          id: true,
          title: true,
          description: true,
          instructor: true,
          category: true,
          startDate: true,
          endDate: true,
          status: true,
        },
      },
    },
  })

  return Response.json({ enrollments })
}, ['STUDENT'])
