"use client";
import { useState, useTransition } from "react";
import { createActivity, updateActivity, deleteActivity } from "../_actions";

interface Activity {
  id: string;
  title: string;
  description: string | null;
  date: Date | null;
  _count: { applications: number };
}

interface ActivityForm { title: string; description: string; date: string }
const EMPTY: ActivityForm = { title: "", description: "", date: "" };

export default function ManageActivitiesTab({ activities: initial }: { activities: Activity[] }) {
  const [activities, setActivities] = useState<Activity[]>(initial);
  const [showModal, setShowModal]   = useState(false);
  const [editing, setEditing]       = useState<Activity | null>(null);
  const [form, setForm]             = useState<ActivityForm>(EMPTY);
  const [deleteId, setDeleteId]     = useState<string | null>(null);
  const [submitting, startSubmit]   = useTransition();
  const [deleting, startDelete]     = useTransition();
  const [error, setError]           = useState<string | null>(null);

  const now = new Date();

  function openCreate() {
    setEditing(null);
    setForm(EMPTY);
    setError(null);
    setShowModal(true);
  }

  function openEdit(act: Activity) {
    setEditing(act);
    setForm({
      title:       act.title,
      description: act.description ?? "",
      date:        act.date ? new Date(act.date).toISOString().slice(0, 10) : "",
    });
    setError(null);
    setShowModal(true);
  }

  function set(field: keyof ActivityForm, value: string) {
    setForm((p) => ({ ...p, [field]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startSubmit(async () => {
      if (editing) {
        const res = await updateActivity(editing.id, {
          title:       form.title,
          description: form.description || null,
          date:        form.date || null,
        });
        if (res.error) { setError(res.error); return; }
        setActivities((prev) => prev.map((a) => a.id === editing.id ? { ...a, ...res.activity } as Activity : a));
      } else {
        const res = await createActivity({
          title:       form.title,
          description: form.description || undefined,
          date:        form.date || undefined,
        });
        if (res.error) { setError(res.error); return; }
        setActivities((prev) => [{ ...res.activity, _count: { applications: 0 } } as Activity, ...prev]);
      }
      setShowModal(false);
    });
  }

  function handleDelete(id: string) {
    startDelete(async () => {
      const res = await deleteActivity(id);
      if (res.error) return;
      setActivities((prev) => prev.filter((a) => a.id !== id));
      setDeleteId(null);
    });
  }

  return (
    <>
      <div className="flex items-center justify-between gap-4">
        <p className="text-gray-500 text-sm">{activities.length} نشاط</p>
        <button
          onClick={openCreate}
          className="px-4 py-2 text-sm font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
        >
          <span>+</span> إضافة نشاط
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
              <tr>
                <th className="px-5 py-3 text-start">النشاط</th>
                <th className="px-5 py-3 text-start">التاريخ</th>
                <th className="px-5 py-3 text-start">الطلبات</th>
                <th className="px-5 py-3 text-start">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {activities.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-5 py-8 text-center text-gray-400">
                    لا توجد أنشطة. أضف نشاطاً جديداً.
                  </td>
                </tr>
              )}
              {activities.map((act) => {
                const isPast = act.date && new Date(act.date) < now;
                return (
                  <tr key={act.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3">
                      <p className="font-medium text-gray-900">{act.title}</p>
                      {act.description && (
                        <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{act.description}</p>
                      )}
                    </td>
                    <td className="px-5 py-3">
                      {act.date ? (
                        <span className={`text-xs ${isPast ? "text-gray-400" : "text-gray-600"}`}>
                          {new Date(act.date).toLocaleDateString("ar-SA")}
                          {isPast && <span className="ms-1 text-gray-400">(منتهٍ)</span>}
                        </span>
                      ) : (
                        <span className="text-xs text-green-600">مفتوح</span>
                      )}
                    </td>
                    <td className="px-5 py-3 text-gray-700 tabular-nums">{act._count.applications}</td>
                    <td className="px-5 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEdit(act)}
                          className="text-xs px-2.5 py-1 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
                        >
                          تعديل
                        </button>
                        <button
                          onClick={() => setDeleteId(act.id)}
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
          className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false); }}
        >
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4">
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-bold text-gray-900 text-lg">{editing ? "تعديل النشاط" : "إضافة نشاط جديد"}</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 text-xl leading-none">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
              {error && (
                <div className="px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">عنوان النشاط *</label>
                <input
                  type="text" required
                  value={form.title}
                  onChange={(e) => set("title", e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="مثال: ورشة القيادة والتواصل"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">الوصف</label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => set("description", e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                  placeholder="تفاصيل النشاط وأهدافه"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">التاريخ</label>
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => set("date", e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <p className="text-xs text-gray-400 mt-1">اتركه فارغاً إذا كان النشاط مفتوح التاريخ</p>
              </div>

              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2.5 text-sm text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  إلغاء
                </button>
                <button type="submit" disabled={submitting}
                  className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-60">
                  {submitting ? "جارٍ الحفظ…" : editing ? "حفظ التعديلات" : "إضافة النشاط"}
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
              سيتم حذف هذا النشاط وجميع طلبات المشاركة. هذا الإجراء لا يمكن التراجع عنه.
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
