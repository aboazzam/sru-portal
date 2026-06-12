import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'
import { decrypt } from '@/lib/session'

const publicRoutes = ['/login', '/']
const authRoutes = ['/login']

const roleDashboard: Record<string, string> = {
  STUDENT: '/student',
  FACULTY: '/faculty',
  ADMIN: '/admin',
  ORGANIZER: '/sanad',
  SUBADMIN: '/sanad',
}

const protectedByRole: Record<string, string[]> = {
  '/student': ['STUDENT'],
  '/faculty': ['FACULTY'],
  '/admin': ['ADMIN'],
}

type SessionLike = { userId: string; role: string }

async function getSession(req: NextRequest): Promise<SessionLike | null> {
  // 1. Try the existing jose session cookie (server-action login)
  const sessionToken = req.cookies.get('session')?.value
  if (sessionToken) {
    const s = await decrypt(sessionToken)
    if (s) return { userId: s.userId, role: s.role }
  }

  // 2. Fall back to the JWT auth-token cookie (REST API login)
  const authToken = req.cookies.get('auth-token')?.value
  if (authToken) {
    try {
      const key = new TextEncoder().encode(process.env.JWT_SECRET!)
      const { payload } = await jwtVerify(authToken, key, { algorithms: ['HS256'] })
      if (payload.sub && typeof payload.role === 'string') {
        return { userId: payload.sub, role: payload.role }
      }
    } catch {
      // expired or tampered token — fall through
    }
  }

  return null
}

export default async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl
  const session = await getSession(req)

  const isPublic = publicRoutes.includes(pathname)
  const isAuth = authRoutes.includes(pathname)

  if (!session && !isPublic) {
    return NextResponse.redirect(new URL('/login', req.nextUrl))
  }

  if (session && (isAuth || pathname === '/dashboard')) {
    const dest = roleDashboard[session.role] ?? '/student'
    return NextResponse.redirect(new URL(dest, req.nextUrl))
  }

  if (session) {
    for (const [protectedPath, allowedRoles] of Object.entries(protectedByRole)) {
      if (pathname.startsWith(protectedPath) && !allowedRoles.includes(session.role)) {
        const dest = roleDashboard[session.role] ?? '/student'
        return NextResponse.redirect(new URL(dest, req.nextUrl))
      }
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
