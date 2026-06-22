import { z } from 'zod'
import bcrypt from 'bcryptjs'
import type { NextRequest } from 'next/server'
import { prisma } from '@/lib/db'
import { withAuth } from '@/lib/with-auth'
import type { JwtPayload } from '@/lib/jwt'

const PatchUserSchema = z.object({
  name:     z.string().min(1).optional(),
  nameEn:   z.string().optional(),
  email:    z.string().email().optional(),
  password: z.string().min(8).optional(),
  role:     z.enum(['STUDENT', 'FACULTY', 'ADMIN', 'ORGANIZER', 'SUBADMIN']).optional(),
  gender:   z.enum(['MALE', 'FEMALE']).nullable().optional(),
})

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  return withAuth(async (req: NextRequest, _admin: JwtPayload) => {
    const body = await req.json().catch(() => null)
    const parsed = PatchUserSchema.safeParse(body)
    if (!parsed.success) {
      return Response.json({ error: parsed.error.flatten().fieldErrors }, { status: 422 })
    }

    const existing = await prisma.user.findUnique({ where: { id } })
    if (!existing) {
      return Response.json({ error: 'User not found.' }, { status: 404 })
    }

    const { password, email, gender, ...rest } = parsed.data

    if (email && email !== existing.email) {
      const taken = await prisma.user.findUnique({ where: { email } })
      if (taken) {
        return Response.json({ error: 'البريد الإلكتروني مستخدم بالفعل.' }, { status: 409 })
      }
    }

    const data: Record<string, unknown> = { ...rest }
    if (email) data.email = email
    if (gender !== undefined) data.gender = gender
    if (password) data.password = await bcrypt.hash(password, 10)

    const user = await prisma.user.update({
      where: { id },
      data,
      select: {
        id: true, name: true, nameEn: true, email: true,
        role: true, gender: true, points: true, createdAt: true,
      },
    })

    return Response.json({ user })
  }, ['ADMIN'])(req)
}
