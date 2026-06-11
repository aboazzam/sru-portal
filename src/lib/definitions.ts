import { z } from 'zod'

export const LoginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email.' }).trim(),
  password: z.string().min(1, { message: 'Password is required.' }),
})

export type LoginFormState =
  | {
      errors?: {
        email?: string[]
        password?: string[]
      }
      message?: string
    }
  | undefined

export type SessionPayload = {
  userId: string
  role: 'STUDENT' | 'FACULTY' | 'ADMIN' | 'ORGANIZER' | 'SUBADMIN'
  expiresAt: Date
}
