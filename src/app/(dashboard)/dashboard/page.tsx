import { redirect } from 'next/navigation'
import { verifySession } from '@/lib/dal'

export default async function DashboardPage() {
  const session = await verifySession()

  if (session.role === 'ADMIN') redirect('/admin')
  if (session.role === 'FACULTY') redirect('/faculty')
  redirect('/student')
}
