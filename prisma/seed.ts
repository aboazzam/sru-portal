import 'dotenv/config'
import path from 'path'
import bcrypt from 'bcryptjs'
import { PrismaClient } from '../src/generated/prisma'
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

  // Seed scholarships (only if none exist)
  const scholarshipCount = await prisma.scholarship.count();
  if (scholarshipCount === 0) {
    await prisma.scholarship.createMany({
      data: [
        // Full scholarships (100% coverage)
        { title: "منحة النخبة للمستجدين",            description: "منحة كاملة 100% للطلاب المستجدين المتميزين — نسبة ثانوية 95%+ للطب، 90%+ لباقي الكليات." },
        { title: "منحة النخبة للمنتظمين",            description: "منحة كاملة 100% للطلاب المنتظمين المتميزين أكاديمياً." },
        { title: "منحة الريادة الدولية",             description: "منحة كاملة 100% للطلاب الدوليين القادمين من خارج المملكة العربية السعودية." },
        { title: "منحة أبناء شهداء الواجب",          description: "منحة كاملة 100% تكريماً لأبناء شهداء الوطن." },
        { title: "منحة أبناء منسوبي الجامعة",         description: "منحة كاملة 100% لأبناء أعضاء هيئة التدريس والموظفين بدوام كامل." },
        { title: "منحة التمكين للمستجدين",            description: "منحة كاملة 100% للطلاب المستجدين من ذوي الدخل المحدود." },
        { title: "المنحة المشتركة مع مؤسسة أبو غزالة", description: "منحة كاملة 100% بالشراكة مع مؤسسة أبو غزالة للتنمية الاجتماعية." },
        { title: "المنحة المشتركة مع جمعية تعلّم",    description: "منحة كاملة 100% بالشراكة مع جمعية دعم التعليم تعلّم." },
        // Partial scholarships
        { title: "منحة التميز (40%)",                description: "منحة جزئية 40% من الرسوم الدراسية لجميع الكليات (30% لكلية الطب). شرط: معدل 4.25/5." },
        { title: "منحة التحويل وحملة الدبلوم (20%)",  description: "منحة جزئية 20% للطلاب المحولين من جامعات أخرى وحاملي الدبلوم." },
        { title: "منحة الطموح (30%)",                description: "منحة جزئية 30% لجميع الكليات (20% لكلية الطب). شرط: نسبة 90% للطب." },
        { title: "منحة التعليم الدولي (30%)",         description: "منحة جزئية 30% للطلاب الدوليين، بشرط تحقيق نسبة قبول 70%." },
        { title: "منحة وقف الشيخ سليمان الراجحي (40%)", description: "منحة جزئية 40% لمنسوبي وقف الشيخ سليمان الراجحي وأبنائهم. شرط: معدل 3/5." },
        { title: "منحة الماجستير (30%)",              description: "منحة جزئية 30% لطلاب الماجستير المتميزين في برامج علم النفس والاقتصاد وإدارة الأعمال." },
        { title: "منحة السداد المبكر (10%)",          description: "منحة جزئية 10% لمن لا يحقق شروط المنح الأكاديمية. لا يمكن الجمع مع أي منحة أخرى." },
      ],
    });
    console.log('Scholarships seeded.');
  }

  console.log('Seed complete.')
}

main().catch(console.error).finally(() => prisma.$disconnect())
