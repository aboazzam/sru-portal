// ═══════════════════════════════════════
// إحصائيات عامة
// ═══════════════════════════════════════
export const scholarshipStats = {
  fullScholarships:    8,
  partialCategories:   7,
  fullCoverage:      100,
  fundingSolutions:    2,
  academicYear: "العام الأكاديمي 1447هـ",
};

// ═══════════════════════════════════════
// المنح الكاملة - 8 فئات
// ═══════════════════════════════════════
export const fullScholarships = [
  {
    id: 1,
    rank: "الأولى",
    title: "منحة النخبة للمستجدين",
    subtitle: "الطلاب المستجدين المتميزين في الجامعة",
    type: "full",
    coverage: 100,
    color: "#6CAEBD",
    partner: null as string | null,
    description:
      "منحة دراسية كاملة لتغطية الرسوم الدراسية فقط، ولا تشمل أي مصاريف أخرى مثل رسوم السكن والوجبات وما في ذلك رسوم التدريب في سنة الامتياز.",
    requirements: {
      title: "شروط المنافسة عليها",
      items: [
        "ألا تقل نسبة الثانوية عن 95% لكلية الطب، وعن 90% لباقي الكليات",
        "أن يحقق الطالب في اختبار القدرات والتحصيلي ما لا يقل عن 90 في كل منهما",
        "أن يكون الطالب مستجداً في بداية السنة الأكاديمية",
      ],
    },
    maintenance: {
      title: "شروط المحافظة عليها",
      items: [
        "تحقيق معدل سنوي لا يقل عن 4.5 من 5 في كلية الطب، و4.25 في باقي الكليات",
        "الالتزام بالضوابط العامة لسياسة المنح",
        "ألا يكون الطالب راسباً في أي مقرر دراسي خلال أي فصل",
      ],
    },
    note: "⚠️ المنحة متاحة لمرحلة البكالوريوس فقط. يتم التواصل بشأن المنح عبر مكتب الصندوق والحلول المالية في بداية كل عام دراسي.",
  },
  {
    id: 2,
    rank: "الثانية",
    title: "منحة النخبة للمنتظمين",
    subtitle: "الطلاب المنتظمين المتميزين أكاديمياً",
    type: "full",
    coverage: 100,
    color: "#6CAEBD",
    partner: null as string | null,
    description: "منحة كاملة للطلاب المنتظمين المتميزين الذين يحافظون على مستوى أكاديمي عالٍ.",
    requirements: { title: "شروط التأهل", items: [] as string[] },
    maintenance: { title: "شروط المحافظة", items: [] as string[] },
    note: null as string | null,
  },
  {
    id: 3,
    rank: "الثالثة",
    title: "منحة الريادة الدولية",
    subtitle: "الطلاب القادمين من خارج المملكة العربية السعودية",
    type: "full",
    coverage: 100,
    color: "#875E9E",
    partner: null as string | null,
    description: "منحة كاملة مقدمة للطلاب الدوليين الراغبين في الالتحاق بجامعة سليمان الراجحي.",
    requirements: { title: "شروط التأهل", items: [] as string[] },
    maintenance: { title: "شروط المحافظة", items: [] as string[] },
    note: null as string | null,
  },
  {
    id: 4,
    rank: "الرابعة",
    title: "منحة أبناء شهداء الواجب",
    subtitle: "تكريماً لأبناء شهداء الوطن",
    type: "full",
    coverage: 100,
    color: "#875E9E",
    partner: null as string | null,
    description: "منحة كاملة تكريماً لأبناء شهداء الوطن الذين ضحوا في سبيل الوطن.",
    requirements: { title: "شروط التأهل", items: [] as string[] },
    maintenance: { title: "شروط المحافظة", items: [] as string[] },
    note: null as string | null,
  },
  {
    id: 5,
    rank: "الخامسة",
    title: "منحة أبناء منسوبي الجامعة",
    subtitle: "لأبناء أعضاء هيئة التدريس والموظفين بدوام كامل",
    type: "full",
    coverage: 100,
    color: "#6CAEBD",
    partner: null as string | null,
    description: "منحة كاملة لأبناء منسوبي الجامعة من أعضاء هيئة التدريس والموظفين.",
    requirements: { title: "شروط التأهل", items: [] as string[] },
    maintenance: { title: "شروط المحافظة", items: [] as string[] },
    note: null as string | null,
  },
  {
    id: 6,
    rank: "السادسة",
    title: "منحة التمكين للمستجدين",
    subtitle: "الطلاب القادمين من ذوي الدخل المحدود",
    type: "full",
    coverage: 100,
    color: "#6CAEBD",
    partner: null as string | null,
    description: "منحة دراسية كاملة للطلاب المستجدين القادمين من الأسر ذات الدخل المحدود.",
    requirements: { title: "شروط التأهل", items: [] as string[] },
    maintenance: { title: "شروط المحافظة", items: [] as string[] },
    note: null as string | null,
  },
  {
    id: 7,
    rank: "السابعة",
    title: "المنحة المشتركة مع مؤسسة أبو غزالة",
    subtitle: "شراكة مع مؤسسة أبو غزالة للتنمية الاجتماعية",
    type: "full",
    coverage: 100,
    color: "#8FA4AB",
    partner: "مؤسسة أبو غزالة للتنمية الاجتماعية",
    description: "منحة مشتركة بين الجامعة ومؤسسة أبو غزالة للتنمية الاجتماعية.",
    requirements: { title: "شروط التأهل", items: [] as string[] },
    maintenance: { title: "شروط المحافظة", items: [] as string[] },
    note: null as string | null,
  },
  {
    id: 8,
    rank: "الثامنة",
    title: "المنحة المشتركة مع جمعية تعلّم",
    subtitle: "شراكة مع جمعية دعم التعليم تعلّم",
    type: "full",
    coverage: 100,
    color: "#8FA4AB",
    partner: "جمعية دعم التعليم تعلّم",
    description: "منحة مشتركة بين الجامعة وجمعية دعم التعليم تعلّم.",
    requirements: { title: "شروط التأهل", items: [] as string[] },
    maintenance: { title: "شروط المحافظة", items: [] as string[] },
    note: null as string | null,
  },
];

