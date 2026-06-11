import Link from "next/link";
import {
  alumniProfile,
  alumniPersonalStats,
  jobOpportunities,
  alumniEvents,
  alumniNews,
  type NewsCategory,
  type EventType,
} from "@/lib/mock/alumni";

const jobTypeLabel: Record<string, string> = {
  fulltime: "دوام كامل",
  parttime: "دوام جزئي",
  remote:   "عن بُعد",
  contract: "عقد مؤقت",
};

const newsCategoryConfig: Record<NewsCategory, { label: string; color: string; bg: string }> = {
  university: { label: "الجامعة",   color: "#4A8FA0", bg: "#E8F6F8" },
  alumni:     { label: "خريجون",    color: "#875E9E", bg: "#F3EEF7" },
  career:     { label: "مهني",      color: "#16A34A", bg: "#DCFCE7" },
  event:      { label: "فعالية",    color: "#D97706", bg: "#FEF3C7" },
};

const eventTypeIcon: Record<EventType, string> = {
  networking: "🤝",
  career:     "💼",
  workshop:   "🛠️",
  ceremony:   "🏆",
  social:     "🎉",
};

function fmt(date: string) {
  return new Date(date).toLocaleDateString("ar-SA", {
    day: "numeric", month: "long", year: "numeric",
  });
}

