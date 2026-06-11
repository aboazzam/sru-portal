import 'dotenv/config'
import path from 'path'
import bcrypt from 'bcryptjs'
import { PrismaClient } from '../src/generated/prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'

const dbPath = path.resolve(process.cwd(), 'dev.db')
const adapter = new PrismaLibSql({ url: `file:${dbPath}` })
const prisma = new PrismaClient({ adapter } as any)

async function main() {
  const hash = (pwd: string) => bcrypt.hash(pwd, 10)

  await prisma.user.upsert({
    where: { email: 'student@sru.edu.sa' },
    update: {},
    create: { name: 'Ali Al-Qahtani', email: 'student@sru.edu.sa', password: await hash('password123'), role: 'STUDENT' },
  })

  await prisma.user.upsert({
    where: { email: 'faculty@sru.edu.sa' },
    update: {},
    create: { name: 'Dr. Sara Al-Otaibi', email: 'faculty@sru.edu.sa', password: await hash('password123'), role: 'FACULTY' },
  })

  await prisma.user.upsert({
    where: { email: 'admin@sru.edu.sa' },
    update: {},
    create: { name: 'Admin User', email: 'admin@sru.edu.sa', password: await hash('password123'), role: 'ADMIN' },
  })

  await prisma.user.upsert({
    where: { email: 'organizer@sru.edu.sa' },
    update: {},
    create: { name: 'Khalid Al-Rashidi', email: 'organizer@sru.edu.sa', password: await hash('organizer123'), role: 'ORGANIZER' },
  })

  await prisma.user.upsert({
    where: { email: 'subadmin@sru.edu.sa' },
    update: {},
    create: { name: 'Nora Al-Ghamdi', email: 'subadmin@sru.edu.sa', password: await hash('subadmin123'), role: 'SUBADMIN' },
  })

  console.log('Seed complete.')
}

main().catch(console.error).finally(() => prisma.$disconnect())
