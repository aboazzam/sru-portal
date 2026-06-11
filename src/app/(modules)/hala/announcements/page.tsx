"use client";
import Link from "next/link";
import { useState } from "react";
import { announcements } from "@/lib/mock/hala";

const categories = ["الكل", "أكاديمي", "إداري", "فعاليات"];

export default function AnnouncementsPage() {
  const [filter, setFilter] = useState("الكل");
  const [expanded, setExpanded] = useState<number | null>(null);

  const filtered =
    filter === "الكل" ? announcements : announcements.filter((a) => a.category === filter);

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-[#8FA4AB]">
        <Link href="/hala" className="hover:text-[#6CAEBD] transition-colors">هلا بك</Link>
        <span>/</span>
        <span className="text-[#1A2A30] font-medium">الإعلانات</span>
      </div>

      {/* Header */}
      <div className="bg-white rounded-2xl p-5 border border-[#E8EDEF] shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl" style={{ background: "#E8F6F8" }}>
            📢
          </div>
          <div>
            <h1 className="font-bold text-[#1A2A30] text-lg">إعلانات الجامعة</h1>
            <p className="text-[#8FA4AB] text-sm">{filtered.length} إعلان</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
              filter === cat
                ? "text-white shadow-sm"
                : "bg-white border border-[#E8EDEF] text-[#506570] hover:border-[#6CAEBD]"
            }`}
            style={filter === cat ? { background: "#6CAEBD" } : undefined}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Announcements list */}
      <div className="space-y-4">
        {filtered.length === 0 && (
          <div className="bg-white rounded-2xl p-12 text-center border border-[#E8EDEF]">
            <p className="text-3xl mb-3">📭</p>
            <p className="text-[#8FA4AB]">لا توجد إعلانات في هذه الفئة</p>
          </div>
        )}
        {filtered.map((a) => (
          <div
            key={a.id}
            className="bg-white rounded-2xl border border-[#E8EDEF] overflow-hidden shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="h-1" style={{ background: a.categoryColor }} />
            <div className="p-5">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span
                      className="text-xs font-bold px-2.5 py-0.5 rounded-full"
                      style={{ background: a.categoryColor + "20", color: a.categoryColor }}
                    >
                      {a.category}
                    </span>
                    <span className="text-xs text-[#9CA3AF]">
                      {new Date(a.date).toLocaleDateString("ar-SA")}
                    </span>
                  </div>
                  <h3 className="font-bold text-[#1F2937] text-base leading-snug">{a.title}</h3>
                  <p
                    className={`text-[#6B7280] text-sm mt-2 leading-relaxed ${
                      expanded === a.id ? "" : "line-clamp-2"
                    }`}
                  >
                    {a.body}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setExpanded(expanded === a.id ? null : a.id)}
                className="mt-3 text-xs font-semibold px-4 py-1.5 rounded-lg transition-colors"
                style={{ background: "#E8F6F8", color: "#4A8FA0" }}
              >
                {expanded === a.id ? "عرض أقل ↑" : "اقرأ المزيد ↓"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