export default function AlumniDashboardPage() {
  const { name, major, graduationYear, honor, profileCompletion, currentJob, college } = alumniProfile;

  // أقرب فعاليتين قادمتين
  const upcomingEvents = alumniEvents
    .filter((e) => new Date(e.date) >= new Date())
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 2);

  // وظائف موصى بها لتخصص الخريج
  const recommendedJobs = jobOpportunities
    .filter((j) => j.majors.includes(major))
    .slice(0, 3);

  return (
    <div className="space-y-6">

      {/* ── بطاقة الترحيب ── */}
      <div
        className="rounded-2xl p-6 text-white shadow-sm"
        style={{ background: "linear-gradient(135deg, #875E9E 0%, #6CAEBD 100%)" }}
      >
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <p className="text-white/70 text-xs mb-1">{college}</p>
            <h1 className="text-xl font-bold">مرحباً، {name.split(" ")[0]} 👋</h1>
            <p className="text-white/80 text-sm mt-0.5">{major} — دفعة {graduationYear}</p>
            {currentJob && (
              <p className="text-white/70 text-xs mt-1">💼 {currentJob}</p>
            )}
          </div>
          {/* Honor badge */}
          <div
            className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold"
            style={{ background: "rgba(255,215,0,0.25)", color: "#FFD700", border: "1px solid rgba(255,215,0,0.4)" }}
          >
            🏅 {honor}
          </div>
        </div>

        {/* Profile completion */}
        <div className="mt-5">
          <div className="flex justify-between text-xs text-white/80 mb-1.5">
            <span>اكتمال الملف الشخصي</span>
            <span>{profileCompletion}%</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2.5">
            <div
              className="h-2.5 rounded-full bg-white transition-all"
              style={{ width: `${profileCompletion}%` }}
            />
          </div>
          {profileCompletion < 100 && (
            <div className="mt-2 flex items-center justify-between">
              <p className="text-white/60 text-xs">أكمل ملفك للحصول على توصيات وظيفية أفضل</p>
              <Link
                href="/alumni/profile"
                className="text-xs font-semibold underline text-white/80 hover:text-white transition-colors"
              >
                أكمل الآن ←
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* ── 6 بطاقات الإحصاء ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {alumniPersonalStats.map((s) => (
          <div
            key={s.id}
            className="bg-white rounded-xl border border-[#E8EDEF] p-4 text-center hover:shadow-sm transition-shadow"
          >
            <div className="text-2xl mb-1">{s.icon}</div>
            <p className="text-xl font-bold" style={{ color: s.color }}>{s.value}</p>
            <p className="text-xs text-[#8FA4AB] mt-0.5 leading-tight">{s.label}</p>
          </div>
        ))}
      </div>

      {/* ── الوظائف الموصى بها ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#E8EDEF] overflow-hidden">
        <div className="px-5 py-4 border-b border-[#E8EDEF] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span>💼</span>
            <h2 className="font-bold text-[#1A2A30] text-sm">وظائف موصى بها لك</h2>
          </div>
          <Link href="/alumni/jobs" className="text-xs font-medium hover:underline" style={{ color: "#875E9E" }}>
            عرض الكل
          </Link>
        </div>
        <div className="divide-y divide-[#F4F7F8]">
          {recommendedJobs.map((job) => (
            <div
              key={job.id}
              className="px-5 py-4 hover:bg-[#F9FAFB] transition-colors"
            >
              <div className="flex items-start gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
                  style={{ background: "#F3EEF7" }}
                >
                  {job.logo}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 flex-wrap">
                    <div>
                      <p className="font-semibold text-sm text-[#1F2937]">{job.title}</p>
                      <p className="text-xs text-[#6B7280] mt-0.5">{job.company} · {job.location}</p>
                    </div>
                    {job.featured && (
                      <span
                        className="shrink-0 text-xs font-bold px-2 py-0.5 rounded-full"
                        style={{ background: "#FEF3C7", color: "#D97706" }}
                      >
                        ⭐ مميزة
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-2 flex-wrap">
                    <span
                      className="text-xs font-medium px-2 py-0.5 rounded-full"
                      style={{ background: "#F3EEF7", color: "#875E9E" }}
                    >
                      {jobTypeLabel[job.type]}
                    </span>
                    <span className="text-xs text-[#6B7280]">💰 {job.salary}</span>
                    <span className="text-xs text-[#9CA3AF]">
                      آخر موعد: {new Date(job.deadline).toLocaleDateString("ar-SA", { day: "numeric", month: "short" })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="px-5 py-3 bg-[#F4F7F8] border-t border-[#E8EDEF]">
          <Link
            href="/alumni/jobs"
            className="text-xs font-semibold flex items-center justify-center gap-1 hover:opacity-80 transition-opacity"
            style={{ color: "#875E9E" }}
          >
            عرض جميع فرص العمل ←
          </Link>
        </div>
      </div>

      {/* ── الفعاليات القادمة + آخر الأخبار ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* الفعاليات القادمة */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#E8EDEF] overflow-hidden">
          <div className="px-5 py-4 border-b border-[#E8EDEF] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span>📅</span>
              <h2 className="font-bold text-[#1A2A30] text-sm">الفعاليات القادمة</h2>
            </div>
            <Link href="/alumni/events" className="text-xs font-medium hover:underline" style={{ color: "#875E9E" }}>
              كل الفعاليات
            </Link>
          </div>
          <div className="divide-y divide-[#F4F7F8]">
            {upcomingEvents.map((ev) => (
              <div key={ev.id} className="px-5 py-4 hover:bg-[#F9FAFB] transition-colors">
                <div className="flex items-start gap-3">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-lg shrink-0"
                    style={{ background: ev.color + "18" }}
                  >
                    {eventTypeIcon[ev.type]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-[#1F2937] leading-snug">{ev.title}</p>
                    <p className="text-xs text-[#9CA3AF] mt-1">
                      {fmt(ev.date)} · {ev.time}
                    </p>
                    <p className="text-xs text-[#6B7280] mt-0.5 truncate">
                      {ev.online ? "🌐" : "📍"} {ev.location}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      {ev.registered ? (
                        <span
                          className="text-xs font-semibold px-2 py-0.5 rounded-full"
                          style={{ background: "#DCFCE7", color: "#16A34A" }}
                        >
                          ✅ مسجّل
                        </span>
                      ) : (
                        <span
                          className="text-xs font-semibold px-2 py-0.5 rounded-full"
                          style={{ background: ev.color + "18", color: ev.color }}
                        >
                          {ev.seatsLeft} مقعد متبقٍ
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* آخر الأخبار */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#E8EDEF] overflow-hidden">
          <div className="px-5 py-4 border-b border-[#E8EDEF] flex items-center gap-2">
            <span>📰</span>
            <h2 className="font-bold text-[#1A2A30] text-sm">آخر الأخبار والتحديثات</h2>
          </div>
          <div className="divide-y divide-[#F4F7F8]">
            {alumniNews.slice(0, 3).map((news) => {
              const cat = newsCategoryConfig[news.category];
              return (
                <div key={news.id} className="px-5 py-4 hover:bg-[#F9FAFB] transition-colors cursor-pointer">
                  <div className="flex items-start gap-3">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center text-lg shrink-0"
                      style={{ background: cat.bg }}
                    >
                      {news.image}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className="text-xs font-semibold px-2 py-0.5 rounded-full"
                          style={{ background: cat.bg, color: cat.color }}
                        >
                          {cat.label}
                        </span>
                        <span className="text-xs text-[#9CA3AF]">{news.readTime} د قراءة</span>
                      </div>
                      <p className="font-semibold text-xs text-[#1F2937] leading-snug">{news.title}</p>
                      <p className="text-xs text-[#6B7280] mt-1 leading-relaxed line-clamp-2">{news.summary}</p>
                      <p className="text-xs text-[#9CA3AF] mt-1">
                        {new Date(news.date).toLocaleDateString("ar-SA", { day: "numeric", month: "long" })}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* ── روابط سريعة ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { href: "/alumni/profile",     label: "أكمل ملفك",       icon: "👤", color: "#875E9E" },
          { href: "/alumni/documents",   label: "وثائقي",          icon: "📄", color: "#6CAEBD" },
          { href: "/alumni/network",     label: "الشبكة المهنية",  icon: "🤝", color: "#4A8FA0" },
          { href: "/alumni/contribute",  label: "ساهم وأعطِ",      icon: "❤️", color: "#875E9E" },
        ].map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="bg-white flex flex-col items-center gap-2 p-4 rounded-xl border border-[#E8EDEF] hover:shadow-sm transition-all group text-center"
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
              style={{ background: link.color + "18" }}
            >
              {link.icon}
            </div>
            <span className="text-xs font-medium text-[#506570] group-hover:text-[#875E9E] transition-colors">
              {link.label}
            </span>
          </Link>
        ))}
      </div>

    </div>
  );
}
