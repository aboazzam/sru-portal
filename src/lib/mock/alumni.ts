export type JobType      = "fulltime" | "parttime" | "remote" | "contract";
export type EventType    = "networking" | "career" | "workshop" | "ceremony" | "social";
export type NewsCategory = "university" | "alumni" | "career" | "event";
export type DocStatus       = "available" | "processing" | "unavailable";
export type OfficialDocStatus = "ready" | "processing" | "pending";
export type AppStatus    = "applied" | "interview" | "offered" | "rejected" | "withdrawn";

// ═══════════════════════════
// الخريج — البيانات الشخصية
// ═══════════════════════════
export const alumniProfile = {
  id:                "ALU-2024-0891",
  name:              "سارة محمد العتيبي",
  nameEn:            "Sarah Mohammed Al-Otaibi",
  major:             "إدارة الأعمال",
  college:           "كلية سليمان الراجحي للأعمال",
  graduationYear:    2024,
  graduationSemester:"الفصل الثاني 1445هـ",
  gpa:               4.72,
  honor:             "مرتبة الشرف الأولى",
  honorEn:           "First Class Honours",
  profileCompletion: 85,
  email:             "s.otaibi@alumni.sru.edu.sa",
  phone:             "05xxxxxxxx",
  city:              "الرياض",
  linkedin:          "linkedin.com/in/sarah-otaibi",
  currentJob:        "محللة أعمال — شركة أرامكو السعودية",
  memberSince:       "2024-06-01",
};

// ═══════════════════════════
// إحصائيات الخريج الشخصية
// ═══════════════════════════
export const alumniPersonalStats = [
  { id: 1, label: "سنوات الخبرة",          value: "2",   icon: "💼", color: "#875E9E" },
  { id: 2, label: "الوظائف المتقدَّم إليها", value: "8",   icon: "📋", color: "#6CAEBD" },
  { id: 3, label: "فعاليات حضرتها",        value: "5",   icon: "📅", color: "#4A8FA0" },
  { id: 4, label: "شبكتي المهنية",          value: "124", icon: "🤝", color: "#875E9E" },
  { id: 5, label: "شهادات مهنية",          value: "3",   icon: "🏆", color: "#6CAEBD" },
  { id: 6, label: "مساهماتي",              value: "2",   icon: "❤️", color: "#4A8FA0" },
];

// ═══════════════════════════
// فرص العمل
// ═══════════════════════════
export type JobOpportunity = {
  id:          number;
  title:       string;
  company:     string;
  location:    string;
  type:        JobType;
  salary:      string;
  majors:      string[];
  postedDate:  string;
  deadline:    string;
  description: string;
  skills:      string[];
  logo:        string;
  featured:    boolean;
};

export const jobOpportunities: JobOpportunity[] = [
  {
    id: 1,
    title:       "محلل أعمال أول",
    company:     "أرامكو السعودية",
    location:    "الظهران",
    type:        "fulltime",
    salary:      "15,000 – 20,000 ريال",
    majors:      ["إدارة الأعمال", "المحاسبة", "الاقتصاد"],
    postedDate:  "2026-05-20",
    deadline:    "2026-06-30",
    description: "تحليل البيانات التشغيلية ودعم اتخاذ القرارات الاستراتيجية.",
    skills:      ["تحليل البيانات", "Excel المتقدم", "Power BI", "التفكير النقدي"],
    logo:        "🛢️",
    featured:    true,
  },
  {
    id: 2,
    title:       "مسؤول تطوير الأعمال",
    company:     "stc",
    location:    "الرياض",
    type:        "fulltime",
    salary:      "12,000 – 16,000 ريال",
    majors:      ["إدارة الأعمال", "التسويق", "الاتصالات"],
    postedDate:  "2026-05-28",
    deadline:    "2026-07-15",
    description: "قيادة مبادرات نمو الأعمال وإدارة علاقات الشركاء الاستراتيجيين.",
    skills:      ["إدارة المشاريع", "التفاوض", "CRM", "التحليل المالي"],
    logo:        "📡",
    featured:    true,
  },
  {
    id: 3,
    title:       "أخصائي موارد بشرية",
    company:     "مجموعة الراجحي المالية",
    location:    "الرياض",
    type:        "fulltime",
    salary:      "10,000 – 14,000 ريال",
    majors:      ["إدارة الأعمال", "الموارد البشرية", "علم النفس التنظيمي"],
    postedDate:  "2026-06-01",
    deadline:    "2026-07-01",
    description: "إدارة عمليات التوظيف والتطوير الوظيفي وتحسين بيئة العمل.",
    skills:      ["إدارة المواهب", "HRMS", "التواصل", "حل النزاعات"],
    logo:        "🏦",
    featured:    false,
  },
  {
    id: 4,
    title:       "محاسب مالي",
    company:     "ديلويت السعودية",
    location:    "الرياض — عن بُعد جزئياً",
    type:        "fulltime",
    salary:      "11,000 – 15,000 ريال",
    majors:      ["المحاسبة", "المالية", "إدارة الأعمال"],
    postedDate:  "2026-05-15",
    deadline:    "2026-06-20",
    description: "إعداد القوائم المالية ومراجعة الحسابات وتقديم الاستشارات الضريبية.",
    skills:      ["IFRS", "SAP", "التدقيق", "الضرائب"],
    logo:        "📊",
    featured:    false,
  },
  {
    id: 5,
    title:       "منسق مشاريع — عن بُعد",
    company:     "Noon",
    location:    "عن بُعد",
    type:        "remote",
    salary:      "8,000 – 11,000 ريال",
    majors:      ["إدارة الأعمال", "هندسة الأنظمة", "إدارة المشاريع"],
    postedDate:  "2026-06-03",
    deadline:    "2026-07-30",
    description: "تنسيق مشاريع التجارة الإلكترونية ومتابعة الجداول الزمنية.",
    skills:      ["Agile", "Jira", "التواصل", "إدارة الوقت"],
    logo:        "🛍️",
    featured:    false,
  },
];

// ═══════════════════════════
// فعاليات الخريجين
// ═══════════════════════════
export type AlumniEvent = {
  id:          number;
  title:       string;
  type:        EventType;
  date:        string;
  time:        string;
  location:    string;
  online:      boolean;
  description: string;
  seats:       number;
  seatsLeft:   number;
  registered:  boolean;
  color:       string;
};

