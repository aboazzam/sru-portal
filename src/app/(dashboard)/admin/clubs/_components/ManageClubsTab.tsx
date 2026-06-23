"use client";
import { useState, useTransition } from "react";
import { createClub, updateClub, deleteClub } from "../_actions";

interface Club {
  id: string;
  name: string;
  description: string | null;
  _count: { memberships: number; activities: number };
}

interface ClubForm { name: string; description: string }
const EMPTY: ClubForm = { name: "", description: "" };

export default function ManageClubsTab({ clubs: initial }: { clubs: Club[] }) {
  const [clubs, setClubs] = useState<Club[]>(initial);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Club | null>(null);
  const [form, setForm] = useState<ClubForm>(EMPTY);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [submitting, startSubmit] = useTransition();
  const [deleting, startDelete] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function openCreate() {
    setEditing(null);
    setForm(EMPTY);
    setError(null);
    setShowModal(true);
  }

  function openEdit(club: Club) {
    setEditing(club);
    setForm({ name: club.name, description: club.description ?? "" });
    setError(null);
    setShowModal(true);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startSubmit(async () => {
      if (editing) {
        const res = await updateClub(editing.id, { name: form.name, description: form.description || null });
        if (res.error) { setError(res.error); return; }
        setClubs((prev) => prev.map((c) => c.id === editing.id ? { ...c, ...res.club } : c));
      } else {
        const res = await createClub({ name: form.name, description: form.description || undefined });
        if (res.error) { setError(res.error); return; }
        setClubs((prev) => [res.club as Club, ...prev]);
      }
      setShowModal(false);
    });
  }

  function handleDelete(id: string) {
    startDelete(async () => {
      const res = await deleteClub(id);
      if (res.error) return;
      setClubs((prev) => prev.filter((c) => c.id !== id));
      setDeleteId(null);
    });
  }

  return (
    <>
      <div className="flex items-center justify-between gap-4">
        <p className="text-gray-500 text-sm">{clubs.length} ناد مسجّل</p>
        <button
          onClick={openCreate}
          className="px-4 py-2 text-sm font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
        >
          <span>+</span> إضافة ناد
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
              <tr>
                <th className="px-5 py-3 text-start">اسم النادي</th>
                <th className="px-5 py-3 text-start">الوصف</th>
                <th className="px-5 py-3 text-start">الأعضاء</th>
                <th className="px-5 py-3 text-start">الأنشطة</th>
                <th className="px-5 py-3 text-start">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {clubs.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-gray-400">
                    لا توجد أندية. أضف نادياً جديداً.
                  </td>
                </tr>
              )}
              {clubs.map((club) => (
                <tr key={club.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3 font-medium text-gray-900">{club.name}</td>
                  <td className="px-5 py-3 text-gray-500 text-xs max-w-xs">
                    <span className="line-clamp-2">{club.description ?? "—"}</span>
                  </td>
                  <td className="px-5 py-3 text-gray-700 tabular-nums">{club._count.memberships}</td>
                  <td className="px-5 py-3 text-gray-700 tabular-nums">{club._count.activities}</td>
                  <td className="px-5 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEdit(club)}
                        className="text-xs px-2.5 py-1 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
                      >
                        تعديل
                      </button>
                      <button
                        onClick={() => setDeleteId(club.id)}
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
              <h2 className="font-bold text-gray-900 text-lg">{editing ? "تعديل النادي" : "إضافة ناد جديد"}</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 text-xl leading-none">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
              {error && (
                <div className="px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">اسم النادي *</label>
                <input
                  type="text" required
                  value={form.name}
                  onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="مثال: نادي كرة القدم"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">الوصف</label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                  placeholder="وصف مختصر للنادي وأهدافه"
                />
              </div>
              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2.5 text-sm text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  إلغاء
                </button>
                <button type="submit" disabled={submitting}
                  className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-60">
                  {submitting ? "جارٍ الحفظ…" : editing ? "حفظ التعديلات" : "إضافة النادي"}
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
              سيتم حذف هذا النادي مع جميع عضوياته وأنشطته. هذا الإجراء لا يمكن التراجع عنه.
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
