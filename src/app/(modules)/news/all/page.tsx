import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/dal";
import { newsArticles, newsCategories, type NewsCategory } from "@/lib/mock/news";

export default async function AllNewsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const { category } = await searchParams;
  const activeCategory = category as NewsCategory | undefined;

  const filtered = activeCategory
    ? newsArticles.filter((a) => a.category === activeCategory)
    : newsArticles;

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("ar-SA", { day: "numeric", month: "long", year: "numeric" });

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#1A2A30]">جميع الأخبار</h1>
        <p className="text-sm text-[#8FA4AB] mt-1">
          {filtered.length} خبر {activeCategory ? `في "${activeCategory}"` : ""}
        </p>
      </div>

      {/* Category filter tabs */}
      <div className="flex items-center gap-2 flex-wrap">
        <Link
          href="/news/all"
          className={`text-xs font-semibold px-4 py-2 rounded-xl transition-all ${
            !activeCategory
              ? "text-white shadow-sm"
              : "bg-white border border-[#E8EDEF] text-[#506570] hover:bg-[#F5F3FF] hover:text-[#7C3AED]"
          }`}
          style={!activeCategory ? { background: "#7C3AED" } : undefined}
        >
          الكل ({newsArticles.length})
        </Link>
        {newsCategories.map((cat) => {
          const count   = newsArticles.filter((a) => a.category === cat.label).length;
          const isActive = activeCategory === cat.label;
          return (
            <Link
              key={cat.label}
              href={`/news/all?category=${encodeURIComponent(cat.label)}`}
              className={`text-xs font-semibold px-4 py-2 rounded-xl transition-all ${
                isActive
                  ? "text-white shadow-sm"
                  : "bg-white border border-[#E8EDEF] text-[#506570] hover:bg-[#F5F3FF] hover:text-[#7C3AED]"
              }`}
              style={isActive ? { background: "#7C3AED" } : undefined}
            >
              {cat.icon} {cat.label} ({count})
            </Link>
          );
        })}
      </div>

      {/* Articles grid */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#E8EDEF] px-6 py-16 text-center">
          <p className="text-4xl mb-2">📭</p>
          <p className="text-sm text-[#8FA4AB]">لا توجد أخبار في هذا التصنيف</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map((article) => (
            <Link key={article.id} href={`/news/${article.id}`} className="block group">
              <div className="bg-white rounded-2xl border border-[#E8EDEF] shadow-sm hover:shadow-md transition-shadow flex flex-col h-full overflow-hidden">
                <div className="h-2" style={{ background: "linear-gradient(to left, #7C3AED, #5B21B6)" }} />
                <div className="p-5 flex flex-col gap-3 flex-1">
                  <div className="flex items-start gap-3">
                    <div className="w-11 h-11 rounded-xl bg-[#F5F3FF] flex items-center justify-center text-2xl shrink-0">
                      {article.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-[#F4F7F8] text-[#506570]">
                        {article.category}
                      </span>
                      {article.featured && (
                        <span className="mr-1 text-xs font-bold px-2 py-0.5 rounded-full bg-[#F5F3FF] text-[#7C3AED]">
                          ⭐ مميز
                        </span>
                      )}
                    </div>
                  </div>

                  <h3 className="font-bold text-sm text-[#1F2937] leading-snug group-hover:text-[#7C3AED] transition-colors line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-xs text-[#6B7280] leading-relaxed line-clamp-3 flex-1">{article.summary}</p>

                  <div className="flex items-center justify-between mt-auto pt-2 border-t border-[#F4F7F8]">
                    <p className="text-xs text-[#9CA3AF]">📅 {formatDate(article.date)}</p>
                    <span className="text-xs font-semibold" style={{ color: "#7C3AED" }}>اقرأ المزيد ←</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
