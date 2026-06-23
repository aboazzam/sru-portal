"use client";
import { useState, useTransition } from "react";
import { createScholarship, updateScholarship, deleteScholarship } from "../_actions";

interface Scholarship {
  id: string;
  title: string;
  description: string | null;
  amount: number | null;
  deadline: Date | null;
  _count: { applications: number };
}

interface ScholarshipForm {
  title: string;
  description: string;
  amount: string;
  deadline: string;
}

const EMPTY: ScholarshipForm = { title: "", description: "", amount: "", deadline: "" };

export default function ManageScholarshipsTab({ scholarships: initial }: { scholarships: Scholarship[] }) {
  const [scholarships, setScholarships] = useState<Scholarship[]>(initial);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Scholarship | null>(null);
  const [form, setForm] = useState<ScholarshipForm>(EMPTY);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [submitting, startSubmit] = useTransition();
  const [deleting, startDelete] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const now = new Date();

  function openCreate() {
    setEditing(null);
    setForm(EMPTY);
    setError(null);
    setShowModal(true);
  }

  function openEdit(s: Scholarship) {
    setEditing(s);
    setForm({
      title:       s.title,
      description: s.description ?? "",
      amount:      s.amount != null ? String(s.amount) : "",
      deadline:    s.deadline ? new Date(s.deadline).toISOString().slice(0, 10) : "",
    });
    setError(null);
    setShowModal(true);
  }

  function set(field: keyof ScholarshipForm, value: string) {
    setForm((p) => ({ ...p, [field]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const amount = form.amount ? parseFloat(form.amount) : undefined;

    startSubmit(async () => {
      if (editing) {
        const res = await updateScholarship(editing.id, {
          title:       form.title,
          description: form.description || null,
          amount:      form.amount ? parseFloat(form.amount) : null,
          deadline:    form.deadline || null,
        });
        if (res.error) { setError(res.error); return; }
        setScholarships((prev) => prev.map((s) => s.id === editing.id ? { ...s, ...res.scholarship } as Scholarship : s));
      } else {
        const res = await createScholarship({
          title:       form.title,
          description: form.description || undefined,
          amount,
          deadline:    form.deadline || undefined,
        });
        if (res.error) { setError(res.error); return; }
        setScholarships((prev) => [{ ...res.scholarship, _count: { applications: 0 } } as Scholarship, ...prev]);
      }
      setShowModal(false);
    });
  }

  function handleDelete(id: string) {
    startDelete(async () => {
      const res = await deleteScholarship(id);
      if (res.error) return;
      setScholarships((prev) => prev.filter((s) => s.id !== id));
      setDeleteId(null);
    });
  }

  return (
    <>
      <div className="flex items-center justify-between gap-4">
        <p className="text-gray-500 text-sm">{scholarships.length} منحة</p>
        <button
          onClick={openCreate}
          className="px-4 py-2 text-sm font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
        >
          <span>+</span> إضافة منحة
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
              <tr>
                <th className="px-5 py-3 text-start">المنحة</th>
                <th className="px-5 py-3 text-start">المبلغ</th>
                <th className="px-5 py-3 text-start">الموعد النهائي</th>
                <th className="px-5 py-3 text-start">الطلبات</th>
                <th className="px-5 py-3 text-start">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {scholarships.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-gray-400">
                    لا توجد منح. أضف منحة جديدة.
                  </td>
                </tr>
              )}
              {scholarships.map((s) => {
                const expired = s.deadline && new Date(s.deadline) < now;
                return (
                  <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3">
                      <p className="font-medium text-gray-900">{s.title}</p>
                      {s.description && (
                        <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{s.description}</p>
                      )}
                    </td>
                    <td className="px-5 py-3 text-gray-700 tabular-nums">
                      {s.amount != null ? `${s.amount.toLocaleString("ar")} ر.س` : "—"}
                    </td>
                    <td className="px-5 py-3">
                      {s.deadline ? (
                        <span className={`text-xs ${expired ? "text-red-500" : "text-gray-500"}`}>
                          {new Date(s.deadline).toLocaleDateString("ar-SA")}
                          {expired && <span className="ms-1 text-red-400">(منتهية)</span>}
                        </span>
                      ) : (
                        <span className="text-gray-400 text-xs">—</span>
                      )}
                    </td>
                    <td className="px-5 py-3 text-gray-700 tabular-nums">{s._count.applications}</td>
                    <td className="px-5 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEdit(s)}
                          className="text-xs px-2.5 py-1 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
                        >
                          تعديل
                        </button>
                        <button
                          onClick={() => setDeleteId(s.id)}
                          className="text-xs px-2.5 py-1 border border-red-200 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                        >
                          حذف
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-sm overflow-y-auto py-8"
          onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false); }}
        >
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4">
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-bold text-gray-900 text-lg">{editing ? "تعديل المنحة" : "إضافة منحة جديدة"}</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 text-xl leading-none">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
              {error && (
                <div className="px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">عنوان المنحة *</label>
                <input
                  type="text" required
                  value={form.title}
                  onChange={(e) => set("title", e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="مثال: منحة التميّز الأكاديمي"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">الوصف</label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => set("description", e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                  placeholder="شروط المنحة وتفاصيلها"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">المبلغ (ر.س)</label>
                  <input
                    type="number" min="0" step="0.01"
                    value={form.amount}
                    onChange={(e) => set("amount", e.target.value)}
                    placeholder="اختياري"
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">الموعد النهائي</label>
                  <input
                    type="date"
                    value={form.deadline}
                    onChange={(e) => set("deadline", e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2.5 text-sm text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  إلغاء
                </button>
                <button type="submit" disabled={submitting}
                  className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-60">
                  {submitting ? "جارٍ الحفظ…" : editing ? "حفظ التعديلات" : "إضافة المنحة"}
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
            <p className="text-gray-500 text-sm mb-6">
              سيتم حذف هذه المنحة وجميع الطلبات المرتبطة بها. هذا الإجراء لا يمكن التراجع عنه.
            </p>
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
