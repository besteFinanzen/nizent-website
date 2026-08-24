export const SECTION_IDS = ["home", "mpg", "dlrg", "about", "services", "contact"] as const;

export function sectionIndexAt(p: number, marks: number[]): number {
  const n = marks.length;
  if (n === 0) return 0;
  const b: number[] = [0];
  for (let i = 1; i < n; i++) b.push((marks[i - 1] + marks[i]) / 2);
  b.push(1);
  for (let i = 0; i < n; i++) {
    if (p >= b[i] && p <= b[i + 1]) return i;
  }
  return n - 1;
}