export const alumniEvents: AlumniEvent[] = [
  {
    id: 1,
    title:       "ملتقى الخريجين السنوي 2026",
    type:        "networking",
    date:        "2026-06-28",
    time:        "17:00 – 21:00",
    location:    "قاعة الأمير خالد — مبنى الإدارة",
    online:      false,
    description: "لقاء سنوي يجمع خريجي الجامعة للتواصل وتبادل الخبرات.",
    seats:       200,
    seatsLeft:   47,
    registered:  true,
    color:       "#875E9E",
  },
  {
    id: 2,
    title:       "ورشة: بناء علامتك الشخصية على LinkedIn",
    type:        "workshop",
    date:        "2026-07-05",
    time:        "10:00 – 13:00",
    location:    "عبر منصة Zoom",
    online:      true,
    description: "ورشة عملية لتحسين الملف الشخصي وتوسيع شبكة العلاقات المهنية.",
    seats:       150,
    seatsLeft:   89,
    registered:  false,
    color:       "#6CAEBD",
  },
  {
    id: 3,
    title:       "يوم المهنة — صيف 2026",
    type:        "career",
    date:        "2026-07-20",
    time:        "09:00 – 16:00",
    location:    "صالة الفعاليات — الحرم الجامعي",
    online:      false,
    description: "معرض توظيف يضم أكثر من 30 شركة رائدة.",
    seats:       500,
    seatsLeft:   230,
    registered:  false,
    color:       "#4A8FA0",
  },
  {
    id: 4,
    title:       "حفل تكريم المتميزين من الخريجين",
    type:        "ceremony",
    date:        "2026-08-10",
    time:        "19:00 – 21:30",
    location:    "قاعة الأمير خالد — مبنى الإدارة",
    online:      false,
    description: "احتفالية سنوية لتكريم الخريجين المتميزين في مجالاتهم المهنية.",
    seats:       300,
    seatsLeft:   120,
    registered:  false,
    color:       "#875E9E",
  },
];

// ═══════════════════════════
// أخبار وتحديثات
// ═══════════════════════════
export type AlumniNews = {
  id:       number;
  category: NewsCategory;
  title:    string;
  summary:  string;
  date:     string;
  image:    string;
  readTime: number;
};

export const alumniNews: AlumniNews[] = [
  {
    id:       1,
    category: "career",
    title:    "الجامعة تطلق برنامج الإرشاد المهني للخريجين الجدد",
    summary:  "يربط البرنامج الخريجين الجدد بمرشدين من خريجي الجامعة أصحاب الخبرة في مختلف القطاعات.",
    date:     "2026-06-05",
    image:    "🎯",
    readTime: 3,
  },
  {
    id:       2,
    category: "alumni",
    title:    "خريجة من كلية الأعمال تتولى قيادة مشروع رائد في أرامكو",
    summary:  "حققت الخريجة إنجازاً بارزاً بعد سنتين من التخرج في إدارة مشاريع الطاقة المستدامة.",
    date:     "2026-06-01",
    image:    "🌟",
    readTime: 4,
  },
  {
    id:       3,
    category: "university",
    title:    "الجامعة تُوقّع اتفاقية شراكة مع 5 شركات لتوظيف الخريجين",
    summary:  "تشمل الاتفاقية توفير فرص وظيفية حصرية وبرامج تدريبية لخريجي جامعة سليمان الراجحي.",
    date:     "2026-05-28",
    image:    "🤝",
    readTime: 2,
  },
  {
    id:       4,
    category: "event",
    title:    "تسجيل ملتقى الخريجين السنوي 2026 يقترب من الإغلاق",
    summary:  "تبقى 47 مقعداً فقط في الملتقى السنوي — سارع بالتسجيل قبل الإغلاق.",
    date:     "2026-05-25",
    image:    "📅",
    readTime: 1,
  },
];

// ═══════════════════════════
// الوثائق المتاحة
// ═══════════════════════════
export const alumniDocuments = [
  { id: 1, title: "شهادة التخرج",          status: "available"    as DocStatus, issuedDate: "2024-07-01", fee: 0    },
  { id: 2, title: "كشف الدرجات الرسمي",    status: "available"    as DocStatus, issuedDate: "2024-07-01", fee: 50   },
  { id: 3, title: "شهادة مرتبة الشرف",     status: "available"    as DocStatus, issuedDate: "2024-07-15", fee: 0    },
  { id: 4, title: "وثيقة إتمام المتطلبات", status: "available"    as DocStatus, issuedDate: "2024-06-20", fee: 0    },
  { id: 5, title: "شهادة حسن سير وسلوك",  status: "processing"   as DocStatus, issuedDate: null,         fee: 30   },
  { id: 6, title: "خطاب توصية رسمي",       status: "unavailable"  as DocStatus, issuedDate: null,         fee: 100  },
];

// ═══════════════════════════
// الوثائق الرسمية (مع رموز التحقق)
// ═══════════════════════════
export type OfficialDocument = {
  id:             number;
  title:          string;
  titleEn:        string;
  category:       "academic" | "conduct" | "financial" | "other";
  icon:           string;
  status:         OfficialDocStatus;
  issuedDate:     string | null;
  fee:            number;
  verificationCode: string | null;
  estimatedDays:  number | null;
  description:    string;
};

export const officialDocuments: OfficialDocument[] = [
  {
    id:               1,
    title:            "شهادة التخرج",
    titleEn:          "Graduation Certificate",
    category:         "academic",
    icon:             "🎓",
    status:           "ready",
    issuedDate:       "2024-07-01",
    fee:              0,
    verificationCode: "SRU-2024-GR-0891-A7X",
    estimatedDays:    null,
    description:      "شهادة رسمية تُثبت إتمام متطلبات درجة البكالوريوس.",
  },
  {
    id:               2,
    title:            "كشف الدرجات الرسمي",
    titleEn:          "Official Academic Transcript",
    category:         "academic",
    icon:             "📋",
    status:           "ready",
    issuedDate:       "2024-07-01",
    fee:              50,
    verificationCode: "SRU-2024-TR-0891-B3K",
    estimatedDays:    null,
    description:      "كشف تفصيلي بجميع المواد والدرجات خلال سنوات الدراسة.",
  },
  {
    id:               3,
    title:            "شهادة مرتبة الشرف",
    titleEn:          "Honours Degree Certificate",
    category:         "academic",
    icon:             "🏅",
    status:           "ready",
    issuedDate:       "2024-07-15",
    fee:              0,
    verificationCode: "SRU-2024-HN-0891-C9M",
    estimatedDays:    null,
    description:      "وثيقة تُثبت حصولك على مرتبة الشرف الأولى.",
  },
  {
    id:               4,
    title:            "وثيقة إتمام المتطلبات",
    titleEn:          "Completion of Requirements Letter",
    category:         "academic",
    icon:             "📄",
    status:           "ready",
    issuedDate:       "2024-06-20",
    fee:              0,
    verificationCode: "SRU-2024-CR-0891-D2P",
    estimatedDays:    null,
    description:      "خطاب رسمي يُثبت استيفاء جميع متطلبات التخرج.",
  },
  {
    id:               5,
    title:            "شهادة حسن سير وسلوك",
    titleEn:          "Good Conduct Certificate",
    category:         "conduct",
    icon:             "🛡️",
    status:           "processing",
    issuedDate:       null,
    fee:              30,
    verificationCode: null,
    estimatedDays:    3,
    description:      "شهادة تُثبت عدم وجود مخالفات أكاديمية أو تأديبية.",
  },
  {
    id:               6,
    title:            "خطاب توصية رسمي",
    titleEn:          "Official Recommendation Letter",
    category:         "other",
    icon:             "✉️",
    status:           "pending",
    issuedDate:       null,
    fee:              100,
    verificationCode: null,
    estimatedDays:    7,
    description:      "خطاب توصية موقّع من عميد الكلية أو أحد أعضاء هيئة التدريس.",
  },
  {
    id:               7,
    title:            "كشف حساب الرسوم",
    titleEn:          "Fee Statement",
    category:         "financial",
    icon:             "💰",
    status:           "pending",
    issuedDate:       null,
    fee:              0,
    verificationCode: null,
    estimatedDays:    2,
    description:      "كشف تفصيلي بالرسوم المدفوعة طوال فترة الدراسة.",
  },
];

