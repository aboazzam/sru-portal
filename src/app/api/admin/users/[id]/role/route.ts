import { z } from 'zod'
import type { NextRequest } from 'next/server'
import { prisma } from '@/lib/db'
import { withAuth } from '@/lib/with-auth'
import type { JwtPayload } from '@/lib/jwt'

const RoleSchema = z.object({
  role: z.enum(['STUDENT', 'FACULTY', 'ADMIN', 'ORGANIZER', 'SUBADMIN']),
})

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  return withAuth(async (req: NextRequest, admin: JwtPayload) => {
    if (admin.sub === id) {
      return Response.json({ error: 'Cannot change your own role.' }, { status: 400 })
    }

    const body = await req.json().catch(() => null)
    const parsed = RoleSchema.safeParse(body)
    if (!parsed.success) {
      return Response.json({ error: parsed.error.flatten().fieldErrors }, { status: 422 })
    }

    const existing = await prisma.user.findUnique({ where: { id } })
    if (!existing) {
      return Response.json({ error: 'User not found.' }, { status: 404 })
    }

    const user = await prisma.user.update({
      where: { id },
      data: { role: parsed.data.role },
      select: { id: true, name: true, email: true, role: true },
    })

    return Response.json({ user })
  }, ['ADMIN'])(req)
}
