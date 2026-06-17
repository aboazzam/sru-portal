"use client";
import Link from "next/link";
import { useState } from "react";
import { graduationDocuments, type DocumentType } from "@/lib/mock/graduates";
import { useTranslations } from "next-intl";

type RequestState = "idle" | "submitting" | "done";

export default function GraduatesDocumentsPage() {
  const t = useTranslations("Graduates");

  const typeLabel: Record<DocumentType, string> = {
    transcript:     t("documents.types.transcript"),
    certificate:    t("documents.types.certificate"),
    clearance:      t("documents.types.clearance"),
    honor:          t("documents.types.honor"),
    recommendation: t("documents.types.recommendation"),
  };
  // All types resolved from JSON Graduates.documents.types.*

  const [requests, setRequests] = useState<Record<string, RequestState>>({});
  const [copies, setCopies]     = useState<Record<string, number>>({});

  function getCopies(id: string) { return copies[id] ?? 1; }
  function getState(id: string)  { return requests[id] ?? "idle"; }

  function handleRequest(id: string) {
    setRequests((prev) => ({ ...prev, [id]: "submitting" }));
    setTimeout(() => {
      setRequests((prev) => ({ ...prev, [id]: "done" }));
    }, 1200);
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Link href="/graduates" className="hover:text-rose-600 transition-colors">{t("documents.breadcrumbParent")}</Link>
        <span>/</span>
        <span className="text-gray-800 font-medium">{t("documents.title")}</span>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-gray-900">{t("documents.title")}</h1>
        <p className="text-gray-500 text-sm mt-0.5">{t("documents.subtitle")}</p>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex items-center gap-3">
        <span className="text-lg">ℹ️</span>
        <p className="text-amber-700 text-sm">{t("documents.clearanceNote")}</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {graduationDocuments.map((doc) => {
          const state = getState(doc.id);
          const n     = getCopies(doc.id);

          return (
            <div key={doc.id} className={`bg-white rounded-xl border p-5 hover:shadow-sm transition-shadow ${
              !doc.available ? "border-gray-100 opacity-70" : "border-gray-200"
            }`}>
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0 ${
                  doc.available ? "bg-rose-50" : "bg-gray-100"
                }`}>
                  {doc.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-bold text-gray-800">{doc.title}</h3>
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">
                          {typeLabel[doc.type]}
                        </span>
                        {!doc.available && (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">
                            {t("documents.lockedBadge")}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-1 leading-relaxed">{doc.desc}</p>
                      <div className="flex gap-4 mt-2 text-xs text-gray-400">
                        <span>💰 {doc.fee}</span>
                        {doc.deliveryDays > 0 && <span>⏱️ {t("documents.deliveryDays", { n: doc.deliveryDays })}</span>}
                        {doc.deliveryDays === 0 && <span>⏱️ {t("documents.deliveredAtCeremony")}</span>}
                      </div>
                    </div>
                  </div>

                  {doc.available && (
                    <div className="mt-4 flex items-center gap-3 flex-wrap">
                      {doc.type !== "certificate" && (
                        <div className="flex items-center gap-2">
                          <label className="text-xs text-gray-500">{t("documents.copiesLabel")}</label>
                          <select
                            value={n}
                            onChange={(e) => setCopies((prev) => ({ ...prev, [doc.id]: Number(e.target.value) }))}
                            disabled={state === "done"}
                            className="px-2 py-1 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-rose-400"
                          >
                            {[1, 2, 3, 4, 5].map((v) => <option key={v} value={v}>{v}</option>)}
                          </select>
                        </div>
                      )}
                      <button
                        onClick={() => state === "idle" && handleRequest(doc.id)}
                        disabled={state !== "idle"}
                        className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
                          state === "done"
                            ? "bg-green-100 text-green-700 cursor-default"
                            : state === "submitting"
                            ? "bg-gray-100 text-gray-400 cursor-wait"
                            : "bg-rose-600 text-white hover:bg-rose-700"
                        }`}
                      >
                        {state === "done"
                          ? t("documents.submittedBtn")
                          : state === "submitting"
                          ? t("documents.submittingBtn")
                          : t("documents.requestBtn")}
                      </button>
                      {state === "done" && (
                        <p className="text-xs text-gray-400">
                          رقم الطلب: GRD-{doc.id.replace("DOC-", "")}-{Date.now().toString().slice(-4)}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="font-semibold text-gray-800 text-sm mb-3">{t("documents.notesTitle")}</h2>

        <ul className="space-y-2 text-sm text-gray-500">
          <li className="flex items-start gap-2"><span className="shrink-0 text-rose-500">•</span>{t("documents.notes.delivery")}</li>
          <li className="flex items-start gap-2"><span className="shrink-0 text-rose-500">•</span>{t("documents.notes.certificate")}</li>
          <li className="flex items-start gap-2"><span className="shrink-0 text-rose-500">•</span>{t("documents.notes.clearance")}</li>
          <li className="flex items-start gap-2"><span className="shrink-0 text-rose-500">•</span>{t("documents.notes.contact")}</li>
        </ul>
      </div>
    </div>
  );
}