// ═══════════════════════════════════════
// المنح الجزئية - 7 فئات
// ═══════════════════════════════════════
type CollegeRow = { name?: string; program?: string; fees: number; percentage: number | null; afterGrant: number | null; note?: string };

export const partialScholarships = [
  {
    id: 1,
    rank: "الأولى",
    title: "منحة التميز",
    percentage: 40,
    color: "#6CAEBD",
    description:
      "تشمل المنحة 40% من الرسوم الدراسية لجميع الكليات (30% لكلية الطب)، شروطها: نسبة 95% للطب، المحافظة: معدل 4.25/5 في الطب، 3.75/5 في باقي الكليات.",
    colleges: [
      { name: "السنة التأسيسية (كلية الطب)", fees: 35000, percentage: 40,  afterGrant: 24500 },
      { name: "كلية الطب (سنة كاملة)",       fees: 90000, percentage: 30,  afterGrant: 63000 },
      { name: "كلية التمريض",                fees: 30000, percentage: 40,  afterGrant: 18000 },
      { name: "كلية العلوم التطبيقية",        fees: 25000, percentage: 40,  afterGrant: 15000 },
      { name: "كلية سليمان الراجحي للأعمال", fees: 20000, percentage: 40,  afterGrant: 12000 },
    ] as CollegeRow[],
    note: null as string | null,
  },
  {
    id: 2,
    rank: "الثانية",
    title: "منحة التحويل وحملة الدبلوم",
    percentage: 20,
    color: "#875E9E",
    description:
      "منح الطلاب المحولين من جامعات أخرى، وطلاب حملة الدبلوم. شروط البقاء: معدل لا يقل عن 3.75/5 لكلية الطب، و2.75/5 لباقي الكليات.",
    colleges: [
      { name: "السنة التأسيسية (كلية الطب)", fees: 35000, percentage: 20,  afterGrant: 28000 },
      { name: "كلية الطب",                   fees: 90000, percentage: 20,  afterGrant: 72000 },
      { name: "كلية التمريض",                fees: 30000, percentage: 40,  afterGrant: 18000 },
      { name: "كلية العلوم التطبيقية",        fees: 25000, percentage: 40,  afterGrant: 15000 },
      { name: "كلية سليمان الراجحي للأعمال", fees: 20000, percentage: 40,  afterGrant: 12000 },
    ] as CollegeRow[],
    note: null as string | null,
  },
  {
    id: 3,
    rank: "الثالثة",
    title: "منحة الطموح",
    percentage: 30,
    color: "#6CAEBD",
    description:
      "تشمل المنحة 30% من الرسوم لجميع الكليات (20% لكلية الطب)، شروط: نسبة 90% للطب. يجب الالتزام بشروط المحافظة المحددة.",
    colleges: [
      { name: "السنة التأسيسية (كلية الطب)", fees: 35000, percentage: 20,  afterGrant: 28000 },
      { name: "كلية الطب",                   fees: 90000, percentage: 20,  afterGrant: 72000 },
      { name: "كلية التمريض",                fees: 30000, percentage: 30,  afterGrant: 21000 },
      { name: "كلية العلوم التطبيقية",        fees: 25000, percentage: 30,  afterGrant: 17500 },
      { name: "كلية سليمان الراجحي للأعمال", fees: 20000, percentage: 30,  afterGrant: 14000 },
    ] as CollegeRow[],
    note: null as string | null,
  },
  {
    id: 4,
    rank: "الرابعة",
    title: "منحة التعليم الدولي",
    percentage: 30,
    color: "#875E9E",
    description:
      "منحة للطلاب الدوليين القادمين من خارج المملكة، بشرط الالتزام بجميع الضوابط السارية وتحقيق نسبة قبول 70%.",
    colleges: [
      { name: "السنة التأسيسية (كلية الطب)", fees: 35000, percentage: 20,  afterGrant: 28000 },
      { name: "كلية الطب",                   fees: 90000, percentage: 20,  afterGrant: 72000 },
      { name: "كلية التمريض",                fees: 30000, percentage: 30,  afterGrant: 21000 },
      { name: "كلية العلوم التطبيقية",        fees: 25000, percentage: 30,  afterGrant: 17500 },
      { name: "كلية سليمان الراجحي للأعمال", fees: 20000, percentage: 30,  afterGrant: 14000 },
    ] as CollegeRow[],
    note: null as string | null,
  },
  {
    id: 5,
    rank: "الخامسة",
    title: "منحة وقف الشيخ سليمان الراجحي",
    percentage: 40,
    color: "#6CAEBD",
    description:
      "منح منسوبي وقف الشيخ سليمان الراجحي وأبنائهم. شرط المحافظة: معدل مقبول سنوي 3/5 في جميع الكليات.",
    colleges: [
      { name: "السنة التأسيسية (كلية الطب)", fees: 35000, percentage: 20,  afterGrant: 28000 },
      { name: "كلية الطب",                   fees: 90000, percentage: 20,  afterGrant: 72000 },
      { name: "كلية التمريض",                fees: 30000, percentage: 40,  afterGrant: 18000 },
      { name: "كلية العلوم التطبيقية",        fees: 25000, percentage: 40,  afterGrant: 15000 },
      { name: "كلية سليمان الراجحي للأعمال", fees: 20000, percentage: 40,  afterGrant: 12000 },
    ] as CollegeRow[],
    note: "⚠️ ينتقل الطالب بعد الفصل الدراسي الأول إلى المنحة الجزئية التي تتحقق شروطها.",
  },
  {
    id: 6,
    rank: "السادسة",
    title: "منحة الماجستير",
    percentage: 30,
    color: "#875E9E",
    description:
      "منح مقدمة لطلاب الماجستير ذوي الخلفية الأكاديمية المتميزة. تشمل برامج ماجستير علم النفس التربوي، والاقتصاد التنموي، وإدارة الأعمال التنفيذي.",
    colleges: [
      { program: "ماجستير علم النفس التربوي (منسوبو الجامعة)",    fees: 90000, percentage: 30, afterGrant: 63000 },
      { program: "ماجستير علم النفس التربوي (سداد فوري – مورا)",  fees: 90000, percentage: 25, afterGrant: 67500 },
      { program: "ماجستير الاقتصاد التنموي (منسوبو الجامعة)",    fees: 90000, percentage: 30, afterGrant: 63000 },
      { program: "ماجستير إدارة الأعمال التنفيذي",                fees: 90000, percentage: null, afterGrant: null, note: "انظر المكتب" },
    ] as CollegeRow[],
    note: null as string | null,
  },
  {
    id: 7,
    rank: "السابعة",
    title: "منحة السداد المبكر",
    percentage: 10,
    color: "#8FA4AB",
    description:
      "نسبة 10% لجميع كليات البكالوريوس لمن لا يحقق شروط المنح الأكاديمية. لا يمكن الجمع بين هذه المنحة وأي منحة أخرى.",
    colleges: [
      { name: "السنة التأسيسية (كلية الطب)", fees: 35000, percentage: 10,  afterGrant: 31500 },
      { name: "كلية الطب",                   fees: 90000, percentage: 10,  afterGrant: 81000 },
      { name: "كلية التمريض",                fees: 30000, percentage: 10,  afterGrant: 27000 },
      { name: "كلية العلوم التطبيقية",        fees: 25000, percentage: 10,  afterGrant: 22500 },
      { name: "كلية سليمان الراجحي للأعمال", fees: 20000, percentage: 10,  afterGrant: 18000 },
    ] as CollegeRow[],
    note: "⚠️ متاحة لمرحلة البكالوريوس فقط. لا يمكن الجمع بينها وأي منحة أخرى.",
  },
];

