import type { NextRequest } from 'next/server'
import { verifyToken, type JwtPayload } from './jwt'

type Role = JwtPayload['role']
type AuthedHandler = (req: NextRequest, user: JwtPayload) => Promise<Response>

export function withAuth(handler: AuthedHandler, roles?: Role[]) {
  return async (req: NextRequest): Promise<Response> => {
    const authHeader = req.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const payload = verifyToken(authHeader.slice(7))
    if (!payload) {
      return Response.json({ error: 'Invalid or expired token' }, { status: 401 })
    }

    if (roles && !roles.includes(payload.role)) {
      return Response.json({ error: 'Forbidden' }, { status: 403 })
    }

    return handler(req, payload)
  }
}
