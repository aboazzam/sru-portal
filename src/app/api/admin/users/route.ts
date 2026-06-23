import { z } from 'zod'
import bcrypt from 'bcryptjs'
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

  try {
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          nameEn: true,
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
  } catch (e) {
    console.error('GET /api/admin/users error:', e)
    return Response.json({ error: 'حدث خطأ في الخادم' }, { status: 500 })
  }
}, ['ADMIN'])

const CreateUserSchema = z.object({
  name:     z.string().min(1),
  nameEn:   z.string().optional(),
  email:    z.string().email(),
  password: z.string().min(8),
  role:     z.enum(['STUDENT', 'FACULTY', 'ADMIN', 'ORGANIZER', 'SUBADMIN']),
  gender:   z.enum(['MALE', 'FEMALE']).optional(),
})

export const POST = withAuth(async (req: NextRequest) => {
  try {
    const body = await req.json().catch(() => null)
    const parsed = CreateUserSchema.safeParse(body)
    if (!parsed.success) {
      return Response.json({ error: parsed.error.flatten().fieldErrors }, { status: 422 })
    }

    const { name, nameEn, email, password, role, gender } = parsed.data

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return Response.json({ error: 'هذا البريد الإلكتروني مسجل مسبقاً' }, { status: 409 })
    }

    const hashed = await bcrypt.hash(password, 10)
    const user = await prisma.user.create({
      data: { name, nameEn, email, password: hashed, role, gender },
      select: {
        id: true, name: true, nameEn: true, email: true,
        role: true, gender: true, points: true, createdAt: true,
      },
    })

    return Response.json({ user }, { status: 201 })
  } catch (e) {
    console.error('POST /api/admin/users error:', e)
    return Response.json({ error: 'حدث خطأ في الخادم' }, { status: 500 })
  }
}, ['ADMIN'])
