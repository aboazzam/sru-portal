import { z } from 'zod'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/db'
import { signToken } from '@/lib/jwt'

const RegisterSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8),
  gender: z.enum(['MALE', 'FEMALE']).optional(),
  collegeId: z.string().optional(),
})

export async function POST(req: Request) {
  const body = await req.json().catch(() => null)
  const parsed = RegisterSchema.safeParse(body)
  if (!parsed.success) {
    return Response.json({ error: parsed.error.flatten().fieldErrors }, { status: 422 })
  }

  const { name, email, password, gender, collegeId } = parsed.data

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    return Response.json({ error: 'Email already in use.' }, { status: 409 })
  }

  if (collegeId) {
    const college = await prisma.college.findUnique({ where: { id: collegeId } })
    if (!college) {
      return Response.json({ error: 'College not found.' }, { status: 404 })
    }
  }

  const hashed = await bcrypt.hash(password, 10)
  const user = await prisma.user.create({
    data: { name, email, password: hashed, gender, collegeId },
    select: { id: true, name: true, email: true, role: true, gender: true, collegeId: true },
  })

  const token = signToken({ sub: user.id, role: user.role })
  return Response.json({ token, user }, { status: 201 })
}
