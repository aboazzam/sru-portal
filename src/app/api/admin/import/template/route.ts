import { NextRequest, NextResponse } from "next/server";
import * as XLSX from "xlsx";

export const dynamic = "force-dynamic";

const TEMPLATES: Record<string, { headers: string[]; sample: Record<string, unknown>[] }> = {
  Users: {
    headers: ["name", "email", "password", "role", "gender"],
    sample: [
      { name: "أحمد محمد العلي",  email: "ahmed@sru.edu.sa", password: "Pass@2026", role: "STUDENT", gender: "MALE"   },
      { name: "سارة خالد الأحمد", email: "sara@sru.edu.sa",  password: "Pass@2026", role: "FACULTY", gender: "FEMALE" },
      { name: "خالد عبدالله",     email: "khalid@sru.edu.sa", password: "Pass@2026", role: "STUDENT", gender: "MALE"   },
    ],
  },
  Scholarships: {
    headers: ["title", "description", "amount", "deadline"],
    sample: [
      { title: "منحة التفوق الأكاديمي",  description: "للطلاب ذوي المعدل 3.75+",           amount: 5000, deadline: "2026-12-31" },
      { title: "منحة الاحتياج المادي",   description: "للطلاب الموثقين مادياً",             amount: 3000, deadline: "2026-09-30" },
      { title: "منحة النشاط الطلابي",    description: "للطلاب المتميزين في الأنشطة",        amount: 2000, deadline: "2026-10-15" },
    ],
  },
  Training: {
    headers: ["title", "description", "instructor", "category", "capacity", "startDate", "endDate", "status"],
    sample: [
      { title: "تدريب البرمجة المتقدمة",     description: "Python و AI وتطوير الويب",    instructor: "د. خالد العمري",   category: "تقنية",  capacity: 30, startDate: "2026-08-01", endDate: "2026-09-30", status: "UPCOMING" },
      { title: "تدريب إدارة المشاريع",        description: "PMP و Agile",                  instructor: "م. سامي الرشيدي", category: "إدارة",  capacity: 25, startDate: "2026-09-01", endDate: "2026-10-31", status: "UPCOMING" },
    ],
  },
  StudentActivity: {
    headers: ["title", "description", "date"],
    sample: [
      { title: "ملتقى الطلاب الجامعي",  description: "تعارف وتبادل خبرات بين الطلاب",   date: "2026-09-15" },
      { title: "مسابقة البرمجة",         description: "هاكاثون لمدة 24 ساعة",             date: "2026-10-01" },
      { title: "يوم الكلية المفتوح",     description: "عرض تخصصات الكلية للطلاب الجدد",  date: "2026-08-20" },
    ],
  },
  VolunteerOpportunity: {
    headers: ["title", "description", "date"],
    sample: [
      { title: "تشجير الحرم الجامعي",   description: "حملة زراعة 500 شجرة",             date: "2026-08-20" },
      { title: "زيارة دار الأيتام",      description: "يوم ترفيهي للأطفال",               date: "2026-09-05" },
      { title: "حملة التبرع بالدم",      description: "حملة سنوية مع وزارة الصحة",       date: "2026-10-10" },
    ],
  },
  StudentService: {
    headers: ["title", "description"],
    sample: [
      { title: "طلب بدل سكن",              description: "للطلاب القادمين من خارج المدينة" },
      { title: "طلب تأجيل الاختبارات",     description: "لأسباب طبية أو طارئة موثقة"       },
      { title: "طلب إفادة قيد",            description: "إفادة رسمية بالقيد الجامعي"         },
    ],
  },
  FinancialSolution: {
    headers: ["title", "description"],
    sample: [
      { title: "تقسيط الرسوم الدراسية",   description: "4 دفعات متساوية على الفصل"          },
      { title: "الإعفاء الجزئي من الرسوم", description: "لمن تثبت حاجتهم المادية بوثائق"    },
      { title: "قرض الطالب",               description: "قرض بدون فوائد يُسدَّد بعد التخرج" },
    ],
  },
  PartnerCompany: {
    headers: ["name", "description", "logoUrl", "website"],
    sample: [
      { name: "شركة أرامكو السعودية", description: "شريك تدريبي استراتيجي في قطاع النفط",    logoUrl: "", website: "https://aramco.com"   },
      { name: "شركة STC",             description: "مزود تدريب في تقنية المعلومات والاتصالات", logoUrl: "", website: "https://stc.com.sa"  },
      { name: "شركة مايكروسوفت",      description: "شريك في التدريب على تقنيات السحابة",       logoUrl: "", website: "https://microsoft.com" },
    ],
  },
};

const NOTES: Record<string, string[]> = {
  Users:                ["role: STUDENT | FACULTY | ADMIN | ORGANIZER | SUBADMIN", "gender: MALE | FEMALE (اختياري)"],
  Scholarships:         ["amount: رقم (اختياري)", "deadline: YYYY-MM-DD (اختياري)"],
  Training:             ["status: UPCOMING | ONGOING | COMPLETED | CANCELLED (الافتراضي: UPCOMING)", "startDate/endDate: YYYY-MM-DD (اختيارية)", "capacity: رقم صحيح (اختياري)"],
  StudentActivity:      ["date: YYYY-MM-DD (اختياري)"],
  VolunteerOpportunity: ["date: YYYY-MM-DD (اختياري)"],
  StudentService:       ["جميع الحقول عدا title اختيارية"],
  FinancialSolution:    ["جميع الحقول عدا title اختيارية"],
  PartnerCompany:       ["logoUrl: رابط الصورة (اختياري)", "website: رابط الموقع (اختياري)"],
};

export async function GET(request: NextRequest) {
  const sheet = new URL(request.url).searchParams.get("sheet");

  if (!sheet || !TEMPLATES[sheet]) {
    return NextResponse.json({ error: "نوع البيانات غير صحيح" }, { status: 400 });
  }

  const tmpl = TEMPLATES[sheet];
  const wb   = XLSX.utils.book_new();

  // Main data sheet
  const ws = XLSX.utils.json_to_sheet(tmpl.sample, { header: tmpl.headers });

  // Style header row width (basic column width hints)
  const colWidths = tmpl.headers.map((h) => ({ wch: Math.max(h.length + 4, 20) }));
  ws["!cols"] = colWidths;

  XLSX.utils.book_append_sheet(wb, ws, sheet);

  // Notes sheet
  const notesData = [
    ["الحقول المطلوبة (*)"],
    ...TEMPLATES[sheet].headers.map((h) => [`${h}`]),
    [""],
    ["ملاحظات"],
    ...(NOTES[sheet] ?? []).map((n) => [n]),
  ];
  const wsNotes = XLSX.utils.aoa_to_sheet(notesData);
  wsNotes["!cols"] = [{ wch: 60 }];
  XLSX.utils.book_append_sheet(wb, wsNotes, "ملاحظات");

  const buffer = XLSX.write(wb, { type: "buffer", bookType: "xlsx" }) as Uint8Array;

  return new NextResponse(buffer, {
    headers: {
      "Content-Type":        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="${sheet}-template.xlsx"`,
    },
  });
}
