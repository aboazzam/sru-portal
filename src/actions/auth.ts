'use server'
import { redirect } from 'next/navigation'
import bcrypt from 'bcryptjs'
import { LoginSchema, type LoginFormState } from '@/lib/definitions'
import { createSession, deleteSession } from '@/lib/session'
import { prisma } from '@/lib/db'

export async function login(state: LoginFormState, formData: FormData): Promise<LoginFormState> {
  const validated = LoginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  })

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors }
  }

  const { email, password } = validated.data
  const user = await prisma.user.findUnique({ where: { email } })

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return { message: 'Invalid email or password.' }
  }

  await createSession(user.id, user.role)
  const roleMap: Record<string, string> = { ADMIN: '/admin', FACULTY: '/faculty', ORGANIZER: '/sanad', SUBADMIN: '/sanad' }
  const dest = roleMap[user.role] ?? '/student'
  redirect(dest)
}

export async function logout() {
  await deleteSession()
  redirect('/login')
}
