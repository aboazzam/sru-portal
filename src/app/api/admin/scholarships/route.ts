import { z } from 'zod'
import type { NextRequest } from 'next/server'
import { prisma } from '@/lib/db'
import { withAuth } from '@/lib/with-auth'

const CreateSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  amount: z.number().positive().optional(),
  deadline: z.string().datetime({ offset: true }).optional(),
})

export const POST = withAuth(async (req: NextRequest) => {
  const body = await req.json().catch(() => null)
  const parsed = CreateSchema.safeParse(body)
  if (!parsed.success) {
    return Response.json({ error: parsed.error.flatten().fieldErrors }, { status: 422 })
  }

  const { title, description, amount, deadline } = parsed.data

  const scholarship = await prisma.scholarship.create({
    data: {
      title,
      description,
      amount,
      deadline: deadline ? new Date(deadline) : undefined,
    },
  })

  return Response.json({ scholarship }, { status: 201 })
}, ['ADMIN'])
