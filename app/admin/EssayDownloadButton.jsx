"use client";

import { useState } from "react";

export default function EssayDownloadButton({ filePath, driveLink }) {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleDownload() {
    setMessage("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/admin/signed-essay-url", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ filePath }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Could not create download link.");
      }

      window.open(data.signedUrl, "_blank", "noopener,noreferrer");
    } catch (error) {
      console.error("Essay download error:", error);
      setMessage(error.message || "Could not open file.");
    } finally {
      setIsLoading(false);
    }
  }

  if (filePath) {
    return (
      <div className="flex flex-col gap-1">
        <button
          type="button"
          onClick={handleDownload}
          disabled={isLoading}
          className="rounded-xl bg-slate-950 px-3 py-2 text-xs font-bold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? "Creating link..." : "Download file"}
        </button>

        <p className="max-w-[220px] truncate font-mono text-[11px] text-slate-500">
          {filePath}
        </p>

        {message && (
          <p className="max-w-[220px] text-xs font-semibold text-rose-700">
            {message}
          </p>
        )}
      </div>
    );
  }

  if (driveLink) {
    return (
      <a
        href={driveLink}
        target="_blank"
        rel="noreferrer"
        className="rounded-xl bg-white px-3 py-2 text-xs font-bold text-slate-950 ring-1 ring-slate-200 hover:bg-slate-50"
      >
        Open link
      </a>
    );
  }

  return <span className="text-slate-400">No file/link</span>;
}