// ═══════════════════════════
// اكتمال الملف الشخصي
// ═══════════════════════════
export const profileCompletionItems = [
  { id: 1, label: "البيانات الأساسية",      done: true,  points: 15 },
  { id: 2, label: "الصورة الشخصية",         done: true,  points: 10 },
  { id: 3, label: "الوظيفة الحالية",        done: true,  points: 15 },
  { id: 4, label: "رابط LinkedIn",          done: true,  points: 10 },
  { id: 5, label: "مدينة الإقامة",          done: true,  points: 5  },
  { id: 6, label: "السيرة الذاتية (Bio)",   done: false, points: 15 },
  { id: 7, label: "المهارات المهنية",        done: false, points: 15 },
  { id: 8, label: "الشهادات والدورات",       done: true,  points: 10 },
  { id: 9, label: "تفضيلات التواصل",        done: false, points: 5  },
];

// ═══════════════════════════
// الإنجازات والشارات
// ═══════════════════════════
export type BadgeLevel = "gold" | "silver" | "bronze";

export type Achievement = {
  id:          number;
  title:       string;
  description: string;
  icon:        string;
  level:       BadgeLevel;
  earnedDate:  string;
  category:    "academic" | "career" | "community" | "engagement";
};

export const alumniAchievements: Achievement[] = [
  {
    id:          1,
    title:       "خريج متميز",
    description: "حصلت على مرتبة الشرف الأولى بمعدل 4.72",
    icon:        "🏅",
    level:       "gold",
    earnedDate:  "2024-07-01",
    category:    "academic",
  },
  {
    id:          2,
    title:       "ملف مكتمل 85%",
    description: "أكملت أكثر من 80% من بيانات ملفك الشخصي",
    icon:        "✅",
    level:       "silver",
    earnedDate:  "2024-08-10",
    category:    "engagement",
  },
  {
    id:          3,
    title:       "موظف في 60 يوم",
    description: "حصلت على وظيفتك الأولى خلال شهرين من التخرج",
    icon:        "⚡",
    level:       "gold",
    earnedDate:  "2024-08-01",
    category:    "career",
  },
  {
    id:          4,
    title:       "عضو نشط",
    description: "حضرت 5 فعاليات لخريجي الجامعة",
    icon:        "🎯",
    level:       "silver",
    earnedDate:  "2026-03-15",
    category:    "engagement",
  },
  {
    id:          5,
    title:       "شبكة متنامية",
    description: "بنيت شبكة مهنية تجاوزت 100 خريج",
    icon:        "🤝",
    level:       "bronze",
    earnedDate:  "2025-11-01",
    category:    "community",
  },
  {
    id:          6,
    title:       "مانح مساهم",
    description: "ساهمت في دعم مبادرات الجامعة",
    icon:        "❤️",
    level:       "bronze",
    earnedDate:  "2025-12-20",
    category:    "community",
  },
];

// ═══════════════════════════
// طلبات التوظيف
// ═══════════════════════════
export const jobApplications = [
  { id: "APP-2026-004", jobTitle: "محلل أعمال أول",         company: "أرامكو السعودية",      appliedDate: "2026-05-25", status: "interview"  as AppStatus },
  { id: "APP-2026-002", jobTitle: "مسؤول تطوير الأعمال",    company: "stc",                  appliedDate: "2026-05-01", status: "applied"    as AppStatus },
  { id: "APP-2025-011", jobTitle: "مدير علاقات العملاء",    company: "البنك الأهلي",          appliedDate: "2025-12-10", status: "rejected"   as AppStatus },
  { id: "APP-2025-007", jobTitle: "أخصائي تطوير تنظيمي",   company: "وزارة الموارد البشرية", appliedDate: "2025-10-05", status: "withdrawn"  as AppStatus },
];

// ═══════════════════════════
// برامج التطوير المهني
// ═══════════════════════════
export type DevCategory = "certificate" | "workshop" | "seminar" | "course";
export type DevStatus   = "available" | "enrolled" | "completed";

export type DevelopmentProgram = {
  id:           number;
  title:        string;
  provider:     string;
  category:     DevCategory;
  icon:         string;
  duration:     string;
  price:        number;
  alumniPrice:  number;
  discount:     number;
  startDate:    string;
  mode:         "online" | "onsite" | "hybrid";
  seats:        number;
  seatsLeft:    number;
  rating:       number;
  description:  string;
  skills:       string[];
  color:        string;
};

