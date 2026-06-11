export type PayStatus = "confirmed" | "pending" | "failed";
export type InvStatus = "paid" | "partial" | "unpaid" | "overdue";
export type ReqStatus = "approved" | "rejected" | "pending" | "completed";
export type AlertType = "urgent" | "warning" | "success" | "info";

// ═══════════════════════════
// المستخدمون
// ═══════════════════════════
export const mockStudent = {
  id: "S-44210",
  name: "علي أحمد القحطاني",
  major: "علوم الحاسب",
  year: 3,
  semester: "الفصل الثاني 1446-1447",
  guardian: {
    name: "أحمد القحطاني",
    relation: "الأب",
    phone: "05xxxxxxxx",
  },
};

// ═══════════════════════════
// ملخص الحساب المالي
// ═══════════════════════════
export const financialSummary = {
  totalFees:  18500,
  paid:       12000,
  remaining:   6500,
  dueDate:    "2026-06-20",
  status:     "partial" as InvStatus,
  currency:   "ريال",
};

// ═══════════════════════════
// الرسوم الدراسية - تفاصيل
// ═══════════════════════════
export const tuitionDetails = [
  { id: 1, item: "الساعات الدراسية (15 ساعة)", amount: 15000, status: "partial" as InvStatus, paid: 10000, remaining:  5000 },
  { id: 2, item: "رسوم التسجيل",                amount:   500, status: "paid"    as InvStatus, paid:   500, remaining:     0 },
  { id: 3, item: "رسوم المختبرات",               amount:   800, status: "paid"    as InvStatus, paid:   800, remaining:     0 },
  { id: 4, item: "رسوم الأنشطة الطلابية",        amount:   200, status: "unpaid"  as InvStatus, paid:     0, remaining:   200 },
  { id: 5, item: "رسوم الخدمات الإلكترونية",     amount:   300, status: "unpaid"  as InvStatus, paid:     0, remaining:   300 },
  { id: 6, item: "التأمين الصحي",                amount:   700, status: "paid"    as InvStatus, paid:   700, remaining:     0 },
  { id: 7, item: "رسوم المكتبة",                 amount:   200, status: "unpaid"  as InvStatus, paid:     0, remaining:   200 },
  { id: 8, item: "رسوم الحافلات",               amount:   800, status: "partial"  as InvStatus, paid:   500, remaining:   300 },
];

// ═══════════════════════════
// سجل المدفوعات
// ═══════════════════════════
export const paymentsHistory = [
  { id: "PAY-2026-0041", date: "2026-05-10", amount: 5000, method: "تحويل بنكي",   bank: "بنك الراجحي",  reference: "TXN884521", status: "confirmed" as PayStatus },
  { id: "PAY-2026-0028", date: "2026-04-01", amount: 4000, method: "نقطة البيع",   bank: "بنك الأهلي",   reference: "TXN771234", status: "confirmed" as PayStatus },
  { id: "PAY-2026-0015", date: "2026-03-15", amount: 2000, method: "بطاقة ائتمان", bank: "بنك سامبا",    reference: "TXN662198", status: "confirmed" as PayStatus },
  { id: "PAY-2026-0003", date: "2026-02-20", amount: 1000, method: "تحويل بنكي",   bank: "بنك الراجحي",  reference: "TXN559871", status: "confirmed" as PayStatus },
  { id: "PAY-2025-0091", date: "2025-12-05", amount: 3500, method: "تحويل بنكي",   bank: "البنك الوطني", reference: "TXN448832", status: "confirmed" as PayStatus },
  { id: "PAY-2025-0074", date: "2025-11-01", amount: 2000, method: "نقطة البيع",   bank: "بنك الراجحي",  reference: "TXN337741", status: "confirmed" as PayStatus },
];

// ═══════════════════════════
// الفواتير والإيصالات
// ═══════════════════════════
export const invoices = [
  {
    id:        "INV-2026-001",
    title:     "رسوم الفصل الثاني 1446-1447",
    issueDate: "2026-02-01",
    dueDate:   "2026-06-20",
    amount:    18500,
    paid:      12000,
    remaining:  6500,
    status:    "partial" as InvStatus,
    items:     tuitionDetails,
  },
  {
    id:        "INV-2025-002",
    title:     "رسوم الفصل الأول 1446-1447",
    issueDate: "2025-09-01",
    dueDate:   "2026-01-15",
    amount:    17800,
    paid:      17800,
    remaining:     0,
    status:    "paid" as InvStatus,
    items:     [] as typeof tuitionDetails,
  },
  {
    id:        "INV-2025-001",
    title:     "رسوم الفصل الثاني 1445-1446",
    issueDate: "2025-02-01",
    dueDate:   "2025-06-15",
    amount:    16500,
    paid:      16500,
    remaining:     0,
    status:    "paid" as InvStatus,
    items:     [] as typeof tuitionDetails,
  },
];

// ═══════════════════════════
// الطلبات المالية
// ═══════════════════════════
export const financialRequests = [
  { id: "FREQ-2026-008", type: "تقسيط الرسوم",  date: "2026-05-20", amount: 6500, status: "approved"  as ReqStatus, note: "تمت الموافقة - 3 أقساط متساوية" },
  { id: "FREQ-2026-003", type: "إعفاء جزئي",    date: "2026-03-10", amount: 2000, status: "rejected"  as ReqStatus, note: "لا يستوفي شروط الإعفاء" },
  { id: "FREQ-2025-021", type: "استرداد رسوم",  date: "2025-11-05", amount:  500, status: "completed" as ReqStatus, note: "تم الاسترداد بتاريخ 2025-11-20" },
];

// ═══════════════════════════
// أنواع الطلبات المتاحة
// ═══════════════════════════
export const requestTypes = [
  { id: 1, label: "تقسيط الرسوم الدراسية",  icon: "📅", description: "طلب تقسيط المبلغ المتبقي على دفعات" },
  { id: 2, label: "إعفاء من الرسوم",        icon: "🎓", description: "طلب إعفاء كلي أو جزئي بسبب التفوق أو الظروف" },
  { id: 3, label: "استرداد رسوم",           icon: "↩️", description: "طلب استرداد مبالغ مدفوعة بالزيادة" },
  { id: 4, label: "تأجيل موعد السداد",      icon: "⏳", description: "طلب تمديد الموعد النهائي للسداد" },
  { id: 5, label: "شهادة سداد",             icon: "📄", description: "طلب وثيقة تثبت إتمام السداد" },
  { id: 6, label: "كشف حساب",              icon: "📊", description: "طلب كشف حساب مالي مفصّل" },
];

// ═══════════════════════════
// التنبيهات المالية
// ═══════════════════════════
export const financialAlerts = [
  { id: 1, type: "urgent"  as AlertType, title: "آخر موعد سداد الرسوم",         detail: "المبلغ المتبقي 6,500 ريال",       daysLeft: 10,   date: "2026-06-20" },
  { id: 2, type: "warning" as AlertType, title: "موعد القسط الثاني قادم",        detail: "مبلغ القسط 2,167 ريال",           daysLeft: 20,   date: "2026-06-30" },
  { id: 3, type: "success" as AlertType, title: "تم تأكيد دفعتك الأخيرة",       detail: "مبلغ 5,000 ريال بتاريخ 10/5",    daysLeft: null, date: "2026-05-10" },
  { id: 4, type: "info"    as AlertType, title: "فتح باب التسجيل للفصل القادم", detail: "تأكد من استيفاء شروط السداد",     daysLeft: null, date: "2026-06-08" },
];
