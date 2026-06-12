import type { NextRequest } from 'next/server'
import { prisma } from '@/lib/db'
import { withAuth } from '@/lib/with-auth'

export const GET = withAuth(async (_req: NextRequest) => {
  const [
    totalUsers,
    totalStudents,
    totalAdmins,
    totalScholarships,
    activeScholarships,
    totalTrainings,
    upcomingTrainings,
    totalApplications,
    totalEnrollments,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { role: 'STUDENT' } }),
    prisma.user.count({ where: { role: 'ADMIN' } }),
    prisma.scholarship.count(),
    prisma.scholarship.count({
      where: {
        OR: [{ deadline: null }, { deadline: { gte: new Date() } }],
      },
    }),
    prisma.training.count(),
    prisma.training.count({ where: { status: 'UPCOMING' } }),
    prisma.scholarshipApplication.count(),
    prisma.trainingEnrollment.count(),
  ])

  return Response.json({
    users: { total: totalUsers, students: totalStudents, admins: totalAdmins },
    scholarships: { total: totalScholarships, active: activeScholarships },
    trainings: { total: totalTrainings, upcoming: upcomingTrainings },
    applications: { total: totalApplications },
    enrollments: { total: totalEnrollments },
  })
}, ['ADMIN'])
