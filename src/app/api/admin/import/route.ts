import { NextRequest, NextResponse } from "next/server";
import * as XLSX from "xlsx";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";

export const dynamic = "force-dynamic";

type FailedRow = { row: number; reason: string };
type ImportResult = { succeeded: number; failed: FailedRow[] };

function str(val: unknown, fallback = ""): string {
  if (val == null) return fallback;
  return String(val).trim();
}

function parseDate(val: unknown): Date | undefined {
  if (!val) return undefined;
  if (val instanceof Date) return isNaN(val.getTime()) ? undefined : val;
  if (typeof val === "number") {
    const d = new Date(Math.round((val - 25569) * 86400 * 1000));
    return isNaN(d.getTime()) ? undefined : d;
  }
  if (typeof val === "string" && val.trim()) {
    const d = new Date(val.trim());
    return isNaN(d.getTime()) ? undefined : d;
  }
  return undefined;
}

function parseInt_(val: unknown): number | undefined {
  if (val == null || val === "") return undefined;
  const n = parseInt(String(val), 10);
  return isNaN(n) ? undefined : n;
}

function parseFloat_(val: unknown): number | undefined {
  if (val == null || val === "") return undefined;
  const n = parseFloat(String(val));
  return isNaN(n) ? undefined : n;
}

const VALID_ROLES    = ["STUDENT", "FACULTY", "ADMIN", "ORGANIZER", "SUBADMIN"] as const;
const VALID_GENDERS  = ["MALE", "FEMALE"] as const;
const VALID_TRAINING = ["UPCOMING", "ONGOING", "COMPLETED", "CANCELLED"] as const;

async function importUsers(rows: Record<string, unknown>[]): Promise<ImportResult> {
  let succeeded = 0;
  const failed: FailedRow[] = [];

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const rowNum = i + 2;

    const name    = str(row.name);
    const email   = str(row.email).toLowerCase();
    const pwd     = str(row.password);
    const role    = str(row.role, "STUDENT").toUpperCase();
    const gender  = row.gender ? str(row.gender).toUpperCase() : null;

    if (!name)                          { failed.push({ row: rowNum, reason: "حقل الاسم مطلوب" }); continue; }
    if (!email)                         { failed.push({ row: rowNum, reason: "حقل البريد الإلكتروني مطلوب" }); continue; }
    if (!pwd)                           { failed.push({ row: rowNum, reason: "حقل كلمة المرور مطلوب" }); continue; }
    if (!VALID_ROLES.includes(role as typeof VALID_ROLES[number])) {
      failed.push({ row: rowNum, reason: `الدور غير صحيح: ${role} — القيم المقبولة: ${VALID_ROLES.join(", ")}` }); continue;
    }
    if (gender && !VALID_GENDERS.includes(gender as typeof VALID_GENDERS[number])) {
      failed.push({ row: rowNum, reason: `الجنس غير صحيح: ${gender} — القيم المقبولة: MALE, FEMALE` }); continue;
    }

    try {
      const hashed = await bcrypt.hash(pwd, 10);
      await prisma.user.create({
        data: {
          name, email, password: hashed,
          role:   role as "STUDENT" | "FACULTY" | "ADMIN" | "ORGANIZER" | "SUBADMIN",
          gender: gender as "MALE" | "FEMALE" | null,
        },
      });
      succeeded++;
    } catch (e: unknown) {
      const code = (e as { code?: string }).code;
      failed.push({ row: rowNum, reason: code === "P2002" ? "البريد الإلكتروني موجود مسبقاً" : "خطأ في الإدراج" });
    }
  }
  return { succeeded, failed };
}

async function importScholarships(rows: Record<string, unknown>[]): Promise<ImportResult> {
  let succeeded = 0;
  const failed: FailedRow[] = [];

  for (let i = 0; i < rows.length; i++) {
    const row    = rows[i];
    const rowNum = i + 2;
    const title  = str(row.title);
    if (!title) { failed.push({ row: rowNum, reason: "حقل العنوان مطلوب" }); continue; }

    try {
      await prisma.scholarship.create({
        data: {
          title,
          description: str(row.description) || null,
          amount:      parseFloat_(row.amount),
          deadline:    parseDate(row.deadline),
        },
      });
      succeeded++;
    } catch { failed.push({ row: rowNum, reason: "خطأ في الإدراج" }); }
  }
  return { succeeded, failed };
}

async function importTraining(rows: Record<string, unknown>[]): Promise<ImportResult> {
  let succeeded = 0;
  const failed: FailedRow[] = [];

  for (let i = 0; i < rows.length; i++) {
    const row    = rows[i];
    const rowNum = i + 2;
    const title  = str(row.title);
    const status = str(row.status, "UPCOMING").toUpperCase();

    if (!title)                                                                                  { failed.push({ row: rowNum, reason: "حقل العنوان مطلوب" }); continue; }
    if (!VALID_TRAINING.includes(status as typeof VALID_TRAINING[number]))                       { failed.push({ row: rowNum, reason: `الحالة غير صحيحة: ${status}` }); continue; }

    try {
      await prisma.training.create({
        data: {
          title,
          description: str(row.description) || null,
          instructor:  str(row.instructor)  || null,
          category:    str(row.category)    || null,
          capacity:    parseInt_(row.capacity),
          startDate:   parseDate(row.startDate),
          endDate:     parseDate(row.endDate),
          status:      status as "UPCOMING" | "ONGOING" | "COMPLETED" | "CANCELLED",
        },
      });
      succeeded++;
    } catch { failed.push({ row: rowNum, reason: "خطأ في الإدراج" }); }
  }
  return { succeeded, failed };
}

