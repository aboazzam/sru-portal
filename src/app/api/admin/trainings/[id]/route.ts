import { z } from 'zod'
import type { NextRequest } from 'next/server'
import { prisma } from '@/lib/db'
import { withAuth } from '@/lib/with-auth'
import type { JwtPayload } from '@/lib/jwt'

const UpdateSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  instructor: z.string().optional(),
  category: z.string().optional(),
  capacity: z.number().int().positive().nullable().optional(),
  startDate: z.string().datetime({ offset: true }).nullable().optional(),
  endDate: z.string().datetime({ offset: true }).nullable().optional(),
  status: z.enum(['UPCOMING', 'ONGOING', 'COMPLETED', 'CANCELLED']).optional(),
})

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  return withAuth(async (req: NextRequest, _user: JwtPayload) => {
    const body = await req.json().catch(() => null)
    const parsed = UpdateSchema.safeParse(body)
    if (!parsed.success) {
      return Response.json({ error: parsed.error.flatten().fieldErrors }, { status: 422 })
    }

    const existing = await prisma.training.findUnique({ where: { id } })
    if (!existing) {
      return Response.json({ error: 'Training not found.' }, { status: 404 })
    }

    const { startDate, endDate, ...rest } = parsed.data
    const training = await prisma.training.update({
      where: { id },
      data: {
        ...rest,
        ...(startDate !== undefined ? { startDate: startDate ? new Date(startDate) : null } : {}),
        ...(endDate !== undefined ? { endDate: endDate ? new Date(endDate) : null } : {}),
      },
    })

    return Response.json({ training })
  }, ['ADMIN'])(req)
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  return withAuth(async (_req: NextRequest, _user: JwtPayload) => {
    const existing = await prisma.training.findUnique({ where: { id } })
    if (!existing) {
      return Response.json({ error: 'Training not found.' }, { status: 404 })
    }

    await prisma.$transaction([
      prisma.trainingEnrollment.deleteMany({ where: { trainingId: id } }),
      prisma.training.delete({ where: { id } }),
    ])

    return new Response(null, { status: 204 })
  }, ['ADMIN'])(req)
}
