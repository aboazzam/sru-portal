import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/dal";
import { newsArticles, newsCategories } from "@/lib/mock/news";

export default async function NewsDashboard() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const featured = newsArticles.find((a) => a.featured) ?? newsArticles[0];
  const recent   = newsArticles.filter((a) => a.id !== featured.id).slice(0, 6);

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("ar-SA", { day: "numeric", month: "long", year: "numeric" });

  return (
    <div className="space-y-6">

      {/* Header */}
      <div
        className="rounded-2xl p-6 text-white shadow-sm"
        style={{ background: "linear-gradient(135deg, #7C3AED 0%, #5B21B6 100%)" }}
      >
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <p className="text-white/70 text-xs mb-1">الأخبار الجامعية — جامعة سليمان الراجحي</p>
            <h1 className="text-xl font-bold">مرحباً، {user.name.split(" ")[0]} 👋</h1>
            <p className="text-white/80 text-sm mt-0.5">ابقَ على اطلاع بآخر أخبار الجامعة وفعالياتها</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-xl font-bold">
            {user.name.charAt(0)}
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between gap-4 flex-wrap">
          <p className="text-white/70 text-sm">{newsArticles.length} خبر · {newsCategories.length} تصنيفات</p>
          <Link
            href="/news/all"
            className="text-xs font-bold px-4 py-2 rounded-xl text-white transition-all hover:bg-white/20"
            style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.3)" }}
          >
            جميع الأخبار ←
          </Link>
        </div>
      </div>

      {/* Featured article */}
      <Link href={`/news/${featured.id}`} className="block group">
        <div className="bg-white rounded-2xl border border-[#E8EDEF] shadow-sm overflow-hidden hover:shadow-md transition-shadow">
          <div className="h-2" style={{ background: "linear-gradient(to left, #7C3AED, #5B21B6)" }} />
          <div className="p-6">
            <div className="flex items-start gap-4">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shrink-0"
                style={{ background: "#F5F3FF" }}
              >
                {featured.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span
                    className="text-xs font-bold px-2.5 py-1 rounded-full"
                    style={{ background: "#F5F3FF", color: "#7C3AED" }}
                  >
                    ⭐ خبر مميز
                  </span>
                  <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-[#F4F7F8] text-[#506570]">
                    {featured.category}
                  </span>
                </div>
                <h2 className="text-base font-bold text-[#1F2937] leading-snug group-hover:text-[#7C3AED] transition-colors">
                  {featured.title}
                </h2>
                <p className="text-sm text-[#6B7280] mt-2 leading-relaxed line-clamp-2">{featured.summary}</p>
                <p className="text-xs text-[#9CA3AF] mt-3">📅 {formatDate(featured.date)}</p>
              </div>
            </div>
          </div>
        </div>
      </Link>

      {/* Recent articles grid + categories */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Articles grid (2/3 width) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-[#1A2A30] text-sm flex items-center gap-2">
              <span>🕐</span> آخر الأخبار
            </h2>
            <Link href="/news/all" className="text-xs font-medium hover:underline" style={{ color: "#7C3AED" }}>
              عرض الكل
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {recent.map((article) => (
              <Link key={article.id} href={`/news/${article.id}`} className="block group">
                <div className="bg-white rounded-2xl border border-[#E8EDEF] shadow-sm hover:shadow-md transition-shadow p-4 h-full flex flex-col gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#F5F3FF] flex items-center justify-center text-xl shrink-0">
                      {article.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-[#F4F7F8] text-[#506570]">
                        {article.category}
                      </span>
                      <h3 className="mt-1 font-semibold text-sm text-[#1F2937] leading-snug group-hover:text-[#7C3AED] transition-colors line-clamp-2">
                        {article.title}
                      </h3>
                    </div>
                  </div>
                  <p className="text-xs text-[#6B7280] leading-relaxed line-clamp-2 flex-1">{article.summary}</p>
                  <p className="text-xs text-[#9CA3AF]">📅 {formatDate(article.date)}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Categories sidebar (1/3 width) */}
        <div className="space-y-4">
          <h2 className="font-bold text-[#1A2A30] text-sm flex items-center gap-2">
            <span>🏷️</span> التصنيفات
          </h2>
          <div className="bg-white rounded-2xl border border-[#E8EDEF] shadow-sm overflow-hidden">
            <div className="divide-y divide-[#F4F7F8]">
              {newsCategories.map((cat) => {
                const count = newsArticles.filter((a) => a.category === cat.label).length;
                return (
                  <Link
                    key={cat.label}
                    href={`/news/all?category=${encodeURIComponent(cat.label)}`}
                    className="flex items-center justify-between px-5 py-3.5 hover:bg-[#F5F3FF] transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{cat.icon}</span>
                      <span className="text-sm font-medium text-[#374151] group-hover:text-[#7C3AED] transition-colors">
                        {cat.label}
                      </span>
                    </div>
                    <span
                      className="text-xs font-bold px-2.5 py-1 rounded-full"
                      style={{ background: "#F5F3FF", color: "#7C3AED" }}
                    >
                      {count}
                    </span>
                  </Link>
                );
              })}
            </div>
            <div className="px-5 py-3 bg-[#F4F7F8] border-t border-[#E8EDEF]">
              <Link
                href="/news/all"
                className="text-xs font-semibold flex items-center justify-center hover:opacity-80 transition-opacity"
                style={{ color: "#7C3AED" }}
              >
                عرض جميع الأخبار ←
              </Link>
            </div>
          </div>

          {/* Quick stat */}
          <div
            className="rounded-2xl px-5 py-4 flex items-start gap-3"
            style={{ background: "linear-gradient(to left, #F5F3FF, #EDE9FE)", border: "1px solid #C4B5FD" }}
          >
            <span className="text-2xl shrink-0">📣</span>
            <div>
              <p className="font-bold text-[#5B21B6] text-sm mb-1">ابقَ على اطلاع</p>
              <p className="text-xs text-[#7C3AED] leading-relaxed">
                تابع أخبار الجامعة يومياً للاطلاع على أحدث الفعاليات والإعلانات الأكاديمية والفرص الطلابية.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
