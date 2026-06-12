import { z } from 'zod'
import type { NextRequest } from 'next/server'
import { prisma } from '@/lib/db'
import { withAuth } from '@/lib/with-auth'
import type { JwtPayload } from '@/lib/jwt'

const UpdateSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  amount: z.number().positive().optional(),
  deadline: z.string().datetime({ offset: true }).nullable().optional(),
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

    const existing = await prisma.scholarship.findUnique({ where: { id } })
    if (!existing) {
      return Response.json({ error: 'Scholarship not found.' }, { status: 404 })
    }

    const { deadline, ...rest } = parsed.data
    const scholarship = await prisma.scholarship.update({
      where: { id },
      data: {
        ...rest,
        ...(deadline !== undefined ? { deadline: deadline ? new Date(deadline) : null } : {}),
      },
    })

    return Response.json({ scholarship })
  }, ['ADMIN'])(req)
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  return withAuth(async (_req: NextRequest, _user: JwtPayload) => {
    const existing = await prisma.scholarship.findUnique({ where: { id } })
    if (!existing) {
      return Response.json({ error: 'Scholarship not found.' }, { status: 404 })
    }

    await prisma.$transaction([
      prisma.scholarshipApplication.deleteMany({ where: { scholarshipId: id } }),
      prisma.scholarship.delete({ where: { id } }),
    ])

    return new Response(null, { status: 204 })
  }, ['ADMIN'])(req)
}
