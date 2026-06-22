"use client";
import { useState, useEffect, useTransition } from "react";
import { getClientToken } from "@/lib/client-auth";

const REQUEST_TYPES = [
  { id: "التسجيل في برنامج",      icon: "📝", description: "طلب التسجيل في برنامج تدريبي متاح" },
  { id: "التحاق ببرنامج خارجي",   icon: "🌐", description: "طلب الموافقة على حضور دورة خارج الجامعة" },
  { id: "إلغاء التسجيل",          icon: "❌", description: "طلب إلغاء تسجيلك في برنامج لم يبدأ" },
  { id: "إعادة جدولة",            icon: "📅", description: "طلب نقل تسجيلك لدفعة قادمة" },
  { id: "إصدار شهادة حضور",       icon: "🎓", description: "طلب شهادة لدورة أُتمّت دون إصدار تلقائي" },
  { id: "الاعتراض على التقييم",    icon: "⚖️", description: "طلب مراجعة الدرجة أو تقييم الأداء" },
];

const STATUS_CONFIG: Record<string, { label: string; bg: string; color: string; icon: string }> = {
  PENDING:   { label: "قيد المراجعة", bg: "#FEF3C7", color: "#D97706", icon: "⏳" },
  APPROVED:  { label: "مقبول",        bg: "#DCFCE7", color: "#16A34A", icon: "✅" },
  REJECTED:  { label: "مرفوض",        bg: "#FEE2E2", color: "#DC2626", icon: "❌" },
  COMPLETED: { label: "مكتمل",        bg: "#DBEAFE", color: "#2563EB", icon: "🏁" },
};

interface TrainingRequest {
  id:          string;
  type:        string;
  programName: string;
  notes:       string | null;
  status:      string;
  createdAt:   string;
}

type Toast = { id: number; message: string; ok: boolean };

