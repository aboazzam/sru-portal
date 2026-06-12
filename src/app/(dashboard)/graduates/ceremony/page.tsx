"use client";
import Link from "next/link";
import { useState } from "react";
import { ceremonyDetails, graduationTimeline } from "@/lib/mock/graduates";

export default function CeremonyPage() {
  const [registered, setRegistered] = useState(ceremonyDetails.registered);
  const [guests, setGuests] = useState(2);
  const [submitted, setSubmitted] = useState(false);

  function handleRegister() {
    setRegistered(true);
    setSubmitted(true);
  }

  const deadlinePassed = new Date(ceremonyDetails.registrationDeadline) < new Date();
  const daysLeft = Math.max(0, Math.ceil(
    (new Date(ceremonyDetails.registrationDeadline).getTime() - Date.now()) / 86400000
  ));

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Link href="/graduates" className="hover:text-rose-600 transition-colors">الخريجون</Link>
        <span>/</span>
        <span className="text-gray-800 font-medium">حفل التخرج</span>
      </div>

      <h1 className="text-2xl font-bold text-gray-900">حفل التخرج 🎓</h1>

      {/* Main info card */}
      <div
        className="rounded-2xl p-6 text-white shadow-sm"
        style={{ background: "linear-gradient(135deg, #BE185D 0%, #9F1239 100%)" }}
      >
        <div className="flex items-center gap-3 mb-4">
          <span className="text-4xl">🏆</span>
          <div>
            <p className="text-rose-200 text-xs">حفل التخرج السنوي</p>
            <h2 className="text-xl font-bold">جامعة سليمان الراجحي</h2>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { icon: "📅", label: "التاريخ",   value: new Date(ceremonyDetails.date).toLocaleDateString("ar-SA", { day: "numeric", month: "long", year: "numeric" }) },
            { icon: "🕙", label: "الوقت",     value: ceremonyDetails.time },
            { icon: "📍", label: "المكان",    value: ceremonyDetails.venue },
            { icon: "👥", label: "عدد الضيوف المسموح", value: `${ceremonyDetails.guestsAllowed} ضيوف` },
          ].map((item) => (
            <div key={item.label} className="bg-white/15 rounded-xl p-3">
              <p className="text-lg mb-1">{item.icon}</p>
              <p className="text-rose-200 text-[10px]">{item.label}</p>
              <p className="font-semibold text-sm mt-0.5 leading-snug">{item.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Registration card */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-800">التسجيل في الحفل</h2>
          </div>
          <div className="p-5">
            {submitted || registered ? (
              <div className="text-center py-6">
                <p className="text-5xl mb-3">🎉</p>
                <h3 className="font-bold text-gray-800 text-lg">تم التسجيل بنجاح!</h3>
                <p className="text-gray-500 text-sm mt-1">
                  تم تسجيلك في حفل التخرج مع {guests} ضيوف.
                </p>
                <p className="text-gray-400 text-xs mt-3">
                  ستصلك رسالة تأكيد على بريدك الجامعي قريباً.
                </p>
              </div>
            ) : deadlinePassed ? (
              <div className="text-center py-6">
                <p className="text-4xl mb-2">⏰</p>
                <p className="text-gray-500 text-sm">انتهى موعد التسجيل</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-rose-50 border border-rose-200">
                  <span className="text-rose-700 text-sm font-medium">⏳ المتبقي للتسجيل</span>
                  <span className="text-rose-700 font-bold">{daysLeft} يوم</span>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">عدد الضيوف</label>
                  <select
                    value={guests}
                    onChange={(e) => setGuests(Number(e.target.value))}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                  >
                    {Array.from({ length: ceremonyDetails.guestsAllowed }, (_, i) => i + 1).map((n) => (
                      <option key={n} value={n}>{n} {n === 1 ? "ضيف" : "ضيوف"}</option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-400 mt-1">الحد الأقصى: {ceremonyDetails.guestsAllowed} ضيوف</p>
                </div>

                <button
                  onClick={handleRegister}
                  className="w-full py-3 bg-rose-600 text-white rounded-xl font-bold hover:bg-rose-700 transition-colors"
                >
                  تأكيد التسجيل
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Details */}
        <div className="space-y-4">
          {/* Rehearsal */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">🎭</span>
              <h3 className="font-semibold text-gray-800 text-sm">البروفا العامة</h3>
            </div>
            <div className="space-y-2 text-sm text-gray-600">
              <p>📅 {new Date(ceremonyDetails.rehearsalDate).toLocaleDateString("ar-SA", { weekday: "long", day: "numeric", month: "long" })}</p>
              <p>🕓 {ceremonyDetails.rehearsalTime}</p>
              <p>📍 {ceremonyDetails.venue}</p>
              <p className="text-xs text-gray-400 mt-2">الحضور إلزامي لجميع المتخرجين</p>
            </div>
          </div>

          {/* Dresscode */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">👔</span>
              <h3 className="font-semibold text-gray-800 text-sm">الزي الرسمي</h3>
            </div>
            <p className="text-sm text-gray-600">{ceremonyDetails.dresscode}</p>
            <div className="mt-3 p-3 rounded-lg bg-amber-50 border border-amber-200">
              <p className="text-xs text-amber-700">📌 يُمكن استلام الزي الأكاديمي من إدارة شؤون الطلاب اعتباراً من 1 سبتمبر 2026</p>
            </div>
          </div>
        </div>

      </div>

      {/* Timeline */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-800 text-sm">المراحل والمواعيد</h2>
        </div>
        <div className="px-5 py-4">
          <div className="space-y-4">
            {graduationTimeline.map((step, idx) => (
              <div key={idx} className="flex items-start gap-4">
                <div className="flex flex-col items-center">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                    step.done ? "bg-green-500 text-white" : "bg-gray-100 text-gray-400"
                  }`}>
                    {step.done ? "✓" : idx + 1}
                  </div>
                  {idx < graduationTimeline.length - 1 && (
                    <div className={`w-0.5 h-8 mt-1 ${step.done ? "bg-green-300" : "bg-gray-200"}`} />
                  )}
                </div>
                <div className="flex-1 min-w-0 pb-2">
                  <p className={`text-sm font-medium ${step.done ? "text-gray-400 line-through" : "text-gray-800"}`}>
                    {step.label}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {new Date(step.date).toLocaleDateString("ar-SA", { day: "numeric", month: "long", year: "numeric" })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
