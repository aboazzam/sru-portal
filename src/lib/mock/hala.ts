export type NotifType = "urgent" | "warning" | "info" | "success";
export type ReqStatus = "pending" | "in_progress" | "completed";

/* ─── Personas ────────────────────────────────────────── */
export const mockStudent = {
  name:   "علي القحطاني",
  id:     "S-44210",
  major:  "علوم الحاسب",
  year:   3,
  gpa:    3.7,
  role:   "student" as const,
};

export const mockFaculty = {
  name:         "د. سارة العمري",
  title:        "أستاذ مشارك",
  department:   "كلية الحاسب والمعلومات",
  employeeId:   "F-1045",
  coursesCount: 3,
  role:         "faculty" as const,
};

/* ─── Today Schedules ─────────────────────────────────── */
export const studentScheduleToday = [
  { code: "CS401", name: "الذكاء الاصطناعي",  time: "08:00–09:30", room: "A-204",  instructor: "د. محمد الحربي",   status: "ended"    as const },
  { code: "CS410", name: "أمن المعلومات",     time: "10:00–11:30", room: "B-101",  instructor: "د. سارة العمري",   status: "current"  as const },
  { code: "IS401", name: "إدارة المشاريع",    time: "13:00–14:30", room: "C-305",  instructor: "د. خالد الدوسري",  status: "upcoming" as const },
];

export const facultyScheduleToday = [
  { code: "CS401", name: "الذكاء الاصطناعي", time: "08:00–09:30", room: "A-204",  students: 35, attendance: 91, status: "ended"    as const },
  { code: "CS301", name: "قواعد البيانات",   time: "11:00–12:30", room: "Lab-2",  students: 42, attendance: 85, status: "current"  as const },
  { code: "CS410", name: "أمن المعلومات",    time: "14:00–15:30", room: "B-101",  students: 50, attendance: 88, status: "upcoming" as const },
];

/* ─── Notifications ──────────────────────────────────── */
export const notifications: {
  id: number; type: NotifType; title: string; date: string; daysLeft: number | null;
}[] = [
  { id: 1, type: "urgent",  title: "آخر موعد سداد الرسوم الدراسية",          date: "2026-06-11", daysLeft: 3  },
  { id: 2, type: "warning", title: "بداية التسجيل للفصل القادم",              date: "2026-06-15", daysLeft: 7  },
  { id: 3, type: "info",    title: "نتائج الاختبار المنتصفي متاحة الآن",     date: "2026-06-08", daysLeft: null },
  { id: 4, type: "success", title: "فعالية نادي الحاسب – غداً 4م",           date: "2026-06-09", daysLeft: 1  },
  { id: 5, type: "warning", title: "موعد تسليم التقارير البحثية الأسبوع القادم", date: "2026-06-16", daysLeft: 8 },
  { id: 6, type: "info",    title: "تحديث الجدول الدراسي – راجع التغييرات",  date: "2026-06-07", daysLeft: null },
];

export const facultyNotifications: { id: number; type: NotifType; title: string; date: string; daysLeft: number | null }[] = [
  { id: 1, type: "urgent",  title: "آخر موعد رفع درجات الاختبار المنتصفي",   date: "2026-06-12", daysLeft: 4  },
  { id: 2, type: "warning", title: "اجتماع مجلس الكلية – الأربعاء 10ص",      date: "2026-06-11", daysLeft: 3  },
  { id: 3, type: "info",    title: "تحديث نظام التسجيل الأكاديمي",            date: "2026-06-08", daysLeft: null },
  { id: 4, type: "success", title: "اعتماد مقرر CS501 للفصل القادم",          date: "2026-06-07", daysLeft: null },
];

/* ─── Announcements ──────────────────────────────────── */
export const announcements = [
  {
    id: 1, title: "بداية التسجيل للفصل الصيفي 1447",
    body: "يُعلم الطلاب بأن التسجيل في مقررات الفصل الصيفي سيبدأ يوم الأحد الموافق 15 يونيو 2026. يُرجى مراجعة الشروط والمتطلبات.",
    date: "2026-06-08", category: "أكاديمي", categoryColor: "#6CAEBD",
  },
  {
    id: 2, title: "إعلان نتائج منح التفوق الدراسي",
    body: "أُعلنت نتائج منح التفوق الدراسي للفصل الثاني 1446. بإمكان المقبولين مراجعة بوابة المنح للاطلاع على التفاصيل.",
    date: "2026-06-07", category: "إداري", categoryColor: "#875E9E",
  },
  {
    id: 3, title: "معرض الابتكار الطلابي الثامن",
    body: "تدعو عمادة شؤون الطلاب جميع الطلاب للمشاركة في معرض الابتكار الثامن. التسجيل متاح حتى 20 يونيو.",
    date: "2026-06-05", category: "فعاليات", categoryColor: "#8FA4AB",
  },
  {
    id: 4, title: "تحديث لوائح السكن الجامعي 1447",
    body: "صدرت اللوائح المحدّثة لسكن الطلاب للعام الدراسي القادم. يُرجى الاطلاع عليها قبل التقديم على السكن.",
    date: "2026-06-03", category: "إداري", categoryColor: "#875E9E",
  },
  {
    id: 5, title: "إطلاق برنامج الإرشاد الأكاديمي المحسّن",
    body: "يسعد عمادة شؤون الطلاب إطلاق نظام الإرشاد الأكاديمي الجديد الذي يتيح حجز مواعيد مع المرشدين إلكترونياً.",
    date: "2026-06-01", category: "أكاديمي", categoryColor: "#6CAEBD",
  },
  {
    id: 6, title: "دوري كرة القدم بين الكليات – الدور الأول",
    body: "تنطلق منافسات الدوري السنوي بين الكليات في 22 يونيو. سجّل فريقك قبل 17 يونيو.",
    date: "2026-05-28", category: "فعاليات", categoryColor: "#8FA4AB",
  },
];

