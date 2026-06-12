import 'server-only'
import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import type { SessionPayload } from './definitions'

const key = new TextEncoder().encode(process.env.SESSION_SECRET)
const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000

export async function encrypt(payload: SessionPayload) {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(key)
}

export async function decrypt(token: string | undefined = '') {
  try {
    const { payload } = await jwtVerify(token, key, { algorithms: ['HS256'] })
    return payload as unknown as SessionPayload
  } catch {
    return null
  }
}

export async function createSession(userId: string, role: SessionPayload['role']) {
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS)
  const token = await encrypt({ userId, role, expiresAt })
  const cookieStore = await cookies()
  cookieStore.set('session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires: expiresAt,
    sameSite: 'lax',
    path: '/',
  })
}

export async function deleteSession() {
  const cookieStore = await cookies()
  cookieStore.delete('session')
}

export async function getSession() {
  const cookieStore = await cookies()

  // 1. Try existing jose session cookie (server-action login)
  const sessionToken = cookieStore.get('session')?.value
  if (sessionToken) {
    const session = await decrypt(sessionToken)
    if (session) return session
  }

  // 2. Fall back to JWT auth-token cookie (REST API login)
  const authToken = cookieStore.get('auth-token')?.value
  if (authToken) {
    try {
      const key = new TextEncoder().encode(process.env.JWT_SECRET!)
      const { payload } = await jwtVerify(authToken, key, { algorithms: ['HS256'] })
      if (payload.sub && typeof payload.role === 'string') {
        return {
          userId: payload.sub,
          role: payload.role as SessionPayload['role'],
          expiresAt: new Date((payload.exp ?? 0) * 1000),
        }
      }
    } catch {
      // expired or tampered
    }
  }

  return null
}
