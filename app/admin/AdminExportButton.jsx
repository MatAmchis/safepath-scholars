"use client";

import { useState } from "react";

export default function AdminExportButton({
  type,
  label = "Export CSV",
  filename = "export.csv",
}) {
  const [isExporting, setIsExporting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function exportCsv() {
    setIsExporting(true);
    setErrorMessage("");

    try {
      const response = await fetch(
        `/api/admin/export?type=${encodeURIComponent(type)}`
      );

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || "Could not export CSV.");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("CSV export error:", error);
      setErrorMessage(error.message || "Could not export CSV.");
    } finally {
      setIsExporting(false);
    }
  }

  return (
    <div className="flex flex-col items-start gap-2">
      <button
        type="button"
        onClick={exportCsv}
        disabled={isExporting}
        className="rounded-2xl bg-white px-5 py-3 text-sm font-bold text-slate-950 ring-1 ring-slate-200 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isExporting ? "Exporting..." : label}
      </button>

      {errorMessage && (
        <p className="text-xs font-semibold text-rose-700">{errorMessage}</p>
      )}
    </div>
  );
}