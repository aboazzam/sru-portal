export type TrainingStatus  = "completed" | "inprogress" | "enrolled" | "cancelled" | "pending";
export type TrainingCategory = "technical" | "soft" | "language" | "leadership" | "professional";
export type CertStatus      = "issued" | "pending" | "expired";
export type ReqStatus       = "approved" | "rejected" | "pending" | "completed";
export type AlertType       = "urgent" | "warning" | "success" | "info";
export type DeliveryMode    = "online" | "onsite" | "hybrid";

// ═══════════════════════════
// ملخص الطالب التدريبي
// ═══════════════════════════
export const trainingSummary = {
  totalEnrolled:    4,
  totalCompleted:  11,
  totalHours:      87,
  certificates:     5,
  currentSemester:  "الفصل الثاني 1446-1447",
  hoursRequired:   120,
  hoursRemaining:   33,
};

// ═══════════════════════════
// التصنيفات
// ═══════════════════════════
export const trainingCategories: { id: TrainingCategory; label: string; icon: string; color: string }[] = [
  { id: "technical",     label: "تقنية",              icon: "💻", color: "#6CAEBD" },
  { id: "soft",          label: "مهارات ناعمة",        icon: "🤝", color: "#875E9E" },
  { id: "language",      label: "لغات",               icon: "🌐", color: "#8FA4AB" },
  { id: "leadership",    label: "قيادة وإدارة",        icon: "🎯", color: "#4A8FA0" },
  { id: "professional",  label: "مهنية وتخصصية",      icon: "📋", color: "#6A4A7E" },
];

// ═══════════════════════════
// كتالوج البرامج التدريبية
// ═══════════════════════════
export type TrainingProgram = {
  id:           number;
  title:        string;
  provider:     string;
  category:     TrainingCategory;
  hours:        number;
  mode:         DeliveryMode;
  lang:         "ar" | "en" | "ar/en";
  seats:        number;
  seatsLeft:    number;
  startDate:    string;
  endDate:      string;
  description:  string;
  skills:       string[];
  prerequisites?: string;
  color:        string;
  featured:     boolean;
};

