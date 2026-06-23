"use client";
import { useState, useTransition } from "react";
import { createTraining, updateTraining, deleteTraining } from "../_actions";

interface Training {
  id: string;
  title: string;
  description: string | null;
  instructor: string | null;
  category: string | null;
  capacity: number | null;
  startDate: Date | null;
  endDate: Date | null;
  status: string;
  _count: { enrollments: number };
}

interface TrainingForm {
  title: string;
  description: string;
  instructor: string;
  category: string;
  capacity: string;
  startDate: string;
  endDate: string;
  status: string;
}

const EMPTY_FORM: TrainingForm = {
  title: "", description: "", instructor: "", category: "",
  capacity: "", startDate: "", endDate: "", status: "UPCOMING",
};

const STATUS_LABEL: Record<string, string> = {
  UPCOMING:  "قادم",
  ONGOING:   "جارٍ",
  COMPLETED: "منتهٍ",
  CANCELLED: "ملغي",
};

const STATUS_BADGE: Record<string, string> = {
  UPCOMING:  "bg-blue-100 text-blue-700",
  ONGOING:   "bg-green-100 text-green-700",
  COMPLETED: "bg-gray-100 text-gray-600",
  CANCELLED: "bg-red-100 text-red-700",
};

interface Props { trainings: Training[] }

