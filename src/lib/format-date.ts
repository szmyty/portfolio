const displayDateFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: "UTC",
});

/**
 * Format API timestamps identically during server rendering and hydration.
 */
export function formatDisplayDate(value: string): string {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : displayDateFormatter.format(date);
}