export const developmentPrograms: DevelopmentProgram[] = [
  {
    id: 1,
    title:       "شهادة PMP في إدارة المشاريع",
    provider:    "PMI — المعهد الدولي",
    category:    "certificate",
    icon:        "🏆",
    duration:    "35 ساعة — 4 أسابيع",
    price:       2800,
    alumniPrice: 1960,
    discount:    30,
    startDate:   "2026-07-10",
    mode:        "hybrid",
    seats:       25,
    seatsLeft:   9,
    rating:      4.8,
    description: "أكثر شهادات إدارة المشاريع اعترافاً دولياً — مخصصة لخريجي الجامعة بخصم 30%.",
    skills:      ["تخطيط المشاريع", "إدارة المخاطر", "Agile", "PMBOK"],
    color:       "#875E9E",
  },
  {
    id: 2,
    title:       "ورشة: Excel للتحليل المالي المتقدم",
    provider:    "مركز التطوير المهني — SRU",
    category:    "workshop",
    icon:        "📊",
    duration:    "8 ساعات — يوم واحد",
    price:       400,
    alumniPrice: 280,
    discount:    30,
    startDate:   "2026-06-28",
    mode:        "onsite",
    seats:       30,
    seatsLeft:   14,
    rating:      4.6,
    description: "ورشة مكثفة تشمل Power Query وPivot Tables والنمذجة المالية.",
    skills:      ["Power Query", "Pivot Tables", "VBA أساسي", "النمذجة المالية"],
    color:       "#16A34A",
  },
  {
    id: 3,
    title:       "ندوة: مستقبل الذكاء الاصطناعي في قطاع الأعمال",
    provider:    "رابطة خريجي SRU",
    category:    "seminar",
    icon:        "🤖",
    duration:    "3 ساعات",
    price:       0,
    alumniPrice: 0,
    discount:    100,
    startDate:   "2026-07-02",
    mode:        "online",
    seats:       500,
    seatsLeft:   312,
    rating:      4.5,
    description: "ندوة مجانية للخريجين مع خبراء من قطاعات التقنية والمال والصحة.",
    skills:      ["الذكاء الاصطناعي", "تحويل الأعمال", "الاتجاهات المستقبلية"],
    color:       "#6CAEBD",
  },
  {
    id: 4,
    title:       "دورة: القيادة التحويلية للمدراء الجدد",
    provider:    "مركز التطوير المهني — SRU",
    category:    "course",
    icon:        "🎯",
    duration:    "20 ساعة — أسبوعان",
    price:       1200,
    alumniPrice: 840,
    discount:    30,
    startDate:   "2026-07-15",
    mode:        "hybrid",
    seats:       20,
    seatsLeft:   7,
    rating:      4.9,
    description: "برنامج مصمم لخريجي أول 3 سنوات وظيفية لبناء مهارات القيادة الفعّالة.",
    skills:      ["القيادة", "التواصل", "بناء الفرق", "إدارة التغيير"],
    color:       "#875E9E",
  },
  {
    id: 5,
    title:       "شهادة SHRM-CP في الموارد البشرية",
    provider:    "SHRM — المجتمع الدولي لإدارة الموارد",
    category:    "certificate",
    icon:        "👥",
    duration:    "40 ساعة — 5 أسابيع",
    price:       3500,
    alumniPrice: 2450,
    discount:    30,
    startDate:   "2026-08-01",
    mode:        "online",
    seats:       40,
    seatsLeft:   22,
    rating:      4.7,
    description: "شهادة دولية معترفة بها لمحترفي الموارد البشرية — خصم خريجين 30%.",
    skills:      ["إدارة المواهب", "التعويضات", "قانون العمل", "التطوير التنظيمي"],
    color:       "#4A8FA0",
  },
  {
    id: 6,
    title:       "ورشة: بناء خطة عمل ناجحة",
    provider:    "مركز ريادة الأعمال — SRU",
    category:    "workshop",
    icon:        "🚀",
    duration:    "6 ساعات — يوم واحد",
    price:       300,
    alumniPrice: 0,
    discount:    100,
    startDate:   "2026-07-20",
    mode:        "onsite",
    seats:       35,
    seatsLeft:   18,
    rating:      4.4,
    description: "ورشة مجانية للخريجين الراغبين في إطلاق مشاريعهم الريادية.",
    skills:      ["Business Model Canvas", "التحليل المالي", "خطة التسويق"],
    color:       "#D97706",
  },
];

export type MyDevProgram = {
  id:          string;
  programId:   number;
  title:       string;
  provider:    string;
  category:    DevCategory;
  icon:        string;
  status:      DevStatus;
  progress:    number;
  startDate:   string;
  endDate:     string | null;
  grade:       string | null;
  color:       string;
};

export const myDevelopmentPrograms: MyDevProgram[] = [
  {
    id:        "DEV-2026-003",
    programId: 2,
    title:     "Excel للتحليل المالي المتقدم",
    provider:  "مركز التطوير المهني — SRU",
    category:  "workshop",
    icon:      "📊",
    status:    "enrolled",
    progress:  0,
    startDate: "2026-06-28",
    endDate:   null,
    grade:     null,
    color:     "#16A34A",
  },
  {
    id:        "DEV-2025-011",
    programId: 4,
    title:     "القيادة التحويلية للمدراء الجدد",
    provider:  "مركز التطوير المهني — SRU",
    category:  "course",
    icon:      "🎯",
    status:    "completed",
    progress:  100,
    startDate: "2025-10-01",
    endDate:   "2025-10-15",
    grade:     "ممتاز",
    color:     "#875E9E",
  },
  {
    id:        "DEV-2025-007",
    programId: 3,
    title:     "ندوة: مستقبل الذكاء الاصطناعي",
    provider:  "رابطة خريجي SRU",
    category:  "seminar",
    icon:      "🤖",
    status:    "completed",
    progress:  100,
    startDate: "2025-07-02",
    endDate:   "2025-07-02",
    grade:     "حضور",
    color:     "#6CAEBD",
  },
];

// ═══════════════════════════
// شبكة الخريجين
// ═══════════════════════════
export type NetworkAlumnus = {
  id:             number;
  name:           string;
  initial:        string;
  major:          string;
  college:        string;
  graduationYear: number;
  company:        string;
  jobTitle:       string;
  city:           string;
  connected:      boolean;
  mutualCount:    number;
  color:          string;
};

export const alumniNetworkStats = {
  totalAlumni:   4820,
  myConnections: 124,
  pendingRequests: 3,
};

export const alumniNetwork: NetworkAlumnus[] = [
  { id: 1,  name: "محمد عبدالله الغامدي",   initial: "م", major: "علوم الحاسب",      college: "كلية العلوم التطبيقية", graduationYear: 2023, company: "أرامكو السعودية",    jobTitle: "مهندس برمجيات",       city: "الظهران", connected: true,  mutualCount: 18, color: "#6CAEBD" },
  { id: 2,  name: "نورة سعد القحطاني",     initial: "ن", major: "إدارة الأعمال",     college: "كلية الأعمال",          graduationYear: 2024, company: "مجموعة الراجحي",    jobTitle: "محللة أعمال",         city: "الرياض",  connected: true,  mutualCount: 12, color: "#875E9E" },
  { id: 3,  name: "خالد إبراهيم العتيبي",  initial: "خ", major: "المحاسبة",           college: "كلية الأعمال",          graduationYear: 2022, company: "ديلويت السعودية",   jobTitle: "مدقق حسابات",         city: "الرياض",  connected: true,  mutualCount: 9,  color: "#4A8FA0" },
  { id: 4,  name: "ريم فهد الشمري",        initial: "ر", major: "الطب",               college: "كلية الطب",             graduationYear: 2024, company: "مستشفى الملك فيصل", jobTitle: "طبيبة مقيمة",         city: "الرياض",  connected: false, mutualCount: 5,  color: "#DC2626" },
  { id: 5,  name: "عبدالرحمن يوسف المالكي",initial: "ع", major: "هندسة الحاسب",      college: "كلية العلوم التطبيقية", graduationYear: 2023, company: "stc",               jobTitle: "مهندس شبكات",         city: "جدة",     connected: false, mutualCount: 7,  color: "#6CAEBD" },
  { id: 6,  name: "دانا محمد الحربي",      initial: "د", major: "إدارة الأعمال",     college: "كلية الأعمال",          graduationYear: 2024, company: "Noon",              jobTitle: "مديرة منتج",          city: "الرياض",  connected: true,  mutualCount: 21, color: "#875E9E" },
  { id: 7,  name: "أحمد علي الزهراني",     initial: "أ", major: "تمريض",              college: "كلية التمريض",          graduationYear: 2023, company: "وزارة الصحة",       jobTitle: "ممرض أول",            city: "مكة",     connected: false, mutualCount: 3,  color: "#16A34A" },
  { id: 8,  name: "لمى عبدالعزيز الدوسري", initial: "ل", major: "المالية",            college: "كلية الأعمال",          graduationYear: 2022, company: "البنك الأهلي",      jobTitle: "محللة مالية أولى",   city: "الرياض",  connected: false, mutualCount: 14, color: "#D97706" },
  { id: 9,  name: "فيصل سلطان البلوي",     initial: "ف", major: "علوم الحاسب",       college: "كلية العلوم التطبيقية", graduationYear: 2021, company: "ماكنزي",            jobTitle: "مستشار أول",          city: "الرياض",  connected: false, mutualCount: 2,  color: "#6CAEBD" },
  { id: 10, name: "هند عبدالله الرشيدي",   initial: "هـ", major: "إدارة الأعمال",    college: "كلية الأعمال",          graduationYear: 2024, company: "أمازون السعودية",   jobTitle: "مديرة عمليات",        city: "الرياض",  connected: true,  mutualCount: 16, color: "#875E9E" },
  { id: 11, name: "سلطان ناصر الشهري",     initial: "س", major: "المحاسبة",          college: "كلية الأعمال",          graduationYear: 2023, company: "KPMG",              jobTitle: "محاسب قانوني",        city: "جدة",     connected: false, mutualCount: 8,  color: "#4A8FA0" },
  { id: 12, name: "بسمة خالد العمري",      initial: "ب", major: "إدارة الأعمال",     college: "كلية الأعمال",          graduationYear: 2022, company: "P&G",               jobTitle: "مديرة تسويق",         city: "جدة",     connected: false, mutualCount: 11, color: "#875E9E" },
];

