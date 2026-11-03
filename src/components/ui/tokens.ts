/** Token warna yang boleh dipakai komponen & block. Nilai lain ditolak oleh tipe. */
export type ColorToken =
  | "brume"
  | "menthe"
  | "limonade"
  | "verveine"
  | "paper"
  | "pop"
  | "ink";

/** Ukuran preset. Tidak ada input px bebas. */
export type Scale = "sm" | "md" | "lg";

/**
 * Petakan token warna menjadi nilai CSS variable.
 * Dipakai agar warna selalu berasal dari tokens.css, bukan nilai mentah.
 */
export function bgColor(color?: ColorToken | "none"): string | undefined {
  if (!color || color === "none") return undefined;
  return `var(--${color})`;
}
