"use client";
import { useState, useTransition } from "react";
import { createService, updateService, deleteService } from "../_actions";

interface Service {
  id: string;
  title: string;
  description: string | null;
  _count: { applications: number };
}

interface ServiceForm { title: string; description: string }
const EMPTY: ServiceForm = { title: "", description: "" };

export default function ManageServicesTab({ services: initial }: { services: Service[] }) {
  const [services, setServices]     = useState<Service[]>(initial);
  const [showModal, setShowModal]   = useState(false);
  const [editing, setEditing]       = useState<Service | null>(null);
  const [form, setForm]             = useState<ServiceForm>(EMPTY);
  const [deleteId, setDeleteId]     = useState<string | null>(null);
  const [submitting, startSubmit]   = useTransition();
  const [deleting, startDelete]     = useTransition();
  const [error, setError]           = useState<string | null>(null);

  function openCreate() {
    setEditing(null);
    setForm(EMPTY);
    setError(null);
    setShowModal(true);
  }

  function openEdit(svc: Service) {
    setEditing(svc);
    setForm({ title: svc.title, description: svc.description ?? "" });
    setError(null);
    setShowModal(true);
  }

  function set(field: keyof ServiceForm, value: string) {
    setForm((p) => ({ ...p, [field]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startSubmit(async () => {
      if (editing) {
        const res = await updateService(editing.id, {
          title:       form.title,
          description: form.description || null,
        });
        if (res.error) { setError(res.error); return; }
        setServices((prev) => prev.map((s) => s.id === editing.id ? { ...s, ...res.service } as Service : s));
      } else {
        const res = await createService({
          title:       form.title,
          description: form.description || undefined,
        });
        if (res.error) { setError(res.error); return; }
        setServices((prev) => [{ ...res.service, _count: { applications: 0 } } as Service, ...prev]);
      }
      setShowModal(false);
    });
  }

  function handleDelete(id: string) {
    startDelete(async () => {
      const res = await deleteService(id);
      if (res.error) return;
      setServices((prev) => prev.filter((s) => s.id !== id));
      setDeleteId(null);
    });
  }

  return (
    <>
      <div className="flex items-center justify-between gap-4">
        <p className="text-gray-500 text-sm">{services.length} خدمة</p>
        <button
          onClick={openCreate}
          className="px-4 py-2 text-sm font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
        >
          <span>+</span> إضافة خدمة
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
              <tr>
                <th className="px-5 py-3 text-start">الخدمة</th>
                <th className="px-5 py-3 text-start">الطلبات</th>
                <th className="px-5 py-3 text-start">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {services.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-5 py-8 text-center text-gray-400">
                    لا توجد خدمات. أضف خدمة جديدة.
                  </td>
                </tr>
              )}
              {services.map((svc) => (
                <tr key={svc.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3">
                    <p className="font-medium text-gray-900">{svc.title}</p>
                    {svc.description && (
                      <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">{svc.description}</p>
                    )}
                  </td>
                  <td className="px-5 py-3 text-gray-700 tabular-nums">{svc._count.applications}</td>
                  <td className="px-5 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEdit(svc)}
                        className="text-xs px-2.5 py-1 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
                      >
                        تعديل
                      </button>
                      <button
                        onClick={() => setDeleteId(svc.id)}
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

      {/* Create / Edit Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false); }}
        >
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4">
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-bold text-gray-900 text-lg">{editing ? "تعديل الخدمة" : "إضافة خدمة جديدة"}</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 text-xl leading-none">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
              {error && (
                <div className="px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">عنوان الخدمة *</label>
                <input
                  type="text" required
                  value={form.title}
                  onChange={(e) => set("title", e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="مثال: شهادة القيد والدراسة"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">الوصف</label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => set("description", e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                  placeholder="وصف مختصر للخدمة وما تتضمنه"
                />
              </div>

              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2.5 text-sm text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  إلغاء
                </button>
                <button type="submit" disabled={submitting}
                  className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-60">
                  {submitting ? "جارٍ الحفظ…" : editing ? "حفظ التعديلات" : "إضافة الخدمة"}
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
              سيتم حذف هذه الخدمة وجميع الطلبات المرتبطة بها. هذا الإجراء لا يمكن التراجع عنه.
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