// ═══════════════════════════
// خيارات المساهمة
// ═══════════════════════════
export type ContribCategory = "mentoring" | "giving" | "teaching" | "volunteering" | "sponsoring";

export type ContributionOption = {
  id:          number;
  category:    ContribCategory;
  title:       string;
  subtitle:    string;
  icon:        string;
  color:       string;
  impact:      string;
  timeCommit:  string;
  description: string;
  joined:      number;
  benefits:    string[];
};

export const contributionOptions: ContributionOption[] = [
  {
    id:          1,
    category:    "mentoring",
    title:       "مرشد مهني",
    subtitle:    "وجّه الطلاب نحو مسارهم",
    icon:        "🎯",
    color:       "#875E9E",
    impact:      "أثر مباشر على 3–5 طلاب",
    timeCommit:  "ساعة واحدة / الشهر",
    description: "انضم لبرنامج الإرشاد المهني وكن مرجعاً لطلاب السنة الأخيرة في تخصصك.",
    joined:      148,
    benefits:    ["شهادة مرشد معتمد", "دعوة لملتقيات الخريجين المميزة", "بادج في ملفك الشخصي"],
  },
  {
    id:          2,
    category:    "giving",
    title:       "دعم صندوق المنح",
    subtitle:    "مكّن طالباً من إتمام مسيرته",
    icon:        "💛",
    color:       "#D97706",
    impact:      "منحة تُغطي 25–100% من الرسوم",
    timeCommit:  "تبرع واحد أو دوري",
    description: "ساهم في صندوق منح الجامعة لدعم الطلاب المتميزين محدودي الدخل.",
    joined:      312,
    benefits:    ["إيصال ضريبي رسمي", "شهادة شكر", "ذكر في التقرير السنوي للجامعة"],
  },
  {
    id:          3,
    category:    "teaching",
    title:       "محاضر ضيف",
    subtitle:    "اشرك خبرتك مع الجيل القادم",
    icon:        "🎙️",
    color:       "#6CAEBD",
    impact:      "يصل لـ 30–80 طالب بالمحاضرة",
    timeCommit:  "محاضرة واحدة / الفصل",
    description: "شارك تجربتك المهنية بمحاضرة ضيف تُثري المناهج الدراسية.",
    joined:      67,
    benefits:    ["خطاب شكر من عمادة الكلية", "شبكة علاقات مع الهيئة التدريسية", "بادج في ملفك"],
  },
  {
    id:          4,
    category:    "volunteering",
    title:       "متطوع في الفعاليات",
    subtitle:    "كن جزءاً من لجان الجامعة",
    icon:        "🙌",
    color:       "#16A34A",
    impact:      "فعاليات تجمع 200+ خريج ومتدرب",
    timeCommit:  "يوم أو يومان / الفصل",
    description: "انضم لفريق تنظيم ملتقيات الخريجين وأيام المهنة والفعاليات الاجتماعية.",
    joined:      94,
    benefits:    ["تسهيل دخول مميز للفعاليات", "شهادة تطوع", "معرفة شخصية بإدارة الجامعة"],
  },
  {
    id:          5,
    category:    "sponsoring",
    title:       "رعاية مؤسسية",
    subtitle:    "شارك بمنشأتك في دعم الجامعة",
    icon:        "🏢",
    color:       "#4A8FA0",
    impact:      "فرص توظيف حصرية لخريجي الجامعة",
    timeCommit:  "عقد سنوي مرن",
    description: "اربط منشأتك بجامعة سليمان الراجحي عبر برامج الرعاية وفرص التوظيف.",
    joined:      29,
    benefits:    ["شعار الشركة في جميع مواد الجامعة", "جناح في يوم المهنة", "قناة توظيف مباشرة"],
  },
];

// ═══════════════════════════
// مساهماتي الحالية
// ═══════════════════════════
export type MyContribution = {
  id:           string;
  optionId:     number;
  title:        string;
  icon:         string;
  color:        string;
  joinedDate:   string;
  status:       "active" | "paused" | "completed";
  detail:       string;
};

export const myContributions: MyContribution[] = [
  {
    id:         "CONT-2025-002",
    optionId:   1,
    title:      "مرشد مهني",
    icon:       "🎯",
    color:      "#875E9E",
    joinedDate: "2025-09-01",
    status:     "active",
    detail:     "أرشدت 2 طلاب منذ الانضمام — الجلسة القادمة: 20 يونيو",
  },
  {
    id:         "CONT-2025-001",
    optionId:   4,
    title:      "متطوع في الفعاليات",
    icon:       "🙌",
    color:      "#16A34A",
    joinedDate: "2025-06-01",
    status:     "active",
    detail:     "تطوعت في 2 فعاليات — التالية: ملتقى الخريجين 28 يونيو",
  },
];

// ═══════════════════════════
// بيانات لوحة الشركة (Employer)
// ═══════════════════════════
export type ApplicantStatus = "new" | "reviewed" | "interview" | "accepted" | "rejected";

