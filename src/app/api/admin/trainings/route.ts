import { z } from 'zod'
import type { NextRequest } from 'next/server'
import { prisma } from '@/lib/db'
import { withAuth } from '@/lib/with-auth'

const CreateSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  instructor: z.string().optional(),
  category: z.string().optional(),
  capacity: z.number().int().positive().optional(),
  startDate: z.string().datetime({ offset: true }).optional(),
  endDate: z.string().datetime({ offset: true }).optional(),
  status: z.enum(['UPCOMING', 'ONGOING', 'COMPLETED', 'CANCELLED']).optional(),
})

export const POST = withAuth(async (req: NextRequest) => {
  const body = await req.json().catch(() => null)
  const parsed = CreateSchema.safeParse(body)
  if (!parsed.success) {
    return Response.json({ error: parsed.error.flatten().fieldErrors }, { status: 422 })
  }

  const { startDate, endDate, ...rest } = parsed.data

  const training = await prisma.training.create({
    data: {
      ...rest,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
    },
  })

  return Response.json({ training }, { status: 201 })
}, ['ADMIN'])
