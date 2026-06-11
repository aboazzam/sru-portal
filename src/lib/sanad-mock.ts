export type RequestStatus = "pending" | "in_progress" | "completed" | "rejected";

export const documentTypes = [
  "شهادة قيد",
  "شهادة إتمام الدراسة",
  "كشف درجات",
  "وثيقة نقل",
  "خطاب تعريفي للبنك",
  "وثيقة إجازة دراسية",
];

export const schedule: { day: string; slot: string; course: string; room: string; color: string }[] = [
  { day: "الأحد",    slot: "08:00–10:00", course: "CS401 – هندسة البرمجيات",         room: "A-204", color: "#3D1F6E" },
  { day: "الأحد",    slot: "10:00–12:00", course: "MATH301 – التفاضل والتكامل",      room: "B-110", color: "#00B4C8" },
  { day: "الاثنين",  slot: "08:00–10:00", course: "CS420 – قواعد البيانات",           room: "C-301", color: "#6B46C1" },
  { day: "الاثنين",  slot: "13:00–15:00", course: "IS310 – نظم المعلومات",           room: "A-204", color: "#0097AA" },
  { day: "الثلاثاء", slot: "10:00–12:00", course: "CS401 – هندسة البرمجيات (عملي)", room: "Lab-2", color: "#3D1F6E" },
  { day: "الأربعاء", slot: "08:00–10:00", course: "MATH301 – التفاضل والتكامل",      room: "B-110", color: "#00B4C8" },
  { day: "الأربعاء", slot: "13:00–15:00", course: "CS420 – قواعد البيانات (عملي)",  room: "Lab-1", color: "#6B46C1" },
  { day: "الخميس",   slot: "10:00–12:00", course: "IS310 – نظم المعلومات (عملي)",   room: "Lab-3", color: "#0097AA" },
];

export const availableCourses = [
  { id: "CS501", name: "الذكاء الاصطناعي", instructor: "د. محمد الشمري", time: "الأحد – 10:00", seats: 15, total: 40 },
  { id: "CS510", name: "أمن المعلومات",    instructor: "د. سارة العتيبي", time: "الاثنين – 08:00", seats: 8, total: 30 },
  { id: "IS401", name: "إدارة المشاريع",  instructor: "د. خالد الدوسري", time: "الثلاثاء – 13:00", seats: 22, total: 35 },
  { id: "MATH401","name": "إحصاء تطبيقي", instructor: "د. نورة الغامدي", time: "الأربعاء – 10:00", seats: 0, total: 25 },
  { id: "CS520", name: "شبكات الحاسب",    instructor: "د. عبدالله القحطاني", time: "الخميس – 08:00", seats: 5, total: 30 },
];

export const clearanceSteps = [
  { id: 1, label: "التحقق من المستحقات المالية", desc: "التأكد من سداد جميع الرسوم الدراسية المستحقة", icon: "💳" },
  { id: 2, label: "تسليم المواد المكتبية",        desc: "إعادة جميع الكتب والمواد المستعارة من المكتبة",  icon: "📚" },
  { id: 3, label: "تسليم مستلزمات السكن",         desc: "إعادة مفاتيح الغرفة والمستلزمات المستعارة",    icon: "🏠" },
  { id: 4, label: "التأكيد النهائي",              desc: "مراجعة الطلب وإصدار وثيقة إخلاء الطرف",        icon: "✅" },
];

export const events = [
  { id: 1, title: "ورشة تطوير تطبيقات الجوال",    date: "2026-06-08", time: "10:00 – 12:00", location: "قاعة A-101", category: "أكاديمي",   color: "#3D1F6E",  seats: 30, registered: 18 },
  { id: 2, title: "مسابقة الكود البرمجي",          date: "2026-06-11", time: "09:00 – 15:00", location: "مختبر الحاسب", category: "أكاديمي", color: "#3D1F6E",  seats: 50, registered: 42 },
  { id: 3, title: "يوم الثقافة الجامعية",          date: "2026-06-14", time: "17:00 – 21:00", location: "المدرج الكبير", category: "ثقافي",  color: "#00B4C8",  seats: 200, registered: 155 },
  { id: 4, title: "دوري كرة القدم الجامعي",        date: "2026-06-17", time: "16:00 – 20:00", location: "الملعب الرياضي", category: "رياضي", color: "#0097AA",  seats: 100, registered: 60 },
  { id: 5, title: "ندوة: مستقبل تقنية المعلومات", date: "2026-06-21", time: "11:00 – 13:00", location: "قاعة B-201",  category: "أكاديمي",  color: "#3D1F6E",  seats: 80, registered: 45 },
  { id: 6, title: "معرض الابتكار الطلابي",         date: "2026-06-25", time: "10:00 – 17:00", location: "الردهة الرئيسية", category: "ثقافي", color: "#6B46C1", seats: 500, registered: 210 },
];

export const skillsPrograms = [
  { id: 1, name: "برنامج تطوير مهارات القيادة",    duration: "6 أسابيع", level: "مبتدئ",    enrolled: true  },
  { id: 2, name: "مهارات التواصل الفعّال",          duration: "4 أسابيع", level: "متوسط",    enrolled: false },
  { id: 3, name: "إدارة الوقت والإنتاجية",          duration: "3 أسابيع", level: "مبتدئ",    enrolled: false },
  { id: 4, name: "التفكير النقدي وحل المشكلات",     duration: "5 أسابيع", level: "متقدم",    enrolled: false },
  { id: 5, name: "مهارات العرض والتقديم",           duration: "4 أسابيع", level: "متوسط",    enrolled: true  },
];

