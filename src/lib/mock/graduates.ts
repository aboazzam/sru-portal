export type RequirementStatus = "completed" | "in_progress" | "pending" | "waived";
export type DocumentType = "transcript" | "certificate" | "clearance" | "honor" | "recommendation";

export const graduationRequirements = [
  // Academic
  {
    id: 1, category: "أكاديمي",
    title: "إتمام 132 ساعة معتمدة",
    detail: "اجتيزت 124 من 132 ساعة",
    status: "in_progress" as RequirementStatus,
    progress: 94,
  },
  {
    id: 2, category: "أكاديمي",
    title: "المعدل التراكمي ≥ 2.00",
    detail: "المعدل الحالي: 3.42",
    status: "completed" as RequirementStatus,
    progress: 100,
  },
  {
    id: 3, category: "أكاديمي",
    title: "اجتياز مقرر التخرج",
    detail: "CS499 — بحث التخرج",
    status: "in_progress" as RequirementStatus,
    progress: 70,
  },
  // Financial
  {
    id: 4, category: "مالي",
    title: "سداد جميع الرسوم الدراسية",
    detail: "لا توجد مستحقات معلّقة",
    status: "completed" as RequirementStatus,
    progress: 100,
  },
  {
    id: 5, category: "مالي",
    title: "إعادة المواد المستعارة من المكتبة",
    detail: "3 كتب قيد الاستعارة",
    status: "pending" as RequirementStatus,
    progress: 0,
  },
  // Administrative
  {
    id: 6, category: "إداري",
    title: "إخلاء الطرف",
    detail: "5 من 8 أقسام وقّعت",
    status: "in_progress" as RequirementStatus,
    progress: 62,
  },
  {
    id: 7, category: "إداري",
    title: "تسوية حساب السكن",
    detail: "لا يسري — خارج الحرم",
    status: "waived" as RequirementStatus,
    progress: 100,
  },
  {
    id: 8, category: "إداري",
    title: "تسليم الصور الرسمية",
    detail: "4 صور شخصية بالزي الأكاديمي",
    status: "pending" as RequirementStatus,
    progress: 0,
  },
  // Training
  {
    id: 9, category: "تدريب",
    title: "إتمام التدريب التعاوني",
    detail: "16 أسبوعاً مع شركة الاتصالات السعودية",
    status: "completed" as RequirementStatus,
    progress: 100,
  },
  {
    id: 10, category: "تدريب",
    title: "رفع تقرير التدريب النهائي",
    detail: "تم الرفع والاعتماد",
    status: "completed" as RequirementStatus,
    progress: 100,
  },
];

export const ceremonyDetails = {
  date: "2026-09-15",
  time: "10:00 ص",
  venue: "قاعة الملك سلمان للمؤتمرات",
  city: "الباحة",
  dresscode: "الزي الأكاديمي الرسمي (روب + قبعة)",
  guestsAllowed: 4,
  registrationDeadline: "2026-08-25",
  registrationOpen: true,
  registered: false,
  rehearsalDate: "2026-09-14",
  rehearsalTime: "04:00 م",
};

export const graduationTimeline = [
  { date: "2026-07-01", label: "بداية فترة تقديم طلبات التخرج",    done: true  },
  { date: "2026-07-31", label: "آخر موعد لإتمام متطلبات إخلاء الطرف", done: false },
  { date: "2026-08-15", label: "الإعلان عن قوائم المتخرجين المؤهلين", done: false },
  { date: "2026-08-25", label: "آخر موعد للتسجيل في حفل التخرج",    done: false },
  { date: "2026-09-01", label: "توزيع الزي الأكاديمي",               done: false },
  { date: "2026-09-14", label: "البروفا العامة",                      done: false },
  { date: "2026-09-15", label: "حفل التخرج 🎓",                      done: false },
];

export const graduationDocuments: {
  id: string;
  type: DocumentType;
  title: string;
  desc: string;
  icon: string;
  fee: string;
  deliveryDays: number;
  available: boolean;
}[] = [
  {
    id: "DOC-01", type: "transcript",
    title: "كشف الدرجات الرسمي",
    desc: "كشف درجات مختوم بختم الجامعة باللغتين العربية والإنجليزية",
    icon: "📊", fee: "مجاناً", deliveryDays: 3, available: true,
  },
  {
    id: "DOC-02", type: "certificate",
    title: "شهادة التخرج",
    desc: "الشهادة الرسمية — تُسلَّم في حفل التخرج أو عبر البريد المسجّل",
    icon: "🎓", fee: "مجاناً", deliveryDays: 0, available: true,
  },
  {
    id: "DOC-03", type: "clearance",
    title: "وثيقة إخلاء الطرف",
    desc: "تُصدر بعد إتمام جميع خطوات إخلاء الطرف",
    icon: "✅", fee: "مجاناً", deliveryDays: 5, available: false,
  },
  {
    id: "DOC-04", type: "honor",
    title: "شهادة التميز الأكاديمي",
    desc: "للطلاب الحاصلين على مرتبة الشرف — المعدل 3.75 فأكثر",
    icon: "🏅", fee: "مجاناً", deliveryDays: 7, available: false,
  },
  {
    id: "DOC-05", type: "recommendation",
    title: "خطاب توصية أكاديمي",
    desc: "يُصدر من عميد الكلية أو المشرف الأكاديمي بناءً على الطلب",
    icon: "📝", fee: "مجاناً", deliveryDays: 10, available: true,
  },
];

export const clearanceSteps = [
  { dept: "المكتبة الجامعية",         signed: true  },
  { dept: "الشؤون المالية",           signed: true  },
  { dept: "إدارة السكن",              signed: true  },
  { dept: "عمادة شؤون الطلاب",        signed: true  },
  { dept: "قسم تقنية المعلومات",      signed: true  },
  { dept: "كلية الحاسب والمعلومات",  signed: false },
  { dept: "القبول والتسجيل",          signed: false },
  { dept: "الإدارة العامة",           signed: false },
];
