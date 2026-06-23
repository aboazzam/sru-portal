"use client";
import { useState, useTransition } from "react";
import { createOpportunity, updateOpportunity, deleteOpportunity } from "../_actions";

interface Opportunity {
  id: string;
  title: string;
  description: string | null;
  date: Date | null;
  _count: { applications: number };
}

interface OpportunityForm { title: string; description: string; date: string }
const EMPTY: OpportunityForm = { title: "", description: "", date: "" };

export default function ManageOpportunitiesTab({ opportunities: initial }: { opportunities: Opportunity[] }) {
  const [opportunities, setOpportunities] = useState<Opportunity[]>(initial);
  const [showModal, setShowModal]         = useState(false);
  const [editing, setEditing]             = useState<Opportunity | null>(null);
  const [form, setForm]                   = useState<OpportunityForm>(EMPTY);
  const [deleteId, setDeleteId]           = useState<string | null>(null);
  const [submitting, startSubmit]         = useTransition();
  const [deleting, startDelete]           = useTransition();
  const [error, setError]                 = useState<string | null>(null);

  const now = new Date();

  function openCreate() {
    setEditing(null);
    setForm(EMPTY);
    setError(null);
    setShowModal(true);
  }

  function openEdit(opp: Opportunity) {
    setEditing(opp);
    setForm({
      title:       opp.title,
      description: opp.description ?? "",
      date:        opp.date ? new Date(opp.date).toISOString().slice(0, 10) : "",
    });
    setError(null);
    setShowModal(true);
  }

  function set(field: keyof OpportunityForm, value: string) {
    setForm((p) => ({ ...p, [field]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startSubmit(async () => {
      if (editing) {
        const res = await updateOpportunity(editing.id, {
          title:       form.title,
          description: form.description || null,
          date:        form.date || null,
        });
        if (res.error) { setError(res.error); return; }
        setOpportunities((prev) => prev.map((o) => o.id === editing.id ? { ...o, ...res.opportunity } as Opportunity : o));
      } else {
        const res = await createOpportunity({
          title:       form.title,
          description: form.description || undefined,
          date:        form.date || undefined,
        });
        if (res.error) { setError(res.error); return; }
        setOpportunities((prev) => [{ ...res.opportunity, _count: { applications: 0 } } as Opportunity, ...prev]);
      }
      setShowModal(false);
    });
  }

  function handleDelete(id: string) {
    startDelete(async () => {
      const res = await deleteOpportunity(id);
      if (res.error) return;
      setOpportunities((prev) => prev.filter((o) => o.id !== id));
      setDeleteId(null);
    });
  }

  return (
    <>
      <div className="flex items-center justify-between gap-4">
        <p className="text-gray-500 text-sm">{opportunities.length} فرصة تطوع</p>
        <button
          onClick={openCreate}
          className="px-4 py-2 text-sm font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
        >
          <span>+</span> إضافة فرصة
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
              <tr>
                <th className="px-5 py-3 text-start">الفرصة</th>
                <th className="px-5 py-3 text-start">التاريخ</th>
                <th className="px-5 py-3 text-start">الطلبات</th>
                <th className="px-5 py-3 text-start">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {opportunities.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-5 py-8 text-center text-gray-400">
                    لا توجد فرص تطوع. أضف فرصة جديدة.
                  </td>
                </tr>
              )}
              {opportunities.map((opp) => {
                const isPast = opp.date && new Date(opp.date) < now;
                return (
                  <tr key={opp.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3">
                      <p className="font-medium text-gray-900">{opp.title}</p>
                      {opp.description && (
                        <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{opp.description}</p>
                      )}
                    </td>
                    <td className="px-5 py-3">
                      {opp.date ? (
                        <span className={`text-xs ${isPast ? "text-gray-400" : "text-gray-600"}`}>
                          {new Date(opp.date).toLocaleDateString("ar-SA")}
                          {isPast && <span className="ms-1 text-gray-400">(منتهية)</span>}
                        </span>
                      ) : (
                        <span className="text-xs text-green-600">مفتوحة</span>
                      )}
                    </td>
                    <td className="px-5 py-3 text-gray-700 tabular-nums">{opp._count.applications}</td>
                    <td className="px-5 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEdit(opp)}
                          className="text-xs px-2.5 py-1 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
                        >
                          تعديل
                        </button>
                        <button
                          onClick={() => setDeleteId(opp.id)}
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
              <h2 className="font-bold text-gray-900 text-lg">{editing ? "تعديل الفرصة" : "إضافة فرصة تطوع"}</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 text-xl leading-none">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
              {error && (
                <div className="px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">عنوان الفرصة *</label>
                <input
                  type="text" required
                  value={form.title}
                  onChange={(e) => set("title", e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="مثال: تطوع في معرض الكتاب الجامعي"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">الوصف</label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => set("description", e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                  placeholder="تفاصيل الفرصة ومتطلباتها"
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
                <p className="text-xs text-gray-400 mt-1">اتركه فارغاً إذا كانت الفرصة مفتوحة التاريخ</p>
              </div>

              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2.5 text-sm text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  إلغاء
                </button>
                <button type="submit" disabled={submitting}
                  className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-60">
                  {submitting ? "جارٍ الحفظ…" : editing ? "حفظ التعديلات" : "إضافة الفرصة"}
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
              سيتم حذف هذه الفرصة وجميع طلبات التطوع المرتبطة بها. هذا الإجراء لا يمكن التراجع عنه.
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
