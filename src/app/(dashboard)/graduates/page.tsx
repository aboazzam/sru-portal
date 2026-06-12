import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/dal";
import { prisma } from "@/lib/db";
import {
  jobOpportunities,
  alumniEvents,
} from "@/lib/mock/alumni";

const eventTypeIcon: Record<string, string> = {
  networking: "🤝",
  career:     "💼",
  workshop:   "🛠️",
  ceremony:   "🏆",
  social:     "🎉",
};

const jobTypeLabel: Record<string, string> = {
  fulltime: "دوام كامل",
  parttime: "دوام جزئي",
  remote:   "عن بُعد",
  contract: "عقد مؤقت",
};

export default async function GraduatesPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  // Real DB data for this user
  const [userRecord, schApps, trainingEnrollments, volunteerApps] = await Promise.all([
    prisma.user.findUnique({ where: { id: user.id }, select: { points: true, createdAt: true } }),
    prisma.scholarshipApplication.count({ where: { userId: user.id } }),
    prisma.trainingEnrollment.count({ where: { userId: user.id } }),
    prisma.volunteerApplication.count({ where: { userId: user.id } }),
  ]);

  // Mock: upcoming events & featured jobs
  const upcomingEvents = alumniEvents
    .filter((e) => new Date(e.date) >= new Date())
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 3);

  const featuredJobs = jobOpportunities.filter((j) => j.featured).slice(0, 3);
  const allJobs = jobOpportunities.slice(0, 4);

  const quickLinks = [
    { href: "/alumni/profile",     icon: "👤", label: "ملفي الشخصي",     color: "bg-rose-50   border-rose-200   text-rose-700"   },
    { href: "/alumni/jobs",        icon: "💼", label: "فرص العمل",         color: "bg-purple-50 border-purple-200 text-purple-700" },
    { href: "/alumni/documents",   icon: "📄", label: "وثائقي",            color: "bg-blue-50   border-blue-200   text-blue-700"   },
    { href: "/alumni/network",     icon: "🤝", label: "الشبكة المهنية",    color: "bg-teal-50   border-teal-200   text-teal-700"   },
    { href: "/alumni/development", icon: "📈", label: "التطوير المهني",    color: "bg-green-50  border-green-200  text-green-700"  },
    { href: "/alumni/contribute",  icon: "❤️", label: "المساهمة والعطاء", color: "bg-pink-50   border-pink-200   text-pink-700"   },
  ];

  return (
    <div className="space-y-6">

      {/* Welcome card */}
      <div
        className="rounded-2xl p-6 text-white shadow-sm"
        style={{ background: "linear-gradient(135deg, #BE185D 0%, #9F1239 100%)" }}
      >
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <p className="text-rose-300 text-xs mb-1">بوابة الخريجين — جامعة سليمان الراجحي</p>
            <h1 className="text-2xl font-bold">مرحباً، {user.name.split(" ")[0]} 🎓</h1>
            <p className="text-rose-200 text-sm mt-1">
              {(userRecord?.points ?? 0) > 0 && `${userRecord!.points} نقطة · `}
              عضو منذ {new Date(userRecord?.createdAt ?? Date.now()).toLocaleDateString("ar-SA", { month: "long", year: "numeric" })}
            </p>
          </div>
          <div className="shrink-0 w-14 h-14 rounded-full bg-white/20 flex items-center justify-center text-2xl font-bold text-white">
            {user.name.charAt(0)}
          </div>
        </div>

        {/* Stats row */}
        <div className="mt-5 grid grid-cols-3 gap-3">
          {[
            { label: "طلبات المنح",     value: schApps,          icon: "🎓" },
            { label: "برامج التدريب",   value: trainingEnrollments, icon: "📋" },
            { label: "فرص تطوعية",      value: volunteerApps,    icon: "🤲" },
          ].map((s) => (
            <div key={s.label} className="bg-white/15 rounded-xl p-3 text-center">
              <p className="text-lg">{s.icon}</p>
              <p className="text-xl font-bold">{s.value}</p>
              <p className="text-rose-200 text-[10px] mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {quickLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`flex flex-col items-center gap-2 p-4 rounded-xl border font-medium text-sm transition-all hover:shadow-sm hover:-translate-y-0.5 text-center ${link.color}`}
          >
            <span className="text-xl">{link.icon}</span>
            <span className="text-xs leading-tight">{link.label}</span>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Upcoming events */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span>📅</span>
              <h2 className="font-bold text-gray-800 text-sm">الفعاليات القادمة</h2>
            </div>
            <Link href="/alumni/events" className="text-xs text-rose-600 hover:underline font-medium">
              كل الفعاليات
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {upcomingEvents.map((ev) => (
              <div key={ev.id} className="px-5 py-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start gap-3">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-lg shrink-0"
                    style={{ background: ev.color + "18" }}
                  >
                    {eventTypeIcon[ev.type]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-gray-800 leading-snug">{ev.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {new Date(ev.date).toLocaleDateString("ar-SA", { day: "numeric", month: "long" })}
                      {" · "}{ev.time}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {ev.online ? "🌐" : "📍"} {ev.location}
                    </p>
                    <div className="mt-1.5">
                      {ev.registered ? (
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-green-100 text-green-700">
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
          <div className="px-5 py-3 bg-gray-50 border-t border-gray-100">
            <Link href="/alumni/events" className="text-xs font-semibold text-rose-600 hover:underline flex items-center justify-center gap-1">
              استعرض جميع الفعاليات ←
            </Link>
          </div>
        </div>

        {/* Job opportunities */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span>💼</span>
              <h2 className="font-bold text-gray-800 text-sm">فرص العمل</h2>
            </div>
            <Link href="/alumni/jobs" className="text-xs text-rose-600 hover:underline font-medium">
              عرض الكل ({jobOpportunities.length})
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {allJobs.map((job) => {
              const daysLeft = Math.max(0, Math.ceil(
                (new Date(job.deadline).getTime() - Date.now()) / 86400000
              ));
              return (
                <div key={job.id} className="px-5 py-3.5 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-purple-50 flex items-center justify-center text-lg shrink-0">
                      {job.logo}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="font-semibold text-sm text-gray-800 truncate">{job.title}</p>
                          <p className="text-xs text-gray-500">{job.company} · {job.location}</p>
                        </div>
                        {job.featured && (
                          <span className="shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700">
                            ⭐
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-purple-50 text-purple-700">
                          {jobTypeLabel[job.type]}
                        </span>
                        <span className="text-[10px] text-gray-400">💰 {job.salary}</span>
                        <span className={`text-[10px] ${daysLeft <= 7 ? "text-red-500 font-semibold" : "text-gray-400"}`}>
                          ⏰ {daysLeft > 0 ? `${daysLeft} يوم` : "انتهى"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="px-5 py-3 bg-gray-50 border-t border-gray-100">
            <Link href="/alumni/jobs" className="text-xs font-semibold text-rose-600 hover:underline flex items-center justify-center gap-1">
              عرض جميع الوظائف ←
            </Link>
          </div>
        </div>

      </div>

      {/* Alumni module sections */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5">
        <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
          <span>🎓</span>
          خدمات بوابة الخريجين
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            {
              href: "/alumni/card",
              icon: "🪪",
              title: "بطاقة الخريج",
              desc: "استخرج بطاقة الخريج الرسمية",
              color: "border-rose-200 bg-rose-50",
              btn: "bg-rose-600 hover:bg-rose-700",
            },
            {
              href: "/alumni/development",
              icon: "📈",
              title: "التطوير المهني",
              desc: "دورات وشهادات لتعزيز مسيرتك",
              color: "border-purple-200 bg-purple-50",
              btn: "bg-purple-600 hover:bg-purple-700",
            },
            {
              href: "/alumni/network",
              icon: "🤝",
              title: "شبكة الخريجين",
              desc: "تواصل مع خريجي الجامعة",
              color: "border-teal-200 bg-teal-50",
              btn: "bg-teal-600 hover:bg-teal-700",
            },
            {
              href: "/alumni/contribute",
              icon: "❤️",
              title: "المساهمة والعطاء",
              desc: "ساهم في دعم مجتمعك الجامعي",
              color: "border-pink-200 bg-pink-50",
              btn: "bg-pink-600 hover:bg-pink-700",
            },
          ].map((card) => (
            <div key={card.href} className={`rounded-xl border p-4 flex flex-col gap-3 ${card.color}`}>
              <div className="flex items-center gap-2">
                <span className="text-xl">{card.icon}</span>
                <h3 className="font-bold text-gray-800 text-sm">{card.title}</h3>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed flex-1">{card.desc}</p>
              <Link
                href={card.href}
                className={`block text-center py-2 rounded-lg text-white text-xs font-semibold transition-colors ${card.btn}`}
              >
                الدخول
              </Link>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