export const trainingPrograms: TrainingProgram[] = [
  {
    id: 1,
    title:       "مهارات التفكير النقدي وحل المشكلات",
    provider:    "مركز التطوير الجامعي",
    category:    "soft",
    hours:        8,
    mode:         "onsite",
    lang:         "ar",
    seats:        30,
    seatsLeft:    12,
    startDate:    "2026-06-20",
    endDate:      "2026-06-21",
    description:  "برنامج مكثف يُعزّز قدرة الطالب على تحليل المواقف واتخاذ القرارات المبنية على الأدلة.",
    skills:       ["التحليل المنطقي", "صنع القرار", "حل المشكلات الإبداعي"],
    color:        "#875E9E",
    featured:     true,
  },
  {
    id: 2,
    title:       "مقدمة في الذكاء الاصطناعي وتطبيقاته",
    provider:    "مركز التقنية وريادة الأعمال",
    category:    "technical",
    hours:        16,
    mode:         "hybrid",
    lang:         "ar/en",
    seats:        25,
    seatsLeft:     8,
    startDate:    "2026-07-01",
    endDate:      "2026-07-04",
    description:  "يستعرض البرنامج أساسيات الذكاء الاصطناعي والتعلم الآلي مع تطبيقات عملية بلغة Python.",
    skills:       ["Python الأساسية", "Machine Learning", "تحليل البيانات"],
    prerequisites: "إلمام بأساسيات البرمجة",
    color:        "#6CAEBD",
    featured:     true,
  },
  {
    id: 3,
    title:       "التواصل الفعّال والعرض والتقديم",
    provider:    "مركز التطوير الجامعي",
    category:    "soft",
    hours:        6,
    mode:         "onsite",
    lang:         "ar",
    seats:        40,
    seatsLeft:    25,
    startDate:    "2026-06-25",
    endDate:      "2026-06-25",
    description:  "يُدرّب الطلاب على فنون التحدث أمام الجمهور وبناء العروض التقديمية المؤثرة.",
    skills:       ["الإلقاء والإقناع", "PowerPoint المتقدم", "التواصل غير اللفظي"],
    color:        "#875E9E",
    featured:     false,
  },
  {
    id: 4,
    title:       "اللغة الإنجليزية للأعمال — المستوى المتقدم",
    provider:    "قسم اللغات",
    category:    "language",
    hours:        20,
    mode:         "online",
    lang:         "en",
    seats:        50,
    seatsLeft:    31,
    startDate:    "2026-07-05",
    endDate:      "2026-07-24",
    description:  "يُطوّر مهارات الكتابة والتحدث الإنجليزية في البيئات المهنية.",
    skills:       ["كتابة التقارير", "المراسلات الرسمية", "المحادثة المهنية"],
    prerequisites: "اجتياز اختبار تحديد المستوى",
    color:        "#8FA4AB",
    featured:     false,
  },
  {
    id: 5,
    title:       "إدارة المشاريع بأسلوب Agile",
    provider:    "مركز التقنية وريادة الأعمال",
    category:    "professional",
    hours:        12,
    mode:         "hybrid",
    lang:         "ar/en",
    seats:        20,
    seatsLeft:     5,
    startDate:    "2026-07-10",
    endDate:      "2026-07-12",
    description:  "يُغطي منهجيات Scrum وKanban وتطبيقها في إدارة مشاريع التخرج وبيئات العمل.",
    skills:       ["Scrum Framework", "Kanban", "تخطيط المشاريع"],
    color:        "#6A4A7E",
    featured:     true,
  },
  {
    id: 6,
    title:       "ريادة الأعمال من الفكرة إلى الإطلاق",
    provider:    "مركز التقنية وريادة الأعمال",
    category:    "leadership",
    hours:        10,
    mode:         "onsite",
    lang:         "ar",
    seats:        35,
    seatsLeft:    18,
    startDate:    "2026-08-02",
    endDate:      "2026-08-03",
    description:  "رحلة من التحقق من الفكرة إلى بناء نموذج العمل وإعداد خطة الإطلاق.",
    skills:       ["Business Model Canvas", "التحقق من الفكرة", "الإطلاق والتسويق"],
    color:        "#4A8FA0",
    featured:     false,
  },
  {
    id: 7,
    title:       "أمن المعلومات والخصوصية الرقمية",
    provider:    "مركز التقنية وريادة الأعمال",
    category:    "technical",
    hours:        8,
    mode:         "online",
    lang:         "ar",
    seats:        60,
    seatsLeft:    42,
    startDate:    "2026-07-15",
    endDate:      "2026-07-16",
    description:  "يشرح مفاهيم الأمن السيبراني وأفضل ممارسات حماية البيانات الشخصية والمهنية.",
    skills:       ["الأمن السيبراني الأساسي", "حماية الخصوصية", "التعرف على التهديدات"],
    color:        "#6CAEBD",
    featured:     false,
  },
  {
    id: 8,
    title:       "القيادة وبناء الفرق",
    provider:    "مركز التطوير الجامعي",
    category:    "leadership",
    hours:        9,
    mode:         "onsite",
    lang:         "ar",
    seats:        28,
    seatsLeft:    14,
    startDate:    "2026-08-10",
    endDate:      "2026-08-11",
    description:  "يُنمّي مهارات القيادة الشخصية والعمل الجماعي في بيئات متنوعة.",
    skills:       ["القيادة التحويلية", "تكوين الفرق", "إدارة النزاعات"],
    color:        "#4A8FA0",
    featured:     false,
  },
];

