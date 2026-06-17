import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getCurrentUser } from "@/lib/dal";
import { trainingRequests, requestTypes } from "@/lib/mock/training";

export default async function TrainingRequestsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const t  = await getTranslations("Training");
  const ts = await getTranslations("Status");

  const reqStatusConfig: Record<string, { label: string; bg: string; color: string; icon: string }> = {
    pending:   { label: ts("pending"),   bg: "#FEF3C7", color: "#D97706", icon: "⏳" },
    approved:  { label: ts("approved"),  bg: "#DCFCE7", color: "#16A34A", icon: "✅" },
    rejected:  { label: ts("rejected"),  bg: "#FEE2E2", color: "#DC2626", icon: "❌" },
    completed: { label: ts("completed"), bg: "#DBEAFE", color: "#2563EB", icon: "🏁" },
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#1A2A30]">{t("requests.title")}</h1>
        <p className="text-[#8FA4AB] text-sm mt-0.5">
          {t("requests.subtitle")}
        </p>
      </div>

      {/* New request form */}
      <div className="bg-white rounded-2xl border border-[#E8EDEF] shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-[#E8EDEF] flex items-center gap-2">
          <span>📝</span>
          <h2 className="font-bold text-[#1A2A30] text-sm">{t("requests.newRequest")}</h2>
        </div>
        <div className="p-5 space-y-4">
          {/* Request type grid */}
          <div>
            <p className="text-xs font-semibold text-[#506570] mb-3">{t("requests.selectType")}</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {requestTypes.map((rt) => (
                <label
                  key={rt.id}
                  className="flex flex-col gap-1.5 p-3 rounded-xl border border-[#E8EDEF] cursor-pointer hover:border-[#6CAEBD] hover:bg-[#F0F9FB] transition-all group"
                >
                  <input type="radio" name="reqType" value={rt.id} className="hidden" />
                  <span className="text-xl">{rt.icon}</span>
                  <span className="text-xs font-semibold text-[#1F2937] leading-snug group-hover:text-[#4A8FA0]">
                    {rt.label}
                  </span>
                  <span className="text-[10px] text-[#9CA3AF] leading-snug">{rt.description}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Program name */}
          <div>
            <label className="block text-xs font-semibold text-[#506570] mb-1.5">
              {t("requests.programName")}
            </label>
            <input
              type="text"
              placeholder={t("requests.programPlaceholder")}
              className="w-full rounded-xl border border-[#C8D4D8] px-3 py-2.5 text-sm text-[#1F2937] placeholder:text-[#B0BEC5] focus:outline-none focus:border-[#6CAEBD] focus:ring-1 focus:ring-[#6CAEBD]"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-[#506570] mb-1.5">
              {t("requests.notes")}
            </label>
            <textarea
              rows={3}
              placeholder={t("requests.notesPlaceholder")}
              className="w-full rounded-xl border border-[#C8D4D8] px-3 py-2.5 text-sm text-[#1F2937] placeholder:text-[#B0BEC5] focus:outline-none focus:border-[#6CAEBD] focus:ring-1 focus:ring-[#6CAEBD] resize-none"
            />
          </div>

          {/* Attachment placeholder */}
          <div className="border-2 border-dashed border-[#C8D4D8] rounded-xl p-5 text-center hover:border-[#6CAEBD] hover:bg-[#F0F9FB] transition-colors cursor-pointer">
            <p className="text-2xl mb-1">📎</p>
            <p className="text-xs font-semibold text-[#506570]">{t("requests.attachLabel")}</p>
            <p className="text-[10px] text-[#9CA3AF] mt-0.5">{t("requests.attachHint")}</p>
          </div>

          {/* Submit */}
          <div className="flex justify-end">
            <button
              type="button"
              className="px-6 py-2.5 rounded-xl text-sm font-bold text-white transition-opacity hover:opacity-90"
              style={{ background: "linear-gradient(to left, #6CAEBD, #4A8FA0)" }}
            >
              {t("requests.sendBtn")}
            </button>
          </div>
        </div>
      </div>

      {/* Request history */}
      {trainingRequests.length > 0 && (
        <div className="bg-white rounded-2xl border border-[#E8EDEF] shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-[#E8EDEF] flex items-center gap-2">
            <span>📋</span>
            <h2 className="font-bold text-[#1A2A30] text-sm">{t("requests.history")}</h2>
            <span className="ms-auto text-xs font-bold text-[#6CAEBD]">{trainingRequests.length}</span>
          </div>
          <div className="divide-y divide-[#F4F7F8]">
            {trainingRequests.map((req) => {
              const sc = reqStatusConfig[req.status] ?? reqStatusConfig.pending;
              return (
                <div key={req.id} className="px-5 py-4 hover:bg-[#F9FAFB] transition-colors">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-[#1F2937] text-sm">{req.program}</p>
                        <span
                          className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                          style={{ background: sc.bg, color: sc.color }}
                        >
                          {sc.icon} {sc.label}
                        </span>
                      </div>
                      <p className="text-xs text-[#8FA4AB] mt-0.5">{req.type}</p>
                      {req.note && (
                        <p className="text-xs text-[#6B7280] mt-1 bg-[#F4F7F8] rounded-lg px-2.5 py-1.5">
                          {req.note}
                        </p>
                      )}
                    </div>
                    <div className="shrink-0 text-end">
                      <p className="text-xs font-mono text-[#9CA3AF]">{req.id}</p>
                      <p className="text-[10px] text-[#B0BEC5] mt-0.5">{req.date}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
