import { z } from 'zod'
import type { NextRequest } from 'next/server'
import { prisma } from '@/lib/db'
import { withAuth } from '@/lib/with-auth'
import type { JwtPayload } from '@/lib/jwt'

export const GET = withAuth(async (_req: NextRequest, user: JwtPayload) => {
  const requests = await prisma.trainingRequest.findMany({
    where: { userId: user.sub },
    orderBy: { createdAt: 'desc' },
  })
  return Response.json({ requests })
})

const CreateSchema = z.object({
  type:        z.string().min(1),
  programName: z.string().min(1),
  notes:       z.string().optional(),
})

export const POST = withAuth(async (req: NextRequest, user: JwtPayload) => {
  const body = await req.json().catch(() => null)
  const parsed = CreateSchema.safeParse(body)
  if (!parsed.success) {
    return Response.json({ error: parsed.error.flatten().fieldErrors }, { status: 422 })
  }

  const request = await prisma.trainingRequest.create({
    data: {
      userId:      user.sub,
      type:        parsed.data.type,
      programName: parsed.data.programName,
      notes:       parsed.data.notes,
    },
  })

  return Response.json({ request }, { status: 201 })
})
