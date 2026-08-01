export type TimelineItem<T> = { type: "separator"; label: string } | { type: "item"; data: T };

export function groupByDayMonthYear<T extends { id: string; createdAt: string }>(items: T[]): TimelineItem<T>[] {
  const output: TimelineItem<T>[] = [];
  let lastLabel = "";

  items.forEach((item) => {
    const date = new Date(item.createdAt);
    const label = Number.isNaN(date.getTime())
      ? "Unknown date"
      : date.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });
    if (label !== lastLabel) {
      output.push({ type: "separator", label });
      lastLabel = label;
    }
    output.push({ type: "item", data: item });
  });

  return output;
}

export function getActionLabel(action: string) {
  return (action || "")
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export function getActionMeta(action: string) {
  const normalized = (action || "").toUpperCase();
  if (normalized.includes("DELETE") || normalized.includes("DEACTIVATE")) {
    return "bg-red-100 text-red-800";
  }
  if (normalized.includes("CREATE") || normalized.includes("ACTIVATE")) {
    return "bg-green-100 text-green-800";
  }
  return "bg-slate-100 text-slate-800";
}

function formatRecordForDisplay(record: Record<string, unknown>): string {
  return Object.entries(record)
    .map(([k, v]) => {
      if (v !== null && typeof v === "object") {
        return `${k}: ${JSON.stringify(v)}`;
      }
      return `${k}: ${String(v)}`;
    })
    .join(", ");
}

/** Format activity details JSON for display (e.g. {"id":"x","name":"y"} → "ID: x, Name: y"). */
export function formatActivityDetails(details: string | Record<string, unknown> | null | undefined): string {
  if (details == null || details === "") return "";
  if (typeof details === "object") {
    if (Array.isArray(details)) {
      return JSON.stringify(details);
    }
    return formatRecordForDisplay(details as Record<string, unknown>);
  }
  try {
    const parsed = JSON.parse(details) as unknown;
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      return formatRecordForDisplay(parsed as Record<string, unknown>);
    }
    return typeof parsed === "string" ? parsed : JSON.stringify(parsed);
  } catch {
    return details;
  }
}