export default function TrainingRequestsPage() {
  const [requests, setRequests]   = useState<TrainingRequest[]>([]);
  const [loading, setLoading]     = useState(true);
  const [selectedType, setType]   = useState("");
  const [programName, setProgram] = useState("");
  const [notes, setNotes]         = useState("");
  const [toasts, setToasts]       = useState<Toast[]>([]);
  const [submitting, startSubmit] = useTransition();
  const toastId = { current: 0 };

  function addToast(message: string, ok: boolean) {
    const id = ++toastId.current;
    setToasts((prev) => [...prev, { id, message, ok }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
  }

  async function fetchRequests() {
    const token = getClientToken();
    const res = await fetch("/api/training/requests", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      const data = await res.json();
      setRequests(data.requests ?? []);
    }
    setLoading(false);
  }

  useEffect(() => { fetchRequests(); }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedType || !programName.trim()) return;

    startSubmit(async () => {
      const token = getClientToken();
      const res = await fetch("/api/training/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ type: selectedType, programName: programName.trim(), notes: notes.trim() || undefined }),
      });

      if (res.ok) {
        addToast("تم إرسال طلبك بنجاح", true);
        setType("");
        setProgram("");
        setNotes("");
        fetchRequests();
      } else {
        addToast("حدث خطأ أثناء إرسال الطلب", false);
      }
    });
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#1A2A30]">طلبات التدريب</h1>
        <p className="text-[#8FA4AB] text-sm mt-0.5">
          تقديم طلبات التدريب ومتابعة حالتها
        </p>
      </div>

      {/* New request form */}
      <div className="bg-white rounded-2xl border border-[#E8EDEF] shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-[#E8EDEF] flex items-center gap-2">
          <span>📝</span>
          <h2 className="font-bold text-[#1A2A30] text-sm">طلب جديد</h2>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Request type grid */}
          <div>
            <p className="text-xs font-semibold text-[#506570] mb-3">اختر نوع الطلب</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {REQUEST_TYPES.map((rt) => (
                <button
                  key={rt.id}
                  type="button"
                  onClick={() => setType(rt.id)}
                  className={`flex flex-col gap-1.5 p-3 rounded-xl border text-right cursor-pointer transition-all group ${
                    selectedType === rt.id
                      ? "border-[#6CAEBD] bg-[#F0F9FB] ring-1 ring-[#6CAEBD]"
                      : "border-[#E8EDEF] hover:border-[#6CAEBD] hover:bg-[#F0F9FB]"
                  }`}
                >
                  <span className="text-xl">{rt.icon}</span>
                  <span className="text-xs font-semibold text-[#1F2937] leading-snug group-hover:text-[#4A8FA0]">
                    {rt.id}
                  </span>
                  <span className="text-[10px] text-[#9CA3AF] leading-snug">{rt.description}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Program name */}
          <div>
            <label className="block text-xs font-semibold text-[#506570] mb-1.5">
              اسم البرنامج / الدورة *
            </label>
            <input
              type="text"
              required
              value={programName}
              onChange={(e) => setProgram(e.target.value)}
              placeholder="مثال: دورة PMP الاحترافية"
              className="w-full rounded-xl border border-[#C8D4D8] px-3 py-2.5 text-sm text-[#1F2937] placeholder:text-[#B0BEC5] focus:outline-none focus:border-[#6CAEBD] focus:ring-1 focus:ring-[#6CAEBD]"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-[#506570] mb-1.5">
              ملاحظات (اختياري)
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="أي تفاصيل إضافية تود إضافتها..."
              className="w-full rounded-xl border border-[#C8D4D8] px-3 py-2.5 text-sm text-[#1F2937] placeholder:text-[#B0BEC5] focus:outline-none focus:border-[#6CAEBD] focus:ring-1 focus:ring-[#6CAEBD] resize-none"
            />
          </div>

          {/* Submit */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submitting || !selectedType || !programName.trim()}
              className="px-6 py-2.5 rounded-xl text-sm font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-40"
              style={{ background: "linear-gradient(to left, #6CAEBD, #4A8FA0)" }}
            >
              {submitting ? "جارٍ الإرسال…" : "إرسال الطلب"}
            </button>
          </div>
        </form>
      </div>

      {/* Request history */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-[#E8EDEF] p-8 text-center text-[#8FA4AB] text-sm">
          جارٍ التحميل…
        </div>
      ) : requests.length > 0 ? (
        <div className="bg-white rounded-2xl border border-[#E8EDEF] shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-[#E8EDEF] flex items-center gap-2">
            <span>📋</span>
            <h2 className="font-bold text-[#1A2A30] text-sm">سجل الطلبات</h2>
            <span className="ms-auto text-xs font-bold text-[#6CAEBD]">{requests.length}</span>
          </div>
          <div className="divide-y divide-[#F4F7F8]">
            {requests.map((req) => {
              const sc = STATUS_CONFIG[req.status] ?? STATUS_CONFIG.PENDING;
              return (
                <div key={req.id} className="px-5 py-4 hover:bg-[#F9FAFB] transition-colors">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-[#1F2937] text-sm">{req.programName}</p>
                        <span
                          className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                          style={{ background: sc.bg, color: sc.color }}
                        >
                          {sc.icon} {sc.label}
                        </span>
                      </div>
                      <p className="text-xs text-[#8FA4AB] mt-0.5">{req.type}</p>
                      {req.notes && (
                        <p className="text-xs text-[#6B7280] mt-1 bg-[#F4F7F8] rounded-lg px-2.5 py-1.5">
                          {req.notes}
                        </p>
                      )}
                    </div>
                    <div className="shrink-0 text-end">
                      <p className="text-xs font-mono text-[#9CA3AF]">{req.id.slice(-8).toUpperCase()}</p>
                      <p className="text-[10px] text-[#B0BEC5] mt-0.5">
                        {new Date(req.createdAt).toLocaleDateString("ar-SA")}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[#E8EDEF] py-16 text-center">
          <p className="text-4xl mb-3">📝</p>
          <p className="text-[#8FA4AB] text-sm">لم تقدّم أي طلبات بعد</p>
        </div>
      )}

      {/* Toasts */}
      <div className="fixed bottom-5 end-5 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto px-4 py-3 rounded-xl shadow-lg text-sm font-medium ${
              t.ok ? "bg-green-600 text-white" : "bg-red-600 text-white"
            }`}
          >
            {t.ok ? "✓" : "✕"} {t.message}
          </div>
        ))}
      </div>
    </div>
  );
}
