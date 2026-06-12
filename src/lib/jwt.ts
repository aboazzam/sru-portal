import jwt from 'jsonwebtoken'

const secret = process.env.JWT_SECRET!

export type JwtPayload = {
  sub: string
  role: 'STUDENT' | 'FACULTY' | 'ADMIN' | 'ORGANIZER' | 'SUBADMIN'
}

export function signToken(payload: JwtPayload): string {
  return jwt.sign(payload, secret, { expiresIn: '7d' })
}

export function verifyToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, secret) as JwtPayload
  } catch {
    return null
  }
}
