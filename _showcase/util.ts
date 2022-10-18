export function headerify(str: string): string {
  return str.replaceAll(/[ -/]/g, "_").toLowerCase();
}