async function importStudentActivity(rows: Record<string, unknown>[]): Promise<ImportResult> {
  let succeeded = 0;
  const failed: FailedRow[] = [];
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i]; const rowNum = i + 2;
    const title = str(row.title);
    if (!title) { failed.push({ row: rowNum, reason: "حقل العنوان مطلوب" }); continue; }
    try {
      await prisma.studentActivity.create({ data: { title, description: str(row.description) || null, date: parseDate(row.date) } });
      succeeded++;
    } catch { failed.push({ row: rowNum, reason: "خطأ في الإدراج" }); }
  }
  return { succeeded, failed };
}

async function importVolunteerOpportunity(rows: Record<string, unknown>[]): Promise<ImportResult> {
  let succeeded = 0;
  const failed: FailedRow[] = [];
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i]; const rowNum = i + 2;
    const title = str(row.title);
    if (!title) { failed.push({ row: rowNum, reason: "حقل العنوان مطلوب" }); continue; }
    try {
      await prisma.volunteerOpportunity.create({ data: { title, description: str(row.description) || null, date: parseDate(row.date) } });
      succeeded++;
    } catch { failed.push({ row: rowNum, reason: "خطأ في الإدراج" }); }
  }
  return { succeeded, failed };
}

async function importStudentService(rows: Record<string, unknown>[]): Promise<ImportResult> {
  let succeeded = 0;
  const failed: FailedRow[] = [];
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i]; const rowNum = i + 2;
    const title = str(row.title);
    if (!title) { failed.push({ row: rowNum, reason: "حقل العنوان مطلوب" }); continue; }
    try {
      await prisma.studentService.create({ data: { title, description: str(row.description) || null } });
      succeeded++;
    } catch { failed.push({ row: rowNum, reason: "خطأ في الإدراج" }); }
  }
  return { succeeded, failed };
}

async function importFinancialSolution(rows: Record<string, unknown>[]): Promise<ImportResult> {
  let succeeded = 0;
  const failed: FailedRow[] = [];
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i]; const rowNum = i + 2;
    const title = str(row.title);
    if (!title) { failed.push({ row: rowNum, reason: "حقل العنوان مطلوب" }); continue; }
    try {
      await prisma.financialSolution.create({ data: { title, description: str(row.description) || null } });
      succeeded++;
    } catch { failed.push({ row: rowNum, reason: "خطأ في الإدراج" }); }
  }
  return { succeeded, failed };
}

async function importPartnerCompany(rows: Record<string, unknown>[]): Promise<ImportResult> {
  let succeeded = 0;
  const failed: FailedRow[] = [];
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i]; const rowNum = i + 2;
    const name = str(row.name);
    if (!name) { failed.push({ row: rowNum, reason: "حقل الاسم مطلوب" }); continue; }
    try {
      await prisma.partnerCompany.create({
        data: { name, description: str(row.description) || null, logoUrl: str(row.logoUrl) || null, website: str(row.website) || null },
      });
      succeeded++;
    } catch (e: unknown) {
      const code = (e as { code?: string }).code;
      failed.push({ row: rowNum, reason: code === "P2002" ? "الاسم موجود مسبقاً" : "خطأ في الإدراج" });
    }
  }
  return { succeeded, failed };
}

const IMPORTERS: Record<string, (rows: Record<string, unknown>[]) => Promise<ImportResult>> = {
  Users:                importUsers,
  Scholarships:         importScholarships,
  Training:             importTraining,
  StudentActivity:      importStudentActivity,
  VolunteerOpportunity: importVolunteerOpportunity,
  StudentService:       importStudentService,
  FinancialSolution:    importFinancialSolution,
  PartnerCompany:       importPartnerCompany,
};

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session?.userId || session.role !== "ADMIN") {
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "فشل في قراءة بيانات الطلب" }, { status: 400 });
  }

  const file   = formData.get("file")   as File   | null;
  const sheet  = formData.get("sheet")  as string | null;
  const action = formData.get("action") as string | null;

  if (!file || !sheet)         return NextResponse.json({ error: "الملف ونوع البيانات مطلوبان" }, { status: 400 });
  if (!IMPORTERS[sheet])       return NextResponse.json({ error: `نوع البيانات غير مدعوم: ${sheet}` }, { status: 400 });
  if (!file.name.endsWith(".xlsx"))
    return NextResponse.json({ error: "يرجى رفع ملف Excel بصيغة .xlsx فقط" }, { status: 400 });

  let buffer: ArrayBuffer;
  try { buffer = await file.arrayBuffer(); }
  catch { return NextResponse.json({ error: "فشل في قراءة الملف" }, { status: 400 }); }

  let workbook: XLSX.WorkBook;
  try { workbook = XLSX.read(new Uint8Array(buffer), { type: "array", cellDates: true }); }
  catch { return NextResponse.json({ error: "الملف غير صالح أو تالف" }, { status: 400 }); }

  const sheetName = workbook.SheetNames.find((n) => n === sheet) ?? workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  if (!worksheet) return NextResponse.json({ error: "الملف لا يحتوي على بيانات" }, { status: 400 });

  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(worksheet, { defval: null });
  if (rows.length === 0) return NextResponse.json({ error: "لا توجد صفوف بيانات في الملف" }, { status: 400 });

  if (action === "preview") {
    return NextResponse.json({
      rows:    rows.slice(0, 5).map((r) =>
        Object.fromEntries(Object.entries(r).map(([k, v]) => [k, v instanceof Date ? v.toLocaleDateString("en-CA") : v]))
      ),
      columns: Object.keys(rows[0]),
      total:   rows.length,
    });
  }

  const result = await IMPORTERS[sheet](rows);
  return NextResponse.json({ sheet, ...result });
}
