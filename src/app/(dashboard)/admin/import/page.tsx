"use client";
import { useState, useRef, useCallback, useEffect } from "react";
import Link from "next/link";

const SHEETS = [
  { key: "Users",                label: "المستخدمون",         icon: "👥", required: "name, email, password",  note: "role: STUDENT|FACULTY|ADMIN|ORGANIZER|SUBADMIN · gender: MALE|FEMALE"       },
  { key: "Scholarships",         label: "المنح الدراسية",     icon: "🎓", required: "title",                   note: "amount: رقم · deadline: YYYY-MM-DD"                                           },
  { key: "Training",             label: "التدريب التعاوني",   icon: "🏢", required: "title",                   note: "status: UPCOMING|ONGOING|COMPLETED|CANCELLED · startDate/endDate: YYYY-MM-DD" },
  { key: "StudentActivity",      label: "الأنشطة الطلابية",  icon: "🎯", required: "title",                   note: "date: YYYY-MM-DD (اختياري)"                                                   },
  { key: "VolunteerOpportunity", label: "فرص التطوع",         icon: "🌱", required: "title",                   note: "date: YYYY-MM-DD (اختياري)"                                                   },
  { key: "StudentService",       label: "الخدمات الطلابية",  icon: "🛎️", required: "title",                   note: "description: اختياري"                                                         },
  { key: "FinancialSolution",    label: "الحلول المالية",     icon: "💳", required: "title",                   note: "description: اختياري"                                                         },
  { key: "PartnerCompany",       label: "شركاء التدريب",      icon: "🤝", required: "name",                    note: "description, logoUrl, website: اختيارية"                                      },
] as const;

type SheetKey = (typeof SHEETS)[number]["key"];
type Phase = "idle" | "file-selected" | "previewing" | "importing" | "done" | "error";

type PreviewData = {
  rows:    Record<string, unknown>[];
  columns: string[];
  total:   number;
};

type ImportResult = {
  succeeded: number;
  failed:    { row: number; reason: string }[];
};

