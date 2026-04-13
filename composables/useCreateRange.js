export function useCreateRange(length, start = 0) {
  return Array.from({ length }, (v, k) => start + k);
}
