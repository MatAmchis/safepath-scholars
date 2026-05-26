import {
  canExportAdminData,
  canPerformAdminAction,
} from "./adminPermissions";

function formatValue(value) {
  if (value === null || value === undefined || value === "") {
    return "—";
  }

  if (Array.isArray(value)) {
    return value.length ? value.join(", ") : "—";
  }

  if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  }

  return String(value);
}

export function AdminReadOnlyValue({ value, multiline = false }) {
  const displayValue = formatValue(value);

  if (multiline) {
    return (
      <div className="min-w-[220px] whitespace-pre-wrap rounded-2xl bg-slate-50 p-3 text-sm leading-6 text-slate-700">
        {displayValue}
      </div>
    );
  }

  return (
    <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">
      {displayValue}
    </span>
  );
}

export function AdminActionGate({ role, action, fallback, children }) {
  if (!canPerformAdminAction(role, action)) {
    return fallback || <AdminReadOnlyValue value="Read only" />;
  }

  return children;
}

export function AdminExportGate({ role, type, children }) {
  if (!canExportAdminData(role, type)) {
    return null;
  }

  return children;
}

export function AdminPermissionNotice({ children }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 text-sm leading-7 text-slate-600">
      {children || "Your role has read-only access on this page."}
    </div>
  );
}