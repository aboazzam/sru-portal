"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { useTranslations, useLocale } from "next-intl";
import { getClientToken } from "@/lib/client-auth";

interface User {
  id: string;
  name: string;
  nameEn: string | null;
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

const ROLES = ["STUDENT", "FACULTY", "ADMIN", "ORGANIZER", "SUBADMIN"];

const ROLE_AR: Record<string, string> = {
  STUDENT:   "طالب",
  FACULTY:   "هيئة التدريس",
  ADMIN:     "مدير",
  ORGANIZER: "منظم",
  SUBADMIN:  "مشرف",
};

const ROLE_EN: Record<string, string> = {
  STUDENT:   "Student",
  FACULTY:   "Faculty Member",
  ADMIN:     "Admin",
  ORGANIZER: "Organizer",
  SUBADMIN:  "Sub-Admin",
};

const roleBadge: Record<string, string> = {
  STUDENT:   "bg-blue-100 text-blue-700",
  FACULTY:   "bg-green-100 text-green-700",
  ADMIN:     "bg-purple-100 text-purple-700",
  ORGANIZER: "bg-orange-100 text-orange-700",
  SUBADMIN:  "bg-gray-100 text-gray-700",
};

type Toast = { id: number; message: string; type: "success" | "error" };

function ToastContainer({ toasts, onRemove }: { toasts: Toast[]; onRemove: (id: number) => void }) {
  return (
    <div className="fixed bottom-5 end-5 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`pointer-events-auto px-4 py-3 rounded-xl shadow-lg text-sm font-medium flex items-center gap-2 transition-all ${
            t.type === "success" ? "bg-green-600 text-white" : "bg-red-600 text-white"
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

// ── Add User Modal ─────────────────────────────────────────────────────────────
interface AddUserModalProps {
  onClose: () => void;
  onSuccess: (user: User) => void;
}

function AddUserModal({ onClose, onSuccess }: AddUserModalProps) {
  const t = useTranslations("AdminUsers");
  const [form, setForm] = useState({ name: "", nameEn: "", email: "", password: "", role: "STUDENT", gender: "" });
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
    const body: Record<string, unknown> = {
      name:     form.name,
      email:    form.email,
      password: form.password,
      role:     form.role,
    };
    if (form.nameEn.trim()) body.nameEn = form.nameEn.trim();
    if (form.gender) body.gender = form.gender;

    const res = await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    setSubmitting(false);

    if (!res.ok) {
      if (res.status === 409) {
        setError(t("emailTaken"));
      } else if (typeof data.error === "object") {
        const msgs = Object.values(data.error as Record<string, string[]>).flat();
        setError(msgs[0] ?? t("fieldError"));
      } else {
        setError(data.error ?? t("genericError"));
      }
      return;
    }

    onSuccess(data.user);
  }

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-sm overflow-y-auto py-6"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-bold text-gray-900 text-lg">{t("addUserTitle")}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors text-xl leading-none">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {error && (
            <div className="px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t("fullName")} *</label>
            <input
              type="text" required value={form.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="أحمد محمد العلي"
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t("nameEn")}</label>
            <input
              type="text" value={form.nameEn}
              onChange={(e) => set("nameEn", e.target.value)}
              placeholder={t("nameEnPlaceholder")}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t("email")} *</label>
            <input
              type="email" required value={form.email}
              onChange={(e) => set("email", e.target.value)}
              placeholder="ahmed@sru.edu.sa"
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t("password")} *</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required minLength={8} value={form.password}
                onChange={(e) => set("password", e.target.value)}
                placeholder={t("passwordHint")}
                className="w-full px-3 py-2.5 pe-10 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <button
                type="button" onClick={() => setShowPassword((v) => !v)}
                className="absolute end-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors text-xs"
              >
                {showPassword ? t("hide") : t("show")}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t("role")} *</label>
            <select
              value={form.role} onChange={(e) => set("role", e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              {ROLES.map((r) => (
                <option key={r} value={r}>{ROLE_AR[r]} — {ROLE_EN[r]}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t("genderOptional")}</label>
            <select
              value={form.gender} onChange={(e) => set("gender", e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">{t("genderUnset")}</option>
              <option value="MALE">{t("genderMale")}</option>
              <option value="FEMALE">{t("genderFemale")}</option>
            </select>
          </div>

          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose}
              className="flex-1 px-4 py-2.5 text-sm text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              {t("cancel")}
            </button>
            <button type="submit" disabled={submitting}
              className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed">
              {submitting ? t("adding") : t("addSubmit")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Edit User Modal ────────────────────────────────────────────────────────────
interface EditUserModalProps {
  user: User;
  onClose: () => void;
  onSuccess: (user: User) => void;
}

function EditUserModal({ user, onClose, onSuccess }: EditUserModalProps) {
  const t = useTranslations("AdminUsers");
  const [form, setForm] = useState({
    name:     user.name,
    nameEn:   user.nameEn ?? "",
    email:    user.email,
    password: "",
    role:     user.role,
    gender:   user.gender ?? "",
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
    const body: Record<string, unknown> = {
      name:   form.name,
      nameEn: form.nameEn.trim() || null,
      email:  form.email,
      role:   form.role,
      gender: form.gender || null,
    };
    if (form.password) body.password = form.password;

    const res = await fetch(`/api/admin/users/${user.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    setSubmitting(false);

    if (!res.ok) {
      if (res.status === 409) {
        setError(t("emailTaken"));
      } else if (typeof data.error === "object") {
        const msgs = Object.values(data.error as Record<string, string[]>).flat();
        setError(msgs[0] ?? t("fieldError"));
      } else {
        setError(data.error ?? t("genericError"));
      }
      return;
    }

    onSuccess(data.user);
  }

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-sm overflow-y-auto py-6"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-bold text-gray-900 text-lg">{t("editUserTitle")}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors text-xl leading-none">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {error && (
            <div className="px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t("fullName")} *</label>
            <input
              type="text" required value={form.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="أحمد محمد العلي"
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t("nameEn")}</label>
            <input
              type="text" value={form.nameEn}
              onChange={(e) => set("nameEn", e.target.value)}
              placeholder={t("nameEnPlaceholder")}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t("email")} *</label>
            <input
              type="email" required value={form.email}
              onChange={(e) => set("email", e.target.value)}
              placeholder="ahmed@sru.edu.sa"
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t("passwordOptional")}</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                minLength={8} value={form.password}
                onChange={(e) => set("password", e.target.value)}
                placeholder={t("passwordHint")}
                className="w-full px-3 py-2.5 pe-10 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <button
                type="button" onClick={() => setShowPassword((v) => !v)}
                className="absolute end-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors text-xs"
              >
                {showPassword ? t("hide") : t("show")}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t("role")} *</label>
            <select
              value={form.role} onChange={(e) => set("role", e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              {ROLES.map((r) => (
                <option key={r} value={r}>{ROLE_AR[r]} — {ROLE_EN[r]}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t("genderOptional")}</label>
            <select
              value={form.gender} onChange={(e) => set("gender", e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">{t("genderUnset")}</option>
              <option value="MALE">{t("genderMale")}</option>
              <option value="FEMALE">{t("genderFemale")}</option>
            </select>
          </div>

          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose}
              className="flex-1 px-4 py-2.5 text-sm text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              {t("cancel")}
            </button>
            <button type="submit" disabled={submitting}
              className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed">
              {submitting ? t("saving") : t("editSubmit")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────────
export default function UsersPage() {
  const t      = useTranslations("AdminUsers");
  const locale = useLocale();

  const roleLabel = locale === "ar" ? ROLE_AR : ROLE_EN;

  const [users, setUsers]           = useState<User[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [search, setSearch]         = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [page, setPage]             = useState(1);
  const [loading, setLoading]       = useState(true);
  const [changingRole, setChangingRole] = useState<Record<string, boolean>>({});
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUser, setEditingUser]   = useState<User | null>(null);
  const [toasts, setToasts]         = useState<Toast[]>([]);
  const toastIdRef                  = useRef(0);
  const debounceRef                 = useRef<ReturnType<typeof setTimeout> | null>(null);

  function addToast(message: string, type: Toast["type"]) {
    const id = ++toastIdRef.current;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((toast) => toast.id !== id)), 4000);
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
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ role: newRole }),
    });
    if (res.ok) {
      setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u)));
    }
    setChangingRole((prev) => ({ ...prev, [userId]: false }));
  }

  function handleUserCreated(user: User) {
    setShowAddModal(false);
    addToast(t("addedSuccess", { name: user.name }), "success");
    fetchUsers(search, roleFilter, page);
  }

  function handleUserUpdated(user: User) {
    setEditingUser(null);
    addToast(t("updatedSuccess", { name: user.name }), "success");
    setUsers((prev) => prev.map((u) => (u.id === user.id ? user : u)));
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{t("title")}</h1>
        <p className="text-gray-500 text-sm mt-0.5">
          {pagination ? t("subtitle", { n: pagination.total.toLocaleString() }) : t("loading")}
        </p>
      </div>

      {/* Filters + Add button */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder={t("search")}
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
          <option value="">{t("allRoles")}</option>
          {ROLES.map((r) => (
            <option key={r} value={r}>{ROLE_AR[r]} — {ROLE_EN[r]}</option>
          ))}
        </select>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 text-sm font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors shrink-0 flex items-center gap-2"
        >
          <span className="text-base leading-none">+</span>
          {t("addUser")}
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
              <tr>
                <th className="px-5 py-3 text-start">{t("cols.name")}</th>
                <th className="px-5 py-3 text-start">{t("cols.email")}</th>
                <th className="px-5 py-3 text-start">{t("cols.role")}</th>
                <th className="px-5 py-3 text-start">{t("cols.points")}</th>
                <th className="px-5 py-3 text-start">{t("cols.date")}</th>
                <th className="px-5 py-3 text-start">{t("cols.changeRole")}</th>
                <th className="px-5 py-3 text-start">{t("cols.actions")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading && users.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-8 text-center text-gray-400">{t("loading")}</td>
                </tr>
              )}
              {!loading && users.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-8 text-center text-gray-400">{t("noUsers")}</td>
                </tr>
              )}
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3">
                    <p className="font-medium text-gray-900">{user.name}</p>
                    {user.nameEn && <p className="text-xs text-gray-400 mt-0.5">{user.nameEn}</p>}
                  </td>
                  <td className="px-5 py-3 text-gray-500 text-xs">{user.email}</td>
                  <td className="px-5 py-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${roleBadge[user.role] ?? "bg-gray-100 text-gray-600"}`}>
                      {roleLabel[user.role] ?? user.role}
                    </span>
                  </td>
                  <td className="px-5 py-3 tabular-nums text-gray-700">{user.points}</td>
                  <td className="px-5 py-3 text-gray-400 text-xs">
                    {new Date(user.createdAt).toLocaleDateString(locale === "ar" ? "ar-SA" : "en-US")}
                  </td>
                  <td className="px-5 py-3">
                    <select
                      value={user.role}
                      disabled={changingRole[user.id]}
                      onChange={(e) => changeRole(user.id, e.target.value)}
                      className="text-xs px-2 py-1.5 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-green-500 disabled:opacity-50 cursor-pointer"
                    >
                      {ROLES.map((r) => (
                        <option key={r} value={r}>{ROLE_AR[r]} — {ROLE_EN[r]}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-5 py-3">
                    <button
                      onClick={() => setEditingUser(user)}
                      className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1.5 border border-gray-200 rounded-lg text-gray-600 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 transition-colors"
                      title={t("editUserTitle")}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {pagination && pagination.pages > 1 && (
          <div className="px-5 py-3 border-t border-gray-100 flex items-center justify-between">
            <p className="text-xs text-gray-500">
              {locale === "ar"
                ? `صفحة ${pagination.page} من ${pagination.pages}`
                : `Page ${pagination.page} of ${pagination.pages}`}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={pagination.page <= 1}
                className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50 transition-colors"
              >
                {t("prev")}
              </button>
              <button
                onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
                disabled={pagination.page >= pagination.pages}
                className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50 transition-colors"
              >
                {t("next")}
              </button>
            </div>
          </div>
        )}
      </div>

      {showAddModal && (
        <AddUserModal onClose={() => setShowAddModal(false)} onSuccess={handleUserCreated} />
      )}

      {editingUser && (
        <EditUserModal
          user={editingUser}
          onClose={() => setEditingUser(null)}
          onSuccess={handleUserUpdated}
        />
      )}

      <ToastContainer toasts={toasts} onRemove={(id) => setToasts((prev) => prev.filter((toast) => toast.id !== id))} />
    </div>
  );
}