export type JobPosting = {
  id:           string;
  title:        string;
  department:   string;
  type:         string;
  location:     string;
  postedDate:   string;
  deadline:     string;
  applicants:   number;
  status:       "active" | "closed" | "draft";
};

export type Applicant = {
  id:          string;
  jobId:       string;
  name:        string;
  initial:     string;
  major:       string;
  gpa:         number;
  gradYear:    number;
  honor:       boolean;
  city:        string;
  email:       string;
  phone:       string;
  appliedDate: string;
  status:      ApplicantStatus;
  color:       string;
  skills:      string[];
  verifyCode:  string;
  coverNote?:  string;
};

export const employerJobPostings: JobPosting[] = [
  { id: "JOB-001", title: "محلل مالي",           department: "المالية والمحاسبة", type: "fulltime", location: "الرياض",  postedDate: "2026-05-15", deadline: "2026-07-01", applicants: 12, status: "active" },
  { id: "JOB-002", title: "مسؤول موارد بشرية",   department: "الموارد البشرية",   type: "fulltime", location: "جدة",     postedDate: "2026-05-28", deadline: "2026-07-15", applicants: 8,  status: "active" },
  { id: "JOB-003", title: "مدير تسويق رقمي",     department: "التسويق",           type: "hybrid",   location: "الرياض",  postedDate: "2026-04-10", deadline: "2026-06-01", applicants: 20, status: "closed" },
];

export const employerApplicants: Applicant[] = [
  { id: "AAPP-001", jobId: "JOB-001", name: "سارة محمد العتيبي",    initial: "س",  major: "إدارة الأعمال",  gpa: 4.72, gradYear: 2024, honor: true,  city: "الرياض", email: "s.otaibi@alumni.sru.edu.sa",   phone: "0512345678", appliedDate: "2026-05-25", status: "interview", color: "#875E9E", skills: ["Excel", "Power BI", "التحليل المالي"],   verifyCode: "SRU-2024-GR-0891-A7X", coverNote: "أسعى للانضمام لفريقكم المالي المتميز بخبرتي في التحليل وقدرتي على العمل ضمن فريق متعدد المهام." },
  { id: "AAPP-002", jobId: "JOB-001", name: "نورة سعد القحطاني",    initial: "ن",  major: "المحاسبة",       gpa: 4.55, gradYear: 2024, honor: true,  city: "الرياض", email: "n.qahtani@alumni.sru.edu.sa",  phone: "0523456789", appliedDate: "2026-05-26", status: "new",       color: "#6CAEBD", skills: ["IFRS", "SAP", "التدقيق"],              verifyCode: "SRU-2024-TR-0892-B3K" },
  { id: "AAPP-003", jobId: "JOB-001", name: "خالد إبراهيم العتيبي",  initial: "خ",  major: "المالية",        gpa: 4.20, gradYear: 2023, honor: false, city: "جدة",    email: "k.otaibi@alumni.sru.edu.sa",   phone: "0534567890", appliedDate: "2026-05-27", status: "reviewed",  color: "#4A8FA0", skills: ["Bloomberg", "Valuation", "المالية"],   verifyCode: "SRU-2023-GR-0541-C9M", coverNote: "خبرة 3 سنوات في التحليل المالي وإعداد التقارير الاستراتيجية لكبرى شركات القطاع الخاص." },
  { id: "AAPP-004", jobId: "JOB-001", name: "لمى عبدالعزيز الدوسري", initial: "ل",  major: "إدارة الأعمال",  gpa: 3.95, gradYear: 2022, honor: false, city: "الرياض", email: "l.dosari@alumni.sru.edu.sa",   phone: "0545678901", appliedDate: "2026-05-30", status: "rejected",  color: "#D97706", skills: ["Excel", "إدارة المشاريع"],             verifyCode: "SRU-2022-GR-0312-D2P" },
  { id: "AAPP-005", jobId: "JOB-002", name: "هند عبدالله الرشيدي",   initial: "هـ", major: "إدارة الأعمال",  gpa: 4.60, gradYear: 2024, honor: true,  city: "جدة",    email: "h.rashidi@alumni.sru.edu.sa",  phone: "0556789012", appliedDate: "2026-06-01", status: "new",       color: "#875E9E", skills: ["التوظيف", "HRMS", "إدارة المواهب"],    verifyCode: "SRU-2024-GR-0893-E5R", coverNote: "شغفي بتطوير المواهب وبناء ثقافة مؤسسية إيجابية يجعلني الخيار الأمثل لهذا الدور." },
  { id: "AAPP-006", jobId: "JOB-002", name: "دانا محمد الحربي",      initial: "د",  major: "إدارة الأعمال",  gpa: 4.38, gradYear: 2024, honor: false, city: "الرياض", email: "d.harbi@alumni.sru.edu.sa",    phone: "0567890123", appliedDate: "2026-06-02", status: "interview", color: "#875E9E", skills: ["التدريب والتطوير", "التعويضات"],        verifyCode: "SRU-2024-GR-0894-F8T" },
  { id: "AAPP-007", jobId: "JOB-002", name: "بسمة خالد العمري",      initial: "ب",  major: "الموارد البشرية", gpa: 4.11, gradYear: 2022, honor: false, city: "جدة",   email: "b.omari@alumni.sru.edu.sa",    phone: "0578901234", appliedDate: "2026-06-03", status: "accepted",  color: "#4A8FA0", skills: ["SAP HR", "قانون العمل", "التوظيف"],   verifyCode: "SRU-2022-GR-0315-G1U" },
  { id: "AAPP-008", jobId: "JOB-003", name: "محمد عبدالله الغامدي",  initial: "م",  major: "التسويق",        gpa: 4.44, gradYear: 2023, honor: true,  city: "الرياض", email: "m.ghamdi@alumni.sru.edu.sa",   phone: "0589012345", appliedDate: "2026-04-15", status: "accepted",  color: "#6CAEBD", skills: ["SEO", "Google Ads", "التحليلات"],      verifyCode: "SRU-2023-GR-0542-H4V" },
];

// ═══════════════════════════
// بيانات لوحة الإدارة (Admin)
// ═══════════════════════════
export const universityStats = [
  { id: 1, label: "إجمالي الخريجين",       value: "4,820", icon: "🎓", color: "#875E9E", trend: "+312 هذا العام"         },
  { id: 2, label: "معدل التوظيف",           value: "87%",   icon: "💼", color: "#6CAEBD", trend: "+4% عن العام الماضي"   },
  { id: 3, label: "خريجو هذا العام",        value: "612",   icon: "📋", color: "#4A8FA0", trend: "دفعة 2026"             },
  { id: 4, label: "خريجو مرتبة الشرف",      value: "18%",   icon: "🏅", color: "#D97706", trend: "من إجمالي الخريجين"   },
  { id: 5, label: "شركات توظيف نشطة",      value: "47",    icon: "🏢", color: "#16A34A", trend: "شريك موقّع"            },
  { id: 6, label: "فعاليات هذا الفصل",     value: "12",    icon: "📅", color: "#875E9E", trend: "4 قادمة"               },
  { id: 7, label: "متوسط المعدل التراكمي",  value: "4.21",  icon: "📊", color: "#6CAEBD", trend: "آخر 3 دفعات"          },
  { id: 8, label: "رضا الخريجين",           value: "92%",   icon: "⭐", color: "#4A8FA0", trend: "استطلاع 2025"          },
];

