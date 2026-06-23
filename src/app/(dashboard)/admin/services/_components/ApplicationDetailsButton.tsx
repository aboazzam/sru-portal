"use client";
import { useState } from "react";

interface Props {
  notes: string | null;
  formData: string | null;
}

export default function ApplicationDetailsButton({ notes, formData }: Props) {
  const [open, setOpen] = useState(false);

  if (!notes && !formData) return null;

  let parsed: Record<string, string> | null = null;
  if (formData) {
    try { parsed = JSON.parse(formData); } catch { /* ignore */ }
  }

  const FIELD_LABELS: Record<string, string> = {
    semester_from:     "من الفصل الدراسي",
    semester_to:       "إلى الفصل الدراسي",
    purpose:           "الغرض من الطلب",
    copies:            "عدد النسخ",
    language:          "لغة الوثيقة",
    recipient:         "الجهة المستلمة",
    course_name:       "اسم المقرر",
    course_code:       "رمز المقرر",
    appeal_reason:     "سبب التظلم",
    expected_grade:    "الدرجة المتوقعة",
    withdrawal_reason: "سبب الانسحاب",
    effective_date:    "تاريخ الانسحاب",
    details:           "تفاصيل إضافية",
    room_type:         "نوع الغرفة",
    duration:          "مدة الإقامة",
    special_needs:     "احتياجات خاصة",
    area:              "المنطقة",
    schedule:          "الجدول",
    medical_reason:    "سبب الطلب الطبي",
    doctor_name:       "اسم الطبيب",
    urgency:           "مستوى الأولوية",
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="text-xs px-2 py-0.5 border border-gray-200 rounded text-gray-500 hover:bg-gray-50 transition-colors"
      >
        تفاصيل
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}
        >
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm mx-4 max-h-[80vh] flex flex-col">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between shrink-0">
              <h3 className="font-bold text-gray-900">تفاصيل الطلب</h3>
              <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-600 text-xl leading-none">✕</button>
            </div>
            <div className="overflow-y-auto px-5 py-4 space-y-4">
              {parsed && Object.keys(parsed).length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">بيانات النموذج</p>
                  {Object.entries(parsed).map(([key, val]) => (
                    <div key={key} className="flex gap-2 text-sm">
                      <span className="text-gray-500 shrink-0">{FIELD_LABELS[key] ?? key}:</span>
                      <span className="text-gray-900 font-medium break-words">{String(val)}</span>
                    </div>
                  ))}
                </div>
              )}
              {notes && (
                <div className="space-y-1">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">ملاحظات الطالب</p>
                  <p className="text-sm text-gray-800 whitespace-pre-wrap">{notes}</p>
                </div>
              )}
            </div>
            <div className="px-5 py-4 border-t border-gray-100 shrink-0">
              <button onClick={() => setOpen(false)}
                className="w-full px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
