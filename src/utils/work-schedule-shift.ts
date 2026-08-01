const HH_MM_SS = /^([01]?\d|2[0-3]):([0-5]\d)(?::([0-5]\d))?$/;

/**
 * Normalize an "HH:mm" (or "HH:mm:ss") wall-clock input into the "HH:MM:SS"
 * string the attendance backend expects (`z.iso.time`, second precision), or
 * null when empty/invalid.
 */
export function parseScheduleTimeInput(value: string | null | undefined): string | null {
  if (value == null || String(value).trim() === "") {
    return null;
  }
  const match = HH_MM_SS.exec(String(value).trim());
  if (!match) {
    return null;
  }
  const hours = String(Number(match[1])).padStart(2, "0");
  const minutes = match[2];
  const seconds = match[3] ?? "00";
  return `${hours}:${minutes}:${seconds}`;
}

/**
 * Format an API "HH:MM:SS" time string into "HH:mm" for a `<input type="time">`.
 * Falls back to parsing legacy ISO date-time strings.
 */
export function formatScheduleTimeForInput(value: string | null | undefined): string {
  if (value == null) return "";
  const s = String(value).trim();
  if (s === "") return "";
  const match = HH_MM_SS.exec(s);
  if (match) {
    return `${match[1].padStart(2, "0")}:${match[2]}`;
  }
  const d = new Date(s);
  if (Number.isNaN(d.getTime())) return "";
  return `${String(d.getUTCHours()).padStart(2, "0")}:${String(d.getUTCMinutes()).padStart(2, "0")}`;
}

export function formatScheduleTimeLabel(value: string | null | undefined): string {
  const t = formatScheduleTimeForInput(value);
  return t || "—";
}