export const employmentByYear = [
  { year: 2020, total: 580, employed: 471, rate: 81, avgGpa: 4.05, honors: 92  },
  { year: 2021, total: 620, employed: 521, rate: 84, avgGpa: 4.10, honors: 108 },
  { year: 2022, total: 675, employed: 582, rate: 86, avgGpa: 4.15, honors: 118 },
  { year: 2023, total: 710, employed: 625, rate: 88, avgGpa: 4.18, honors: 127 },
  { year: 2024, total: 748, employed: 661, rate: 88, avgGpa: 4.22, honors: 137 },
  { year: 2025, total: 875, employed: 779, rate: 89, avgGpa: 4.28, honors: 162 },
];

export const employmentByMajor = [
  { major: "إدارة الأعمال",     college: "كلية الأعمال",           total: 980, employed: 872, rate: 89, avgGpa: 4.20, topEmployer: "أرامكو السعودية"   },
  { major: "المحاسبة",          college: "كلية الأعمال",           total: 740, employed: 673, rate: 91, avgGpa: 4.25, topEmployer: "ديلويت السعودية"  },
  { major: "المالية",           college: "كلية الأعمال",           total: 620, employed: 552, rate: 89, avgGpa: 4.18, topEmployer: "مجموعة الراجحي"   },
  { major: "علوم الحاسب",      college: "كلية العلوم التطبيقية", total: 510, employed: 474, rate: 93, avgGpa: 4.30, topEmployer: "stc"               },
  { major: "هندسة الحاسب",     college: "كلية العلوم التطبيقية", total: 430, employed: 393, rate: 91, avgGpa: 4.22, topEmployer: "stc"               },
  { major: "الطب",              college: "كلية الطب",              total: 380, employed: 380, rate: 100, avgGpa: 4.50, topEmployer: "وزارة الصحة"     },
  { major: "التمريض",           college: "كلية التمريض",           total: 290, employed: 270, rate: 93, avgGpa: 4.15, topEmployer: "وزارة الصحة"      },
  { major: "الموارد البشرية",   college: "كلية الأعمال",           total: 250, employed: 213, rate: 85, avgGpa: 4.10, topEmployer: "stc"               },
  { major: "التسويق",           college: "كلية الأعمال",           total: 340, employed: 292, rate: 86, avgGpa: 4.08, topEmployer: "Noon"              },
  { major: "الاقتصاد",          college: "كلية الأعمال",           total: 280, employed: 237, rate: 85, avgGpa: 4.12, topEmployer: "البنك الأهلي"     },
];

export const topEmployers = [
  { company: "أرامكو السعودية",  hired: 312, logo: "🛢️", sector: "الطاقة",       color: "#6CAEBD" },
  { company: "stc",              hired: 274, logo: "📡", sector: "الاتصالات",    color: "#875E9E" },
  { company: "مجموعة الراجحي",  hired: 198, logo: "🏦", sector: "المالية",      color: "#D97706" },
  { company: "وزارة الصحة",     hired: 185, logo: "🏥", sector: "الصحة",        color: "#16A34A" },
  { company: "ديلويت السعودية",  hired: 143, logo: "📊", sector: "الاستشارات",  color: "#4A8FA0" },
];

export type AdminAlumnus = {
  id:        string;
  name:      string;
  initial:   string;
  college:   string;
  major:     string;
  gradYear:  number;
  gpa:       number;
  honor:     boolean;
  city:      string;
  company:   string;
  jobTitle:  string;
  email:     string;
  phone:     string;
  color:     string;
  status:    "employed" | "seeking" | "studying" | "other";
};