export const volunteerOpportunities = [
  { id: 1, title: "تعليم الحاسب للمجتمع",       org: "مركز التطوع",         hours: 8,  category: "تعليمي",  deadline: "2026-06-15", spots: 10 },
  { id: 2, title: "حملة نظافة البيئة المدرسية",  org: "نادي البيئة",         hours: 4,  category: "بيئي",    deadline: "2026-06-12", spots: 25 },
  { id: 3, title: "مساعدة ذوي الاحتياجات الخاصة", org: "جمعية الرعاية",      hours: 12, category: "اجتماعي", deadline: "2026-06-20", spots: 8  },
  { id: 4, title: "تدريب ناشئي كرة القدم",       org: "نادي الجامعة الرياضي", hours: 6, category: "رياضي",   deadline: "2026-06-18", spots: 5  },
  { id: 5, title: "دعم مكتبة الحي",              org: "بلدية المنطقة",        hours: 5, category: "تعليمي",  deadline: "2026-06-25", spots: 15 },
  { id: 6, title: "تنظيم معرض الكتاب",          org: "نادي القراءة",         hours: 10, category: "ثقافي",   deadline: "2026-07-01", spots: 20 },
];

export const volunteerLog = [
  { id: 1, activity: "تعليم الحاسب للمجتمع",      date: "2026-04-20", hours: 8,  status: "مكتمل" },
  { id: 2, activity: "دعم مكتبة الحي",            date: "2026-05-05", hours: 5,  status: "مكتمل" },
  { id: 3, activity: "حملة نظافة البيئة",          date: "2026-05-18", hours: 4,  status: "مكتمل" },
  { id: 4, activity: "تنظيم يوم الثقافة",          date: "2026-06-14", hours: 6,  status: "جاري"  },
];

export const studentRequests: {
  id: string; type: string; date: string; status: RequestStatus; notes: string;
}[] = [
  { id: "REQ-001", type: "شهادة قيد",               date: "2026-06-01", status: "completed",   notes: "جاهزة للاستلام من الإدارة" },
  { id: "REQ-002", type: "التسجيل في CS501",         date: "2026-06-03", status: "in_progress", notes: "بانتظار موافقة المرشد الأكاديمي" },
  { id: "REQ-003", type: "إخلاء طرف",               date: "2026-06-05", status: "pending",     notes: "قيد المراجعة من الإدارة المالية" },
  { id: "REQ-004", type: "التسجيل في فعالية: ورشة تطوير", date: "2026-06-06", status: "completed", notes: "تم التسجيل بنجاح" },
  { id: "REQ-005", type: "شهادة إتمام الدراسة",     date: "2026-05-28", status: "rejected",    notes: "لم تكتمل متطلبات التخرج بعد" },
  { id: "REQ-006", type: "تسجيل تطوع: تعليم الحاسب", date: "2026-05-20", status: "completed", notes: "تم التسجيل والإتمام" },
];

export const organizerEvents = [
  { id: 1, title: "ورشة تطوير تطبيقات الجوال",    date: "2026-06-08", registered: 18, capacity: 30, status: "قادم"    },
  { id: 2, title: "مسابقة الكود البرمجي",          date: "2026-06-11", registered: 42, capacity: 50, status: "قادم"    },
  { id: 3, title: "يوم الثقافة الجامعية",          date: "2026-06-14", registered: 155, capacity: 200, status: "قادم"  },
  { id: 4, title: "ندوة: مستقبل تقنية المعلومات", date: "2026-06-21", registered: 45, capacity: 80, status: "قادم"    },
  { id: 5, title: "ورشة الكتابة الإبداعية",       date: "2026-05-10", registered: 25, capacity: 25, status: "مكتمل"   },
  { id: 6, title: "دوري رياضي سابق",              date: "2026-04-20", registered: 60, capacity: 80, status: "مكتمل"   },
];

export const subadminStats = {
  totalRequests: 148,
  pendingRequests: 23,
  completedThisMonth: 87,
  activeOrganizers: 6,
};

export const organizersList = [
  { id: 1, name: "خالد الرشيدي",  email: "organizer@sru.edu.sa",   eventsManaged: 6, status: "نشط"     },
  { id: 2, name: "مريم السيد",    email: "mariam@sru.edu.sa",      eventsManaged: 4, status: "نشط"     },
  { id: 3, name: "فهد الحارثي",   email: "fahad.h@sru.edu.sa",     eventsManaged: 2, status: "نشط"     },
  { id: 4, name: "رنا المطيري",   email: "rana.m@sru.edu.sa",      eventsManaged: 0, status: "معلق"    },
];

export const requestsByMonth = [
  { month: "يناير", count: 42 },
  { month: "فبراير", count: 58 },
  { month: "مارس",  count: 71 },
  { month: "أبريل", count: 65 },
  { month: "مايو",  count: 83 },
  { month: "يونيو", count: 87 },
];