// ═══════════════════════════
// دوراتي المسجَّلة والجارية
// ═══════════════════════════
export type EnrolledCourse = {
  id:         string;
  programId:  number;
  title:      string;
  provider:   string;
  category:   TrainingCategory;
  hours:      number;
  mode:       DeliveryMode;
  status:     TrainingStatus;
  progress:   number;
  startDate:  string;
  endDate:    string;
  grade?:     string;
  color:      string;
};

export const enrolledCourses: EnrolledCourse[] = [
  {
    id:         "ENR-2026-014",
    programId:  2,
    title:      "مقدمة في الذكاء الاصطناعي وتطبيقاته",
    provider:   "مركز التقنية وريادة الأعمال",
    category:   "technical",
    hours:       16,
    mode:        "hybrid",
    status:      "inprogress",
    progress:    65,
    startDate:   "2026-07-01",
    endDate:     "2026-07-04",
    color:       "#6CAEBD",
  },
  {
    id:         "ENR-2026-010",
    programId:  5,
    title:      "إدارة المشاريع بأسلوب Agile",
    provider:   "مركز التقنية وريادة الأعمال",
    category:   "professional",
    hours:       12,
    mode:        "hybrid",
    status:      "enrolled",
    progress:     0,
    startDate:   "2026-07-10",
    endDate:     "2026-07-12",
    color:       "#6A4A7E",
  },
  {
    id:         "ENR-2026-007",
    programId:  1,
    title:      "مهارات التفكير النقدي وحل المشكلات",
    provider:   "مركز التطوير الجامعي",
    category:   "soft",
    hours:        8,
    mode:        "onsite",
    status:      "enrolled",
    progress:     0,
    startDate:   "2026-06-20",
    endDate:     "2026-06-21",
    color:       "#875E9E",
  },
  {
    id:         "ENR-2025-041",
    programId:  4,
    title:      "اللغة الإنجليزية للأعمال — المستوى المتقدم",
    provider:   "قسم اللغات",
    category:   "language",
    hours:       20,
    mode:        "online",
    status:      "cancelled",
    progress:    30,
    startDate:   "2025-10-05",
    endDate:     "2025-10-24",
    color:       "#8FA4AB",
  },
];

// ═══════════════════════════
// الدورات المكتملة
// ═══════════════════════════
export const completedCourses: EnrolledCourse[] = [
  {
    id:         "ENR-2025-033",
    programId:  3,
    title:      "التواصل الفعّال والعرض والتقديم",
    provider:   "مركز التطوير الجامعي",
    category:   "soft",
    hours:        6,
    mode:        "onsite",
    status:      "completed",
    progress:   100,
    startDate:   "2025-09-25",
    endDate:     "2025-09-25",
    grade:       "ممتاز",
    color:       "#875E9E",
  },
  {
    id:         "ENR-2025-020",
    programId:  8,
    title:      "القيادة وبناء الفرق",
    provider:   "مركز التطوير الجامعي",
    category:   "leadership",
    hours:        9,
    mode:        "onsite",
    status:      "completed",
    progress:   100,
    startDate:   "2025-08-10",
    endDate:     "2025-08-11",
    grade:       "جيد جداً",
    color:       "#4A8FA0",
  },
  {
    id:         "ENR-2025-009",
    programId:  7,
    title:      "أمن المعلومات والخصوصية الرقمية",
    provider:   "مركز التقنية وريادة الأعمال",
    category:   "technical",
    hours:        8,
    mode:        "online",
    status:      "completed",
    progress:   100,
    startDate:   "2025-07-15",
    endDate:     "2025-07-16",
    grade:       "ممتاز",
    color:       "#6CAEBD",
  },
  {
    id:         "ENR-2025-004",
    programId:  6,
    title:      "ريادة الأعمال من الفكرة إلى الإطلاق",
    provider:   "مركز التقنية وريادة الأعمال",
    category:   "leadership",
    hours:       10,
    mode:        "onsite",
    status:      "completed",
    progress:   100,
    startDate:   "2025-06-02",
    endDate:     "2025-06-03",
    grade:       "جيد",
    color:       "#4A8FA0",
  },
  {
    id:         "ENR-2024-051",
    programId:  1,
    title:      "مهارات التفكير النقدي وحل المشكلات",
    provider:   "مركز التطوير الجامعي",
    category:   "soft",
    hours:        8,
    mode:        "onsite",
    status:      "completed",
    progress:   100,
    startDate:   "2024-12-10",
    endDate:     "2024-12-11",
    grade:       "ممتاز",
    color:       "#875E9E",
  },
  {
    id:         "ENR-2024-038",
    programId:  5,
    title:      "إدارة المشاريع بأسلوب Agile",
    provider:   "مركز التقنية وريادة الأعمال",
    category:   "professional",
    hours:       12,
    mode:        "hybrid",
    status:      "completed",
    progress:   100,
    startDate:   "2024-10-10",
    endDate:     "2024-10-12",
    grade:       "جيد جداً",
    color:       "#6A4A7E",
  },
];