// ═══════════════════════════════════════
// الشروط العامة
// ═══════════════════════════════════════
export const generalTerms = [
  { icon: "🚫", title: "عدم الجمع بين المنح",    description: "لا يمكن الجمع بين أكثر من منحة واحدة. في حال استحقاق أكثر من منحة تُطبَّق المنحة الأعلى." },
  { icon: "📋", title: "تغطية المنحة",           description: "تغطي المنحة الرسوم الدراسية فقط، ولا تشمل رسوم السكن أو الوجبات أو المستلزمات أو رسوم التدريب." },
  { icon: "⚠️", title: "الانقطاع عن الدراسة",   description: "تتوقف المنحة في حال انقطاع الطالب لأسباب غير طبية، وتُعاد في السنة الأكاديمية التالية وفقاً للشروط." },
  { icon: "🎓", title: "الالتحاق بالأقدمية",     description: "تُقيَّم نسبة الأقدمية عند التعادل في المنافسة على المنح." },
  { icon: "💰", title: "الرسوم الدراسية",        description: "تُحتسب المنحة لكل فصل على حدة. رسوم الفصل الصيفي تُعامَل كفصل دراسي مستقل." },
  { icon: "📝", title: "التقديم على المنحة",     description: "يتم التقديم في بداية كل عام دراسي عبر مكتب الصندوق والحلول المالية أو البريد الإلكتروني الرسمي." },
];