export default function AdminImportPage() {
  const [selectedSheet, setSelectedSheet] = useState<SheetKey>("Users");
  const [phase, setPhase]                 = useState<Phase>("idle");
  const [file, setFile]                   = useState<File | null>(null);
  const [dragging, setDragging]           = useState(false);
  const [preview, setPreview]             = useState<PreviewData | null>(null);
  const [result, setResult]               = useState<ImportResult | null>(null);
  const [error, setError]                 = useState<string | null>(null);
  const [progress, setProgress]           = useState(0);
  const fileInputRef                      = useRef<HTMLInputElement>(null);

  const sheetInfo = SHEETS.find((s) => s.key === selectedSheet)!;

  // Fake progress bar during import
  useEffect(() => {
    if (phase !== "importing") return;
    setProgress(0);
    const iv = setInterval(() => {
      setProgress((p) => {
        if (p >= 88) { clearInterval(iv); return 88; }
        return p + Math.random() * 6;
      });
    }, 180);
    return () => clearInterval(iv);
  }, [phase]);

  useEffect(() => {
    if (phase === "done") setProgress(100);
  }, [phase]);

  const reset = () => {
    setPhase("idle");
    setFile(null);
    setPreview(null);
    setResult(null);
    setError(null);
    setProgress(0);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const processFile = useCallback(async (f: File) => {
    if (!f.name.endsWith(".xlsx")) {
      setError("يرجى رفع ملف Excel بصيغة .xlsx فقط");
      setPhase("error");
      return;
    }

    setFile(f);
    setPhase("previewing");
    setError(null);

    const fd = new FormData();
    fd.append("file", f);
    fd.append("sheet", selectedSheet);
    fd.append("action", "preview");

    try {
      const res  = await fetch("/api/admin/import", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "خطأ في معالجة الملف"); setPhase("error"); return; }
      setPreview(data);
      setPhase("file-selected");
    } catch {
      setError("خطأ في الاتصال بالخادم");
      setPhase("error");
    }
  }, [selectedSheet]);

  const handleImport = async () => {
    if (!file) return;
    setPhase("importing");

    const fd = new FormData();
    fd.append("file", file);
    fd.append("sheet", selectedSheet);
    fd.append("action", "import");

    try {
      const res  = await fetch("/api/admin/import", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "خطأ في الاستيراد"); setPhase("error"); return; }
      setResult(data);
      setPhase("done");
    } catch {
      setError("خطأ في الاتصال بالخادم");
      setPhase("error");
    }
  };

  const handleDragOver  = (e: React.DragEvent) => { e.preventDefault(); setDragging(true);  };
  const handleDragLeave = ()                      => setDragging(false);
  const handleDrop      = (e: React.DragEvent)   => {
    e.preventDefault(); setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) processFile(f);
  };

  return (
    <div className="space-y-6 max-w-4xl">

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Link href="/admin" className="hover:text-green-600 transition-colors">لوحة التحكم</Link>
        <span>/</span>
        <span className="text-gray-800 font-medium">استيراد البيانات</span>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-gray-900">استيراد بيانات Excel</h1>
        <p className="text-gray-500 text-sm mt-0.5">استورد بيانات الجداول من ملفات Excel (.xlsx)</p>
      </div>

      {/* Sheet selector */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="font-semibold text-gray-800 text-sm mb-3">1. اختر نوع البيانات</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {SHEETS.map((s) => (
            <button
              key={s.key}
              onClick={() => { setSelectedSheet(s.key); reset(); }}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-right ${
                selectedSheet === s.key
                  ? "bg-green-600 text-white shadow-sm"
                  : "bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              <span className="shrink-0">{s.icon}</span>
              <span className="truncate leading-tight">{s.label}</span>
            </button>
          ))}
        </div>

        {/* Selected sheet info */}
        <div className="mt-3 p-3 rounded-lg bg-green-50 border border-green-200 flex items-start justify-between gap-3 flex-wrap">
          <div>
            <p className="text-xs text-green-700 font-medium">
              {sheetInfo.icon} {sheetInfo.label} — الحقول المطلوبة: <code className="bg-green-100 px-1 rounded">{sheetInfo.required}</code>
            </p>
            <p className="text-xs text-green-600 mt-0.5">{sheetInfo.note}</p>
          </div>
          <a
            href={`/api/admin/import/template?sheet=${selectedSheet}`}
            className="shrink-0 flex items-center gap-1.5 text-xs font-semibold text-green-700 bg-white border border-green-300 px-3 py-1.5 rounded-lg hover:bg-green-50 transition-colors"
            download
          >
            ⬇️ تحميل القالب
          </a>
        </div>
      </div>

      {/* Upload zone — shown only on idle / error phases */}
      {(phase === "idle" || phase === "error") && (
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="font-semibold text-gray-800 text-sm mb-3">2. ارفع ملف Excel</h2>

          {error && (
            <div className="mb-3 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
              <span>⚠️</span> {error}
            </div>
          )}

          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`relative flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-10 cursor-pointer transition-all ${
              dragging
                ? "border-green-500 bg-green-50"
                : "border-gray-300 bg-gray-50 hover:border-green-400 hover:bg-green-50/50"
            }`}
          >
            <div className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl transition-all ${dragging ? "bg-green-100" : "bg-gray-100"}`}>
              📂
            </div>
            <div className="text-center">
              <p className="font-semibold text-gray-700 text-sm">اسحب وأفلت ملف Excel هنا</p>
              <p className="text-gray-400 text-xs mt-1">أو انقر لاختيار الملف · يدعم .xlsx فقط</p>
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx"
            className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) processFile(f); }}
          />
        </div>
      )}

      {/* Preview phase */}
      {phase === "previewing" && (
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-full border-2 border-green-600 border-t-transparent animate-spin shrink-0" />
            <p className="text-sm text-gray-600">جارٍ تحليل الملف...</p>
          </div>
        </div>
      )}

      {/* File selected → show preview + confirm */}
      {phase === "file-selected" && preview && file && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between gap-4 flex-wrap">
            <div>
              <h2 className="font-semibold text-gray-800 text-sm">معاينة البيانات</h2>
              <p className="text-xs text-gray-400 mt-0.5">
                📄 {file.name} · {sheetInfo.icon} {sheetInfo.label} · إجمالي الصفوف: <span className="font-semibold text-gray-700">{preview.total}</span>
                {preview.total > 5 && <span className="text-gray-400"> (تظهر أول 5 صفوف)</span>}
              </p>
            </div>
            <button onClick={reset} className="text-xs text-gray-400 hover:text-gray-600 transition-colors">
              ✕ إلغاء
            </button>
          </div>

          {/* Preview table */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-3 py-2.5 text-right font-semibold text-gray-500 w-10">#</th>
                  {preview.columns.map((col) => (
                    <th key={col} className="px-3 py-2.5 text-right font-semibold text-gray-600 whitespace-nowrap">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {preview.rows.map((row, i) => (
                  <tr key={i} className="hover:bg-gray-50 transition-colors">
                    <td className="px-3 py-2.5 text-gray-400 text-center">{i + 2}</td>
                    {preview.columns.map((col) => (
                      <td key={col} className="px-3 py-2.5 text-gray-700 whitespace-nowrap max-w-[180px] truncate">
                        {row[col] != null ? String(row[col]) : <span className="text-gray-300 italic">فارغ</span>}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="px-5 py-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between gap-3">
            <p className="text-xs text-gray-500">
              سيتم استيراد <span className="font-bold text-gray-700">{preview.total}</span> صف إلى جدول <span className="font-bold text-gray-700">{sheetInfo.label}</span>
            </p>
            <div className="flex gap-2">
              <button onClick={reset} className="px-4 py-2 text-sm text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                إلغاء
              </button>
              <button
                onClick={handleImport}
                className="px-5 py-2 text-sm font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
              >
                ✅ تأكيد الاستيراد
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Importing progress */}
      {phase === "importing" && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-5 h-5 rounded-full border-2 border-green-600 border-t-transparent animate-spin shrink-0" />
            <p className="font-semibold text-gray-800 text-sm">جارٍ الاستيراد...</p>
          </div>
          <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-500 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
          <p className="text-xs text-gray-400 mt-2">{Math.round(Math.min(progress, 100))}% — يرجى الانتظار</p>
        </div>
      )}

      {/* Results */}
      {phase === "done" && result && (
        <div className="space-y-4">
          {/* Summary cards */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-xl border border-green-200 p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center text-2xl shrink-0">✅</div>
              <div>
                <p className="text-3xl font-extrabold text-green-600 tabular-nums">{result.succeeded}</p>
                <p className="text-xs text-green-700 font-medium mt-0.5">صف تم استيراده بنجاح</p>
              </div>
            </div>
            <div className={`bg-white rounded-xl border p-5 flex items-center gap-4 ${result.failed.length > 0 ? "border-red-200" : "border-gray-200"}`}>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0 ${result.failed.length > 0 ? "bg-red-100" : "bg-gray-100"}`}>
                {result.failed.length > 0 ? "❌" : "🎉"}
              </div>
              <div>
                <p className={`text-3xl font-extrabold tabular-nums ${result.failed.length > 0 ? "text-red-600" : "text-gray-400"}`}>
                  {result.failed.length}
                </p>
                <p className={`text-xs font-medium mt-0.5 ${result.failed.length > 0 ? "text-red-700" : "text-gray-400"}`}>
                  {result.failed.length > 0 ? "صف فشل الاستيراد" : "لا توجد أخطاء 🎉"}
                </p>
              </div>
            </div>
          </div>

          {/* Progress bar full */}
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-green-500"
              style={{
                width: `${result.succeeded + result.failed.length > 0
                  ? Math.round((result.succeeded / (result.succeeded + result.failed.length)) * 100)
                  : 100}%`
              }}
            />
          </div>

          {/* Failed rows detail */}
          {result.failed.length > 0 && (
            <div className="bg-white rounded-xl border border-red-200 overflow-hidden">
              <div className="px-5 py-4 border-b border-red-100 bg-red-50">
                <h3 className="font-semibold text-red-800 text-sm">تفاصيل الصفوف الفاشلة ({result.failed.length})</h3>
              </div>
              <div className="divide-y divide-red-50 max-h-64 overflow-y-auto">
                {result.failed.map((f, i) => (
                  <div key={i} className="px-5 py-3 flex items-start gap-3">
                    <span className="text-xs font-bold text-red-400 bg-red-50 px-2 py-0.5 rounded shrink-0">صف {f.row}</span>
                    <p className="text-sm text-red-700">{f.reason}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={reset}
              className="px-5 py-2.5 text-sm font-semibold text-white bg-green-600 rounded-xl hover:bg-green-700 transition-colors"
            >
              📤 استيراد ملف آخر
            </button>
            <Link
              href="/admin"
              className="px-5 py-2.5 text-sm font-semibold text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
            >
              العودة للوحة التحكم
            </Link>
          </div>
        </div>
      )}

      {/* Templates info card */}
      {(phase === "idle" || phase === "error") && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-800 text-sm">📋 قوالب Excel للتحميل</h2>
            <p className="text-xs text-gray-400 mt-0.5">قوالب جاهزة مع بيانات نموذجية للمساعدة في تعبئة البيانات</p>
          </div>
          <div className="p-4 grid grid-cols-2 sm:grid-cols-4 gap-2">
            {SHEETS.map((s) => (
              <a
                key={s.key}
                href={`/api/admin/import/template?sheet=${s.key}`}
                download
                className="flex items-center gap-2 px-3 py-2.5 rounded-lg border border-gray-200 text-xs font-medium text-gray-600 hover:bg-gray-50 hover:border-green-300 transition-all"
              >
                <span>{s.icon}</span>
                <span className="truncate">{s.label}</span>
                <span className="text-green-500 shrink-0">⬇️</span>
              </a>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
