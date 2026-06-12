import type { NextRequest } from 'next/server'
import { prisma } from '@/lib/db'
import { withAuth } from '@/lib/with-auth'

export const GET = withAuth(async (req: NextRequest) => {
  const { searchParams } = req.nextUrl
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1'))
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') ?? '20')))
  const role = searchParams.get('role') ?? undefined
  const search = searchParams.get('search') ?? undefined

  const where = {
    ...(role ? { role: role as any } : {}),
    ...(search
      ? {
          OR: [
            { name: { contains: search } },
            { email: { contains: search } },
          ],
        }
      : {}),
  }

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        gender: true,
        points: true,
        collegeId: true,
        createdAt: true,
      },
    }),
    prisma.user.count({ where }),
  ])

  return Response.json({
    users,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  })
}, ['ADMIN'])