export const adminAlumniList: AdminAlumnus[] = [
  { id: "ALU-2024-0891", name: "سارة محمد العتيبي",      initial: "س",  college: "كلية الأعمال",           major: "إدارة الأعمال",   gradYear: 2024, gpa: 4.72, honor: true,  city: "الرياض",   company: "أرامكو السعودية",        jobTitle: "محللة أعمال",           email: "s.otaibi@alumni.sru.edu.sa",    phone: "0512345678", color: "#875E9E", status: "employed" },
  { id: "ALU-2024-0892", name: "نورة سعد القحطاني",      initial: "ن",  college: "كلية الأعمال",           major: "المحاسبة",         gradYear: 2024, gpa: 4.55, honor: true,  city: "الرياض",   company: "ديلويت السعودية",        jobTitle: "محاسبة قانونية",        email: "n.qahtani@alumni.sru.edu.sa",   phone: "0523456789", color: "#6CAEBD", status: "employed" },
  { id: "ALU-2023-0541", name: "خالد إبراهيم العتيبي",   initial: "خ",  college: "كلية الأعمال",           major: "المالية",          gradYear: 2023, gpa: 4.20, honor: false, city: "جدة",      company: "مجموعة الراجحي",        jobTitle: "محلل مالي",             email: "k.otaibi@alumni.sru.edu.sa",    phone: "0534567890", color: "#4A8FA0", status: "employed" },
  { id: "ALU-2024-0893", name: "ريم فهد الشمري",         initial: "ر",  college: "كلية الطب",              major: "الطب",             gradYear: 2024, gpa: 4.85, honor: true,  city: "الرياض",   company: "وزارة الصحة",            jobTitle: "طبيبة مقيمة",           email: "r.shamri@alumni.sru.edu.sa",    phone: "0545678901", color: "#DC2626", status: "employed" },
  { id: "ALU-2023-0542", name: "عبدالرحمن يوسف المالكي", initial: "ع",  college: "كلية العلوم التطبيقية", major: "هندسة الحاسب",    gradYear: 2023, gpa: 4.38, honor: false, city: "جدة",      company: "stc",                    jobTitle: "مهندس شبكات",           email: "a.maliki@alumni.sru.edu.sa",    phone: "0556789012", color: "#6CAEBD", status: "employed" },
  { id: "ALU-2024-0894", name: "دانا محمد الحربي",       initial: "د",  college: "كلية الأعمال",           major: "إدارة الأعمال",   gradYear: 2024, gpa: 4.38, honor: false, city: "الرياض",   company: "Noon",                   jobTitle: "مديرة منتج",            email: "d.harbi@alumni.sru.edu.sa",     phone: "0567890123", color: "#875E9E", status: "employed" },
  { id: "ALU-2023-0543", name: "أحمد علي الزهراني",      initial: "أ",  college: "كلية التمريض",           major: "التمريض",          gradYear: 2023, gpa: 4.05, honor: false, city: "مكة",      company: "وزارة الصحة",            jobTitle: "ممرض أول",              email: "a.zahrani@alumni.sru.edu.sa",   phone: "0578901234", color: "#16A34A", status: "employed" },
  { id: "ALU-2022-0312", name: "لمى عبدالعزيز الدوسري",  initial: "ل",  college: "كلية الأعمال",           major: "المالية",          gradYear: 2022, gpa: 3.95, honor: false, city: "الرياض",   company: "البنك الأهلي",           jobTitle: "محللة مالية أولى",     email: "l.dosari@alumni.sru.edu.sa",    phone: "0589012345", color: "#D97706", status: "employed" },
  { id: "ALU-2021-0189", name: "فيصل سلطان البلوي",      initial: "ف",  college: "كلية العلوم التطبيقية", major: "علوم الحاسب",     gradYear: 2021, gpa: 4.48, honor: true,  city: "الرياض",   company: "ماكنزي",                 jobTitle: "مستشار أول",            email: "f.balawi@alumni.sru.edu.sa",    phone: "0590123456", color: "#6CAEBD", status: "employed" },
  { id: "ALU-2024-0895", name: "هند عبدالله الرشيدي",    initial: "هـ", college: "كلية الأعمال",           major: "إدارة الأعمال",   gradYear: 2024, gpa: 4.60, honor: true,  city: "جدة",      company: "أمازون السعودية",        jobTitle: "مديرة عمليات",         email: "h.rashidi@alumni.sru.edu.sa",   phone: "0501234567", color: "#875E9E", status: "employed" },
  { id: "ALU-2023-0544", name: "سلطان ناصر الشهري",      initial: "س",  college: "كلية الأعمال",           major: "المحاسبة",         gradYear: 2023, gpa: 4.15, honor: false, city: "جدة",      company: "KPMG",                   jobTitle: "محاسب قانوني",          email: "s.shahri@alumni.sru.edu.sa",    phone: "0512345679", color: "#4A8FA0", status: "employed" },
  { id: "ALU-2022-0313", name: "بسمة خالد العمري",       initial: "ب",  college: "كلية الأعمال",           major: "إدارة الأعمال",   gradYear: 2022, gpa: 4.22, honor: false, city: "جدة",      company: "P&G",                    jobTitle: "مديرة تسويق",           email: "b.omari@alumni.sru.edu.sa",     phone: "0523456780", color: "#875E9E", status: "employed" },
  { id: "ALU-2024-0896", name: "طلال عمر النعيمي",       initial: "ط",  college: "كلية الأعمال",           major: "التسويق",          gradYear: 2024, gpa: 3.88, honor: false, city: "الرياض",   company: "",                       jobTitle: "",                      email: "t.naimi@alumni.sru.edu.sa",     phone: "0534567891", color: "#D97706", status: "seeking"  },
  { id: "ALU-2023-0545", name: "منى عبدالرحمن الجهني",   initial: "م",  college: "كلية العلوم التطبيقية", major: "علوم الحاسب",     gradYear: 2023, gpa: 4.62, honor: true,  city: "المدينة",  company: "موبايلي",                jobTitle: "مطورة تطبيقات",         email: "m.johni@alumni.sru.edu.sa",     phone: "0545678902", color: "#6CAEBD", status: "employed" },
  { id: "ALU-2024-0897", name: "يوسف محمد الحمد",        initial: "ي",  college: "كلية الأعمال",           major: "إدارة الأعمال",   gradYear: 2024, gpa: 4.02, honor: false, city: "الرياض",   company: "",                       jobTitle: "",                      email: "y.hamad@alumni.sru.edu.sa",     phone: "0556789013", color: "#4A8FA0", status: "seeking"  },
  { id: "ALU-2022-0314", name: "نجود علي الثبيتي",       initial: "ن",  college: "كلية التمريض",           major: "التمريض",          gradYear: 2022, gpa: 4.30, honor: false, city: "الطائف",   company: "مستشفى الملك فيصل",     jobTitle: "ممرضة أولى",            email: "n.thubaiti@alumni.sru.edu.sa",  phone: "0567890124", color: "#16A34A", status: "employed" },
  { id: "ALU-2021-0190", name: "راشد سعود المطيري",      initial: "ر",  college: "كلية الأعمال",           major: "الاقتصاد",         gradYear: 2021, gpa: 4.15, honor: false, city: "الرياض",   company: "البنك الكويتي",          jobTitle: "محلل اقتصادي",          email: "r.mutairi@alumni.sru.edu.sa",   phone: "0578901235", color: "#D97706", status: "employed" },
  { id: "ALU-2023-0546", name: "عبير محمد السبيعي",      initial: "ع",  college: "كلية الأعمال",           major: "الموارد البشرية",  gradYear: 2023, gpa: 4.08, honor: false, city: "الرياض",   company: "وزارة الموارد البشرية", jobTitle: "أخصائية موارد بشرية",  email: "a.subaie@alumni.sru.edu.sa",    phone: "0589012346", color: "#875E9E", status: "employed" },
  { id: "ALU-2024-0898", name: "حمد عبدالله الخالدي",    initial: "ح",  college: "كلية العلوم التطبيقية", major: "هندسة الحاسب",    gradYear: 2024, gpa: 4.44, honor: true,  city: "الرياض",   company: "أرامكو السعودية",        jobTitle: "مهندس برمجيات",         email: "h.khaldi@alumni.sru.edu.sa",    phone: "0590123457", color: "#6CAEBD", status: "employed" },
  { id: "ALU-2025-1001", name: "جواهر سعيد الغامدي",     initial: "ج",  college: "كلية الطب",              major: "الطب",             gradYear: 2025, gpa: 4.91, honor: true,  city: "الرياض",   company: "مستشفى الملك سلمان",    jobTitle: "طبيبة مقيمة",           email: "j.ghamdi@alumni.sru.edu.sa",    phone: "0501234568", color: "#DC2626", status: "studying" },
];

// ═══════════════════════════
// بيانات لوحة الشركة (Employer)
// ═══════════════════════════
export const employerDashboardData = {
  stats: [
    { id: 1, label: "الوظائف النشطة",     value: "2",  icon: "💼", color: "#875E9E" },
    { id: 2, label: "إجمالي المتقدمين",   value: "20", icon: "👥", color: "#6CAEBD" },
    { id: 3, label: "مقابلات مجدوَلة",   value: "3",  icon: "🎙️", color: "#D97706" },
    { id: 4, label: "تم قبولهم",          value: "2",  icon: "✅", color: "#16A34A" },
    { id: 5, label: "معدل الاستجابة",     value: "87%",icon: "📊", color: "#4A8FA0" },
  ],
  recentApplicants: employerApplicants.filter((a) => a.status === "new" || a.status === "interview").slice(0, 5),
};