export default function TrainingProgramsTab({ trainings: initial }: Props) {
  const [trainings, setTrainings] = useState<Training[]>(initial);
  const [showModal, setShowModal]   = useState(false);
  const [editing, setEditing]       = useState<Training | null>(null);
  const [form, setForm]             = useState<TrainingForm>(EMPTY_FORM);
  const [deleteId, setDeleteId]     = useState<string | null>(null);
  const [submitting, startSubmit]   = useTransition();
  const [deleting, startDelete]     = useTransition();
  const [error, setError]           = useState<string | null>(null);

  function openCreate() {
    setEditing(null);
    setForm(EMPTY_FORM);
    setError(null);
    setShowModal(true);
  }

  function openEdit(tr: Training) {
    setEditing(tr);
    setForm({
      title:       tr.title,
      description: tr.description ?? "",
      instructor:  tr.instructor ?? "",
      category:    tr.category ?? "",
      capacity:    tr.capacity != null ? String(tr.capacity) : "",
      startDate:   tr.startDate ? tr.startDate.toISOString().slice(0, 10) : "",
      endDate:     tr.endDate   ? tr.endDate.toISOString().slice(0, 10)   : "",
      status:      tr.status,
    });
    setError(null);
    setShowModal(true);
  }

  function set(field: keyof TrainingForm, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const payload: Record<string, unknown> = {
      title:       form.title,
      description: form.description || undefined,
      instructor:  form.instructor  || undefined,
      category:    form.category    || undefined,
      capacity:    form.capacity    ? parseInt(form.capacity) : undefined,
      startDate:   form.startDate   ? new Date(form.startDate).toISOString() : undefined,
      endDate:     form.endDate     ? new Date(form.endDate).toISOString()   : undefined,
      status:      form.status,
    };

    startSubmit(async () => {
      if (editing) {
        const res = await updateTraining(editing.id, payload);
        if (res.error) { setError(typeof res.error === "string" ? res.error : "خطأ في التحديث"); return; }
        setTrainings((prev) => prev.map((t) => t.id === editing.id ? { ...t, ...res.training! } as Training : t));
      } else {
        const res = await createTraining(payload);
        if (res.error) { setError(typeof res.error === "string" ? res.error : "خطأ في الإنشاء"); return; }
        setTrainings((prev) => [{ ...res.training!, _count: { enrollments: 0 } } as Training, ...prev]);
      }
      setShowModal(false);
    });
  }

  function handleDelete(id: string) {
    startDelete(async () => {
      const res = await deleteTraining(id);
      if (res.error) return;
      setTrainings((prev) => prev.filter((t) => t.id !== id));
      setDeleteId(null);
    });
  }

  return (
    <>
      <div className="flex items-center justify-between gap-4">
        <p className="text-gray-500 text-sm">{trainings.length} برنامج تدريبي</p>
        <button
          onClick={openCreate}
          className="px-4 py-2 text-sm font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
        >
          <span>+</span> إضافة برنامج
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
              <tr>
                <th className="px-5 py-3 text-start">البرنامج</th>
                <th className="px-5 py-3 text-start">المدرّب</th>
                <th className="px-5 py-3 text-start">التصنيف</th>
                <th className="px-5 py-3 text-start">تاريخ البداية</th>
                <th className="px-5 py-3 text-start">المسجّلون</th>
                <th className="px-5 py-3 text-start">الحالة</th>
                <th className="px-5 py-3 text-start">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {trainings.length === 0 && (
                <tr><td colSpan={7} className="px-5 py-8 text-center text-gray-400">لا توجد برامج تدريبية. أضف برنامجاً جديداً.</td></tr>
              )}
              {trainings.map((tr) => (
                <tr key={tr.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3">
                    <p className="font-medium text-gray-900">{tr.title}</p>
                    {tr.description && <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{tr.description}</p>}
                  </td>
                  <td className="px-5 py-3 text-gray-500 text-xs">{tr.instructor ?? "—"}</td>
                  <td className="px-5 py-3 text-gray-500 text-xs">{tr.category ?? "—"}</td>
                  <td className="px-5 py-3 text-gray-400 text-xs">
                    {tr.startDate ? new Date(tr.startDate).toLocaleDateString("ar-SA") : "—"}
                  </td>
                  <td className="px-5 py-3 text-gray-700 tabular-nums">
                    {tr._count.enrollments}
                    {tr.capacity != null && <span className="text-gray-400 text-xs"> / {tr.capacity}</span>}
                  </td>
                  <td className="px-5 py-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_BADGE[tr.status] ?? "bg-gray-100 text-gray-600"}`}>
                      {STATUS_LABEL[tr.status] ?? tr.status}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEdit(tr)}
                        className="text-xs px-2.5 py-1 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
                      >
                        تعديل
                      </button>
                      <button
                        onClick={() => setDeleteId(tr.id)}
                        className="text-xs px-2.5 py-1 border border-red-200 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                      >
                        حذف
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-sm overflow-y-auto py-8"
          onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false); }}
        >
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4">
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-bold text-gray-900 text-lg">{editing ? "تعديل البرنامج" : "إضافة برنامج تدريبي"}</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 text-xl leading-none">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
              {error && (
                <div className="px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">عنوان البرنامج *</label>
                <input type="text" required value={form.title} onChange={(e) => set("title", e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">الوصف</label>
                <textarea rows={2} value={form.description} onChange={(e) => set("description", e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">المدرّب</label>
                  <input type="text" value={form.instructor} onChange={(e) => set("instructor", e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">التصنيف</label>
                  <input type="text" value={form.category} onChange={(e) => set("category", e.target.value)}
                    placeholder="تقنية، إدارة، ..."
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">تاريخ البداية</label>
                  <input type="date" value={form.startDate} onChange={(e) => set("startDate", e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">تاريخ الانتهاء</label>
                  <input type="date" value={form.endDate} onChange={(e) => set("endDate", e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">الطاقة الاستيعابية</label>
                  <input type="number" min="1" value={form.capacity} onChange={(e) => set("capacity", e.target.value)}
                    placeholder="غير محدودة"
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">الحالة</label>
                  <select value={form.status} onChange={(e) => set("status", e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-500">
                    <option value="UPCOMING">قادم</option>
                    <option value="ONGOING">جارٍ</option>
                    <option value="COMPLETED">منتهٍ</option>
                    <option value="CANCELLED">ملغي</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2.5 text-sm text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  إلغاء
                </button>
                <button type="submit" disabled={submitting}
                  className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-60">
                  {submitting ? "جارٍ الحفظ…" : editing ? "حفظ التعديلات" : "إضافة البرنامج"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteId && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm mx-4 p-6 text-center">
            <p className="text-3xl mb-3">🗑️</p>
            <h3 className="font-bold text-gray-900 text-lg mb-1">تأكيد الحذف</h3>
            <p className="text-gray-500 text-sm mb-6">سيتم حذف هذا البرنامج وجميع تسجيلاته. هذا الإجراء لا يمكن التراجع عنه.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)}
                className="flex-1 px-4 py-2.5 text-sm text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                إلغاء
              </button>
              <button onClick={() => handleDelete(deleteId)} disabled={deleting}
                className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-60">
                {deleting ? "جارٍ الحذف…" : "حذف"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
