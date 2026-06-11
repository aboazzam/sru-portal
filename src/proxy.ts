import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
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

// Pages accessible only to specific roles (cross-role exclusion)
const protectedByRole: Record<string, string[]> = {
  '/student': ['STUDENT'],
  '/faculty': ['FACULTY'],
  '/admin': ['ADMIN'],
}

export default async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl
  const token = req.cookies.get('session')?.value
  const session = await decrypt(token)

  const isPublic = publicRoutes.includes(pathname)
  const isAuth = authRoutes.includes(pathname)

  if (!session && !isPublic) {
    return NextResponse.redirect(new URL('/login', req.nextUrl))
  }

  // Redirect authenticated users from /login or /dashboard to their role page
  if (session && (isAuth || pathname === '/dashboard')) {
    const dest = roleDashboard[session.role] ?? '/student'
    return NextResponse.redirect(new URL(dest, req.nextUrl))
  }

  // Role-exclusivity: prevent accessing another role's exclusive page
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