// ═══════════════════════════
// الشهادات
// ═══════════════════════════
export type Certificate = {
  id:         string;
  title:      string;
  issuedBy:   string;
  category:   TrainingCategory;
  issueDate:  string;
  expiryDate: string | null;
  status:     CertStatus;
  hours:      number;
  grade:      string;
  color:      string;
  serialNo:   string;
};

export const certificates: Certificate[] = [
  {
    id:         "CERT-2025-005",
    title:      "التواصل الفعّال والعرض والتقديم",
    issuedBy:   "مركز التطوير الجامعي — جامعة سليمان الراجحي",
    category:   "soft",
    issueDate:  "2025-09-28",
    expiryDate: null,
    status:     "issued",
    hours:        6,
    grade:       "ممتاز",
    color:       "#875E9E",
    serialNo:    "SRU-TRN-20250928-003",
  },
  {
    id:         "CERT-2025-004",
    title:      "القيادة وبناء الفرق",
    issuedBy:   "مركز التطوير الجامعي — جامعة سليمان الراجحي",
    category:   "leadership",
    issueDate:  "2025-08-14",
    expiryDate: "2027-08-14",
    status:     "issued",
    hours:        9,
    grade:       "جيد جداً",
    color:       "#4A8FA0",
    serialNo:    "SRU-TRN-20250814-018",
  },
  {
    id:         "CERT-2025-003",
    title:      "أمن المعلومات والخصوصية الرقمية",
    issuedBy:   "مركز التقنية وريادة الأعمال — جامعة سليمان الراجحي",
    category:   "technical",
    issueDate:  "2025-07-20",
    expiryDate: "2027-07-20",
    status:     "issued",
    hours:        8,
    grade:       "ممتاز",
    color:       "#6CAEBD",
    serialNo:    "SRU-TRN-20250720-007",
  },
  {
    id:         "CERT-2025-002",
    title:      "ريادة الأعمال من الفكرة إلى الإطلاق",
    issuedBy:   "مركز التقنية وريادة الأعمال — جامعة سليمان الراجحي",
    category:   "leadership",
    issueDate:  "2025-06-06",
    expiryDate: null,
    status:     "issued",
    hours:       10,
    grade:       "جيد",
    color:       "#4A8FA0",
    serialNo:    "SRU-TRN-20250606-029",
  },
  {
    id:         "CERT-2024-001",
    title:      "مهارات التفكير النقدي وحل المشكلات",
    issuedBy:   "مركز التطوير الجامعي — جامعة سليمان الراجحي",
    category:   "soft",
    issueDate:  "2024-12-14",
    expiryDate: null,
    status:     "issued",
    hours:        8,
    grade:       "ممتاز",
    color:       "#875E9E",
    serialNo:    "SRU-TRN-20241214-011",
  },
];

