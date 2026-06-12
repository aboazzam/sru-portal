'use server'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import bcrypt from 'bcryptjs'
import { LoginSchema, type LoginFormState } from '@/lib/definitions'
import { createSession, deleteSession } from '@/lib/session'
import { signToken } from '@/lib/jwt'
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

  // Also set the JWT auth-token so client components can call authenticated APIs
  const jwtToken = signToken({ sub: user.id, role: user.role })
  const cookieStore = await cookies()
  cookieStore.set('auth-token', jwtToken, {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 7 * 24 * 60 * 60,
    sameSite: 'lax',
    path: '/',
  })

  const roleMap: Record<string, string> = {
    ADMIN: '/admin',
    FACULTY: '/faculty',
    ORGANIZER: '/sanad',
    SUBADMIN: '/sanad',
  }
  redirect(roleMap[user.role] ?? '/student')
}

export async function logout() {
  await deleteSession()
  const cookieStore = await cookies()
  cookieStore.delete('auth-token')
  redirect('/login')
}
