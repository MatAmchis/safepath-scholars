"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function AdminFilters({
  searchPlaceholder = "Search...",
  statusOptions = [],
  priorityOptions = [],
  reviewerOptions = [],
  showSearch = true,
  showStatus = false,
  showPriority = false,
  showReviewer = false,
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [q, setQ] = useState(searchParams.get("q") || "");
  const [status, setStatus] = useState(searchParams.get("status") || "");
  const [priority, setPriority] = useState(searchParams.get("priority") || "");
  const [reviewer, setReviewer] = useState(searchParams.get("reviewer") || "");

  function applyFilters(event) {
    event.preventDefault();

    const params = new URLSearchParams();

    if (q.trim()) params.set("q", q.trim());
    if (status) params.set("status", status);
    if (priority) params.set("priority", priority);
    if (reviewer) params.set("reviewer", reviewer);

    const queryString = params.toString();
    router.push(queryString ? `${pathname}?${queryString}` : pathname);
  }

  function clearFilters() {
    setQ("");
    setStatus("");
    setPriority("");
    setReviewer("");
    router.push(pathname);
  }

  return (
    <form
      onSubmit={applyFilters}
      className="mb-8 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
    >
      <div className="grid gap-4 lg:grid-cols-4">
        {showSearch && (
          <label className="block lg:col-span-2">
            <span className="mb-2 block text-sm font-bold text-slate-800">
              Search
            </span>

            <input
              type="search"
              value={q}
              onChange={(event) => setQ(event.target.value)}
              placeholder={searchPlaceholder}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
            />
          </label>
        )}

        {showStatus && (
          <label className="block">
            <span className="mb-2 block text-sm font-bold text-slate-800">
              Status
            </span>

            <select
              value={status}
              onChange={(event) => setStatus(event.target.value)}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
            >
              <option value="">All statuses</option>
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        )}

        {showPriority && (
          <label className="block">
            <span className="mb-2 block text-sm font-bold text-slate-800">
              Priority
            </span>

            <select
              value={priority}
              onChange={(event) => setPriority(event.target.value)}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
            >
              <option value="">All priorities</option>
              {priorityOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        )}

        {showReviewer && (
          <label className="block">
            <span className="mb-2 block text-sm font-bold text-slate-800">
              Reviewer
            </span>

            <select
              value={reviewer}
              onChange={(event) => setReviewer(event.target.value)}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
            >
              <option value="">All reviewers</option>
              <option value="unassigned">Unassigned</option>
              {reviewerOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        )}
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <button
          type="submit"
          className="rounded-2xl bg-slate-950 px-5 py-3 text-sm font-bold text-white hover:bg-slate-800"
        >
          Apply filters
        </button>

        <button
          type="button"
          onClick={clearFilters}
          className="rounded-2xl bg-white px-5 py-3 text-sm font-bold text-slate-950 ring-1 ring-slate-200 hover:bg-slate-100"
        >
          Clear
        </button>
      </div>
    </form>
  );
}