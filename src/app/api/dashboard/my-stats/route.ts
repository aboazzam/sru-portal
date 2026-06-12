import type { NextRequest } from 'next/server'
import { prisma } from '@/lib/db'
import { withAuth } from '@/lib/with-auth'
import type { JwtPayload } from '@/lib/jwt'

export const GET = withAuth(async (_req: NextRequest, user: JwtPayload) => {
  const [me, scholarshipApplications, trainingEnrollments] = await Promise.all([
    prisma.user.findUnique({
      where: { id: user.sub },
      select: { points: true },
    }),
    prisma.scholarshipApplication.findMany({
      where: { userId: user.sub },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        status: true,
        createdAt: true,
        scholarship: { select: { id: true, title: true, amount: true, deadline: true } },
      },
    }),
    prisma.trainingEnrollment.findMany({
      where: { userId: user.sub },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        status: true,
        createdAt: true,
        training: { select: { id: true, title: true, category: true, startDate: true, status: true } },
      },
    }),
  ])

  const appsByStatus = scholarshipApplications.reduce<Record<string, number>>((acc, a) => {
    acc[a.status] = (acc[a.status] ?? 0) + 1
    return acc
  }, {})

  const enrollmentsByStatus = trainingEnrollments.reduce<Record<string, number>>((acc, e) => {
    acc[e.status] = (acc[e.status] ?? 0) + 1
    return acc
  }, {})

  return Response.json({
    points: me?.points ?? 0,
    scholarships: {
      total: scholarshipApplications.length,
      byStatus: appsByStatus,
      applications: scholarshipApplications,
    },
    trainings: {
      total: trainingEnrollments.length,
      byStatus: enrollmentsByStatus,
      enrollments: trainingEnrollments,
    },
  })
}, ['STUDENT'])