// ═══════════════════════════
// الطلبات التدريبية
// ═══════════════════════════
export const trainingRequests = [
  { id: "TREQ-2026-005", type: "التحاق ببرنامج خارجي", date: "2026-05-30", program: "دورة PMP الاحترافية",   status: "pending"   as ReqStatus, note: "" },
  { id: "TREQ-2026-002", type: "إعادة التسجيل",         date: "2026-04-10", program: "إدارة المشاريع Agile", status: "approved"  as ReqStatus, note: "تمت الموافقة وتأكيد مقعدك" },
  { id: "TREQ-2025-019", type: "إلغاء التسجيل",         date: "2025-10-01", program: "اللغة الإنجليزية للأعمال", status: "completed" as ReqStatus, note: "تم الإلغاء واسترداد الأولوية" },
  { id: "TREQ-2025-011", type: "شهادة حضور",            date: "2025-09-30", program: "التواصل الفعّال",       status: "completed" as ReqStatus, note: "تم إصدار الشهادة" },
];

export const requestTypes = [
  { id: 1, label: "التسجيل في برنامج",      icon: "📝", description: "طلب التسجيل في برنامج تدريبي متاح" },
  { id: 2, label: "التحاق ببرنامج خارجي",   icon: "🌐", description: "طلب الموافقة على حضور دورة خارج الجامعة" },
  { id: 3, label: "إلغاء التسجيل",          icon: "❌", description: "طلب إلغاء تسجيلك في برنامج لم يبدأ" },
  { id: 4, label: "إعادة جدولة",            icon: "📅", description: "طلب نقل تسجيلك لدفعة قادمة" },
  { id: 5, label: "إصدار شهادة حضور",       icon: "🎓", description: "طلب شهادة لدورة أُتمّت دون إصدار تلقائي" },
  { id: 6, label: "الاعتراض على التقييم",    icon: "⚖️", description: "طلب مراجعة الدرجة أو تقييم الأداء" },
];

// ═══════════════════════════
// تنبيهات التدريب
// ═══════════════════════════
export const trainingAlerts = [
  { id: 1, type: "urgent"  as AlertType, title: "آخر موعد لتأكيد التسجيل",    detail: "دورة الذكاء الاصطناعي — اليوم الأخير",   daysLeft: 3,    date: "2026-06-12" },
  { id: 2, type: "warning" as AlertType, title: "ساعات التدريب الإلزامي",     detail: "متبقٍ 33 ساعة لاستيفاء المتطلب",         daysLeft: null, date: null },
  { id: 3, type: "success" as AlertType, title: "تم إصدار شهادتك الجديدة",    detail: "التواصل الفعّال — بتاريخ 28/9/2025",      daysLeft: null, date: "2025-09-28" },
  { id: 4, type: "info"    as AlertType, title: "مقاعد محدودة في Agile",      detail: "5 مقاعد متبقية — سارع بالتأكيد",         daysLeft: 30,   date: "2026-07-10" },
];

// ═══════════════════════════
// الجلسات القادمة
// ═══════════════════════════
export const upcomingSessions = [
  { id: 1, programTitle: "مهارات التفكير النقدي وحل المشكلات", date: "2026-06-20", time: "09:00–17:00", location: "قاعة 3A — المبنى الإداري", mode: "onsite" as DeliveryMode, color: "#875E9E" },
  { id: 2, programTitle: "مقدمة في الذكاء الاصطناعي وتطبيقاته — الجلسة 3",  date: "2026-07-03", time: "10:00–14:00", location: "منصة التعلم الإلكتروني",        mode: "online"  as DeliveryMode, color: "#6CAEBD" },
  { id: 3, programTitle: "إدارة المشاريع بأسلوب Agile — اليوم 1",           date: "2026-07-10", time: "08:30–16:30", location: "قاعة 7B — المبنى الأكاديمي",   mode: "onsite"  as DeliveryMode, color: "#6A4A7E" },
];
