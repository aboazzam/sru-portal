"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { getClientToken } from "@/lib/client-auth";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  gender: string | null;
  points: number;
  createdAt: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

const roleLabel: Record<string, string> = {
  STUDENT:   "طالب",
  FACULTY:   "هيئة التدريس",
  ADMIN:     "مدير",
  ORGANIZER: "منظم",
  SUBADMIN:  "مشرف",
};

const roleBadge: Record<string, string> = {
  STUDENT:   "bg-blue-100 text-blue-700",
  FACULTY:   "bg-green-100 text-green-700",
  ADMIN:     "bg-purple-100 text-purple-700",
  ORGANIZER: "bg-orange-100 text-orange-700",
  SUBADMIN:  "bg-gray-100 text-gray-700",
};

const ROLES = ["STUDENT", "FACULTY", "ADMIN", "ORGANIZER", "SUBADMIN"];

type Toast = { id: number; message: string; type: "success" | "error" };

function ToastContainer({ toasts, onRemove }: { toasts: Toast[]; onRemove: (id: number) => void }) {
  return (
    <div className="fixed bottom-5 end-5 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`pointer-events-auto px-4 py-3 rounded-xl shadow-lg text-sm font-medium flex items-center gap-2 transition-all ${
            t.type === "success"
              ? "bg-green-600 text-white"
              : "bg-red-600 text-white"
          }`}
        >
          <span>{t.type === "success" ? "✓" : "✕"}</span>
          {t.message}
          <button onClick={() => onRemove(t.id)} className="ms-2 opacity-70 hover:opacity-100">✕</button>
        </div>
      ))}
    </div>
  );
}

interface AddUserModalProps {
  onClose: () => void;
  onSuccess: (user: User) => void;
}

function AddUserModal({ onClose, onSuccess }: AddUserModalProps) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "STUDENT",
    gender: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function set(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const token = getClientToken();
    const body: Record<string, string> = {
      name:     form.name,
      email:    form.email,
      password: form.password,
      role:     form.role,
    };
    if (form.gender) body.gender = form.gender;

    const res = await fetch("/api/admin/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    setSubmitting(false);

    if (!res.ok) {
      if (res.status === 409) {
        setError("البريد الإلكتروني مستخدم بالفعل.");
      } else if (typeof data.error === "object") {
        const msgs = Object.values(data.error as Record<string, string[]>).flat();
        setError(msgs[0] ?? "خطأ في البيانات");
      } else {
        setError(data.error ?? "حدث خطأ غير متوقع");
      }
      return;
    }

    onSuccess(data.user);
  }

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-bold text-gray-900 text-lg">إضافة مستخدم جديد</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors text-xl leading-none"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {error && (
            <div className="px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">الاسم الكامل *</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="أحمد محمد العلي"
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">البريد الإلكتروني *</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
              placeholder="ahmed@sru.edu.sa"
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">كلمة المرور *</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                minLength={8}
                value={form.password}
                onChange={(e) => set("password", e.target.value)}
                placeholder="8 أحرف على الأقل"
                className="w-full px-3 py-2.5 pe-10 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute end-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors text-xs"
              >
                {showPassword ? "إخفاء" : "إظهار"}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">الدور *</label>
            <select
              value={form.role}
              onChange={(e) => set("role", e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              {ROLES.map((r) => (
                <option key={r} value={r}>{roleLabel[r] ?? r}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">الجنس (اختياري)</label>
            <select
              value={form.gender}
              onChange={(e) => set("gender", e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">غير محدد</option>
              <option value="MALE">ذكر</option>
              <option value="FEMALE">أنثى</option>
            </select>
          </div>

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 text-sm text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? "جارٍ الإضافة…" : "إضافة المستخدم"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function UsersPage() {
  const [users, setUsers]           = useState<User[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [search, setSearch]         = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [page, setPage]             = useState(1);
  const [loading, setLoading]       = useState(true);
  const [changingRole, setChangingRole] = useState<Record<string, boolean>>({});
  const [showAddModal, setShowAddModal] = useState(false);
  const [toasts, setToasts]         = useState<Toast[]>([]);
  const toastIdRef                  = useRef(0);
  const debounceRef                 = useRef<ReturnType<typeof setTimeout> | null>(null);

  function addToast(message: string, type: Toast["type"]) {
    const id = ++toastIdRef.current;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
  }

  const fetchUsers = useCallback(async (q: string, r: string, p: number) => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(p), limit: "15" });
    if (q) params.set("search", q);
    if (r) params.set("role", r);
    const token = getClientToken();
    const res = await fetch(`/api/admin/users?${params}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      const data = await res.json();
      setUsers(data.users ?? []);
      setPagination(data.pagination ?? null);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchUsers(search, roleFilter, page), 300);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [search, roleFilter, page, fetchUsers]);

  async function changeRole(userId: string, newRole: string) {
    setChangingRole((prev) => ({ ...prev, [userId]: true }));
    const token = getClientToken();
    const res = await fetch(`/api/admin/users/${userId}/role`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ role: newRole }),
    });
    if (res.ok) {
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
      );
    }
    setChangingRole((prev) => ({ ...prev, [userId]: false }));
  }

  function handleUserCreated(user: User) {
    setShowAddModal(false);
    addToast(`تمت إضافة ${user.name} بنجاح`, "success");
    fetchUsers(search, roleFilter, page);
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">المستخدمون</h1>
        <p className="text-gray-500 text-sm mt-0.5">
          {pagination ? `${pagination.total.toLocaleString("ar")} مستخدم` : "جارٍ التحميل…"}
        </p>
      </div>

      {/* Filters + Add button */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="بحث بالاسم أو البريد الإلكتروني…"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          {loading && (
            <span className="absolute end-3 top-1/2 -translate-y-1/2 text-gray-300 text-xs animate-pulse">●●●</span>
          )}
        </div>
        <select
          value={roleFilter}
          onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}
          className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="">كل الأدوار</option>
          {ROLES.map((r) => (
            <option key={r} value={r}>{roleLabel[r] ?? r}</option>
          ))}
        </select>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 text-sm font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors shrink-0 flex items-center gap-2"
        >
          <span className="text-base leading-none">+</span>
          إضافة مستخدم
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
              <tr>
                <th className="px-5 py-3 text-start">الاسم</th>
                <th className="px-5 py-3 text-start">البريد الإلكتروني</th>
                <th className="px-5 py-3 text-start">الدور</th>
                <th className="px-5 py-3 text-start">النقاط</th>
                <th className="px-5 py-3 text-start">تاريخ التسجيل</th>
                <th className="px-5 py-3 text-start">تغيير الدور</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading && users.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-gray-400">جارٍ التحميل…</td>
                </tr>
              )}
              {!loading && users.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-gray-400">لا يوجد مستخدمون مطابقون</td>
                </tr>
              )}
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3 font-medium text-gray-900">{user.name}</td>
                  <td className="px-5 py-3 text-gray-500 text-xs">{user.email}</td>
                  <td className="px-5 py-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${roleBadge[user.role] ?? "bg-gray-100 text-gray-600"}`}>
                      {roleLabel[user.role] ?? user.role}
                    </span>
                  </td>
                  <td className="px-5 py-3 tabular-nums text-gray-700">{user.points}</td>
                  <td className="px-5 py-3 text-gray-400 text-xs">
                    {new Date(user.createdAt).toLocaleDateString("ar-SA")}
                  </td>
                  <td className="px-5 py-3">
                    <select
                      value={user.role}
                      disabled={changingRole[user.id]}
                      onChange={(e) => changeRole(user.id, e.target.value)}
                      className="text-xs px-2 py-1.5 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-green-500 disabled:opacity-50 cursor-pointer"
                    >
                      {ROLES.map((r) => (
                        <option key={r} value={r}>{roleLabel[r] ?? r}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {pagination && pagination.pages > 1 && (
          <div className="px-5 py-3 border-t border-gray-100 flex items-center justify-between">
            <p className="text-xs text-gray-500">
              صفحة {pagination.page} من {pagination.pages}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={pagination.page <= 1}
                className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50 transition-colors"
              >
                السابق
              </button>
              <button
                onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
                disabled={pagination.page >= pagination.pages}
                className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50 transition-colors"
              >
                التالي
              </button>
            </div>
          </div>
        )}
      </div>

      {showAddModal && (
        <AddUserModal
          onClose={() => setShowAddModal(false)}
          onSuccess={handleUserCreated}
        />
      )}

      <ToastContainer toasts={toasts} onRemove={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))} />
    </div>
  );
}
