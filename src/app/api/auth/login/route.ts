import { z } from 'zod'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/db'
import { signToken } from '@/lib/jwt'

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

export async function POST(req: Request) {
  const body = await req.json().catch(() => null)
  const parsed = LoginSchema.safeParse(body)
  if (!parsed.success) {
    return Response.json({ error: parsed.error.flatten().fieldErrors }, { status: 422 })
  }

  const { email, password } = parsed.data
  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, name: true, email: true, role: true, gender: true, points: true, password: true },
  })

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return Response.json({ error: 'Invalid email or password.' }, { status: 401 })
  }

  const token = signToken({ sub: user.id, role: user.role })
  const { password: _, ...safeUser } = user
  return Response.json({ token, user: safeUser })
}
