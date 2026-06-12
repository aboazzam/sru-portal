import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/dal";
import { newsArticles, newsCategories } from "@/lib/mock/news";

export default async function NewsArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const { id } = await params;
  const article = newsArticles.find((a) => a.id === id);
  if (!article) notFound();

  const related = newsArticles
    .filter((a) => a.id !== article.id && a.category === article.category)
    .slice(0, 3);

  const catMeta = newsCategories.find((c) => c.label === article.category);

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("ar-SA", { day: "numeric", month: "long", year: "numeric" });

  return (
    <div className="space-y-6 max-w-4xl">

      {/* Back breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-[#8FA4AB]">
        <Link href="/news" className="hover:text-[#7C3AED] transition-colors">الأخبار</Link>
        <span>/</span>
        <Link href="/news/all" className="hover:text-[#7C3AED] transition-colors">جميع الأخبار</Link>
        <span>/</span>
        <span className="text-[#1A2A30] font-medium line-clamp-1">{article.title}</span>
      </div>

      {/* Article card */}
      <article className="bg-white rounded-2xl border border-[#E8EDEF] shadow-sm overflow-hidden">
        <div className="h-2" style={{ background: "linear-gradient(to left, #7C3AED, #5B21B6)" }} />
        <div className="p-6 sm:p-8 space-y-6">

          {/* Meta */}
          <div className="flex items-start gap-5">
            <div className="w-16 h-16 rounded-2xl bg-[#F5F3FF] flex items-center justify-center text-3xl shrink-0">
              {article.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span
                  className="text-xs font-bold px-2.5 py-1 rounded-full"
                  style={{ background: "#F5F3FF", color: "#7C3AED" }}
                >
                  {catMeta?.icon} {article.category}
                </span>
                {article.featured && (
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#FEF9C3] text-[#854D0E]">
                    ⭐ خبر مميز
                  </span>
                )}
              </div>
              <h1 className="text-lg sm:text-xl font-bold text-[#1F2937] leading-snug">
                {article.title}
              </h1>
              <p className="text-xs text-[#9CA3AF] mt-2">📅 {formatDate(article.date)}</p>
            </div>
          </div>

          {/* Summary */}
          <div
            className="rounded-xl px-5 py-4"
            style={{ background: "#F5F3FF", borderRight: "3px solid #7C3AED" }}
          >
            <p className="text-sm text-[#5B21B6] leading-relaxed font-medium">{article.summary}</p>
          </div>

          {/* Body paragraphs */}
          <div className="space-y-4">
            {article.body.map((para, i) => (
              <p key={i} className="text-sm text-[#374151] leading-loose">
                {para}
              </p>
            ))}
          </div>

        </div>
      </article>

      {/* Related articles */}
      {related.length > 0 && (
        <section>
          <h2 className="font-bold text-[#1A2A30] text-sm mb-4 flex items-center gap-2">
            <span>🔗</span> أخبار ذات صلة
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {related.map((rel) => (
              <Link key={rel.id} href={`/news/${rel.id}`} className="block group">
                <div className="bg-white rounded-2xl border border-[#E8EDEF] shadow-sm hover:shadow-md transition-shadow p-4 flex flex-col gap-2 h-full">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{rel.icon}</span>
                    <span className="text-xs font-medium text-[#506570]">{rel.category}</span>
                  </div>
                  <h3 className="text-sm font-semibold text-[#1F2937] leading-snug group-hover:text-[#7C3AED] transition-colors line-clamp-2 flex-1">
                    {rel.title}
                  </h3>
                  <p className="text-xs text-[#9CA3AF]">📅 {formatDate(rel.date)}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Back button */}
      <div>
        <Link
          href="/news/all"
          className="inline-flex items-center gap-2 text-xs font-bold px-5 py-2.5 rounded-xl text-white transition-opacity hover:opacity-90"
          style={{ background: "linear-gradient(to left, #7C3AED, #5B21B6)" }}
        >
          ← العودة إلى جميع الأخبار
        </Link>
      </div>

    </div>
  );
}