/* ─── Faculty Pending Requests ───────────────────────── */
export const facultyPendingRequests: {
  id: string; student: string; type: string; date: string; status: ReqStatus;
}[] = [
  { id: "REQ-101", student: "محمد العتيبي",  type: "وثيقة رسمية",    date: "2026-06-07", status: "pending"     },
  { id: "REQ-102", student: "نورة السبيعي",  type: "مراجعة درجة",    date: "2026-06-06", status: "pending"     },
  { id: "REQ-103", student: "فهد الدوسري",   type: "إذن غياب",       date: "2026-06-05", status: "in_progress" },
  { id: "REQ-104", student: "ريم الحارثي",   type: "إرشاد أكاديمي",  date: "2026-06-04", status: "completed"   },
];

/* ─── Faculty Stats ───────────────────────────────────── */
export const facultyStats = [
  { label: "إجمالي الطلاب",   value: 127, icon: "👥", color: "#6CAEBD" },
  { label: "المقررات",         value: 3,   icon: "📚", color: "#875E9E" },
  { label: "طلبات معلقة",     value: 3,   icon: "⏳", color: "#DC2626" },
  { label: "متوسط الحضور",    value: "87%", icon: "📊", color: "#8FA4AB" },
];

/* ─── Guide Data ─────────────────────────────────────── */
export const guideBuildings = [
  { name: "مبنى الإدارة المركزي",    code: "A",   desc: "عمادة شؤون الطلاب، القبول والتسجيل، الشؤون المالية",   icon: "🏛️" },
  { name: "كلية الحاسب والمعلومات", code: "B",   desc: "قسم علوم الحاسب، نظم المعلومات، الأمن السيبراني",        icon: "💻" },
  { name: "المختبرات العلمية",        code: "Lab", desc: "مختبرات البرمجة والشبكات وقواعد البيانات",               icon: "🔬" },
  { name: "المكتبة الجامعية",         code: "L",   desc: "مصادر مفتوحة 24/7 للطلاب المسجّلين",                   icon: "📚" },
  { name: "المسجد الجامعي",           code: "M",   desc: "يتسع لـ 1000 مصلٍّ، مفتوح طوال اليوم",                  icon: "🕌" },
  { name: "مركز التدريب والتطوير",   code: "T",   desc: "قاعات الاجتماعات، ورش العمل، التدريب المهني",            icon: "🎯" },
];

export const guideFacilities = [
  { name: "العيادة الجامعية",     desc: "أحد–خميس 8:00–16:00 | مبنى الخدمات الطلابية",     icon: "🏥", color: "#6CAEBD" },
  { name: "الكافيتريا والمطاعم", desc: "3 مطاعم وكافيتريا رئيسية | أوقات متنوعة",            icon: "🍽️", color: "#875E9E" },
  { name: "الملاعب الرياضية",    desc: "ملعب كرة قدم ● صالة ألعاب ● مسار المشي",            icon: "⚽", color: "#8FA4AB" },
  { name: "مواقف السيارات",      desc: "P1 للطلاب ● P2 لأعضاء هيئة التدريس",                icon: "🚗", color: "#6B838C" },
  { name: "مكتب البريد",         desc: "أحد–خميس 9:00–14:00 | مبنى الخدمات",               icon: "📬", color: "#6CAEBD" },
  { name: "نقطة الإنترنت واي فاي", desc: "تغطية كاملة للحرم ● استخدام البريد الجامعي",      icon: "📶", color: "#875E9E" },
];

export const guideContacts = [
  { dept: "عمادة شؤون الطلاب",      ext: "2100", email: "students@sru.edu.sa",  icon: "🎓" },
  { dept: "القبول والتسجيل",         ext: "2200", email: "registrar@sru.edu.sa", icon: "📋" },
  { dept: "الشؤون المالية",          ext: "2300", email: "finance@sru.edu.sa",   icon: "💰" },
  { dept: "تقنية المعلومات (IT)",   ext: "2400", email: "itsupport@sru.edu.sa", icon: "💻" },
  { dept: "إدارة السكن",             ext: "2500", email: "housing@sru.edu.sa",   icon: "🏠" },
  { dept: "خدمات النقل",            ext: "2600", email: "transport@sru.edu.sa", icon: "🚌" },
];
