import { z } from 'zod'
import type { NextRequest } from 'next/server'
import { prisma } from '@/lib/db'
import { withAuth } from '@/lib/with-auth'
import type { JwtPayload } from '@/lib/jwt'

const StatusSchema = z.object({
  status: z.enum(['PENDING', 'APPROVED', 'REJECTED', 'COMPLETED']),
})

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  return withAuth(async (req: NextRequest, _user: JwtPayload) => {
    const body = await req.json().catch(() => null)
    const parsed = StatusSchema.safeParse(body)
    if (!parsed.success) {
      return Response.json({ error: parsed.error.flatten().fieldErrors }, { status: 422 })
    }

    const existing = await prisma.trainingRequest.findUnique({ where: { id } })
    if (!existing) {
      return Response.json({ error: 'Request not found.' }, { status: 404 })
    }

    const request = await prisma.trainingRequest.update({
      where: { id },
      data: { status: parsed.data.status },
    })

    return Response.json({ request })
  }, ['ADMIN'])(req)
}
