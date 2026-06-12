import { z } from 'zod'
import type { NextRequest } from 'next/server'
import { prisma } from '@/lib/db'
import { withAuth } from '@/lib/with-auth'

const ApplySchema = z.object({
  scholarshipId: z.string().min(1),
})

export const POST = withAuth(async (req: NextRequest, user) => {
  const body = await req.json().catch(() => null)
  const parsed = ApplySchema.safeParse(body)
  if (!parsed.success) {
    return Response.json({ error: parsed.error.flatten().fieldErrors }, { status: 422 })
  }

  const { scholarshipId } = parsed.data

  const scholarship = await prisma.scholarship.findUnique({ where: { id: scholarshipId } })
  if (!scholarship) {
    return Response.json({ error: 'Scholarship not found.' }, { status: 404 })
  }

  if (scholarship.deadline && scholarship.deadline < new Date()) {
    return Response.json({ error: 'Application deadline has passed.' }, { status: 410 })
  }

  const existing = await prisma.scholarshipApplication.findUnique({
    where: { userId_scholarshipId: { userId: user.sub, scholarshipId } },
  })
  if (existing) {
    return Response.json({ error: 'You have already applied for this scholarship.' }, { status: 409 })
  }

  const application = await prisma.scholarshipApplication.create({
    data: { userId: user.sub, scholarshipId },
    select: { id: true, status: true, createdAt: true, scholarshipId: true },
  })

  return Response.json({ application }, { status: 201 })
}, ['STUDENT'])
