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
  STUDENT:  "طالب",
  FACULTY:  "هيئة التدريس",
  ADMIN:    "مدير",
  ORGANIZER:"منظم",
  SUBADMIN: "مشرف",
};

const roleStyle: Record<string, string> = {
  STUDENT:  "bg-blue-100 text-blue-700",
  FACULTY:  "bg-green-100 text-green-700",
  ADMIN:    "bg-purple-100 text-purple-700",
  ORGANIZER:"bg-orange-100 text-orange-700",
  SUBADMIN: "bg-gray-100 text-gray-700",
};

const ROLES = ["", "STUDENT", "FACULTY", "ADMIN", "ORGANIZER", "SUBADMIN"];

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  // Debounce search; immediately apply role/page changes
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchUsers(search, role, page);
    }, 300);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [search, role, page, fetchUsers]);

  function handleSearch(v: string) {
    setSearch(v);
    setPage(1);
  }

  function handleRole(v: string) {
    setRole(v);
    setPage(1);
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">المستخدمون</h1>
        <p className="text-gray-500 text-sm mt-0.5">
          {pagination ? `${pagination.total.toLocaleString("ar")} مستخدم` : "جارٍ التحميل…"}
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="بحث بالاسم أو البريد الإلكتروني…"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-4 pr-10 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          {loading && (
            <span className="absolute end-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">⏳</span>
          )}
        </div>
        <select
          value={role}
          onChange={(e) => handleRole(e.target.value)}
          className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
        >
          <option value="">كل الأدوار</option>
          {ROLES.filter(Boolean).map((r) => (
            <option key={r} value={r}>{roleLabel[r] ?? r}</option>
          ))}
        </select>
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
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading && users.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-gray-400">
                    جارٍ التحميل…
                  </td>
                </tr>
              )}
              {!loading && users.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-gray-400">
                    لا يوجد مستخدمون مطابقون
                  </td>
                </tr>
              )}
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3 font-medium text-gray-900">{user.name}</td>
                  <td className="px-5 py-3 text-gray-500 text-xs">{user.email}</td>
                  <td className="px-5 py-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${roleStyle[user.role] ?? "bg-gray-100 text-gray-600"}`}>
                      {roleLabel[user.role] ?? user.role}
                    </span>
                  </td>
                  <td className="px-5 py-3 tabular-nums text-gray-700">{user.points}</td>
                  <td className="px-5 py-3 text-gray-400 text-xs">
                    {new Date(user.createdAt).toLocaleDateString("ar-SA")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
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
    </div>
  );
}