// ═══════════════════════════════════════
// رحلة التقديم
// ═══════════════════════════════════════
export const applicationJourney = [
  { step: 1, actor: "الطالب", title: "التأكد من الاستيفاء",             description: "مراجعة متطلبات التقديم وتجهيز الأوراق المطلوبة" },
  { step: 2, actor: "الطالب", title: "تقديم طلب المنحة",               description: "إرسال الطلب عبر البوابة أو البريد الإلكتروني" },
  { step: 3, actor: "المكتب", title: "تقديم المستندات التكميلية",       description: "إتمام الإجراءات الإدارية من قِبَل المكتب" },
  { step: 4, actor: "المكتب", title: "مراجعة الأهلية وإصدار القرار",   description: "منح المنحة رسمياً للطالب المستحق" },
  { step: 5, actor: "الطالب", title: "الاستمتاع بالمنحة والمحافظة عليها", description: "الاستمرار في التفوق الأكاديمي للحفاظ على المنحة" },
];

// ═══════════════════════════════════════
// الحلول التمويلية
// ═══════════════════════════════════════
export const fundingSolutions = [
  {
    id: 1,
    name: "جيل باي",
    logo: "JeelPay",
    tagline: "تقسيط الرسوم على 12 شهراً",
    color: "#6CAEBD",
    description:
      "يُقدِّم جيل باي حلولاً تمويلية مباشرة للطلاب المسجلين في جامعة سليمان الراجحي، تتيح تقسيط الرسوم الدراسية على مدى 12 شهراً.",
    features: [
      "تقسيط الرسوم على 12 شهراً بدون فوائد",
      "بدون رسوم إدارية",
      "موافقة فورية عند استيفاء الشروط",
      "خدمة متاحة لجميع التخصصات",
    ],
    contact: { website: "www.jeelpay.com", email: "support@jeelpay.com" },
  },
  {
    id: 2,
    name: "صندوق مسالك التمويلي",
    logo: "Masalik",
    tagline: "تمويل ميسر حتى ما بعد التخرج",
    color: "#875E9E",
    description:
      "يُقدِّم الصندوق حلولاً تمويلية مباشرة للطلاب، تتيح تقسيط الرسوم على فترة تمتد حتى ما بعد التخرج.",
    features: [
      "تمديد فترة السداد إلى ما بعد التخرج",
      "بدون رسوم إدارية مُقيِّدة",
      "يشمل رسوم جميع الكليات والبرامج",
      "التقديم في بداية كل عام دراسي",
    ],
    contact: { phone: "920002054", email: "info@rdf.org.sa" },
  },
];

// ═══════════════════════════════════════
// حالة طلب الطالب الحالي
// ═══════════════════════════════════════
export const myScholarshipStatus = {
  hasActiveScholarship: true,
  scholarship: {
    title:      "منحة التميز",
    type:       "partial",
    percentage: 40,
    college:    "كلية سليمان الراجحي للأعمال",
    feesOrigin: 20000,
    discount:    8000,
    feesAfter:  12000,
    year:       "1447هـ",
    status:     "active",
  },
  applicationHistory: [
    { id: "SCH-2026-001", type: "منحة التميز",  year: "1447هـ", status: "approved", date: "2026-02-01" },
    { id: "SCH-2025-001", type: "منحة التميز",  year: "1446هـ", status: "approved", date: "2025-09-01" },
    { id: "SCH-2024-001", type: "منحة الطموح", year: "1445هـ", status: "approved", date: "2024-09-01" },
  ],
};
