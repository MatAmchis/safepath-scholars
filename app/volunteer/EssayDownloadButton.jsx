"use client";

import { useState } from "react";

export default function EssayDownloadButton({ filePath }) {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function downloadEssay() {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await fetch("/api/volunteer/signed-essay-url", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ filePath }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Could not create download link.");
      }

      window.open(data.url, "_blank", "noopener,noreferrer");
    } catch (error) {
      console.error("Volunteer essay download error:", error);
      setErrorMessage(error.message || "Could not download essay.");
    } finally {
      setIsLoading(false);
    }
  }

  if (!filePath) {
    return <span className="text-sm text-slate-400">No file</span>;
  }

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={downloadEssay}
        disabled={isLoading}
        className="rounded-2xl bg-slate-950 px-4 py-2 text-sm font-bold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isLoading ? "Preparing..." : "Download"}
      </button>

      {errorMessage && (
        <p className="max-w-xs text-xs font-semibold text-rose-700">
          {errorMessage}
        </p>
      )}
    </div>
  );
}