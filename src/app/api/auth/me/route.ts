import type { NextRequest } from 'next/server'
import { prisma } from '@/lib/db'
import { withAuth } from '@/lib/with-auth'
import type { JwtPayload } from '@/lib/jwt'

export const GET = withAuth(async (_req: NextRequest, user: JwtPayload) => {
  const me = await prisma.user.findUnique({
    where: { id: user.sub },
    select: { id: true, name: true, email: true, role: true, gender: true, points: true, collegeId: true, createdAt: true },
  })

  if (!me) {
    return Response.json({ error: 'User not found.' }, { status: 404 })
  }

  return Response.json({ user: me })
})
